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
@Table(name = "evidence_records")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EvidenceRecordEntity {
    @Id
    private UUID id;
    
    private String tenantId;
    private String workerId;
    
    private String sourceEventId;
    private String sourceSystem; // e.g. communication, governance, marketplace
    private String sourceType; // e.g. task.completed, policy.violation
    
    @jakarta.persistence.Column(columnDefinition = "jsonb")
    private String payload;
    private String payloadHash; // Immutable integrity check
    
    private LocalDateTime occurredAt;
    private LocalDateTime recordedAt;
}
