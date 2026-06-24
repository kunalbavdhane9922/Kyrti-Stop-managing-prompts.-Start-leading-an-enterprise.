package com.saep.memory.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "memory_relations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemoryRelation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_memory_id", nullable = false)
    private MemoryEntry sourceMemory;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_memory_id", nullable = false)
    private MemoryEntry targetMemory;

    @Column(name = "relation_type", nullable = false)
    private String relationType;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
