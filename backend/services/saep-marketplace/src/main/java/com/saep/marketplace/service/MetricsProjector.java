package com.saep.marketplace.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.saep.marketplace.domain.TenantMetricsEntity;
import com.saep.marketplace.repository.TenantMetricsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class MetricsProjector {

    private final TenantMetricsRepository metricsRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;

    /**
     * Consumes marketplace domain events and incrementally projects them into the metrics read model.
     * 
     * E.g., On agent.hired.requested, increment "total_hires_requested" for the tenant.
     * On payment.failed, increment "total_payment_failures".
     */
    @KafkaListener(topics = "marketplace.events.outbound", groupId = "saep-marketplace-metrics-projector")
    @Transactional
    public void projectEvent(String message) {
        log.debug("Received event for metrics projection: {}", message);
        
        try {
            JsonNode eventNode = objectMapper.readTree(message);
            if (!eventNode.has("tenantId") || !eventNode.has("eventType")) return;
            
            UUID tenantId = UUID.fromString(eventNode.get("tenantId").asText());
            String eventType = eventNode.get("eventType").asText();
            
            TenantMetricsEntity metrics = metricsRepository.findById(tenantId)
                    .orElse(TenantMetricsEntity.builder().tenantId(tenantId).build());
            
            boolean updated = false;
            if (eventType.startsWith("agent.hired.requested")) {
                metrics.incrementHiresRequested();
                updated = true;
            } else if (eventType.startsWith("payment.failed")) {
                metrics.incrementPaymentFailures();
                updated = true;
            } else if (eventType.startsWith("agent.hired.completed")) {
                metrics.incrementHiresCompleted();
                updated = true;
            }
            
            if (updated) {
                metricsRepository.save(metrics);
                // Invalidate the cache to ensure cache-aside consistency
                redisTemplate.delete("metrics:tenant:" + tenantId);
                log.info("Projected metric for {} and invalidated cache.", tenantId);
            }
            
        } catch (Exception e) {
            log.error("Failed to project metrics", e);
            throw new RuntimeException("Metrics projection failed", e);
        }
    }
}
