package com.saep.audit.domain;

import com.fasterxml.jackson.databind.JsonNode;
import com.saep.common.enums.ActorType;
import com.saep.common.enums.AuditResult;
import com.saep.common.enums.AuditScope;
import jakarta.persistence.*;
import org.hibernate.annotations.Type;
import io.hypersistence.utils.hibernate.type.json.JsonNodeBinaryType;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "audit_records")
@IdClass(AuditRecordId.class) // Because partitioned by occurred_at requires composite PK
public class AuditRecord {

    @Id
    @Column(name = "event_id", updatable = false, nullable = false)
    private UUID eventId;

    @Id
    @Column(name = "occurred_at", updatable = false, nullable = false)
    private Instant occurredAt;

    @Column(name = "schema_version", updatable = false, nullable = false)
    private Integer schemaVersion;

    @Column(name = "correlation_id", updatable = false)
    private UUID correlationId;

    @Column(name = "owner_id", updatable = false, nullable = false)
    private UUID ownerId;

    @Column(name = "actor_id", updatable = false, nullable = false)
    private UUID actorId;

    @Enumerated(EnumType.STRING)
    @Column(name = "actor_type", updatable = false, nullable = false)
    private ActorType actorType;

    @Column(name = "source_service", updatable = false)
    private String sourceService;

    @Column(name = "ip_address", updatable = false)
    private String ipAddress;

    @Column(name = "user_agent", updatable = false)
    private String userAgent;

    @Column(name = "tenant_id", updatable = false, nullable = false)
    private UUID tenantId;

    @Enumerated(EnumType.STRING)
    @Column(name = "scope", updatable = false)
    private AuditScope scope;

    @Column(name = "action", updatable = false, nullable = false)
    private String action;

    @Column(name = "resource_type", updatable = false, nullable = false)
    private String resourceType;

    @Column(name = "resource_id", updatable = false, nullable = false)
    private UUID resourceId;

    @Enumerated(EnumType.STRING)
    @Column(name = "result", updatable = false, nullable = false)
    private AuditResult result;

    @Column(name = "created_at", updatable = false, nullable = false, insertable = false)
    private Instant createdAt;

    @Type(JsonNodeBinaryType.class)
    @Column(name = "metadata", columnDefinition = "jsonb", updatable = false)
    private JsonNode metadata;

    // Constructors
    public AuditRecord() {}

    // Getters
    public UUID getEventId() { return eventId; }
    public Instant getOccurredAt() { return occurredAt; }
    public Integer getSchemaVersion() { return schemaVersion; }
    public UUID getCorrelationId() { return correlationId; }
    public UUID getOwnerId() { return ownerId; }
    public UUID getActorId() { return actorId; }
    public ActorType getActorType() { return actorType; }
    public String getSourceService() { return sourceService; }
    public String getIpAddress() { return ipAddress; }
    public String getUserAgent() { return userAgent; }
    public UUID getTenantId() { return tenantId; }
    public AuditScope getScope() { return scope; }
    public String getAction() { return action; }
    public String getResourceType() { return resourceType; }
    public UUID getResourceId() { return resourceId; }
    public AuditResult getResult() { return result; }
    public Instant getCreatedAt() { return createdAt; }
    public JsonNode getMetadata() { return metadata; }
}
