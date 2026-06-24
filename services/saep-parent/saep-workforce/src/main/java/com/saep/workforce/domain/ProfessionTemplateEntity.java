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
@Table(name = "profession_templates")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfessionTemplateEntity {
    @Id
    private UUID id;
    
    private String tenantId;
    
    private String professionCode;
    private String professionName;
    private String category;
    
    private Integer templateVersion;
    
    private Boolean activeFlag;
    
    @JdbcTypeCode(SqlTypes.JSON)
    private ProfessionTemplateDefinition definition;
    
    private LocalDateTime createdAt;
    private String createdBy;
    
    // Used to track which template this version replaces
    private String supersedesTemplateId;
}
