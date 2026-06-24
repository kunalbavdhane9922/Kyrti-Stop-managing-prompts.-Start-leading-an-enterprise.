package com.saep.communication.domain.events.v1;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportArchivedEvent {
    private String eventId;
    private UUID tenantId;
    private String aggregateId;
    private String aggregateType;
    private Long aggregateVersion;
    private Instant occurredAt;
    private String correlationId;
    private String causationId;
    private String actorId;
}
