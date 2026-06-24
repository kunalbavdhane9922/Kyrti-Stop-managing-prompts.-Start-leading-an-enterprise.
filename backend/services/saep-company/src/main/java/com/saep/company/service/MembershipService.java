package com.saep.company.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.saep.common.event.DomainEvents;
import com.saep.common.event.EventEnvelope;
import com.saep.company.domain.MembershipEntity;
import com.saep.company.repository.MembershipRepository;
import com.saep.outbox.domain.EventStatus;
import com.saep.outbox.domain.OutboxEvent;
import com.saep.outbox.repository.OutboxEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MembershipService {

    private final MembershipRepository membershipRepository;
    private final OutboxEventRepository outboxEventRepository;
    private final ObjectMapper objectMapper;

    public List<MembershipEntity> getMemberships(String tenantId, String status) {
        if (status != null && !status.isBlank()) {
            return membershipRepository.findByTenantIdAndStatus(tenantId, status);
        }
        return membershipRepository.findByTenantId(tenantId);
    }

    @Transactional
    public void removeMembership(String tenantId, UUID membershipId, UUID callerId) {
        MembershipEntity caller = membershipRepository.findByTenantIdAndUserId(tenantId, callerId)
                .orElseThrow(() -> new IllegalArgumentException("Caller is not a member"));
        if (!"OWNER".equals(caller.getMembershipType())) {
            throw new IllegalArgumentException("Only owners can remove members");
        }

        MembershipEntity target = membershipRepository.findById(membershipId)
                .orElseThrow(() -> new IllegalArgumentException("Membership not found"));
        if (!target.getTenantId().equals(tenantId)) {
            throw new IllegalArgumentException("Membership does not belong to this tenant");
        }

        if ("OWNER".equals(target.getMembershipType()) && "ACTIVE".equals(target.getStatus())) {
            long activeOwners = membershipRepository.countByTenantIdAndMembershipTypeAndStatus(tenantId, "OWNER", "ACTIVE");
            if (activeOwners <= 1) {
                throw new IllegalArgumentException("Cannot remove the last active owner");
            }
        }

        target.setStatus("REMOVED");
        membershipRepository.save(target);

        String correlationId = org.slf4j.MDC.get(com.saep.common.tracing.TracingFilter.CORRELATION_ID);
        if (correlationId == null) correlationId = UUID.randomUUID().toString();
        String traceId = org.slf4j.MDC.get(com.saep.common.tracing.TracingFilter.TRACE_ID);
        if (traceId == null) traceId = UUID.randomUUID().toString();

        DomainEvents.MemberRemoved payload = new DomainEvents.MemberRemoved(
                target.getId().toString(), tenantId, target.getUserId().toString()
        );
        EventEnvelope<DomainEvents.MemberRemoved> envelope = EventEnvelope.wrap(
                payload, "MemberRemoved", DomainEvents.VERSION_1, tenantId, correlationId, correlationId, traceId
        );
        saveOutboxEvent(envelope, "membership.events");

        DomainEvents.AuditEvent auditPayload = new DomainEvents.AuditEvent(
                "MEMBER_REMOVED", tenantId, callerId.toString(), target.getId().toString(), ""
        );
        saveOutboxEvent(EventEnvelope.wrap(auditPayload, "AuditEvent", DomainEvents.VERSION_1, tenantId, correlationId, envelope.getEventId(), traceId), "audit.events");
    }

    @Transactional
    public void suspendMembership(String tenantId, UUID membershipId, UUID callerId) {
        MembershipEntity caller = membershipRepository.findByTenantIdAndUserId(tenantId, callerId)
                .orElseThrow(() -> new IllegalArgumentException("Caller is not a member"));
        if (!"OWNER".equals(caller.getMembershipType())) {
            throw new IllegalArgumentException("Only owners can suspend members");
        }

        MembershipEntity target = membershipRepository.findById(membershipId)
                .orElseThrow(() -> new IllegalArgumentException("Membership not found"));
        if (!target.getTenantId().equals(tenantId)) {
            throw new IllegalArgumentException("Membership does not belong to this tenant");
        }

        if ("OWNER".equals(target.getMembershipType()) && "ACTIVE".equals(target.getStatus())) {
            long activeOwners = membershipRepository.countByTenantIdAndMembershipTypeAndStatus(tenantId, "OWNER", "ACTIVE");
            if (activeOwners <= 1) {
                throw new IllegalArgumentException("Cannot suspend the last active owner");
            }
        }

        target.setStatus("SUSPENDED");
        membershipRepository.save(target);

        String correlationId = org.slf4j.MDC.get(com.saep.common.tracing.TracingFilter.CORRELATION_ID);
        if (correlationId == null) correlationId = UUID.randomUUID().toString();
        String traceId = org.slf4j.MDC.get(com.saep.common.tracing.TracingFilter.TRACE_ID);
        if (traceId == null) traceId = UUID.randomUUID().toString();

        DomainEvents.MemberSuspended payload = new DomainEvents.MemberSuspended(
                target.getId().toString(), tenantId, target.getUserId().toString()
        );
        EventEnvelope<DomainEvents.MemberSuspended> envelope = EventEnvelope.wrap(
                payload, "MemberSuspended", DomainEvents.VERSION_1, tenantId, correlationId, correlationId, traceId
        );
        saveOutboxEvent(envelope, "membership.events");

        DomainEvents.AuditEvent auditPayload = new DomainEvents.AuditEvent(
                "MEMBER_SUSPENDED", tenantId, callerId.toString(), target.getId().toString(), ""
        );
        saveOutboxEvent(EventEnvelope.wrap(auditPayload, "AuditEvent", DomainEvents.VERSION_1, tenantId, correlationId, envelope.getEventId(), traceId), "audit.events");
    }

    private void saveOutboxEvent(EventEnvelope<?> envelope, String topic) {
        try {
            OutboxEvent outboxEvent = OutboxEvent.builder()
                    .eventId(envelope.getEventId())
                    .eventType(envelope.getEventType())
                    .topic(topic)
                    .tenantId(envelope.getTenantId())
                    .payload(objectMapper.writeValueAsString(envelope))
                    .createdAt(LocalDateTime.now())
                    .status(EventStatus.PENDING)
                    .retryCount(0)
                    .build();
            outboxEventRepository.save(outboxEvent);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize event", e);
        }
    }
}
