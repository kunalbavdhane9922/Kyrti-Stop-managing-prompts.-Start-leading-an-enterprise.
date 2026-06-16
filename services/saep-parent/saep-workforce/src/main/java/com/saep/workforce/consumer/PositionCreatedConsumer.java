package com.saep.workforce.consumer;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.saep.common.event.EventEnvelope;
import com.saep.outbox.service.IdempotencyService;
import com.saep.workforce.domain.WorkerEntity;
import com.saep.workforce.repository.WorkerRepository;
import com.saep.outbox.repository.OutboxEventRepository;
import com.saep.outbox.domain.OutboxEvent;
import com.saep.outbox.domain.EventStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PositionCreatedConsumer {

    private final IdempotencyService idempotencyService;
    private final ObjectMapper objectMapper;
    private final WorkerRepository workerRepository;
    private final OutboxEventRepository outboxEventRepository;

    @KafkaListener(topics = "organization.events", groupId = "saep-workforce-wf-group")
    @Transactional
    public void consume(String message) {
        try {
            EventEnvelope<java.util.Map<String, Object>> envelope = objectMapper.readValue(
                    message, new TypeReference<EventEnvelope<java.util.Map<String, Object>>>() {}
            );

            if (!"PositionCreated".equals(envelope.getEventType())) {
                return;
            }

            if (idempotencyService.isAlreadyProcessed(envelope.getEventId())) {
                log.info("PositionCreated Event {} already processed, skipping.", envelope.getEventId());
                return;
            }

            java.util.Map<String, Object> payload = envelope.getPayload();
            String positionId = (String) payload.get("positionId");
            String positionType = (String) payload.get("positionType");

            log.info("Processing PositionCreated event for positionId: {}, type: {}", positionId, positionType);

            if ("AI".equals(positionType)) {
                // Provision an AI worker
                WorkerEntity worker = WorkerEntity.builder()
                        .id(UUID.randomUUID())
                        .tenantId(envelope.getTenantId())
                        .workerType("AI")
                        .status("ACTIVE")
                        .createdAt(LocalDateTime.now())
                        .build();
                workerRepository.save(worker);
                log.info("Provisioned AI Worker {} for Position {}", worker.getId(), positionId);

                // Publish AIProvisioned event
                java.util.Map<String, Object> aiPayload = new java.util.HashMap<>();
                aiPayload.put("positionId", positionId);
                aiPayload.put("workforceId", worker.getId().toString());

                String causationId = org.slf4j.MDC.get(com.saep.common.tracing.TracingFilter.CAUSATION_ID);
                if (causationId == null) causationId = envelope.getEventId(); // Use current event ID if MDC is missing

                String traceId = org.slf4j.MDC.get(com.saep.common.tracing.TracingFilter.TRACE_ID);
                if (traceId == null) traceId = envelope.getTraceId();

                EventEnvelope<java.util.Map<String, Object>> aiEnvelope = EventEnvelope.wrap(
                        aiPayload, "AIProvisioned", "v1", envelope.getTenantId(), envelope.getCorrelationId(), causationId, traceId
                );

                OutboxEvent outboxEvent = OutboxEvent.builder()
                        .eventId(aiEnvelope.getEventId())
                        .eventType(aiEnvelope.getEventType())
                        .topic("workforce.events")
                        .tenantId(aiEnvelope.getTenantId())
                        .payload(objectMapper.writeValueAsString(aiEnvelope))
                        .createdAt(LocalDateTime.now())
                        .status(EventStatus.PENDING)
                        .retryCount(0)
                        .build();
                
                outboxEventRepository.save(outboxEvent);
                log.info("Emitted AIProvisioned event for Position {}", positionId);
            }

        } catch (Exception e) {
            log.error("Failed to process PositionCreated message in workforce", e);
            throw new RuntimeException("Consumer failure", e);
        }
    }
}
