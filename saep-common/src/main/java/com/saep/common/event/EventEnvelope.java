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
    private T payload;

    public static <T> EventEnvelope<T> wrap(T payload, String eventType, String version, String tenantId) {
        return EventEnvelope.<T>builder()
                .eventId(UUID.randomUUID().toString())
                .eventType(eventType)
                .version(version)
                .tenantId(tenantId)
                .occurredAt(LocalDateTime.now())
                .payload(payload)
                .build();
    }
}
