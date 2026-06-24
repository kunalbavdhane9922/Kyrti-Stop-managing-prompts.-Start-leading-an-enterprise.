package com.saep.marketplace.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "reputation_events", indexes = {
    @Index(name = "idx_reputation_agent", columnList = "agent_id")
})
@Data
@NoArgsConstructor
public class ReputationEventEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "agent_id", nullable = false)
    private String agentId;

    @Column(name = "event_type", nullable = false)
    private String eventType; // e.g., "TASK_COMPLETED", "SLA_BREACH", "REVIEW_SUBMITTED"

    @Column(name = "score_delta", nullable = false)
    private Double scoreDelta; // e.g., +5.0 or -10.0

    @Column(name = "causation_id", nullable = false)
    private String causationId;

    @Column(name = "occurred_at", updatable = false)
    private Instant occurredAt = Instant.now();

    @Column(name = "sequence_number", nullable = false)
    private Long sequenceNumber;
}
