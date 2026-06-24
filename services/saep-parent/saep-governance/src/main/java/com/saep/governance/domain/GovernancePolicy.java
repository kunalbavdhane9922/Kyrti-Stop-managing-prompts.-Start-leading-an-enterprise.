package com.saep.governance.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "governance_policies")
public class GovernancePolicy {

    @Id
    private UUID id;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "proposal_type", nullable = false)
    private String proposalType;

    @Column(name = "required_approvals", nullable = false)
    private int requiredApprovals;

    @Column(name = "mfa_required", nullable = false)
    private boolean mfaRequired;

    @Column(name = "expiration_days", nullable = false)
    private int expirationDays;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "status", nullable = false)
    private String status = "ACTIVE";

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getTenantId() { return tenantId; }
    public void setTenantId(UUID tenantId) { this.tenantId = tenantId; }
    public String getProposalType() { return proposalType; }
    public void setProposalType(String proposalType) { this.proposalType = proposalType; }
    public int getRequiredApprovals() { return requiredApprovals; }
    public void setRequiredApprovals(int requiredApprovals) { this.requiredApprovals = requiredApprovals; }
    public boolean isMfaRequired() { return mfaRequired; }
    public void setMfaRequired(boolean mfaRequired) { this.mfaRequired = mfaRequired; }
    public int getExpirationDays() { return expirationDays; }
    public void setExpirationDays(int expirationDays) { this.expirationDays = expirationDays; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
