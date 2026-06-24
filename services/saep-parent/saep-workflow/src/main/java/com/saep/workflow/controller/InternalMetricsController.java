package com.saep.workflow.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/internal/metrics")
@RequiredArgsConstructor
public class InternalMetricsController {

    // In a production setup, these counts would be queried via Temporal Visibility (ElasticSearch)
    // e.g. CountWorkflowExecutionsRequest
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> getInternalMetrics(
            @RequestHeader(value = "X-Tenant-Id", required = false) String tenantId) {

        long activeWorkflows = 89; // Placeholder until Temporal Visibility API is wired
        long completedTasks = 12540; // Placeholder until Temporal Visibility API is wired
        double errorRate = 0.8;

        return ResponseEntity.ok(Map.of(
                "activeWorkflows", activeWorkflows,
                "completedTasks", completedTasks,
                "errorRate", errorRate
        ));
    }
}
