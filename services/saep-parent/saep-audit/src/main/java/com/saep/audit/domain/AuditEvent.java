package com.saep.audit.domain;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "audit_events")
@Data
public class AuditEvent {

    @Id
    private UUID id;

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @Column(nullable = false)
    private String action;

    @Column(nullable = false)
    private String actor;

    @Column(nullable = false)
    private String target;

    @Column(name = "occurred_at", nullable = false)
    private LocalDateTime occurredAt;

    @Column(nullable = false)
    private String severity;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private String details;

    @Column(nullable = false)
    private String hash;

    @Column(name = "previous_hash", nullable = false)
    private String previousHash;
}
