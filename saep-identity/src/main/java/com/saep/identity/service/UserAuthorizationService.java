package com.saep.identity.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class UserAuthorizationService {

    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    public UserAuthorizationService(StringRedisTemplate redisTemplate, ObjectMapper objectMapper) {
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
    }

    public Map<String, Object> getUserAuthorization(UUID userId, String tenantId) {
        String key = "authorization:" + tenantId + ":" + userId;
        String cachedValue = redisTemplate.opsForValue().get(key);

        if (cachedValue != null) {
            try {
                return objectMapper.readValue(cachedValue, new TypeReference<Map<String, Object>>() {});
            } catch (JsonProcessingException e) {
                // Ignore and fall back to default
            }
        }

        // If not found in cache, return an empty projection.
        // The cache should be hydrated by the event listener (RoleChanged, MembershipChanged)
        return Map.of(
                "userId", userId.toString(),
                "tenantId", tenantId,
                "roles", Collections.emptyList(),
                "permissions", Collections.emptyList(),
                "version", 0
        );
    }
}
