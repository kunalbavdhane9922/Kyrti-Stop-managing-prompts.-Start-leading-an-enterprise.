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
@Table(name = "signal_definitions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SignalDefinitionEntity {
    @Id
    private UUID id;
    
    private String tenantId;
    private String signalCode; // e.g. TASK_COMPLETED
    private String signalCategory; // e.g. PERFORMANCE, COMPLIANCE
    
    // Configured weights for this specific signal
    private Double capabilityWeight;
    private Double skillWeight;
    private Double readinessWeight;
    private Double reputationWeight;
    
    private Boolean activeFlag;
    
    private String calculationVersion; // References ScoringPolicy version or its own version
    
    private LocalDateTime createdAt;
    
    @jakarta.persistence.Version
    private Long version;
}
