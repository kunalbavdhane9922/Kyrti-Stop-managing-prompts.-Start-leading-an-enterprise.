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
@Table(name = "worker_profile_read_model")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkerProfileReadModel {
    @Id
    private UUID id;
    private String tenantId;
    
    // Worker Info
    private String workerCode;
    private String displayName;
    private String professionId;
    private String level;
    private String workerType;
    private String status;
    private LocalDateTime hireDate;
    
    // Aggregated Scores
    private Double capabilityScore;
    private Double skillScore;
    private Double readinessScore;
    
    private Double professionalReputation;
    private Double teamReputation;
    private Double companyReputation;
    
    // Quick Stats
    private Integer activeAssignmentCount;
    private Integer completedTaskCount;
    private Integer failedTaskCount;
    
    private LocalDateTime lastUpdatedAt;
}
