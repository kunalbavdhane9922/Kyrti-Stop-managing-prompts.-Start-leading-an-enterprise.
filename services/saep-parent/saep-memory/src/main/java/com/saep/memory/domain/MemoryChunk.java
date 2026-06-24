package com.saep.memory.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "memory_chunks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemoryChunk {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "memory_entry_id", nullable = false)
    private MemoryEntry memoryEntry;

    @Column(name = "chunk_index", nullable = false)
    private Integer chunkIndex;

    @Column(name = "vector_id", nullable = false)
    private UUID vectorId;

    @Column(name = "token_count", nullable = false)
    private Integer tokenCount;

    @Column(name = "content_chunk", columnDefinition = "TEXT", nullable = false)
    private String contentChunk;

    @Column(name = "embedding_model", nullable = false)
    private String embeddingModel;

    @Column(name = "embedding_version", nullable = false)
    private String embeddingVersion;
}
