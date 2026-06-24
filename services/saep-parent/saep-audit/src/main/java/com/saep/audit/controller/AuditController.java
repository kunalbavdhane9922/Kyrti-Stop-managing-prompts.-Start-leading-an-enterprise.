package com.saep.audit.controller;

import com.saep.audit.domain.AuditEvent;
import com.saep.audit.repository.AuditRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/audit")
@RequiredArgsConstructor
public class AuditController {

    private final AuditRepository auditRepository;

    @GetMapping("/timeline")
    public ResponseEntity<List<Object>> getTimeline(@RequestHeader("X-Tenant-Id") String tenantId) {
        List<AuditEvent> events = auditRepository.findByTenantIdOrderByOccurredAtDesc(tenantId);
        
        // Map to frontend expectation
        var timeline = events.stream().map(e -> {
            return java.util.Map.of(
                "id", e.getId(),
                "timestamp", e.getOccurredAt(),
                "action", e.getAction(),
                "actor", e.getActor(),
                "target", e.getTarget(),
                "stateBefore", "N/A", // In a real scenario, this is extracted from 'details' JSON
                "stateAfter", "N/A",  // Same here
                "details", "View full payload for details"
            );
        }).collect(Collectors.toList());

        return ResponseEntity.ok(timeline);
    }

    @GetMapping("/hashes")
    public ResponseEntity<List<Object>> getHashes(@RequestHeader("X-Tenant-Id") String tenantId) {
        List<AuditEvent> events = auditRepository.findByTenantIdOrderByOccurredAtDesc(tenantId);

        // Map to frontend expectation
        var hashes = events.stream().map(e -> {
            return java.util.Map.of(
                "id", e.getId(),
                "action", e.getAction(),
                "userId", e.getActor(),
                "timestamp", e.getOccurredAt(),
                "severity", e.getSeverity(),
                "context", e.getTarget(),
                "hash", e.getHash(),
                "previousHash", e.getPreviousHash()
            );
        }).collect(Collectors.toList());

        return ResponseEntity.ok(hashes);
    }
}
