package com.saep.common.event;

import com.fasterxml.jackson.databind.JsonNode;
import com.saep.common.enums.ActorType;
import com.saep.common.enums.AuditResult;
import com.saep.common.enums.AuditScope;

import java.time.Instant;
import java.util.UUID;

public class AuditEvent {

    private UUID eventId;
    private Integer schemaVersion = 1;
    private UUID correlationId;

    private UUID ownerId;
    private UUID actorId;
    private ActorType actorType;
    private String sourceService;
    private String ipAddress;
    private String userAgent;

    private UUID tenantId;
    private AuditScope scope;

    private String action;
    private String resourceType;
    private UUID resourceId;

    private AuditResult result;
    private Instant occurredAt;

    private JsonNode metadata;

    // Constructors
    public AuditEvent() {
    }

    // Getters and Setters

    public UUID getEventId() { return eventId; }
    public void setEventId(UUID eventId) { this.eventId = eventId; }

    public Integer getSchemaVersion() { return schemaVersion; }
    public void setSchemaVersion(Integer schemaVersion) { this.schemaVersion = schemaVersion; }

    public UUID getCorrelationId() { return correlationId; }
    public void setCorrelationId(UUID correlationId) { this.correlationId = correlationId; }

    public UUID getOwnerId() { return ownerId; }
    public void setOwnerId(UUID ownerId) { this.ownerId = ownerId; }

    public UUID getActorId() { return actorId; }
    public void setActorId(UUID actorId) { this.actorId = actorId; }

    public ActorType getActorType() { return actorType; }
    public void setActorType(ActorType actorType) { this.actorType = actorType; }

    public String getSourceService() { return sourceService; }
    public void setSourceService(String sourceService) { this.sourceService = sourceService; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }

    public UUID getTenantId() { return tenantId; }
    public void setTenantId(UUID tenantId) { this.tenantId = tenantId; }

    public AuditScope getScope() { return scope; }
    public void setScope(AuditScope scope) { this.scope = scope; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getResourceType() { return resourceType; }
    public void setResourceType(String resourceType) { this.resourceType = resourceType; }

    public UUID getResourceId() { return resourceId; }
    public void setResourceId(UUID resourceId) { this.resourceId = resourceId; }

    public AuditResult getResult() { return result; }
    public void setResult(AuditResult result) { this.result = result; }

    public Instant getOccurredAt() { return occurredAt; }
    public void setOccurredAt(Instant occurredAt) { this.occurredAt = occurredAt; }

    public JsonNode getMetadata() { return metadata; }
    public void setMetadata(JsonNode metadata) { this.metadata = metadata; }
}
