package com.saep.core.controller;

import com.saep.core.service.MetricsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/metrics")
@RequiredArgsConstructor
public class MetricsController {

    private final MetricsService metricsService;

    @GetMapping("/operational")
    public ResponseEntity<Map<String, Object>> getOperationalMetrics() {
        var auth = (com.saep.common.security.TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        String tenantId = auth.getTenantId().toString();
        
        return ResponseEntity.ok(metricsService.getOperationalMetrics(tenantId));
    }

    @GetMapping("/workforce")
    public ResponseEntity<Map<String, Object>> getWorkforceMetrics() {
        var auth = (com.saep.common.security.TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        String tenantId = auth.getTenantId().toString();
        
        return ResponseEntity.ok(metricsService.getWorkforceMetrics(tenantId));
    }
}
