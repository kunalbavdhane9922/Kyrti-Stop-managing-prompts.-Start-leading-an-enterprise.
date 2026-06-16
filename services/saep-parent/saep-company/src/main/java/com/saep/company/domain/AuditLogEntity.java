package com.saep.company.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "company_audit_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogEntity {
    @Id
    private UUID id;
    
    @Column(nullable = false)
    private UUID entityId; // e.g., companyId

    @Column(nullable = false)
    private String entityType;

    @Column(nullable = true)
    private String oldState;

    @Column(nullable = false)
    private String newState;

    @Column(nullable = false)
    private Instant timestamp;

    @Column(nullable = true)
    private String userId;
    
    @Column(nullable = true)
    private String tenantId;
    
    @Column(nullable = true)
    private String correlationId;
}
