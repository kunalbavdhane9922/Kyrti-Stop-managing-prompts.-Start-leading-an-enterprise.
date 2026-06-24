package com.saep.company.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.saep.common.event.DomainEvents;
import com.saep.common.event.EventEnvelope;
import com.saep.company.domain.MembershipRoleEntity;
import com.saep.company.domain.RoleEntity;
import com.saep.company.domain.RolePermissionEntity;
import com.saep.company.domain.SystemPermission;
import com.saep.company.repository.MembershipRoleRepository;
import com.saep.company.repository.RolePermissionRepository;
import com.saep.company.repository.RoleRepository;
import com.saep.outbox.domain.EventStatus;
import com.saep.outbox.domain.OutboxEvent;
import com.saep.outbox.repository.OutboxEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrganizationBootstrapService {

    private final RoleRepository roleRepository;
    private final RolePermissionRepository rolePermissionRepository;
    private final MembershipRoleRepository membershipRoleRepository;
    private final OutboxEventRepository outboxEventRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public void bootstrapCompany(String tenantId, UUID founderMembershipId, String founderUserId) {
        log.info("Bootstrapping organization roles for tenant: {}", tenantId);

        RoleEntity ownerRole = createRoleIfNotExists(tenantId, "Owner", "Full administrative access", 1, founderUserId);
        createRoleIfNotExists(tenantId, "Administrator", "System administration access", 2, founderUserId);
        createRoleIfNotExists(tenantId, "Manager", "Managerial access", 3, founderUserId);
        createRoleIfNotExists(tenantId, "Member", "Default member access", 4, founderUserId);

        assignAllPermissionsToOwner(ownerRole.getId(), tenantId);

        assignRoleToMembershipIfNotExists(founderMembershipId, ownerRole.getId(), tenantId, founderUserId);

        log.info("Organization bootstrap complete for tenant: {}", tenantId);
    }

    private RoleEntity createRoleIfNotExists(String tenantId, String name, String description, int displayOrder, String createdBy) {
        return roleRepository.findByTenantIdAndNameAndStatus(tenantId, name, "ACTIVE")
                .orElseGet(() -> {
                    try {
                        RoleEntity newRole = RoleEntity.builder()
                                .tenantId(tenantId)
                                .name(name)
                                .description(description)
                                .status("ACTIVE")
                                .displayOrder(displayOrder)
                                .isSystemRole(true)
                                .createdBy(createdBy)
                                .updatedBy(createdBy)
                                .build();
                        RoleEntity savedRole = roleRepository.saveAndFlush(newRole);

                        // Emit RoleCreated Event
                        String correlationId = UUID.randomUUID().toString();
                        DomainEvents.RoleCreated payload = new DomainEvents.RoleCreated(savedRole.getId().toString(), tenantId, name);
                        String traceId = org.slf4j.MDC.get(com.saep.common.tracing.TracingFilter.TRACE_ID);
                        if (traceId == null) traceId = UUID.randomUUID().toString();
                        EventEnvelope<DomainEvents.RoleCreated> envelope = EventEnvelope.wrap(payload, "RoleCreated", DomainEvents.VERSION_1, tenantId, correlationId, correlationId, traceId);
                        saveOutboxEvent(envelope, "membership.events");

                        return savedRole;
                    } catch (org.springframework.dao.DataIntegrityViolationException e) {
                        log.warn("Concurrent role creation detected for tenant: {} role: {}. Fetching existing role.", tenantId, name);
                        return roleRepository.findByTenantIdAndNameAndStatus(tenantId, name, "ACTIVE")
                                .orElseThrow(() -> new IllegalStateException("Role should exist after constraint violation"));
                    }
                });
    }

    private void assignAllPermissionsToOwner(UUID roleId, String tenantId) {
        List<String> existingPermissions = rolePermissionRepository.findByRoleId(roleId)
                .stream().map(RolePermissionEntity::getPermissionCode).collect(Collectors.toList());

        boolean permissionsAdded = false;
        for (SystemPermission sp : SystemPermission.values()) {
            if (!existingPermissions.contains(sp.getCode())) {
                RolePermissionEntity rp = RolePermissionEntity.builder()
                        .roleId(roleId)
                        .permissionCode(sp.getCode())
                        .build();
                rolePermissionRepository.save(rp);
                permissionsAdded = true;
            }
        }

        if (permissionsAdded) {
            String correlationId = UUID.randomUUID().toString();
            DomainEvents.RolePermissionsUpdated payload = new DomainEvents.RolePermissionsUpdated(roleId.toString(), tenantId);
            String traceId = org.slf4j.MDC.get(com.saep.common.tracing.TracingFilter.TRACE_ID);
            if (traceId == null) traceId = UUID.randomUUID().toString();
            EventEnvelope<DomainEvents.RolePermissionsUpdated> envelope = EventEnvelope.wrap(payload, "RolePermissionsUpdated", DomainEvents.VERSION_1, tenantId, correlationId, correlationId, traceId);
            saveOutboxEvent(envelope, "membership.events");
        }
    }

    private void assignRoleToMembershipIfNotExists(UUID membershipId, UUID roleId, String tenantId, String assignedBy) {
        boolean exists = membershipRoleRepository.findByMembershipId(membershipId).stream()
                .anyMatch(mr -> mr.getRoleId().equals(roleId));

        if (!exists) {
            try {
                MembershipRoleEntity mr = MembershipRoleEntity.builder()
                        .membershipId(membershipId)
                        .roleId(roleId)
                        .assignedBy(assignedBy)
                        .assignedAt(LocalDateTime.now())
                        .build();
                membershipRoleRepository.saveAndFlush(mr);

                // Emit MembershipRoleAssigned
                String correlationId = UUID.randomUUID().toString();
                DomainEvents.MembershipRoleAssigned payload = new DomainEvents.MembershipRoleAssigned(membershipId.toString(), roleId.toString(), tenantId);
                String traceId = org.slf4j.MDC.get(com.saep.common.tracing.TracingFilter.TRACE_ID);
                if (traceId == null) traceId = UUID.randomUUID().toString();
                EventEnvelope<DomainEvents.MembershipRoleAssigned> envelope = EventEnvelope.wrap(payload, "MembershipRoleAssigned", DomainEvents.VERSION_1, tenantId, correlationId, correlationId, traceId);
                saveOutboxEvent(envelope, "membership.events");
            } catch (org.springframework.dao.DataIntegrityViolationException e) {
                log.warn("Concurrent membership role assignment detected for membership: {} role: {}", membershipId, roleId);
            }
        }
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
