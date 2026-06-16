package com.saep.company.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.saep.common.event.DomainEvents;
import com.saep.common.event.EventEnvelope;
import com.saep.company.domain.InvitationEntity;
import com.saep.company.domain.MembershipEntity;
import com.saep.company.repository.InvitationRepository;
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
public class InvitationService {

    private final InvitationRepository invitationRepository;
    private final MembershipRepository membershipRepository;
    private final OutboxEventRepository outboxEventRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public InvitationEntity createInvitation(String tenantId, String email, UUID inviterId) {
        // 1. Verify caller is an OWNER
        MembershipEntity inviter = membershipRepository.findByTenantIdAndUserId(tenantId, inviterId)
                .orElseThrow(() -> new IllegalArgumentException("User is not a member of this workspace"));
        
        if (!"OWNER".equals(inviter.getMembershipType())) {
            throw new IllegalArgumentException("Only owners can invite new members");
        }

        // 2. Uniqueness check: Only one PENDING invite per email per tenant
        List<InvitationEntity> pending = invitationRepository.findByTenantIdAndEmailAndStatus(tenantId, email, "PENDING");
        if (!pending.isEmpty()) {
            throw new IllegalArgumentException("A pending invitation already exists for this email");
        }

        // 3. Create Invitation
        InvitationEntity invitation = InvitationEntity.builder()
                .tenantId(tenantId)
                .email(email)
                .token(UUID.randomUUID().toString().replace("-", "") + UUID.randomUUID().toString().replace("-", "")) // Secure random string
                .status("PENDING")
                .expiresAt(LocalDateTime.now().plusDays(7))
                .build();
        
        invitationRepository.save(invitation);

        // 4. Outbox Event
        String correlationId = org.slf4j.MDC.get(com.saep.common.tracing.TracingFilter.CORRELATION_ID);
        if (correlationId == null) correlationId = UUID.randomUUID().toString();
        String traceId = org.slf4j.MDC.get(com.saep.common.tracing.TracingFilter.TRACE_ID);
        if (traceId == null) traceId = UUID.randomUUID().toString();

        DomainEvents.MemberInvited payload = new DomainEvents.MemberInvited(
                invitation.getId().toString(), tenantId, email
        );
        EventEnvelope<DomainEvents.MemberInvited> envelope = EventEnvelope.wrap(
                payload, "MemberInvited", DomainEvents.VERSION_1, tenantId, correlationId, correlationId, traceId
        );
        saveOutboxEvent(envelope, "membership.events");

        // 5. Audit Event
        DomainEvents.AuditEvent auditPayload = new DomainEvents.AuditEvent(
                "MEMBER_INVITED", tenantId, inviterId.toString(), invitation.getId().toString(), "Invited " + email
        );
        EventEnvelope<DomainEvents.AuditEvent> auditEnvelope = EventEnvelope.wrap(
                auditPayload, "AuditEvent", DomainEvents.VERSION_1, tenantId, correlationId, envelope.getEventId(), traceId
        );
        saveOutboxEvent(auditEnvelope, "audit.events");

        return invitation;
    }

    public InvitationEntity getInvitationByToken(String token) {
        InvitationEntity invite = invitationRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid invitation token"));
        
        if ("EXPIRED".equals(invite.getStatus()) || "REVOKED".equals(invite.getStatus())) {
            throw new IllegalStateException("Invitation is no longer active"); // Controller should map to 410 Gone
        }
        return invite;
    }

