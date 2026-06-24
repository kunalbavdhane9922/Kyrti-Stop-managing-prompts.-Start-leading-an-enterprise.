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
@Table(name = "workforce_score_history")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkforceScoreHistoryEntity {
    @Id
    private UUID id;
    
    private String tenantId;
    private String workerId;
    
    private Double previousCapabilityScore;
    private Double newCapabilityScore;
    
    private Double previousSkillScore;
    private Double newSkillScore;
    
    private Double previousReadinessScore;
    private Double newReadinessScore;
    
    private String signalId; // The signal that caused this update
    private String calculationVersion;
    
    private LocalDateTime timestamp;
}
