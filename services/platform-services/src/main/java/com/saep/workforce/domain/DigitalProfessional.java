package com.saep.workforce.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;
import java.time.Instant;

@Entity
@Table(name = "digital_professionals")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DigitalProfessional {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID tenantId;

    @Column(nullable = false)
    private UUID professionTemplateId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LifecycleState lifecycleState;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExecutionState executionState;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AvailabilityState availabilityState;

    private Instant createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }
}
