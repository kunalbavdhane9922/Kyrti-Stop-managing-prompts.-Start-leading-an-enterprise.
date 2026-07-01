package com.saep.identity.service;

import com.saep.identity.domain.User;
import com.saep.identity.domain.Role;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class JwtService {

    @Value("${jwt.secret:z+y9w1XfR/qj5H+c8V2P4mK7s9tL6bN3yQ1w8Z4c5vA=}")
    private String jwtSecret;

    @Value("${jwt.access.expirationMs}")
    private long jwtAccessExpirationMs;

    public String generateAccessToken(User user, UUID sessionId, String tenantId) {
        List<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());

        var builder = Jwts.builder()
                .id(UUID.randomUUID().toString())
                .subject(user.getEmail())
                .claim("userId", user.getId().toString())
                .claim("sessionId", sessionId.toString())
                .claim("roles", roles)
                .issuedAt(new Date())
                .expiration(new Date((new Date()).getTime() + jwtAccessExpirationMs))
                .signWith(Keys.hmacShaKeyFor(jwtSecret.getBytes()));
                
        if (tenantId != null) {
            builder.claim("tenantId", tenantId);
        }

        return builder.compact();
    }

    public String generatePartialToken(UUID userId, String purpose, long expirationMinutes) {
        return Jwts.builder()
                .id(UUID.randomUUID().toString())
                .subject(userId.toString())
                .claim("userId", userId.toString())
                .claim("purpose", purpose)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * expirationMinutes))
                .signWith(Keys.hmacShaKeyFor(jwtSecret.getBytes()))
                .compact();
    }

    public io.jsonwebtoken.Claims validateAndGetClaims(String token) {
        try {
            return Jwts.parser().verifyWith(Keys.hmacShaKeyFor(jwtSecret.getBytes())).build().parseSignedClaims(token).getPayload();
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid token", e);
        }
    }
}
