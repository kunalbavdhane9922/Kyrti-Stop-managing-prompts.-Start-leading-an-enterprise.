package com.saep.core.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.Map;

@FeignClient(name = "workflow", url = "http://saep-workflow:8080")
public interface WorkflowClient {

    @GetMapping("/api/v1/internal/metrics")
    Map<String, Object> getMetrics(@RequestHeader("X-Tenant-Id") String tenantId);
}
