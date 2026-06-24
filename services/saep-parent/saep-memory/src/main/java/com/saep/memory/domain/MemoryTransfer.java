package com.saep.memory.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "memory_transfers")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemoryTransfer {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "source_memory_id", nullable = false)
    private UUID sourceMemoryId;

    @Column(name = "target_scope", nullable = false)
    private String targetScope;

    @Column(name = "target_tenant_id", nullable = false)
    private UUID targetTenantId;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "reviewer_id")
    private UUID reviewerId;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Version
    @Column(name = "version")
    private Long version;

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
