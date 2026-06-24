package com.saep.communication.controller;

import com.saep.communication.controller.dto.ReportResponse;
import com.saep.communication.domain.ReportEntity;
import com.saep.communication.domain.ReportStatus;
import com.saep.communication.domain.ReportType;
import com.saep.communication.domain.ReportVisibility;
import com.saep.communication.service.IdempotencyService;
import com.saep.communication.service.ReportService;
import com.saep.communication.security.TenantAuthenticationToken;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/communication/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;
    private final IdempotencyService idempotencyService;

    @PostMapping
    @PreAuthorize("hasAuthority('report.generate')")
    public ResponseEntity<?> requestReport(
            @RequestHeader(value = "X-Idempotency-Key") String idempotencyKey,
            @RequestBody Map<String, Object> body) {

        TenantAuthenticationToken auth = (TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        UUID tenantId = auth.getTenantId();
        String currentUserId = auth.getPrincipal().toString();

        var existingKeyOpt = idempotencyService.checkOrStoreIdempotencyKey(tenantId, idempotencyKey, "REQUEST_REPORT_" + idempotencyKey);
        if (existingKeyOpt.isPresent()) {
            return ResponseEntity.status(existingKeyOpt.get().getStatusCode()).body(existingKeyOpt.get().getResponsePayload());
        }

        try {
            ReportType type = ReportType.valueOf((String) body.getOrDefault("reportType", "CUSTOM"));
            ReportVisibility visibility = body.containsKey("visibility") ? 
                    ReportVisibility.valueOf((String) body.get("visibility")) : ReportVisibility.PRIVATE;
            String title = (String) body.get("title");
            String correlationId = (String) body.get("correlationId");
            String requestId = UUID.randomUUID().toString();

            ReportEntity report = reportService.requestReport(tenantId, type, visibility, title, currentUserId, correlationId, requestId, idempotencyKey);
            ReportResponse response = ReportResponse.fromEntity(report);
            
            idempotencyService.saveResponse(tenantId, idempotencyKey, response, HttpStatus.ACCEPTED.value());
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
        } catch (IllegalArgumentException e) {
            idempotencyService.saveResponse(tenantId, idempotencyKey, Map.of("error", e.getMessage()), HttpStatus.BAD_REQUEST.value());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            idempotencyService.saveResponse(tenantId, idempotencyKey, Map.of("error", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR.value());
            throw e;
        }
    }

    @GetMapping
    @PreAuthorize("hasAuthority('report.view')")
    public ResponseEntity<Page<ReportResponse>> getReports(
            @RequestParam(required = false) ReportType type,
            @RequestParam(required = false) ReportStatus status,
            @RequestParam(required = false) String requestedBy,
            Pageable pageable) {

        TenantAuthenticationToken auth = (TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        UUID tenantId = auth.getTenantId();
        String currentUserId = auth.getPrincipal().toString();

        Page<ReportEntity> reports = reportService.getTenantReports(tenantId, type, status, requestedBy, currentUserId, pageable);
        return ResponseEntity.ok(reports.map(ReportResponse::fromEntity));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('report.view')")
    public ResponseEntity<?> getReport(@PathVariable("id") String id) {
        TenantAuthenticationToken auth = (TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        UUID tenantId = auth.getTenantId();
        String currentUserId = auth.getPrincipal().toString();

        try {
            ReportEntity report = reportService.getReportById(tenantId, id, currentUserId);
            return ResponseEntity.ok(ReportResponse.fromEntity(report));
        } catch (org.springframework.security.access.AccessDeniedException e) {
            throw e;
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('report.archive')")
    public ResponseEntity<?> archiveReport(
            @PathVariable("id") String id,
            @RequestHeader(value = "X-Idempotency-Key", required = false) String idempotencyKey) {

        TenantAuthenticationToken auth = (TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        UUID tenantId = auth.getTenantId();
        String currentUserId = auth.getPrincipal().toString();
        boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("admin"));

        var existingKeyOpt = idempotencyService.checkOrStoreIdempotencyKey(tenantId, idempotencyKey, "ARCHIVE_REPORT_" + id);
        if (existingKeyOpt.isPresent()) {
            return ResponseEntity.status(existingKeyOpt.get().getStatusCode()).build();
        }

        try {
            reportService.archiveReport(tenantId, id, currentUserId, isAdmin);
            idempotencyService.saveResponse(tenantId, idempotencyKey, Map.of("status", "archived"), HttpStatus.NO_CONTENT.value());
            return ResponseEntity.noContent().build();
        } catch (org.springframework.security.access.AccessDeniedException e) {
            idempotencyService.saveResponse(tenantId, idempotencyKey, Map.of("error", e.getMessage()), HttpStatus.FORBIDDEN.value());
            throw e;
        } catch (IllegalArgumentException e) {
            idempotencyService.saveResponse(tenantId, idempotencyKey, Map.of("error", e.getMessage()), HttpStatus.NOT_FOUND.value());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            idempotencyService.saveResponse(tenantId, idempotencyKey, Map.of("error", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR.value());
            throw e;
        }
    }
}
