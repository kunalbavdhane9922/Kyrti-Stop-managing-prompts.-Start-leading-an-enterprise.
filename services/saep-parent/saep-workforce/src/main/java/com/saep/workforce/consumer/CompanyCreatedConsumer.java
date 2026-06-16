package com.saep.workforce.consumer;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.saep.common.event.DomainEvents;
import com.saep.common.event.EventEnvelope;
import com.saep.outbox.service.IdempotencyService;
import com.saep.workforce.domain.ConsumerTestLog;
import com.saep.workforce.repository.ConsumerTestLogRepository;
import com.saep.workforce.repository.WorkerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class CompanyCreatedConsumer {

    private final IdempotencyService idempotencyService;
    private final ObjectMapper objectMapper;
    private final ConsumerTestLogRepository consumerTestLogRepository;
    private final WorkerRepository workerRepository;

    @Value("${saep.test.force-failure:false}")
    private boolean forceFailure;

    @Value("${saep.test.consumer-logging:false}")
    private boolean consumerLoggingEnabled;

    @KafkaListener(topics = "company.created", groupId = "saep-workforce-group")
    public void consume(String message) {
        try {
            EventEnvelope<DomainEvents.CompanyCreated> envelope = objectMapper.readValue(
                    message, new TypeReference<EventEnvelope<DomainEvents.CompanyCreated>>() {}
            );

            if (forceFailure) {
                log.info("Forced failure triggered for event {}", envelope.getEventId());
                throw new RuntimeException("Forced failure for Level 3 testing");
            }

            if (idempotencyService.isAlreadyProcessed(envelope.getEventId())) {
                log.info("Event {} already processed, skipping.", envelope.getEventId());
                return;
            }

            log.info("Processing CompanyCreated event for companyId: {}", envelope.getPayload().companyId());
            
            // Calculate latency
            long latencyMs = java.time.temporal.ChronoUnit.MILLIS.between(envelope.getOccurredAt(), java.time.LocalDateTime.now());
            log.info("Event {} processed with end-to-end latency: {} ms", envelope.getEventId(), latencyMs);

            // Execute workforce specific logic for the new company: Initialize default worker for the creator
            String createdBy = envelope.getPayload().createdBy();
            if (createdBy != null && !createdBy.isBlank() && !createdBy.equals("SYSTEM")) {
                try {
                    java.util.UUID workerId = java.util.UUID.fromString(createdBy);
                    com.saep.workforce.domain.WorkerEntity owner = com.saep.workforce.domain.WorkerEntity.builder()
                            .id(workerId)
                            .tenantId(envelope.getTenantId())
                            .workerType("HUMAN")
                            .status("ACTIVE")
                            .createdAt(LocalDateTime.now())
                            .build();
                    workerRepository.save(owner);
                    log.info("Provisioned default HUMAN worker for company owner: {}", workerId);
                } catch (IllegalArgumentException e) {
                    log.warn("createdBy field is not a valid UUID, skipping worker creation. Value: {}", createdBy);
                }
            }

            if (consumerLoggingEnabled) {
                ConsumerTestLog logEntry = ConsumerTestLog.builder()
                    .tenantId(envelope.getTenantId())
                    .eventId(envelope.getEventId())
                    .sequenceName(envelope.getPayload().name())
                    .receivedAt(LocalDateTime.now())
                    .build();
                consumerTestLogRepository.save(logEntry);
                log.info("Saved ConsumerTestLog for event {}", envelope.getEventId());
            }

        } catch (Exception e) {
            log.error("Failed to process message: {}", message, e);
            throw new RuntimeException("Consumer failure", e); // Will trigger DLQ/Retry if configured
        }
    }
}
