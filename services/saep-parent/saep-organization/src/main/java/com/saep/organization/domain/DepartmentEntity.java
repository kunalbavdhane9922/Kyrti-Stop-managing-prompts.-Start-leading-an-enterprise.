package com.saep.organization.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "departments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "build_id", nullable = false)
    private UUID buildId;

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(name = "is_custom")
    private Boolean isCustom;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @PrePersist
    protected void onCreate() {
        if (isCustom == null) isCustom = false;
        if (sortOrder == null) sortOrder = 0;
    }
}
