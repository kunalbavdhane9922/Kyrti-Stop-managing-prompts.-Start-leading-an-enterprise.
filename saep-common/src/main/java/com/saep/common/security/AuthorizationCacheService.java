package com.saep.common.security;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthorizationCacheService {

    private static final Logger log = LoggerFactory.getLogger(AuthorizationCacheService.class);

    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    @Value("${saep.identity.url:http://saep-identity:8080}")
    private String identityServiceUrl;

    // Simple local cache to prevent stampedes (userId+tenantId -> permissions)
    private final ConcurrentHashMap<String, LocalCacheEntry> localCache = new ConcurrentHashMap<>();
    private static final long LOCAL_CACHE_TTL_MS = 30_000; // 30 seconds

    public AuthorizationCacheService(StringRedisTemplate redisTemplate, ObjectMapper objectMapper) {
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(2)).build();
    }

    public List<String> getPermissions(String userId, String tenantId) {
        if (tenantId == null || userId == null) return Collections.emptyList();

        String cacheKey = "authorization:" + tenantId + ":" + userId;

        // 1. Check local cache
        LocalCacheEntry localEntry = localCache.get(cacheKey);
        if (localEntry != null && !localEntry.isExpired()) {
            return localEntry.permissions();
        }

        // 2. Check Redis
        try {
            String redisValue = redisTemplate.opsForValue().get(cacheKey);
            if (redisValue != null) {
                Map<String, Object> data = objectMapper.readValue(redisValue, new TypeReference<Map<String, Object>>() {});
                List<String> perms = (List<String>) data.getOrDefault("permissions", Collections.emptyList());
                localCache.put(cacheKey, new LocalCacheEntry(perms, System.currentTimeMillis() + LOCAL_CACHE_TTL_MS));
                return perms;
            }
        } catch (Exception e) {
            log.warn("Redis authorization fetch failed, falling back to identity service", e);
        }

        // 3. Fallback to saep-identity
        try {
            String url = identityServiceUrl + "/api/internal/v1/auth/permissions?userId=" + userId + "&tenantId=" + tenantId;
            String serviceKey = System.getenv("SAEP_INTERNAL_SERVICE_KEY");
            if (serviceKey == null) serviceKey = "saep-internal-secret-dev-only";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("X-Internal-Service-Key", serviceKey)
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 200) {
                Map<String, Object> respData = objectMapper.readValue(response.body(), new TypeReference<Map<String, Object>>() {});
                Map<String, Object> authData = (Map<String, Object>) respData.get("data");
                if (authData != null) {
                    List<String> perms = (List<String>) authData.getOrDefault("permissions", Collections.emptyList());
                    // Identity service should hydrate redis, but we'll populate local cache
                    localCache.put(cacheKey, new LocalCacheEntry(perms, System.currentTimeMillis() + LOCAL_CACHE_TTL_MS));
                    return perms;
                }
            }
        } catch (Exception e) {
            log.error("Failed to fetch permissions from identity service", e);
        }

        return Collections.emptyList();
    }

    private record LocalCacheEntry(List<String> permissions, long expireAt) {
        public boolean isExpired() {
            return System.currentTimeMillis() > expireAt;
        }
    }
}
