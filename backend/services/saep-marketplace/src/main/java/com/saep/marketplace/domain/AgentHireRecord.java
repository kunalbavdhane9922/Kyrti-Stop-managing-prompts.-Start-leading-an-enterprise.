package com.saep.marketplace.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "agent_hire_records", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"tenant_id", "request_id"})
})
@Data
@NoArgsConstructor
public class AgentHireRecord {

    @Id
    private String id;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "request_id", nullable = false)
    private String requestId;

    @Column(name = "agent_template_id", nullable = false)
    private String agentTemplateId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Setter(AccessLevel.NONE)
    private HireStatus status;

    @Column(name = "hired_agent_name", nullable = false)
    private String hiredAgentName;

    @Column(name = "hired_price", nullable = false)
    private String hiredPrice;

    @Column(name = "hired_engine", nullable = false)
    private String hiredEngine;

    @Column(name = "trial_days")
    private Integer trialDays;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();

    @Version
    private Long version;

    @Column(name = "lifecycle_version", nullable = false)
    private Long lifecycleVersion = 0L;

    public AgentHireRecord(String id, UUID tenantId, UUID userId, String requestId, String agentTemplateId, String hiredAgentName, String hiredPrice, String hiredEngine, Integer trialDays) {
        this.id = id;
        this.tenantId = tenantId;
        this.userId = userId;
        this.requestId = requestId;
        this.agentTemplateId = agentTemplateId;
        this.status = HireStatus.REQUESTED;
        this.hiredAgentName = hiredAgentName;
        this.hiredPrice = hiredPrice;
        this.hiredEngine = hiredEngine;
        this.trialDays = trialDays;
    }

    private static final Map<HireStatus, Set<HireStatus>> ALLOWED_TRANSITIONS = Map.of(
            HireStatus.REQUESTED, Set.of(HireStatus.PAYMENT_IN_PROGRESS, HireStatus.PAYMENT_CONFIRMED, HireStatus.FAILED),
            HireStatus.PAYMENT_IN_PROGRESS, Set.of(HireStatus.PAYMENT_CONFIRMED, HireStatus.FAILED),
            HireStatus.PAYMENT_CONFIRMED, Set.of(HireStatus.PROVISIONING, HireStatus.ACTIVE, HireStatus.FAILED),
            HireStatus.PROVISIONING, Set.of(HireStatus.ACTIVE, HireStatus.FAILED),
            HireStatus.FAILED, Set.of(HireStatus.REFUND_PENDING),
            HireStatus.REFUND_PENDING, Set.of(HireStatus.REFUNDED),
            HireStatus.ACTIVE, Set.of(HireStatus.CANCELLED)
    );

    public void transitionTo(HireStatus newStatus) {
        if (this.status == newStatus) {
            return; // Idempotent
        }
        Set<HireStatus> allowed = ALLOWED_TRANSITIONS.getOrDefault(this.status, Set.of());
        if (!allowed.contains(newStatus)) {
            throw new IllegalStateException("Invalid state transition from " + this.status + " to " + newStatus);
        }
        this.status = newStatus;
        this.lifecycleVersion++;
        this.updatedAt = Instant.now();
    }
}
