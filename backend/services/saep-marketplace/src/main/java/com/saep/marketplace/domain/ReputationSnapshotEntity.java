package com.saep.marketplace.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "reputation_snapshots")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReputationSnapshotEntity {

    @Id
    @Column(name = "agent_id")
    private String agentId;

    @Column(name = "score", nullable = false)
    private Double score;

    @Column(name = "last_event_id")
    private String lastEventId;

    @Column(name = "event_count", nullable = false)
    private Long eventCount;

    @Column(name = "snapshot_created_at", nullable = false)
    private Instant snapshotCreatedAt;
}
