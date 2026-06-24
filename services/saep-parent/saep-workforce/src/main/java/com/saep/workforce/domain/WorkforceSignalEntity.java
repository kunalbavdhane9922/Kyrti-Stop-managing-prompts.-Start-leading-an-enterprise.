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
@Table(name = "workforce_signals")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkforceSignalEntity {
    @Id
    private UUID id;
    
    private String tenantId;
    private String workerId;
    
    private String evidenceId; // References EvidenceRecordEntity
    private String signalDefinitionId; // References SignalDefinitionEntity
    
    private Double capabilityImpact;
    private Double skillImpact;
    private Double readinessImpact;
    
    private LocalDateTime occurredAt;
    private LocalDateTime appliedAt;
}
