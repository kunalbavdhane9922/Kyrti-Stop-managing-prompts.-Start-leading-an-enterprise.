package com.saep.marketplace.domain.events.v1;

import lombok.Builder;
import lombok.Data;
import java.util.Map;

@Data
@Builder
@lombok.NoArgsConstructor
@lombok.AllArgsConstructor
public class AuditEvent {
    @Builder.Default
    private String eventType = "audit.event.v1";
    private String eventId;
    private String action;
    private String actorId;
    private String actorType;
    private String tenantId;
    private String targetId;
    private String targetType;
    private String timestamp;
    private Map<String, String> context;
}
