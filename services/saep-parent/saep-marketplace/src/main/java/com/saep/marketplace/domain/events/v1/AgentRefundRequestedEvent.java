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
public class AgentRefundRequestedEvent {
    @Builder.Default
    private String eventType = "agent.refund.requested.v1";
    private String eventId;
    private String correlationId;
    private String causationId;
    private UUID tenantId;
    private String hireId;
    private String timestamp;
    private String reason;
    private int version = 1;
}
