package com.saep.audit.consumer;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PlatformDomainEvent {
    private String eventId;
    private String correlationId;
    private String actorId;
    private String actorType;
    private String sourceService;
    private String tenantId;
    private String scope;
    private String action;
    private String resourceType;
    private String resourceId;
    private String result;
    private String occurredAt;
}
