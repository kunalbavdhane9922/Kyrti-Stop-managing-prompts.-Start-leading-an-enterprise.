package com.saep.audit.controller;

import com.saep.audit.domain.AuditRecord;
import com.saep.audit.repository.AuditSearchRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/audit")
public class AuditController {

    private final AuditSearchRepository auditSearchRepository;

    public AuditController(AuditSearchRepository auditSearchRepository) {
        this.auditSearchRepository = auditSearchRepository;
    }

    @GetMapping("/search")
    @com.saep.common.security.RequirePermission("audit.read")
    public ResponseEntity<Page<AuditRecord>> searchAuditRecords(
            @RequestParam(required = false) String action,
            @RequestParam(required = false) UUID actorId,
            @RequestParam(required = false) UUID resourceId,
            @RequestParam(required = false) UUID correlationId,
            @RequestParam(required = false) Instant startDate,
            @RequestParam(required = false) Instant endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {

        // Hard cap pagination
        int safeSize = Math.min(size, 500);
        Pageable pageable = PageRequest.of(page, safeSize);

        // SecurityContext extraction for Tenant Isolation
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        
        // Standard V1 Tenant Isolation
        UUID tenantId = com.saep.common.tenant.TenantContext.getTenantId();
        if (tenantId == null) {
            return ResponseEntity.status(403).build();
        }

        Page<AuditRecord> results;
        if (correlationId != null) {
            results = auditSearchRepository.findByTenantIdAndCorrelationIdOrderByOccurredAtDesc(tenantId, correlationId, pageable);
        } else if (resourceId != null) {
            results = auditSearchRepository.findByTenantIdAndResourceIdOrderByOccurredAtDesc(tenantId, resourceId, pageable);
        } else if (actorId != null) {
            results = auditSearchRepository.findByTenantIdAndActorIdOrderByOccurredAtDesc(tenantId, actorId, pageable);
        } else if (action != null) {
            results = auditSearchRepository.findByTenantIdAndActionOrderByOccurredAtDesc(tenantId, action, pageable);
        } else if (startDate != null && endDate != null) {
            results = auditSearchRepository.findByTenantIdAndOccurredAtBetweenOrderByOccurredAtDesc(tenantId, startDate, endDate, pageable);
        } else {
            results = auditSearchRepository.findByTenantIdOrderByOccurredAtDesc(tenantId, pageable);
        }

        return ResponseEntity.ok(results);
    }
}
