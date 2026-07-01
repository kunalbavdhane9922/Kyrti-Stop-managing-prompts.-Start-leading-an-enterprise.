package com.saep.common.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;
import java.util.UUID;

@Component
public class ServiceTokenProvider {

    @Value("${jwt.secret:z+y9w1XfR/qj5H+c8V2P4mK7s9tL6bN3yQ1w8Z4c5vA=}")
    private String jwtSecret;

    private static final long EXPIRATION_MS = 60000; // 1 minute for internal tokens

    public String generateServiceToken(String userId, String tenantId, String correlationId, String sourceService) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + EXPIRATION_MS);

        return Jwts.builder()
                .subject(userId != null ? userId : "system")
                .claims(Map.of(
                        "tenantId", tenantId != null ? tenantId : "",
                        "correlationId", correlationId != null ? correlationId : UUID.randomUUID().toString(),
                        "sourceService", sourceService,
                        "type", "service"
                ))
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key)
                .compact();
    }
}
