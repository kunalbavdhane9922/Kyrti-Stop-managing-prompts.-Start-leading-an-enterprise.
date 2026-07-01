package com.saep.communication.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import com.saep.communication.security.TenantAuthenticationToken;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component("communicationJwtAuthenticationFilter")
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Value("${jwt.secret:z+y9w1XfR/qj5H+c8V2P4mK7s9tL6bN3yQ1w8Z4c5vA=}")
    private String jwtSecret;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String token = authHeader.substring(7);

        try {
            Claims claims = Jwts.parser()
                    .verifyWith(Keys.hmacShaKeyFor(jwtSecret.getBytes()))
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            String tenantIdStr = claims.get("tenantId", String.class);
            String userIdStr = claims.get("userId", String.class);
            if (userIdStr == null) {
                // fallback to subject if userId claim is missing
                userIdStr = claims.getSubject();
            }

            List<?> rawAuthorities = claims.get("authorities", List.class);
            List<SimpleGrantedAuthority> authorities = Collections.emptyList();
            
            if (rawAuthorities != null) {
                authorities = rawAuthorities.stream()
                        .map(a -> new SimpleGrantedAuthority(a.toString()))
                        .collect(Collectors.toList());
            }

            if (userIdStr != null && tenantIdStr != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UUID userId = UUID.fromString(userIdStr);
                UUID tenantId = UUID.fromString(tenantIdStr);

                TenantAuthenticationToken authToken = new TenantAuthenticationToken(userId, tenantId, authorities);
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }

        } catch (Exception e) {
            // Token is invalid or expired
            logger.error("Failed to parse JWT", e);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Unauthorized: " + e.getMessage());
            return;
        }

        filterChain.doFilter(request, response);
    }
}
