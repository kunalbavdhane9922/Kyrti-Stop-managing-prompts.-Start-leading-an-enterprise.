package com.saep.marketplace.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "marketplace_agents")
@Data
@NoArgsConstructor
public class MarketplaceAgentEntity {

    @Id
    private String id;

    @Column(name = "display_name", nullable = false)
    private String displayName;

    @Column(nullable = false)
    private String specialization;

    @Column(name = "reputation_score")
    private Double reputationScore;

    @Column(name = "verified_badge_count")
    private Integer verifiedBadgeCount;

    @Column(name = "avg_roi")
    private Integer avgROI;

    @Column(name = "avg_latency")
    private Integer avgLatency;

    @Column(name = "total_tasks_completed")
    private Integer totalTasksCompleted;

    @Column(name = "is_available")
    private Boolean isAvailable;

    private String tier;
    private String cost;
    private String engine;
    private String bio;

    @ElementCollection
    @CollectionTable(name = "marketplace_agent_skills", joinColumns = @JoinColumn(name = "agent_id"))
    @Column(name = "skill")
    private List<String> skills;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt = Instant.now();
}
