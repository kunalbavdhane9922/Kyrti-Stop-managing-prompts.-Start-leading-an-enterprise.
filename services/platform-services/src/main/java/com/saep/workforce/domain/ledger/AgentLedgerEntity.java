package com.saep.workforce.domain.ledger;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "agent_ledger")
// The Hibernate Filter mathematically ensures no query can accidentally fetch another tenant's financial data
@org.hibernate.annotations.FilterDef(name = "tenantFilter", parameters = @org.hibernate.annotations.ParamDef(name = "tenantId", type = String.class))
@org.hibernate.annotations.Filter(name = "tenantFilter", condition = "tenant_id = :tenantId")
public class AgentLedgerEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "tenant_id", nullable = false, updatable = false)
    private String tenantId;

    @Column(name = "professional_id", nullable = false)
    private String professionalId;

    @Column(name = "cost_limit_usd", precision = 10, scale = 4, nullable = false)
    private BigDecimal costLimitUsd;

    @Column(name = "status", nullable = false)
    private String status;

    // Optimistic Locking: Prevents two CTOs from firing an agent or modifying budget at the exact same millisecond
    @Version
    private Long version;

    // Default Constructor for JPA
    protected AgentLedgerEntity() {}

    public AgentLedgerEntity(String tenantId, String professionalId, BigDecimal costLimitUsd) {
        this.tenantId = tenantId;
        this.professionalId = professionalId;
        this.costLimitUsd = costLimitUsd;
        this.status = "HIRED";
    }

    // Getters and strict state transition logic
    public UUID getId() { return id; }
    public String getTenantId() { return tenantId; }
    public String getProfessionalId() { return professionalId; }
    public BigDecimal getCostLimitUsd() { return costLimitUsd; }
    public String getStatus() { return status; }

    public void terminateContract() {
        this.status = "TERMINATED";
    }
}
