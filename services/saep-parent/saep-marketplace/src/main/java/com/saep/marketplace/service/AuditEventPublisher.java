package com.saep.marketplace.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.saep.marketplace.domain.events.v1.AuditEvent;
import com.saep.outbox.domain.EventStatus;
import com.saep.outbox.domain.OutboxEvent;
import com.saep.outbox.repository.OutboxEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditEventPublisher {

    private final OutboxEventRepository outboxEventRepository;
    private final ObjectMapper objectMapper;

    /**
     * Publishes an audit event through the SAEP Outbox framework.
     * Ensures reliable delivery to the central Audit Service via Kafka.
     */
    public void publishAuditEvent(String action, String actorId, UUID tenantId, String targetId, String targetType, String causationId) {
        try {
            String eventId = UUID.randomUUID().toString();
            
            AuditEvent auditEventDto = AuditEvent.builder()
                    .eventId(eventId)
                    .action(action)
                    .actorId(actorId)
                    .actorType("USER_OR_SYSTEM")
                    .tenantId(tenantId.toString())
                    .targetId(targetId)
                    .targetType(targetType)
                    .timestamp(Instant.now().toString())
                    .context(Map.of("causationId", causationId != null ? causationId : ""))
                    .build();

            OutboxEvent outboxEvent = OutboxEvent.builder()
                    .eventId(eventId)
                    .eventType("audit.event.v1")
                    .topic("audit.events")
                    .tenantId(tenantId.toString())
                    .payload(objectMapper.writeValueAsString(auditEventDto))
                    .createdAt(LocalDateTime.now())
                    .status(EventStatus.PENDING)
                    .retryCount(0)
                    .build();
            
            outboxEventRepository.save(outboxEvent);
            log.info("Published audit event {} for action {} on target {}", eventId, action, targetId);

        } catch (Exception e) {
            log.error("Failed to publish audit event for action {}", action, e);
            throw new RuntimeException("Audit publishing failed", e);
        }
    }
}
