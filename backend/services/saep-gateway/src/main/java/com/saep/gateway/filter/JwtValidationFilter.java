package com.saep.gateway.filter;

import com.saep.gateway.service.JwtBlacklistService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;

@Component
public class JwtValidationFilter implements GlobalFilter, Ordered {

    @Value("${jwt.secret:z+y9w1XfR/qj5H+c8V2P4mK7s9tL6bN3yQ1w8Z4c5vA=}")
    private String jwtSecret;

    private final JwtBlacklistService jwtBlacklistService;

    public JwtValidationFilter(JwtBlacklistService jwtBlacklistService) {
        this.jwtBlacklistService = jwtBlacklistService;
    }

    private static final List<String> OPEN_ROUTES = List.of(
            "/api/v1/auth/login",
            "/api/v1/auth/register",
            "/api/v1/auth/refresh",
            "/api/v1/auth/verify-email",
            "/api/v1/auth/forgot-password",
            "/api/v1/auth/reset-password",
            "/api/v1/auth/verify-2fa",
            "/api/v1/auth/verify-recovery-code",
            "/api/v1/auth/reset-2fa",
            "/api/v1/auth/select-tenant"
    );

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getPath().toString();

        // Skip auth for open endpoints
        if (OPEN_ROUTES.stream().anyMatch(path::startsWith)) {
            return chain.filter(exchange);
        }

        if (path.startsWith("/api/v1/invites/") && exchange.getRequest().getMethod().matches("GET")) {
            return chain.filter(exchange);
        }

        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String token = authHeader.substring(7);
        Claims claims;
        try {
            // Defense in Depth: Gateway validates JWT structure & signature computation FIRST
            claims = Jwts.parser()
                    .verifyWith(Keys.hmacShaKeyFor(jwtSecret.getBytes()))
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (Exception e) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String jti = claims.getId();
        if (jti == null) {
            // All new tokens must have a JTI. Reject if missing.
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String sessionId = claims.get("sessionId", String.class);

        // 2. Query Redis Blacklist and Session Status
        return Mono.zip(
                jwtBlacklistService.isBlacklisted(jti),
                jwtBlacklistService.isSessionActive(sessionId)
        ).flatMap(tuple -> {
            boolean isBlacklisted = tuple.getT1();
            boolean isSessionActive = tuple.getT2();

            if (isBlacklisted || !isSessionActive) {
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }

                    String initialUserId = (String) claims.get("userId");
                    if (initialUserId == null) initialUserId = claims.getSubject();
                    final String finalUserId = initialUserId;
                    
                    String tenantId = (String) claims.get("tenantId");
                    
                    // Enforce tenantId for all routes that are not explicitly allowed without it
                    boolean requiresTenant = !isAllowedWithoutTenant(path, exchange.getRequest().getMethod().name());
                    if (requiresTenant && (tenantId == null || tenantId.isBlank())) {
                        exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                        return exchange.getResponse().setComplete();
                    }

                    String initialEmail = (String) claims.get("email"); // Fallback if subject is email
                    if (initialEmail == null && claims.getSubject() != null && claims.getSubject().contains("@")) {
                        initialEmail = claims.getSubject();
                    }
                    final String finalEmail = initialEmail;

                    ServerWebExchange mutatedExchange = exchange.mutate()
                            .request(builder -> {
                                if (finalUserId != null) builder.header("X-User-Id", finalUserId);
                                if (tenantId != null) builder.header("X-Tenant-Id", tenantId);
                                if (finalEmail != null) builder.header("X-User-Email", finalEmail);
                            })
                            .build();

                    return chain.filter(mutatedExchange);
                })
                .onErrorResume(throwable -> {
                    // FAIL CLOSED strategy on Redis outage
                    exchange.getResponse().setStatusCode(HttpStatus.SERVICE_UNAVAILABLE);
                    return exchange.getResponse().setComplete();
                });
    }

    private boolean isAllowedWithoutTenant(String path, String method) {
        if (path.startsWith("/api/v1/auth/")) {
            return true;
        }
        if (path.startsWith("/api/v1/users/me")) {
            return true;
        }
        if (path.equals("/api/v1/companies") && "POST".equalsIgnoreCase(method)) {
            return true;
        }
        if (path.startsWith("/api/v1/companies/join") && "POST".equalsIgnoreCase(method)) {
            return true;
        }
        // Allow company initialization during wizard flow (JWT may not have tenantId yet)
        if (path.matches("/api/v1/companies/[^/]+/initialize") && "POST".equalsIgnoreCase(method)) {
            return true;
        }
        // Allow organization build submission during wizard flow
        if (path.matches("/api/v1/organizations/[^/]+/build") && "POST".equalsIgnoreCase(method)) {
            return true;
        }
        // Allow frontend to fetch permissions catalog during wizard
        if (path.matches("/api/v1/organizations/[^/]+/permissions/catalog") && "GET".equalsIgnoreCase(method)) {
            return true;
        }
        return false;
    }

    @Override
    public int getOrder() {
        return 0;
    }
}
