package com.saep.marketplace.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "marketplace_agents")
@Data
@NoArgsConstructor
public class MarketplaceAgentEntity {

    @Id
    private String id;

    @Column(name = "display_name", nullable = false)
    private String displayName;

    @Column(nullable = false)
    private String specialization;

    @Column(name = "reputation_score")
    private Double reputationScore;

    @Column(name = "verified_badge_count")
    private Integer verifiedBadgeCount;

    @Column(name = "avg_roi")
    private Integer avgROI;

    @Column(name = "avg_latency")
    private Integer avgLatency;

    @Column(name = "total_tasks_completed")
    private Integer totalTasksCompleted;

    @Column(name = "is_available")
    private Boolean isAvailable;

    private String tier;
    private String cost;
    private String engine;
    private String bio;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private AgentStatus status;

    @Column(name = "reserved_by_tenant_id")
    private java.util.UUID reservedByTenantId;

    @Column(name = "reserved_until")
    private Instant reservedUntil;

    @Column(name = "tenant_id")
    private java.util.UUID tenantId;

    @Column(name = "reservation_id")
    private String reservationId;

    @Column(name = "lifecycle_version")
    private Long lifecycleVersion;

    @ElementCollection
    @CollectionTable(name = "marketplace_agent_skills", joinColumns = @JoinColumn(name = "agent_id"))
    @Column(name = "skill")
    private List<String> skills;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt = Instant.now();

    public String getId() { return this.id; }
    public void setId(String id) { this.id = id; }

    public AgentStatus getStatus() { return this.status; }
    public void setStatus(AgentStatus status) { this.status = status; }

    public java.util.UUID getReservedByTenantId() { return this.reservedByTenantId; }
    public void setReservedByTenantId(java.util.UUID reservedByTenantId) { this.reservedByTenantId = reservedByTenantId; }

    public Instant getReservedUntil() { return this.reservedUntil; }
    public void setReservedUntil(Instant reservedUntil) { this.reservedUntil = reservedUntil; }

    public java.util.UUID getTenantId() { return this.tenantId; }
    public void setTenantId(java.util.UUID tenantId) { this.tenantId = tenantId; }

    public Long getLifecycleVersion() { return this.lifecycleVersion; }
    public void setLifecycleVersion(Long lifecycleVersion) { this.lifecycleVersion = lifecycleVersion; }

    public String getReservationId() { return this.reservationId; }
    public void setReservationId(String reservationId) { this.reservationId = reservationId; }
}
