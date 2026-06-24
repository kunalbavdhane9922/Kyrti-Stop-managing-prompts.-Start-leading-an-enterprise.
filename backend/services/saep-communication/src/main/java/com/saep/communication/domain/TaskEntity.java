package com.saep.communication.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "communication_tasks", indexes = {
    @Index(name = "idx_task_assignee", columnList = "tenant_id, assignee_id")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskEntity {

    @Id
    private String id;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "correlation_id")
    private String correlationId;

    @Column(name = "assigner_id", nullable = false)
    private String assignerId;

    @Column(name = "assignee_id", nullable = false)
    private String assigneeId;

    @Column(name = "status", nullable = false)
    private String status; // ASSIGNED, ACCEPTED, IN_PROGRESS, BLOCKED, COMPLETED, CANCELLED

    @Column(name = "payload", columnDefinition = "text")
    private String payload;

    @Version
    private Long version;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Column(name = "deleted_at")
    private Instant deletedAt;
}
