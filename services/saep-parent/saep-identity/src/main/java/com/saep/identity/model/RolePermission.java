package com.saep.identity.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "role_permissions")
@Getter
@Setter
public class RolePermission {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "role_id", nullable = false)
    private UUID roleId;

    @Column(name = "permission_id", nullable = false)
    private UUID permissionId;

    @Column(name = "granted_at")
    private ZonedDateTime grantedAt;

    @Column(name = "granted_by")
    private UUID grantedBy;

    @PrePersist
    public void prePersist() {
        this.grantedAt = ZonedDateTime.now();
    }
}
