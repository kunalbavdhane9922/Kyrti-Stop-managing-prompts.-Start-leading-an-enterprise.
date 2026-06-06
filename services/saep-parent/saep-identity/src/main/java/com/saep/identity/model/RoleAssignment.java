package com.saep.identity.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "role_assignments")
@Getter
@Setter
public class RoleAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "role_id", nullable = false)
    private UUID roleId;

    @Column(name = "tenant_id")
    private UUID tenantId;

    @Column(name = "assigned_at")
    private ZonedDateTime assignedAt;

    @Column(name = "assigned_by")
    private UUID assignedBy;

    @PrePersist
    public void prePersist() {
        this.assignedAt = ZonedDateTime.now();
    }
}
