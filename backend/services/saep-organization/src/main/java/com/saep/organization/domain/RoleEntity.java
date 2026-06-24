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

@Entity
@Table(name = "roles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoleEntity {
    
    @Id
    private UUID id;
    
    @Column(name = "build_id")
    private UUID buildId;
    
    @Column(name = "tenant_id")
    private String tenantId;
    
    private String name;
    
    private String description;
}
