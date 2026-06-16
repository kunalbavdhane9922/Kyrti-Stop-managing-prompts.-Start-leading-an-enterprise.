package com.saep.identity.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_tenant_memberships")
@Getter
@Setter
public class UserTenantMembership {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @Column(name = "joined_at")
    private LocalDateTime joinedAt;

    @Column(name = "status", nullable = false)
    private String status;

    @PrePersist
    protected void onCreate() {
        joinedAt = LocalDateTime.now();
        if (status == null) status = "ACTIVE";
    }
}
