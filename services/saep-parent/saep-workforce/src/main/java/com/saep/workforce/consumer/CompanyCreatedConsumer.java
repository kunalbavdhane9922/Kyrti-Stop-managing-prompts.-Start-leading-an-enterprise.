package com.saep.workforce.consumer;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.saep.common.event.DomainEvents;
import com.saep.common.event.EventEnvelope;
import com.saep.outbox.service.IdempotencyService;
import com.saep.workforce.domain.ConsumerTestLog;
import com.saep.workforce.repository.ConsumerTestLogRepository;
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

            // TODO: Execute workforce specific logic for the new company (e.g. creating default teams)
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
