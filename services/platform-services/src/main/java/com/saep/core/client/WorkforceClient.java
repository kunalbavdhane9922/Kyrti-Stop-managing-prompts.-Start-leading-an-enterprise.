package com.saep.core.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.Map;

@FeignClient(name = "workforce", url = "http://saep-workforce:8080")
public interface WorkforceClient {

    @GetMapping("/api/v1/internal/metrics")
    Map<String, Object> getMetrics(@RequestHeader("X-Tenant-Id") String tenantId);
}
