package com.saep.communication.controller.dto;

import com.fasterxml.jackson.databind.JsonNode;
import com.saep.communication.domain.ReportEntity;
import com.saep.communication.domain.ReportStatus;
import com.saep.communication.domain.ReportType;
import com.saep.communication.domain.ReportVisibility;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class ReportResponse {
    private String id;
    private UUID tenantId;
    private ReportType reportType;
    private ReportStatus status;
    private ReportVisibility visibility;
    private String requestedBy;
    private String generatedByService;
    private String title;
    private String correlationId;
    private String requestId;
    private String contentSummary;
    private JsonNode contentPayload;
    private String failureCode;
    private String failureReason;
    private Instant timeRangeStart;
    private Instant timeRangeEnd;
    private Instant expiresAt;
    private Instant createdAt;
    private Instant updatedAt;

    public static ReportResponse fromEntity(ReportEntity entity) {
        return ReportResponse.builder()
                .id(entity.getId())
                .tenantId(entity.getTenantId())
                .reportType(entity.getReportType())
                .status(entity.getStatus())
                .visibility(entity.getVisibility())
                .requestedBy(entity.getRequestedBy())
                .generatedByService(entity.getGeneratedByService())
                .title(entity.getTitle())
                .correlationId(entity.getCorrelationId())
                .requestId(entity.getRequestId())
                .contentSummary(entity.getContentSummary())
                .contentPayload(entity.getContentPayload())
                .failureCode(entity.getFailureCode())
                .failureReason(entity.getFailureReason())
                .timeRangeStart(entity.getTimeRangeStart())
                .timeRangeEnd(entity.getTimeRangeEnd())
                .expiresAt(entity.getExpiresAt())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
