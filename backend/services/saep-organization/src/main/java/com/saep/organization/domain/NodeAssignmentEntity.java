package com.saep.organization.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "node_assignments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NodeAssignmentEntity {

    @Id
    private UUID id;

    @Column(name = "node_id", nullable = false)
    private UUID nodeId;

    @Column(name = "assigned_entity_id")
    private UUID assignedEntityId;

    @Column(name = "assigned_at")
    private LocalDateTime assignedAt;

    @Column(name = "tenant_id")
    private String tenantId;

    @Column(name = "assignment_type")
    private String assignmentType;

    @Column(name = "human_name")
    private String humanName;

    @Column(name = "human_email")
    private String humanEmail;

    @Column(name = "ai_agent_id")
    private String aiAgentId;

    private String status;

    @PrePersist
    protected void onCreate() {
        if (assignedAt == null) assignedAt = LocalDateTime.now();
        if (status == null) status = "UNASSIGNED";
    }
}
