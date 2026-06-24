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
@Table(name = "reputation_signals")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReputationSignalEntity {
    @Id
    private UUID id;
    
    private String tenantId;
    
    private String subjectId;
    private String subjectType; // WORKER, TEAM, COMPANY
    
    private String evidenceId; // References EvidenceRecordEntity
    private String signalDefinitionId; // References SignalDefinitionEntity
    
    private Double reputationImpact;
    
    private LocalDateTime occurredAt;
    private LocalDateTime appliedAt;
}
