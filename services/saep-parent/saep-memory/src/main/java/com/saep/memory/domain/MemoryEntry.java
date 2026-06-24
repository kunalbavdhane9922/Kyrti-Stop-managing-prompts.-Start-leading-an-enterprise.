package com.saep.memory.domain;

import com.saep.memory.domain.enums.*;
import jakarta.persistence.*;
import jakarta.persistence.Version;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "memory_entries")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemoryEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "owner_id", nullable = false)
    private UUID ownerId;

    @Enumerated(EnumType.STRING)
    @Column(name = "owner_type", nullable = false)
    private OwnerType ownerType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MemoryScope scope;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MemoryVisibility visibility;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "version_number", nullable = false)
    @Builder.Default
    private Integer versionNumber = 1;

    @Column(name = "importance_score", nullable = false)
    @Builder.Default
    private Integer importanceScore = 5;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MemoryStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "source_type")
    private SourceType sourceType;

    @Column(name = "source_reference")
    private String sourceReference;

    @Column(name = "embedding_attempts", nullable = false)
    @Builder.Default
    private Integer embeddingAttempts = 0;

    @Column(name = "last_embedding_error", columnDefinition = "TEXT")
    private String lastEmbeddingError;

    @Column(name = "next_retry_at")
    private LocalDateTime nextRetryAt;

    @Version
    @Column(name = "version")
    private Long version;

    @Column(name = "idempotency_key")
    private String idempotencyKey;

    @Column(name = "origin_memory_id")
    private UUID originMemoryId;

    @Column(name = "transfer_id")
    private UUID transferId;

    @Column(name = "archived_at")
    private LocalDateTime archivedAt;

    @Column(name = "archived_by")
    private UUID archivedBy;

    @Column(name = "archive_reason")
    private String archiveReason;

    @Column(name = "agent_id")
    private String agentId;

    @Column(name = "workflow_id")
    private String workflowId;

    @Column(name = "task_id")
    private String taskId;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "last_accessed_at")
    private LocalDateTime lastAccessedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
