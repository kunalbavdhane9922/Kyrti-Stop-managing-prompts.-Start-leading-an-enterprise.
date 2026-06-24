package com.saep.audit.repository;

import com.saep.common.event.AuditEvent;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class AuditWriteRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public AuditWriteRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void insertAuditRecord(AuditEvent event) {
        String sql = """
            INSERT INTO audit_records (
                event_id, schema_version, correlation_id, owner_id, actor_id, actor_type,
                source_service, ip_address, user_agent, tenant_id, scope,
                action, resource_type, resource_id, result, occurred_at, metadata
            ) VALUES (
                :eventId, :schemaVersion, :correlationId, :ownerId, :actorId, :actorType,
                :sourceService, :ipAddress, :userAgent, :tenantId, :scope,
                :action, :resourceType, :resourceId, :result, :occurredAt, :metadata::jsonb
            ) ON CONFLICT (event_id, occurred_at) DO NOTHING
            """;

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("eventId", event.getEventId())
                .addValue("schemaVersion", event.getSchemaVersion())
                .addValue("correlationId", event.getCorrelationId())
                .addValue("ownerId", event.getOwnerId())
                .addValue("actorId", event.getActorId())
                .addValue("actorType", event.getActorType() != null ? event.getActorType().name() : null)
                .addValue("sourceService", event.getSourceService())
                .addValue("ipAddress", event.getIpAddress())
                .addValue("userAgent", event.getUserAgent())
                .addValue("tenantId", event.getTenantId())
                .addValue("scope", event.getScope() != null ? event.getScope().name() : null)
                .addValue("action", event.getAction())
                .addValue("resourceType", event.getResourceType())
                .addValue("resourceId", event.getResourceId())
                .addValue("result", event.getResult() != null ? event.getResult().name() : null)
                .addValue("occurredAt", java.sql.Timestamp.from(event.getOccurredAt()))
                .addValue("metadata", event.getMetadata() != null ? event.getMetadata().toString() : null);

        jdbcTemplate.update(sql, params);
    }
}
