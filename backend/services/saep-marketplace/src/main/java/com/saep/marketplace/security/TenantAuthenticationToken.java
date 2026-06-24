package com.saep.marketplace.security;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import java.util.UUID;

public class TenantAuthenticationToken extends AbstractAuthenticationToken {

    private final UUID userId;
    private final UUID tenantId;

    public TenantAuthenticationToken(UUID userId, UUID tenantId) {
        super(null);
        this.userId = userId;
        this.tenantId = tenantId;
        setAuthenticated(true);
    }

    @Override
    public Object getCredentials() {
        return ""; // Cannot return null safely without tripping auth leakage sensors
    }

    @Override
    public Object getPrincipal() {
        return userId;
    }

    public UUID getTenantId() {
        return tenantId;
    }
}
