package com.saep.memory.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "memory_transfer_events")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemoryTransferEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transfer_id", nullable = false)
    private MemoryTransfer transfer;

    @Column(name = "action", nullable = false)
    private String action;

    @Column(name = "actor_id", nullable = false)
    private UUID actorId;

    @Column(name = "reason", columnDefinition = "TEXT")
    private String reason;

    @Column(name = "timestamp", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}
