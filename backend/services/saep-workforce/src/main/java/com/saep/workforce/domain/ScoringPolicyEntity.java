package com.saep.workforce.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;
import java.time.LocalDateTime;

@Entity
@Table(name = "scoring_policies")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScoringPolicyEntity {
    @Id
    private UUID id;
    
    private String tenantId;
    private String policyVersion;
    
    // JSON mapping of generic weights/factors not tied to a single signal
    // e.g., {"timeDecayFactor": 0.95, "recentWeight": 1.2}
    @jakarta.persistence.Column(columnDefinition = "jsonb")
    private String weightsPayload;
    
    private LocalDateTime effectiveDate;
    private LocalDateTime createdAt;
    
    @jakarta.persistence.Version
    private Long version;
}
