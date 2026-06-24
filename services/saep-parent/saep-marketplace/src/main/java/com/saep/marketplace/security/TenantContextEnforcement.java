package com.saep.marketplace.security;

import com.saep.marketplace.service.AuditEventPublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class TenantContextEnforcement {

    private final AuditEventPublisher auditEventPublisher;

    /**
     * Retrieves the current tenant context.
     * Extracts the tenant ID from the Spring Security Context supporting both JWT claims
     * and service-to-service authentication models.
     *
     * @return The UUID of the current tenant.
     * @throws TenantContextMissingException if the context is missing or invalid.
     */
    public UUID getCurrentTenantId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null) {
            String msg = "No authentication context found. Cannot resolve tenant.";
            log.error(msg);
            auditEventPublisher.publishAuditEvent("tenant.resolution.failed", "SYSTEM", UUID.fromString("00000000-0000-0000-0000-000000000000"), "SYSTEM", "TenantContext", msg);
            throw new TenantContextMissingException(msg);
        }

        if (authentication instanceof TenantAuthenticationToken) {
            return ((TenantAuthenticationToken) authentication).getTenantId();
        }

        if (authentication instanceof JwtAuthenticationToken) {
            JwtAuthenticationToken jwtAuth = (JwtAuthenticationToken) authentication;
            Object tenantClaim = jwtAuth.getTokenAttributes().get("tenantId");
            if (tenantClaim != null) {
                try {
                    return UUID.fromString(tenantClaim.toString());
                } catch (IllegalArgumentException e) {
                    String msg = "Invalid UUID format in tenantId claim: " + tenantClaim;
                    log.error(msg);
                    auditEventPublisher.publishAuditEvent("tenant.resolution.failed", authentication.getName(), UUID.fromString("00000000-0000-0000-0000-000000000000"), authentication.getName(), "TenantContext", msg);
                    throw new TenantContextMissingException(msg);
                }
            }
        }

        String msg = "Authentication type not supported or missing tenant claim: " + authentication.getClass().getName();
        log.error(msg);
        auditEventPublisher.publishAuditEvent("tenant.resolution.failed", authentication.getName(), UUID.fromString("00000000-0000-0000-0000-000000000000"), authentication.getName(), "TenantContext", msg);
        throw new TenantContextMissingException(msg);
    }

    /**
     * Validates that the provided tenantId matches the current context.
     * Throws an exception if there is a mismatch, preventing data leakage.
     *
     * @param targetTenantId The tenant ID associated with the aggregate being accessed.
     */
    public void enforceTenantMatch(UUID targetTenantId) {
        if (targetTenantId == null) {
            throw new TenantContextMissingException("Target tenant ID is null.");
        }
        
        UUID currentTenantId = getCurrentTenantId();
        if (!currentTenantId.equals(targetTenantId)) {
            String msg = String.format("Cross-tenant access violation attempt. Principal Tenant: %s, Target Tenant: %s", currentTenantId, targetTenantId);
            log.error(msg);
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String principal = auth != null ? auth.getName() : "SYSTEM";
            auditEventPublisher.publishAuditEvent("tenant.access.violation", principal, targetTenantId, targetTenantId.toString(), "MarketplaceAgent", msg);
            throw new SecurityException("Tenant access violation. Aggregate does not belong to the current tenant context.");
        }
    }
}
