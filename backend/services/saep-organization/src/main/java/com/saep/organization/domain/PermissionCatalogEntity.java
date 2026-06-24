package com.saep.organization.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "permission_catalog")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PermissionCatalogEntity {

    @Id
    private UUID id;

    @Column(name = "tenant_id")
    private String tenantId;

    @Column(nullable = false)
    private String category;

    @Column(name = "permission_key", nullable = false)
    private String permissionKey;

    @Column(nullable = false)
    private String label;

    private String description;

    @Column(name = "is_system")
    private Boolean isSystem;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (isSystem == null) isSystem = false;
        if (sortOrder == null) sortOrder = 0;
    }
}
