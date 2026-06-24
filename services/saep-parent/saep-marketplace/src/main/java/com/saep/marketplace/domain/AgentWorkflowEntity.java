package com.saep.marketplace.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "agent_workflows")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AgentWorkflowEntity {

    @Id
    private String id;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "agent_id", nullable = false)
    private String agentId;

    @Column(name = "status", nullable = false)
    private String status; // E.g., RUNNING, COMPLETED, FAILED

}
