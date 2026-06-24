package com.saep.company.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.saep.company.domain.AuditLogEntity;
import com.saep.company.event.StateTransitionEvent;
import com.saep.company.repository.AuditLogRepository;
import com.saep.outbox.domain.EventStatus;
import com.saep.outbox.domain.OutboxEvent;
import com.saep.outbox.repository.OutboxEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;
    private final OutboxEventRepository outboxEventRepository;
    private final ObjectMapper objectMapper;

    @Transactional(propagation = Propagation.MANDATORY)
    public void recordTransition(String entityId, String entityType, String oldState, String newState, String tenantId, String userId, String correlationId) {
        AuditLogEntity auditLog = AuditLogEntity.builder()
                .id(UUID.randomUUID())
                .entityId(UUID.fromString(entityId))
                .entityType(entityType)
                .oldState(oldState)
                .newState(newState)
                .tenantId(tenantId)
                .userId(userId)
                .correlationId(correlationId)
                .timestamp(Instant.now())
                .build();
        auditLogRepository.save(auditLog);

        StateTransitionEvent eventPayload = new StateTransitionEvent(
                entityId, entityType, oldState, newState, tenantId, userId
        );

        try {
            OutboxEvent outboxEvent = OutboxEvent.builder()
                    .eventId(UUID.randomUUID().toString())
                    .eventType("StateTransitionEvent")
                    .topic("audit.events")
                    .tenantId(tenantId)
                    .payload(objectMapper.writeValueAsString(eventPayload))
                    .createdAt(LocalDateTime.now())
                    .status(EventStatus.PENDING)
                    .retryCount(0)
                    .build();
            outboxEventRepository.save(outboxEvent);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize StateTransitionEvent", e);
        }
    }
}
