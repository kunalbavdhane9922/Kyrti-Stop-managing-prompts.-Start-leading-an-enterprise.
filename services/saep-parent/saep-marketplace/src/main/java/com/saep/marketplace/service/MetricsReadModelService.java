package com.saep.marketplace.service;

import com.saep.marketplace.domain.TenantMetricsEntity;
import com.saep.marketplace.repository.AgentHireRepository;
import com.saep.marketplace.repository.TenantMetricsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class MetricsReadModelService {

    private final TenantMetricsRepository postgresRepository;
    private final AgentHireRepository agentHireRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    /**
     * Retrieves metrics for a specific tenant.
     * Primary source of truth is Postgres. Redis is an optimization layer.
     */
    public TenantMetricsEntity getTenantMetrics(UUID tenantId) {
        log.debug("Fetching metrics for tenant: {}", tenantId);
        String cacheKey = "metrics:tenant:" + tenantId.toString();
        
        Object cached = redisTemplate.opsForValue().get(cacheKey);
        if (cached != null && cached instanceof TenantMetricsEntity) {
            return (TenantMetricsEntity) cached;
        }

        TenantMetricsEntity pgMetrics = postgresRepository.findById(tenantId).orElse(new TenantMetricsEntity(tenantId, 0L, 0L, 0L));
        redisTemplate.opsForValue().set(cacheKey, pgMetrics, Duration.ofMinutes(15));
        return pgMetrics;
    }

    /**
     * Nightly job to recompute counts and repair metrics drift between Postgres and Redis.
     */
    @Scheduled(cron = "0 0 2 * * ?") // 2 AM every day
    @Transactional
    public void reconcileMetrics() {
        log.info("Running nightly metrics reconciliation job to fix drift.");
        
        List<AgentHireRepository.TenantMetricProjection> trueMetrics = agentHireRepository.aggregateMetrics();
        
        for (AgentHireRepository.TenantMetricProjection metric : trueMetrics) {
            TenantMetricsEntity entity = postgresRepository.findById(metric.getTenantId())
                .orElse(TenantMetricsEntity.builder().tenantId(metric.getTenantId()).build());
                
            entity.setTotalHiresRequested(metric.getRequestedCount() == null ? 0L : metric.getRequestedCount());
            entity.setTotalHiresCompleted(metric.getCompletedCount() == null ? 0L : metric.getCompletedCount());
            entity.setTotalPaymentFailures(metric.getFailedCount() == null ? 0L : metric.getFailedCount());
            
            postgresRepository.save(entity);
            redisTemplate.delete("metrics:tenant:" + metric.getTenantId().toString());
        }
        
        log.info("Metrics reconciliation completed across {} tenants.", trueMetrics.size());
    }
}
