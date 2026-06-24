package com.saep.marketplace.controller;

import com.saep.marketplace.domain.MarketplaceAgentEntity;
import com.saep.marketplace.service.MarketplaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/marketplace")
@RequiredArgsConstructor
public class MarketplaceController {

    private final MarketplaceService service;

    @GetMapping("/agents")
    public ResponseEntity<List<MarketplaceAgentEntity>> getAgents() {
        return ResponseEntity.ok(service.getAllAgents());
    }

    @GetMapping("/filters")
    public ResponseEntity<Map<String, Object>> getFilters() {
        return ResponseEntity.ok(service.getFilters());
    }

    @PostMapping("/agents/{agentId}/hire")
    public ResponseEntity<Map<String, Object>> hireAgent(
            @PathVariable String agentId,
            @RequestBody(required = false) Map<String, Object> body,
            @RequestHeader(value = "X-Tenant-ID", required = false) String tenantId) {
            
        int trialDays = 7;
        if (body != null && body.containsKey("trialDays")) {
            trialDays = (Integer) body.get("trialDays");
        }
        
        return ResponseEntity.ok(service.hireAgent(agentId, trialDays, tenantId));
    }
}
