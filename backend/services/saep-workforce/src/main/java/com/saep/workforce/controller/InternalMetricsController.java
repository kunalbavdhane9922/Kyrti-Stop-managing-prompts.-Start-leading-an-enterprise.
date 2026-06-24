package com.saep.workforce.controller;

import com.saep.workforce.repository.WorkerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/internal/metrics")
@RequiredArgsConstructor
public class InternalMetricsController {

    private final WorkerRepository workerRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getInternalMetrics(
            @RequestHeader(value = "X-Tenant-Id") String tenantId) {

        long activeAgents = workerRepository.countByTenantIdAndStatus(tenantId, "ACTIVE");
        long totalAgents = workerRepository.countByTenantIdAndStatus(tenantId, "ACTIVE") + 
                           workerRepository.countByTenantIdAndStatus(tenantId, "INACTIVE");
        
        double utilization = totalAgents > 0 ? (double) activeAgents / totalAgents * 100.0 : 0.0;

        return ResponseEntity.ok(Map.of(
                "activeAgents", activeAgents,
                "utilization", utilization
        ));
    }
}
