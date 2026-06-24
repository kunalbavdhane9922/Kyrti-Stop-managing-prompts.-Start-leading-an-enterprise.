package com.saep.organization.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.saep.common.event.DomainEvents;
import com.saep.common.event.EventEnvelope;
import com.saep.organization.domain.*;
import com.saep.organization.repository.*;
import com.saep.outbox.domain.EventStatus;
import com.saep.outbox.domain.OutboxEvent;
import com.saep.outbox.repository.OutboxEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Handles the Kafka-triggered provisioning flow.
 * 
 * IMPORTANT: This service NO LONGER auto-generates departments, positions, or hierarchy.
 * All organization structure is defined by the user through the 10-phase wizard
 * and persisted via OrganizationBuildService.
 * 
 * This service now only:
 * 1. Creates an empty OrganizationBuild if none exists (backward compatibility)
 * 2. Emits the OrganizationProvisionCompleted event
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OrganizationProvisioningService {

    private final OrganizationBuildRepository buildRepository;
    private final OutboxEventRepository outboxEventRepository;
    private final ObjectMapper objectMapper;
    private final MeterRegistry meterRegistry;

    @Transactional
    public void provisionOrganization(String initializationRequestId, String tenantId, String industry, String growthStage, int employeeCount, String creatorId, String correlationId) {
        log.info("Organization provisioning requested for tenant {}. Structure is user-defined via wizard.", tenantId);
        meterRegistry.counter("organization_build_started_total").increment();
        
        Timer.Sample sample = Timer.start(meterRegistry);

        try {
            if (tenantId != null && tenantId.contains("chaos-fail-provision")) {
                throw new RuntimeException("Forced chaos failure for Organization Provisioning");
            }
            if (tenantId != null && tenantId.contains("chaos-timeout")) {
                log.warn("Chaos condition triggered: Silent drop for tenant {}", tenantId);
                return;
            }

            // Check if a build already exists (created by the wizard)
            var existingBuild = buildRepository.findByTenantIdAndStatus(tenantId, OrganizationBuildStatus.ACTIVE);
            
            if (existingBuild.isPresent()) {
                // Build already exists from wizard — just emit completion event
                log.info("Active build already exists for tenant {}. Emitting completion.", tenantId);
                emitOrganizationProvisionCompleted(initializationRequestId, existingBuild.get().getId().toString(), tenantId, correlationId);
            } else {
                // Backward compatibility: create an empty build for legacy flow
                log.info("No active build found for tenant {}. Creating empty build for backward compatibility.", tenantId);
                OrganizationBuildEntity build = OrganizationBuildEntity.builder()
                        .tenantId(tenantId)
                        .status(OrganizationBuildStatus.ACTIVE)
                        .buildVersion(1)
                        .build();
                build = buildRepository.save(build);
                emitOrganizationProvisionCompleted(initializationRequestId, build.getId().toString(), tenantId, correlationId);
            }

            sample.stop(meterRegistry.timer("organization_provision_duration_seconds"));

        } catch (Exception e) {
            log.error("Failed to provision organization for tenant {}", tenantId, e);
            meterRegistry.counter("organization_build_failed_total").increment();
            sample.stop(meterRegistry.timer("organization_provision_duration_seconds"));
            emitOrganizationProvisionFailed(initializationRequestId, tenantId, correlationId, e.getMessage());
        }
    }

    private void emitOrganizationProvisionCompleted(String initializationRequestId, String buildId, String tenantId, String correlationId) throws JsonProcessingException {
        java.util.Map<String, Object> payload = new java.util.HashMap<>();
        payload.put("initializationRequestId", initializationRequestId);
        payload.put("buildId", buildId);

        String traceId = org.slf4j.MDC.get(com.saep.common.tracing.TracingFilter.TRACE_ID);
        if (traceId == null) traceId = UUID.randomUUID().toString();

        String causationId = org.slf4j.MDC.get(com.saep.common.tracing.TracingFilter.CAUSATION_ID);
        if (causationId == null) causationId = correlationId;

        EventEnvelope<java.util.Map<String, Object>> envelope = EventEnvelope.wrap(
                payload, "OrganizationProvisionCompleted", DomainEvents.VERSION_1, tenantId, correlationId, causationId, traceId
        );

        saveOutbox("organization.events", envelope);
    }

    private void emitOrganizationProvisionFailed(String initializationRequestId, String tenantId, String correlationId, String failureReason) {
        try {
            java.util.Map<String, Object> payload = new java.util.HashMap<>();
            payload.put("initializationRequestId", initializationRequestId);
            payload.put("failureReason", failureReason);

            String traceId = org.slf4j.MDC.get(com.saep.common.tracing.TracingFilter.TRACE_ID);
            if (traceId == null) traceId = UUID.randomUUID().toString();

            String causationId = org.slf4j.MDC.get(com.saep.common.tracing.TracingFilter.CAUSATION_ID);
            if (causationId == null) causationId = correlationId;

            EventEnvelope<java.util.Map<String, Object>> envelope = EventEnvelope.wrap(
                    payload, "OrganizationProvisionFailed", DomainEvents.VERSION_1, tenantId, correlationId, causationId, traceId
            );

            saveOutbox("organization.events", envelope);
        } catch (Exception e) {
            log.error("Failed to emit failure event", e);
        }
    }

    private void saveOutbox(String topic, EventEnvelope<?> envelope) throws JsonProcessingException {
        OutboxEvent outboxEvent = OutboxEvent.builder()
                .eventId(envelope.getEventId())
                .eventType(envelope.getEventType())
                .topic(topic)
                .tenantId(envelope.getTenantId())
                .payload(objectMapper.writeValueAsString(envelope))
                .createdAt(LocalDateTime.now())
                .status(EventStatus.PENDING)
                .retryCount(0)
                .build();
        outboxEventRepository.save(outboxEvent);
    }
}
