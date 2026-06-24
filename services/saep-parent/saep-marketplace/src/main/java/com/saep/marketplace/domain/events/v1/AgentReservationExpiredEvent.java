package com.saep.marketplace.domain.events.v1;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AgentReservationExpiredEvent {
    private String eventId;
    private String correlationId;
    private String causationId;
    private UUID tenantId;
    private String agentId;
    private String occurredAt;
    private Integer version;
}
