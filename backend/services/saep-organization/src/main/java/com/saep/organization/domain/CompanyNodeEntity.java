package com.saep.organization.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "company_nodes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyNodeEntity {

    @Id
    private UUID id;

    @Column(name = "build_id", nullable = false)
    private UUID buildId;

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @Column(name = "parent_node_id")
    private UUID parentNodeId;

    @Column(name = "department_id")
    private UUID departmentId;

    @Column(name = "role_id")
    private UUID roleId;

    @Column(nullable = false)
    private String title;

    @Column(name = "occupant_type", nullable = false)
    private String occupantType;

    @Column(name = "node_type")
    private String nodeType;

    @Column(name = "occupant_name")
    private String occupantName;

    @Column(name = "occupant_email")
    private String occupantEmail;

    @Column(name = "occupant_phone")
    private String occupantPhone;

    @Column(name = "assignment_status")
    private String assignmentStatus;

    @Column(name = "decision_authority")
    private String decisionAuthority;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @Column(name = "group_count")
    private Integer groupCount;

    private String seniority;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (updatedAt == null) updatedAt = LocalDateTime.now();
        if (groupCount == null) groupCount = 1;
        if (sortOrder == null) sortOrder = 0;
        if (assignmentStatus == null) assignmentStatus = "VACANT";
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
