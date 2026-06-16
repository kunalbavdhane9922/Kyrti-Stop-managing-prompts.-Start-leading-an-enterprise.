package com.saep.common.event;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventEnvelope<T> {
    private String eventId;
    private String eventType;
    private String version;
    private String tenantId;
    private LocalDateTime occurredAt;
    private String correlationId;
    private String causationId;
    private String traceId;
    private Integer schemaVersion;
    private String actorId;
    private String actorType;
    private T payload;

    public static <T> EventEnvelope<T> wrap(T payload, String eventType, String version, String tenantId, String correlationId, String causationId, String traceId, Integer schemaVersion, String actorId, String actorType) {
        return EventEnvelope.<T>builder()
                .eventId(UUID.randomUUID().toString())
                .eventType(eventType)
                .version(version)
                .tenantId(tenantId)
                .occurredAt(LocalDateTime.now())
                .correlationId(correlationId)
                .causationId(causationId)
                .traceId(traceId)
                .schemaVersion(schemaVersion != null ? schemaVersion : 1)
                .actorId(actorId != null ? actorId : "SYSTEM")
                .actorType(actorType != null ? actorType : "SYSTEM")
                .payload(payload)
                .build();
    }

    public static <T> EventEnvelope<T> wrap(T payload, String eventType, String version, String tenantId, String correlationId, String causationId, String traceId) {
        if (correlationId == null) throw new IllegalArgumentException("correlationId cannot be null");
        if (traceId == null) throw new IllegalArgumentException("traceId cannot be null");
        return wrap(payload, eventType, version, tenantId, correlationId, causationId, traceId, 1, "SYSTEM", "SYSTEM");
    }
}
