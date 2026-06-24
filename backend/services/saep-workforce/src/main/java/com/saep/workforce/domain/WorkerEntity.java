package com.saep.workforce.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.UUID;
import java.time.LocalDateTime;

@Entity
@Table(name = "workers")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkerEntity {
    @Id
    private UUID id;
    private String tenantId;
    private String workerCode;
    private String displayName;
    private String professionId;
    private String level;
    private String workerType; // AI, HUMAN
    private String originTemplateId;
    private Integer originTemplateVersion;

    @JdbcTypeCode(SqlTypes.JSON)
    private ProfessionTemplateDefinition originTemplateSnapshot;

    private String status; // ACTIVE, INACTIVE, AVAILABLE, EMPLOYED, RETIRED
    private String currentCompanyId;
    private LocalDateTime hireDate;
    private LocalDateTime retirementDate;
    private Integer activeAssignmentCount;
    private Integer completedTaskCount;
    private Integer failedTaskCount;
    private Double currentCapabilityScore;
    private Double currentReputationScore;
    private LocalDateTime createdAt;
}