    @Transactional
    public void acceptInvitation(String token, UUID userId, String userEmail) {
        InvitationEntity invite = getInvitationByToken(token);

        if ("ACCEPTED".equals(invite.getStatus())) {
            return; // Idempotency
        }

        if (!invite.getEmail().equalsIgnoreCase(userEmail)) {
            throw new IllegalArgumentException("Invitation email does not match logged-in user");
        }

        invite.setStatus("ACCEPTED");
        invitationRepository.save(invite);

        // Create Membership
        MembershipEntity membership = MembershipEntity.builder()
                .tenantId(invite.getTenantId())
                .userId(userId)
                .membershipType("MEMBER")
                .status("ACTIVE")
                .createdBy(userId.toString())
                .build();
        membershipRepository.save(membership);

        String correlationId = UUID.randomUUID().toString();

        // 1. MembershipCreated Event
        String traceId = org.slf4j.MDC.get(com.saep.common.tracing.TracingFilter.TRACE_ID);
        if (traceId == null) traceId = UUID.randomUUID().toString();
        
        DomainEvents.MembershipCreated createdPayload = new DomainEvents.MembershipCreated(
                membership.getId().toString(), invite.getTenantId(), userId.toString()
        );
        EventEnvelope<DomainEvents.MembershipCreated> createdEnvelope = EventEnvelope.wrap(
                createdPayload, "MembershipCreated", DomainEvents.VERSION_1, invite.getTenantId(), correlationId, correlationId, traceId
        );
        saveOutboxEvent(createdEnvelope, "membership.events");

        // 2. MemberJoined Event
        DomainEvents.MemberJoined joinedPayload = new DomainEvents.MemberJoined(
                membership.getId().toString(), invite.getTenantId(), userId.toString(), membership.getJoinedAt()
        );
        EventEnvelope<DomainEvents.MemberJoined> joinedEnvelope = EventEnvelope.wrap(
                joinedPayload, "MemberJoined", DomainEvents.VERSION_1, invite.getTenantId(), correlationId, createdEnvelope.getEventId(), traceId
        );
        saveOutboxEvent(joinedEnvelope, "membership.events");

        // 3. Audit Events
        DomainEvents.AuditEvent auditAccept = new DomainEvents.AuditEvent(
                "INVITATION_ACCEPTED", invite.getTenantId(), userId.toString(), invite.getId().toString(), ""
        );
        saveOutboxEvent(EventEnvelope.wrap(auditAccept, "AuditEvent", DomainEvents.VERSION_1, invite.getTenantId(), correlationId, joinedEnvelope.getEventId(), traceId), "audit.events");

        DomainEvents.AuditEvent auditJoined = new DomainEvents.AuditEvent(
                "MEMBER_JOINED", invite.getTenantId(), userId.toString(), membership.getId().toString(), ""
        );
        saveOutboxEvent(EventEnvelope.wrap(auditJoined, "AuditEvent", DomainEvents.VERSION_1, invite.getTenantId(), correlationId, joinedEnvelope.getEventId(), traceId), "audit.events");
    }

    @Transactional
    public void revokeInvitation(String tenantId, UUID inviteId, UUID callerId) {
        MembershipEntity caller = membershipRepository.findByTenantIdAndUserId(tenantId, callerId)
                .orElseThrow(() -> new IllegalArgumentException("Caller is not a member"));
        if (!"OWNER".equals(caller.getMembershipType())) {
            throw new IllegalArgumentException("Only owners can revoke invitations");
        }

        InvitationEntity invite = invitationRepository.findById(inviteId)
                .orElseThrow(() -> new IllegalArgumentException("Invitation not found"));

        if (!invite.getTenantId().equals(tenantId)) {
            throw new IllegalArgumentException("Invitation does not belong to this tenant");
        }

        if (!"PENDING".equals(invite.getStatus())) {
            throw new IllegalStateException("Only pending invitations can be revoked");
        }

        invite.setStatus("REVOKED");
        invitationRepository.save(invite);

        String correlationId = org.slf4j.MDC.get(com.saep.common.tracing.TracingFilter.CORRELATION_ID);
        if (correlationId == null) correlationId = UUID.randomUUID().toString();
        String traceId = org.slf4j.MDC.get(com.saep.common.tracing.TracingFilter.TRACE_ID);
        if (traceId == null) traceId = UUID.randomUUID().toString();

        DomainEvents.AuditEvent auditPayload = new DomainEvents.AuditEvent(
                "INVITATION_REVOKED", tenantId, callerId.toString(), invite.getId().toString(), "Revoked invitation for " + invite.getEmail()
        );
        EventEnvelope<DomainEvents.AuditEvent> envelope = EventEnvelope.wrap(
                auditPayload, "AuditEvent", DomainEvents.VERSION_1, tenantId, correlationId, correlationId, traceId
        );
        saveOutboxEvent(envelope, "audit.events");
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
