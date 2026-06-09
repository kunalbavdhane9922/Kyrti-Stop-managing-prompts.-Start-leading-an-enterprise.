package com.saep.company.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "companies")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyEntity {
    
    @Id
    private String id;
    
    private String name;
    
    private String domain;
    
    private String tenantId;
}
