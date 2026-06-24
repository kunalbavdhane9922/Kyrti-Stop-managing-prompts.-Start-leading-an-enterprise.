package com.saep.company.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "permission_catalog")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PermissionCatalogEntity {

    @Id
    @Column(name = "code", nullable = false, unique = true)
    private String code; // e.g., "members:invite"

    @Column(name = "name", nullable = false)
    private String name; // e.g., "Invite Members"

    @Column(name = "module", nullable = false)
    private String module; // e.g., "MEMBERS"

    @Column(name = "description")
    private String description;

    @Column(name = "is_system", nullable = false)
    private boolean isSystem;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
