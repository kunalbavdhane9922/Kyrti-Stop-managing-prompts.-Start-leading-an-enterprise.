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
@Table(name = "reputation_score_history")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReputationScoreHistoryEntity {
    @Id
    private UUID id;
    
    private String tenantId;
    
    // Can belong to a worker, team, or company
    private String subjectId;
    private String subjectType; // WORKER, TEAM, COMPANY
    
    private Double previousScore;
    private Double newScore;
    
    private String signalId; // The signal that caused this update
    private String calculationVersion;
    
    private LocalDateTime timestamp;
}
