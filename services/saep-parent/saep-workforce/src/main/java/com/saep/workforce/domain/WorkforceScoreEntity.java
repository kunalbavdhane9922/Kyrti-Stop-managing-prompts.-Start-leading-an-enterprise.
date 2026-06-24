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
@Table(name = "workforce_scores")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkforceScoreEntity {
    @Id
    private UUID id;
    
    private String tenantId;
    private String workerId;
    
    private Double capabilityScore;
    private Double skillScore;
    private Double readinessScore;
    
    private String calculationVersion;
    private LocalDateTime updatedAt;
    
    @jakarta.persistence.Version
    private Long version;
}
