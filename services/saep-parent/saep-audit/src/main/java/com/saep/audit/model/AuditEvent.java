package com.saep.audit.model;

import com.saep.common.jpa.BaseTenantEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.UUID;

@Entity
@Table(name = "audit_events")
@Getter
@Setter
public class AuditEvent extends BaseTenantEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String eventType; // e.g., "USER_LOGIN", "COMPANY_CREATED", "POLICY_APPROVED"

    @Column(nullable = false)
    private String entityType;

    @Column(nullable = false)
    private UUID entityId;

    @Column(nullable = false)
    private String action; // CREATE, UPDATE, DELETE, READ

    @Column(columnDefinition = "TEXT")
    private String details; // JSON payload of the event details
}
