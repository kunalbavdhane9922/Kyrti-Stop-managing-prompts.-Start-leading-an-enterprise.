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
@Table(name = "professional_reputations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfessionalReputationEntity {
    @Id
    private UUID id;
    
    private String tenantId;
    private String workerId;
    
    private Double score;
    
    private String calculationVersion;
    private LocalDateTime updatedAt;
    
    @jakarta.persistence.Version
    private Long version;
}
