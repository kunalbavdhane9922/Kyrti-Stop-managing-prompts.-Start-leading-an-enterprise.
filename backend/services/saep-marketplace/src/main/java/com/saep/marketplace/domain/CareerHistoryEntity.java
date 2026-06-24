package com.saep.marketplace.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "career_history")
@Data
@NoArgsConstructor
public class CareerHistoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "agent_id", nullable = false)
    private String agentId;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "contract_id", nullable = false)
    private UUID contractId;

    @Column(name = "contract_snapshot", columnDefinition = "text", nullable = false)
    private String contractSnapshot; // Stored as JSON

    @Column(name = "agent_snapshot", columnDefinition = "text", nullable = false)
    private String agentSnapshot; // Stored as JSON

    @Column(name = "recorded_at", updatable = false)
    private Instant recordedAt = Instant.now();
}
