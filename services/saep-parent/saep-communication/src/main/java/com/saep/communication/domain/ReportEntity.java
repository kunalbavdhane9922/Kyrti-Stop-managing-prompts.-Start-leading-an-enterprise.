package com.saep.communication.domain;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "communication_reports", indexes = {
        @Index(name = "idx_report_tenant_type_status", columnList = "tenant_id, report_type, status"),
        @Index(name = "idx_report_tenant_idem", columnList = "tenant_id, idempotency_key", unique = true)
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "idempotency_key")
    private String idempotencyKey;

    @Enumerated(EnumType.STRING)
    @Column(name = "report_type", nullable = false)
    private ReportType reportType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportVisibility visibility;

    @Column(name = "requested_by", nullable = false)
    private String requestedBy;

    @Column(name = "generated_by_service")
    private String generatedByService;

    private String title;

    @Column(name = "correlation_id")
    private String correlationId;

    @Column(name = "request_id")
    private String requestId;

    @Column(name = "content_summary", columnDefinition = "TEXT")
    private String contentSummary;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "content_payload", columnDefinition = "jsonb")
    private JsonNode contentPayload;

    @Column(name = "failure_code")
    private String failureCode;

    @Column(name = "failure_reason")
    private String failureReason;

    @Column(name = "time_range_start")
    private Instant timeRangeStart;

    @Column(name = "time_range_end")
    private Instant timeRangeEnd;

    @Column(name = "expires_at")
    private Instant expiresAt;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    @Version
    private Long version;

    public String getRequestId() { return this.requestId; }
    public String getContentSummary() { return this.contentSummary; }
    public JsonNode getContentPayload() { return this.contentPayload; }
    public String getFailureCode() { return this.failureCode; }
    public String getFailureReason() { return this.failureReason; }
    public Instant getTimeRangeStart() { return this.timeRangeStart; }
    public Instant getTimeRangeEnd() { return this.timeRangeEnd; }
    public Instant getExpiresAt() { return this.expiresAt; }
    public Instant getCreatedAt() { return this.createdAt; }
    public Instant getUpdatedAt() { return this.updatedAt; }
}
