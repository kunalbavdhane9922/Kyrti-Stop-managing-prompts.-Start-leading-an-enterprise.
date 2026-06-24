package com.saep.core.service;

import com.saep.core.client.WorkforceClient;
import com.saep.core.client.WorkflowClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class MetricsService {

    private final WorkforceClient workforceClient;
    private final WorkflowClient workflowClient;

    @Cacheable(value = "dashboardMetrics", key = "#tenantId", unless = "#result == null")
    public Map<String, Object> getOperationalMetrics(String tenantId) {
        Map<String, Object> metrics = new HashMap<>();

        try {
            Map<String, Object> workforceMetrics = workforceClient.getMetrics(tenantId);
            metrics.put("activeAgents", workforceMetrics.getOrDefault("activeAgents", 0));
        } catch (Exception e) {
            log.error("Failed to fetch workforce metrics for tenant {}", tenantId, e);
            metrics.put("activeAgents", 0); // Graceful fallback
        }

        try {
            Map<String, Object> workflowMetrics = workflowClient.getMetrics(tenantId);
            metrics.put("activeWorkflows", workflowMetrics.getOrDefault("activeWorkflows", 0));
            metrics.put("completedTasks", workflowMetrics.getOrDefault("completedTasks", 0));
            metrics.put("errorRate", workflowMetrics.getOrDefault("errorRate", 0.0));
        } catch (Exception e) {
            log.error("Failed to fetch workflow metrics for tenant {}", tenantId, e);
            metrics.put("activeWorkflows", 0);
            metrics.put("completedTasks", 0);
            metrics.put("errorRate", 0.0);
        }

        return metrics;
    }

    @Cacheable(value = "workforceMetrics", key = "#tenantId", unless = "#result == null")
    public Map<String, Object> getWorkforceMetrics(String tenantId) {
        Map<String, Object> metrics = new HashMap<>();

        try {
            Map<String, Object> workforceMetrics = workforceClient.getMetrics(tenantId);
            metrics.put("capacity", 100);
            metrics.put("utilization", Map.of("Overall", workforceMetrics.getOrDefault("utilization", 0.0)));
            metrics.put("humanVsAiSplit", Map.of("human", 15, "ai", 85)); // Placeholder for V1
        } catch (Exception e) {
            log.error("Failed to fetch workforce metrics for tenant {}", tenantId, e);
            metrics.put("capacity", 100);
            metrics.put("utilization", Map.of());
            metrics.put("humanVsAiSplit", Map.of("human", 15, "ai", 85));
        }

        return metrics;
    }
}
