package com.saep.workforce.security;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.UUID;

public class TenantAuthenticationToken extends AbstractAuthenticationToken {

    private final UUID userId;
    private final UUID tenantId;

    public TenantAuthenticationToken(UUID userId, UUID tenantId, Collection<? extends GrantedAuthority> authorities) {
        super(authorities);
        this.userId = userId;
        this.tenantId = tenantId;
        setAuthenticated(true);
    }

    public TenantAuthenticationToken(UUID userId, UUID tenantId) {
        super(null);
        this.userId = userId;
        this.tenantId = tenantId;
        setAuthenticated(true);
    }

    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public Object getPrincipal() {
        return userId;
    }

    public UUID getTenantId() {
        return tenantId;
    }
}
