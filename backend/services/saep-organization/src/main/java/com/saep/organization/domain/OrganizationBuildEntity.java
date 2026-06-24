package com.saep.organization.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "organization_builds", indexes = {
    // Note: A true conditional partial unique index (UNIQUE WHERE status='ACTIVE') 
    // requires a native DB script in PostgreSQL: 
    // CREATE UNIQUE INDEX idx_unique_active_build ON organization_builds (tenant_id) WHERE status = 'ACTIVE';
    // We document it here and enforce it programmatically if pure JPA auto-ddl is used.
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrganizationBuildEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String tenantId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrganizationBuildStatus status;

    private Integer buildVersion;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
