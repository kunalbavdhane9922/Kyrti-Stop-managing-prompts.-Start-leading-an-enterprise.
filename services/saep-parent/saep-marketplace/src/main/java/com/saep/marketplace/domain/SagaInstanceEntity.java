package com.saep.marketplace.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "saga_instances")
@Data
@NoArgsConstructor
public class SagaInstanceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "correlation_id", nullable = false, unique = true)
    private String correlationId;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "current_step", nullable = false)
    private String currentStep;

    @Column(name = "payload", columnDefinition = "text")
    private String payload;

    @Column(name = "started_at", updatable = false)
    private Instant startedAt = Instant.now();

    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();

    @Version
    private Long version;
}
