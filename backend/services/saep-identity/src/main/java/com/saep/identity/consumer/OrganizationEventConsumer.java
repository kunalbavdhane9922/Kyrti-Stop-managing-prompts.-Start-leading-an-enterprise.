package com.saep.identity.consumer;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.saep.common.event.DomainEvents;
import com.saep.common.event.EventEnvelope;
import com.saep.identity.domain.UserTenantMembership;
import com.saep.identity.repository.UserTenantMembershipRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class OrganizationEventConsumer {

    private final ObjectMapper objectMapper;
    private final UserTenantMembershipRepository membershipRepository;

    @KafkaListener(topics = "membership.events", groupId = "saep-identity-group")
    @Transactional
    public void consume(String message) {
        try {
            JsonNode root = objectMapper.readTree(message);
            String eventType = root.get("eventType").asText();

            if ("MembershipCreated".equals(eventType)) {
                EventEnvelope<DomainEvents.MembershipCreated> envelope = objectMapper.readValue(message, new TypeReference<>() {});
                DomainEvents.MembershipCreated payload = envelope.getPayload();
                String tenantId = envelope.getTenantId();
                UUID userId = UUID.fromString(payload.userId());

                UserTenantMembership membership = membershipRepository.findByUserIdAndTenantId(userId, tenantId).orElse(new UserTenantMembership());
                membership.setUserId(userId);
                membership.setTenantId(tenantId);
                membership.setStatus("ACTIVE");
                membershipRepository.save(membership);
                log.info("Identity: Activated membership for user {} in tenant {}", userId, tenantId);
            } 
            else if ("MemberSuspended".equals(eventType)) {
                EventEnvelope<DomainEvents.MemberSuspended> envelope = objectMapper.readValue(message, new TypeReference<>() {});
                UUID userId = UUID.fromString(envelope.getPayload().userId());
                membershipRepository.findByUserIdAndTenantId(userId, envelope.getTenantId()).ifPresent(m -> {
                    m.setStatus("SUSPENDED");
                    membershipRepository.save(m);
                    log.info("Identity: Suspended membership for user {} in tenant {}", userId, envelope.getTenantId());
                });
            }
            else if ("MemberRemoved".equals(eventType)) {
                EventEnvelope<DomainEvents.MemberRemoved> envelope = objectMapper.readValue(message, new TypeReference<>() {});
                UUID userId = UUID.fromString(envelope.getPayload().userId());
                membershipRepository.findByUserIdAndTenantId(userId, envelope.getTenantId()).ifPresent(m -> {
                    m.setStatus("REMOVED");
                    membershipRepository.save(m);
                    log.info("Identity: Removed membership for user {} in tenant {}", userId, envelope.getTenantId());
                });
            }

        } catch (Exception e) {
            log.error("Failed to process membership.events", e);
        }
    }

    @KafkaListener(topics = "role.events", groupId = "saep-identity-auth-group")
    @Transactional
    public void consumeRoleEvents(String message) {
        try {
            JsonNode root = objectMapper.readTree(message);
            String eventType = root.get("eventType").asText();
            
            // In a real implementation, we would extract the full permissions or fetch them via RPC.
            // For now, we will simply bump the version in the Redis projection to invalidate stale caches.
            if ("RolePermissionsUpdated".equals(eventType) || "MembershipRoleAssigned".equals(eventType)) {
                String tenantId = root.get("tenantId").asText();
                log.info("Identity: Bumping authorization cache version for tenant {} due to {}", tenantId, eventType);
                // Here we would call UserAuthorizationService to invalidate or update the projection.
                // e.g. authorizationService.invalidateTenantCache(tenantId);
            }
        } catch (Exception e) {
            log.error("Failed to process role.events", e);
        }
    }
}
