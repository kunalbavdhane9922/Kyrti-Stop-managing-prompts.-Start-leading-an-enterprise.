package com.saep.company.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.saep.common.event.DomainEvents;
import com.saep.common.event.EventEnvelope;
import com.saep.company.domain.InvitationEntity;
import com.saep.company.repository.InvitationRepository;
import com.saep.outbox.domain.EventStatus;
import com.saep.outbox.domain.OutboxEvent;
import com.saep.outbox.repository.OutboxEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class InvitationExpirationScheduler {

    private final InvitationRepository invitationRepository;
    private final OutboxEventRepository outboxEventRepository;
    private final ObjectMapper objectMapper;

    @Scheduled(cron = "0 0 * * * *") // Run every hour
    @Transactional
    public void expireOldInvitations() {
        LocalDateTime now = LocalDateTime.now();
        List<InvitationEntity> expiredInvites = invitationRepository.findExpiredInvitations(now);

        for (InvitationEntity invite : expiredInvites) {
            invite.setStatus("EXPIRED");
            invitationRepository.save(invite);

            String correlationId = UUID.randomUUID().toString();
            DomainEvents.AuditEvent auditPayload = new DomainEvents.AuditEvent(
                    "INVITATION_EXPIRED", invite.getTenantId(), "SYSTEM", invite.getId().toString(), "Invitation expired automatically"
            );
            String traceId = org.slf4j.MDC.get(com.saep.common.tracing.TracingFilter.TRACE_ID);
            if (traceId == null) traceId = UUID.randomUUID().toString();
            
            EventEnvelope<DomainEvents.AuditEvent> envelope = EventEnvelope.wrap(
                    auditPayload, "AuditEvent", DomainEvents.VERSION_1, invite.getTenantId(), correlationId, correlationId, traceId
            );

            try {
                OutboxEvent outboxEvent = OutboxEvent.builder()
                        .eventId(envelope.getEventId())
                        .eventType(envelope.getEventType())
                        .topic("audit.events")
                        .tenantId(envelope.getTenantId())
                        .payload(objectMapper.writeValueAsString(envelope))
                        .createdAt(LocalDateTime.now())
                        .status(EventStatus.PENDING)
                        .retryCount(0)
                        .build();
                outboxEventRepository.save(outboxEvent);
            } catch (JsonProcessingException e) {
                log.error("Failed to serialize INVITATION_EXPIRED event", e);
            }
            
            log.info("Expired invitation {} for {}", invite.getId(), invite.getEmail());
        }
    }
}
