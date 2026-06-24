package com.saep.memory.service;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.Builder;
import lombok.Data;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
public class ProfessionServiceClient {

    private static final Logger log = LoggerFactory.getLogger(ProfessionServiceClient.class);
    private final RestTemplate restTemplate;
    private final Cache<UUID, MemoryAccessPolicy> profileCache;

    @org.springframework.beans.factory.annotation.Value("${saep.marketplace.url:http://saep-marketplace}")
    private String marketplaceUrl;

    public ProfessionServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        this.profileCache = Caffeine.newBuilder()
                .expireAfterWrite(1, TimeUnit.HOURS)
                .maximumSize(10000)
                .build();
    }

    @Data
    @Builder
    public static class MemoryAccessPolicy {
        private List<String> allowedScopes;
        private boolean canTransfer;
        private boolean canPublish;
    }

    @CircuitBreaker(name = "marketplaceCircuitBreaker", fallbackMethod = "getMemoryProfileFallback")
    public MemoryAccessPolicy getMemoryProfile(UUID userId) {
        // HTTP call to Marketplace
        String url = marketplaceUrl + "/api/v1/profession/memory-profile/" + userId;
        MemoryAccessPolicy policy = restTemplate.getForObject(url, MemoryAccessPolicy.class);
        
        if (policy != null) {
            profileCache.put(userId, policy);
            return policy;
        }
        
        throw new com.saep.memory.exception.ExternalServiceException("Marketplace returned null policy");
    }

    public MemoryAccessPolicy getMemoryProfileFallback(UUID userId, Throwable t) {
        log.warn("Marketplace service down or failed. Attempting to retrieve cached profile for userId={}. Reason: {}", userId, t.getMessage());
        
        MemoryAccessPolicy cachedPolicy = profileCache.getIfPresent(userId);
        if (cachedPolicy != null) {
            return cachedPolicy;
        }
        
        log.error("No cached profile found for userId={}. Failing safely.", userId);
        throw new com.saep.memory.exception.ExternalServiceException("Failed to retrieve memory profile. Marketplace is down and no cache exists.");
    }
}
