package com.saep.marketplace.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

public class TenantContextFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String tenantIdStr = request.getHeader("X-Tenant-Id");
        String userIdStr = request.getHeader("X-User-Id");

        if (tenantIdStr != null && userIdStr != null) {
            try {
                UUID tenantId = UUID.fromString(tenantIdStr);
                UUID userId = UUID.fromString(userIdStr);
                TenantAuthenticationToken auth = new TenantAuthenticationToken(userId, tenantId);
                SecurityContextHolder.getContext().setAuthentication(auth);
            } catch (IllegalArgumentException ignored) {
                // Invalid UUID format
            }
        }

        filterChain.doFilter(request, response);
    }
}
