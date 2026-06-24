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
@Table(name = "career_history")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CareerHistoryEntity {
    @Id
    private UUID id;
    private String tenantId;
    private String workerId;
    
    // Snapshot fields
    private String professionalName;
    private String roleTitle;
    private String level;
    private String companyId;
    
    // Audit fields
    private String actorId;
    private String approverId;
    
    private String eventType; // PROMOTION, DEMOTION, ROLE_CHANGE, TRANSFER
    private String previousValue;
    private String newValue;
    private String reason;
    
    private LocalDateTime occurredAt;

    // Promotion metadata
    private Double promotionScore;
    private Double promotionThreshold;
}
