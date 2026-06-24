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
public class AgentProvisionRequestedEvent {
    @Builder.Default
    private String eventType = "agent.provision.requested.v1";
    private String eventId;
    private String correlationId;
    private String causationId;
    private UUID tenantId;
    private String hireId;
    private String agentTemplateId;
    private String hiredAgentName;
    private String timestamp;
    private int version = 1;
}
