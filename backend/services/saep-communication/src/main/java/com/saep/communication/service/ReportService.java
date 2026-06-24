package com.saep.communication.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.saep.communication.domain.ReportEntity;
import com.saep.communication.domain.ReportStatus;
import com.saep.communication.domain.ReportType;
import com.saep.communication.domain.ReportVisibility;
import com.saep.communication.domain.events.v1.ReportArchivedEvent;
import com.saep.communication.domain.events.v1.ReportFailedEvent;
import com.saep.communication.domain.events.v1.ReportGeneratedEvent;
import com.saep.communication.domain.events.v1.ReportRequestedEvent;
import com.saep.communication.repository.ReportRepository;
import com.saep.outbox.domain.OutboxEvent;
import com.saep.outbox.repository.OutboxEventRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final OutboxEventRepository outboxEventRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public ReportEntity requestReport(UUID tenantId, ReportType type, ReportVisibility visibility, String title,
                                      String requestedBy, String correlationId, String requestId, String idempotencyKey) {
        ReportEntity report = ReportEntity.builder()
                .tenantId(tenantId)
                .reportType(type)
                .visibility(visibility != null ? visibility : ReportVisibility.PRIVATE)
                .status(ReportStatus.PENDING)
                .requestedBy(requestedBy)
                .title(title)
                .correlationId(correlationId)
                .requestId(requestId)
                .idempotencyKey(idempotencyKey)
                .createdAt(Instant.now())
                .build();

        report = reportRepository.save(report);

        ReportRequestedEvent event = ReportRequestedEvent.builder()
                .eventId(UUID.randomUUID().toString())
                .tenantId(tenantId)
                .aggregateId(report.getId())
                .aggregateType("Report")
                .aggregateVersion(report.getVersion())
                .occurredAt(Instant.now())
                .correlationId(correlationId)
                .causationId(requestId)
                .actorId(requestedBy)
                .reportType(type.name())
                .requestId(requestId)
                .build();

        emitOutboxEvent("report.requested.v1", "communication.reports", tenantId, event);
        return report;
    }

    @Transactional
    public ReportEntity markGenerating(UUID tenantId, String reportId) {
        ReportEntity report = getActiveReport(tenantId, reportId);
        
        if (report.getStatus() != ReportStatus.PENDING) {
            throw new IllegalStateException("Only PENDING reports can be marked as GENERATING");
        }
        
        report.setStatus(ReportStatus.GENERATING);
        report.setUpdatedAt(Instant.now());
        return reportRepository.save(report);
    }

    @Transactional
    public ReportEntity markCompleted(UUID tenantId, String reportId, String contentSummary, JsonNode contentPayload, String generatedByService, Instant start, Instant end, Instant expiresAt) {
        ReportEntity report = getActiveReport(tenantId, reportId);
        
        if (report.getStatus() != ReportStatus.GENERATING && report.getStatus() != ReportStatus.PENDING) {
            throw new IllegalStateException("Cannot complete a report that is not GENERATING or PENDING");
        }
        
        report.setStatus(ReportStatus.READY);
        report.setContentSummary(contentSummary);
        report.setContentPayload(contentPayload);
        report.setGeneratedByService(generatedByService);
        report.setTimeRangeStart(start);
        report.setTimeRangeEnd(end);
        report.setExpiresAt(expiresAt);
        report.setUpdatedAt(Instant.now());
        
        report = reportRepository.save(report);

        ReportGeneratedEvent event = ReportGeneratedEvent.builder()
                .eventId(UUID.randomUUID().toString())
                .tenantId(tenantId)
                .aggregateId(report.getId())
                .aggregateType("Report")
                .aggregateVersion(report.getVersion())
                .occurredAt(Instant.now())
                .correlationId(report.getCorrelationId())
                .causationId(report.getRequestId())
                .actorId(generatedByService)
                .generatedByService(generatedByService)
                .build();

        emitOutboxEvent("report.generated.v1", "communication.reports", tenantId, event);
        return report;
    }

    @Transactional
    public ReportEntity markFailed(UUID tenantId, String reportId, String failureCode, String failureReason, String generatedByService) {
        ReportEntity report = getActiveReport(tenantId, reportId);
        
        if (report.getStatus() != ReportStatus.GENERATING && report.getStatus() != ReportStatus.PENDING) {
            throw new IllegalStateException("Cannot fail a report that is not GENERATING or PENDING");
        }
        
        report.setStatus(ReportStatus.FAILED);
        report.setFailureCode(failureCode);
        report.setFailureReason(failureReason);
        report.setGeneratedByService(generatedByService);
        report.setUpdatedAt(Instant.now());
        
        report = reportRepository.save(report);

        ReportFailedEvent event = ReportFailedEvent.builder()
                .eventId(UUID.randomUUID().toString())
                .tenantId(tenantId)
                .aggregateId(report.getId())
                .aggregateType("Report")
                .aggregateVersion(report.getVersion())
                .occurredAt(Instant.now())
                .correlationId(report.getCorrelationId())
                .causationId(report.getRequestId())
                .actorId(generatedByService)
                .failureCode(failureCode)
                .failureReason(failureReason)
                .build();

        emitOutboxEvent("report.failed.v1", "communication.reports", tenantId, event);
        return report;
    }

    @Transactional(readOnly = true)
    public Page<ReportEntity> getTenantReports(UUID tenantId, ReportType type, ReportStatus status, String requestedBy, String currentUserId, Pageable pageable) {
        return reportRepository.findTenantReports(tenantId, type, status, requestedBy, currentUserId, pageable);
    }

    @Transactional(readOnly = true)
    public ReportEntity getReportById(UUID tenantId, String reportId, String currentUserId) {
        ReportEntity report = getActiveReport(tenantId, reportId);
        
        if (report.getVisibility() == ReportVisibility.PRIVATE && !report.getRequestedBy().equals(currentUserId)) {
            throw new org.springframework.security.access.AccessDeniedException("Access denied to private report");
        }
        return report;
    }

    @Transactional
    public void archiveReport(UUID tenantId, String reportId, String currentUserId, boolean isAdmin) {
        ReportEntity report = getActiveReport(tenantId, reportId);
        
        if (!report.getRequestedBy().equals(currentUserId) && !isAdmin) {
            throw new org.springframework.security.access.AccessDeniedException("Only the requester or admin can archive this report");
        }
        
        report.setDeletedAt(Instant.now());
        reportRepository.save(report);

        ReportArchivedEvent event = ReportArchivedEvent.builder()
                .eventId(UUID.randomUUID().toString())
                .tenantId(tenantId)
                .aggregateId(report.getId())
                .aggregateType("Report")
                .aggregateVersion(report.getVersion())
                .occurredAt(Instant.now())
                .correlationId(report.getCorrelationId())
                .actorId(currentUserId)
                .build();

        emitOutboxEvent("report.archived.v1", "communication.reports", tenantId, event);
    }

    private ReportEntity getActiveReport(UUID tenantId, String reportId) {
        return reportRepository.findByTenantIdAndIdAndDeletedAtIsNull(tenantId, reportId)
                .orElseThrow(() -> new IllegalArgumentException("Report not found"));
    }

    private void emitOutboxEvent(String eventType, String topic, UUID tenantId, Object payload) {
        try {
            OutboxEvent outbox = OutboxEvent.builder()
                    .eventId(UUID.randomUUID().toString())
                    .eventType(eventType)
                    .topic(topic)
                    .tenantId(tenantId.toString())
                    .payload(objectMapper.writeValueAsString(payload))
                    .createdAt(LocalDateTime.now())
                    .status(com.saep.outbox.domain.EventStatus.PENDING)
                    .retryCount(0)
                    .build();
            outboxEventRepository.save(outbox);
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize outbox event", e);
        }
    }
}
