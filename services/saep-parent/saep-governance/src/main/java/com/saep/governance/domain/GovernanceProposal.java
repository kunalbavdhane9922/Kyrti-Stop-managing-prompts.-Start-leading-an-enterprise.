package com.saep.governance.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "governance_proposals")
public class GovernanceProposal {

    @Id
    private UUID id;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "type", nullable = false)
    private String type;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "proposer_id", nullable = false)
    private UUID proposerId;

    @Column(name = "proposer_type", nullable = false)
    private String proposerType;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "payload", nullable = false, columnDefinition = "jsonb")
    private String payload;

    @Column(name = "payload_version", nullable = false)
    private String payloadVersion;

    @Column(name = "required_approvals", nullable = false)
    private int requiredApprovals;

    @Column(name = "current_approvals", nullable = false)
    private int currentApprovals;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getTenantId() { return tenantId; }
    public void setTenantId(UUID tenantId) { this.tenantId = tenantId; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public UUID getProposerId() { return proposerId; }
    public void setProposerId(UUID proposerId) { this.proposerId = proposerId; }
    public String getProposerType() { return proposerType; }
    public void setProposerType(String proposerType) { this.proposerType = proposerType; }
    public String getPayload() { return payload; }
    public void setPayload(String payload) { this.payload = payload; }
    public String getPayloadVersion() { return payloadVersion; }
    public void setPayloadVersion(String payloadVersion) { this.payloadVersion = payloadVersion; }
    public int getRequiredApprovals() { return requiredApprovals; }
    public void setRequiredApprovals(int requiredApprovals) { this.requiredApprovals = requiredApprovals; }
    public int getCurrentApprovals() { return currentApprovals; }
    public void setCurrentApprovals(int currentApprovals) { this.currentApprovals = currentApprovals; }
    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public boolean isExpired() {
        return expiresAt.isBefore(LocalDateTime.now());
    }
}
