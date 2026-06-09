package com.saep.identity.service;

import com.saep.identity.dto.response.SessionDto;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.RedisScript;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
public class RedisTokenService {

    private final StringRedisTemplate redisTemplate;
    private final RedisScript<Long> rotateRefreshTokenScript;

    public RedisTokenService(StringRedisTemplate redisTemplate, RedisScript<Long> rotateRefreshTokenScript) {
        this.redisTemplate = redisTemplate;
        this.rotateRefreshTokenScript = rotateRefreshTokenScript;
    }

    public SessionDto createSession(UUID userId, UUID tenantId, String deviceId, String ipAddress, String userAgent, String rawRefreshToken) {
        UUID sessionId = UUID.randomUUID();
        String tokenHash = hashToken(rawRefreshToken);
        
        // 1. Store Refresh Token Hash
        String refreshKey = "refresh:" + tokenHash;
        Map<String, String> refreshMap = new HashMap<>();
        refreshMap.put("userId", userId.toString());
        refreshMap.put("sessionId", sessionId.toString());
        redisTemplate.opsForHash().putAll(refreshKey, refreshMap);
        redisTemplate.expire(refreshKey, 7, TimeUnit.DAYS);

        // 2. Store Session
        String sessionKey = "session:" + sessionId;
        Map<String, String> sessionMap = new HashMap<>();
        sessionMap.put("userId", userId.toString());
        if (tenantId != null) sessionMap.put("tenantId", tenantId.toString());
        sessionMap.put("deviceId", deviceId != null ? deviceId : "");
        sessionMap.put("ipAddress", ipAddress != null ? ipAddress : "");
        sessionMap.put("userAgent", userAgent != null ? userAgent : "");
        sessionMap.put("createdAt", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        sessionMap.put("lastAccessedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        
        redisTemplate.opsForHash().putAll(sessionKey, sessionMap);
        redisTemplate.expire(sessionKey, 30, TimeUnit.DAYS);
        
        // Store reverse mapping to allow cascading eviction
        redisTemplate.opsForValue().set("session_refresh:" + sessionId, tokenHash, 30, TimeUnit.DAYS);

        // 3. Add to User Sessions ZSET and Evict Oldest if > 5
        String userSessionsKey = "user_sessions:" + userId;
        long score = System.currentTimeMillis();
        redisTemplate.opsForZSet().add(userSessionsKey, sessionId.toString(), score);
        
        Long size = redisTemplate.opsForZSet().zCard(userSessionsKey);
        if (size != null && size > 5) {
            Set<String> evictedSessionIds = redisTemplate.opsForZSet().range(userSessionsKey, 0, size - 6);
            if (evictedSessionIds != null) {
                for (String evSessionId : evictedSessionIds) {
                    revokeSessionAndRefreshTokens(userId, evSessionId);
                }
            }
        }

        SessionDto dto = new SessionDto();
        dto.setId(sessionId);
        dto.setUserId(userId);
        dto.setTenantId(tenantId);
        dto.setDeviceId(deviceId);
        dto.setIpAddress(ipAddress);
        dto.setUserAgent(userAgent);
        dto.setCreatedAt(LocalDateTime.now());
        dto.setLastAccessedAt(LocalDateTime.now());
        return dto;
    }

    public void revokeSessionAndRefreshTokens(UUID userId, String sessionId) {
        // Find refresh token pointing to this session and delete it
        String tokenHash = redisTemplate.opsForValue().get("session_refresh:" + sessionId);
        if (tokenHash != null) {
            redisTemplate.delete("refresh:" + tokenHash);
            redisTemplate.delete("session_refresh:" + sessionId);
        }
        
        // Delete Session
        redisTemplate.delete("session:" + sessionId);
        
        // Remove from ZSET
        redisTemplate.opsForZSet().remove("user_sessions:" + userId, sessionId);
    }

    public boolean rotateRefreshToken(String rawRefreshToken, UUID userId) {
        String tokenHash = hashToken(rawRefreshToken);
        Long result = redisTemplate.execute(rotateRefreshTokenScript, Collections.singletonList("refresh:" + tokenHash), userId.toString());
        return result != null && result == 1L;
    }

    public SessionDto getSession(String sessionId) {
        Map<Object, Object> map = redisTemplate.opsForHash().entries("session:" + sessionId);
        if (map.isEmpty()) return null;
        
        SessionDto dto = new SessionDto();
        dto.setId(UUID.fromString(sessionId));
        dto.setUserId(UUID.fromString((String) map.get("userId")));
        if (map.containsKey("tenantId")) dto.setTenantId(UUID.fromString((String) map.get("tenantId")));
        dto.setDeviceId((String) map.get("deviceId"));
        dto.setIpAddress((String) map.get("ipAddress"));
        dto.setUserAgent((String) map.get("userAgent"));
        if (map.containsKey("createdAt")) dto.setCreatedAt(LocalDateTime.parse((String) map.get("createdAt"), DateTimeFormatter.ISO_DATE_TIME));
        if (map.containsKey("lastAccessedAt")) dto.setLastAccessedAt(LocalDateTime.parse((String) map.get("lastAccessedAt"), DateTimeFormatter.ISO_DATE_TIME));
        return dto;
    }

    public List<SessionDto> getUserSessions(UUID userId) {
        String userSessionsKey = "user_sessions:" + userId;
        Set<String> sessionIds = redisTemplate.opsForZSet().reverseRange(userSessionsKey, 0, -1);
        if (sessionIds == null) return Collections.emptyList();
        
        List<SessionDto> sessions = new ArrayList<>();
        for (String id : sessionIds) {
            SessionDto dto = getSession(id);
            if (dto != null) {
                sessions.add(dto);
            }
        }
        return sessions;
    }

    public Map<String, String> getRefreshTokenData(String rawRefreshToken) {
        String tokenHash = hashToken(rawRefreshToken);
        Map<Object, Object> map = redisTemplate.opsForHash().entries("refresh:" + tokenHash);
        if (map.isEmpty()) return null;
        Map<String, String> result = new HashMap<>();
        result.put("userId", (String) map.get("userId"));
        result.put("sessionId", (String) map.get("sessionId"));
        return result;
    }

    public void savePendingTwoFactor(UUID userId, String encryptedSecret) {
        String key = "totp_setup:" + userId;
        Map<String, String> map = new HashMap<>();
        map.put("encryptedSecret", encryptedSecret);
        redisTemplate.opsForHash().putAll(key, map);
        redisTemplate.expire(key, 10, TimeUnit.MINUTES);
    }

    public String getPendingTwoFactorSecret(UUID userId) {
        return (String) redisTemplate.opsForHash().get("totp_setup:" + userId, "encryptedSecret");
    }

    public void deletePendingTwoFactor(UUID userId) {
        redisTemplate.delete("totp_setup:" + userId);
    }

    private String hashToken(String token) {
        try {
            java.security.MessageDigest digest = java.security.MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes("UTF-8"));
            return java.util.Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            throw new RuntimeException("Failed to hash token", e);
        }
    }
}
