package com.saep.organization.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.Column;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "role_templates")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoleTemplateEntity {
    
    @Id
    private UUID id;
    
    @Column(name = "tenant_id")
    private String tenantId;
    
    private String name;
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "template_data")
    private String templateData; // Storing JSONB as String for now
}
