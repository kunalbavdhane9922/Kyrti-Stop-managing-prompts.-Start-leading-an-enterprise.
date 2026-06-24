package com.saep.marketplace.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "employment_contracts")
@Data
@NoArgsConstructor
public class EmploymentContractEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "agent_id", nullable = false)
    private String agentId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ContractStatus status = ContractStatus.DRAFT;

    @Column(name = "trial_days")
    private Integer trialDays;

    @Column(name = "started_at")
    private Instant startedAt;

    @Column(name = "expires_at")
    private Instant expiresAt;

    @Column(name = "terminated_at")
    private Instant terminatedAt;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt = Instant.now();

    @Version
    private Long version;

    @Column(name = "lifecycle_version", nullable = false)
    private Long lifecycleVersion = 0L;
}
