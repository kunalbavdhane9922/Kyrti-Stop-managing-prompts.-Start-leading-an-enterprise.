package com.saep.marketplace.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.saep.marketplace.domain.AgentHireRecord;
import com.saep.marketplace.domain.HireStatus;
import com.saep.marketplace.domain.ProcessedEventEntity;
import com.saep.marketplace.domain.events.v1.AgentProvisionRequestedEvent;
import com.saep.marketplace.domain.events.v1.AgentRefundRequestedEvent;
import com.saep.marketplace.repository.AgentHireRepository;
import com.saep.marketplace.repository.MarketplaceProcessedEventRepository;
import com.saep.outbox.domain.OutboxEvent;
import com.saep.outbox.repository.OutboxEventRepository;
import io.micrometer.core.instrument.MeterRegistry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.annotation.RetryableTopic;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.retry.annotation.Backoff;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class MarketplaceWorkerService {

    private final MarketplaceProcessedEventRepository processedEventRepository;
    private final AgentHireRepository agentHireRepository;
    private final OutboxEventRepository outboxEventRepository;
    private final ObjectMapper objectMapper;
    private final MeterRegistry meterRegistry;

    @RetryableTopic(
        attempts = "3",
        backoff = @Backoff(delay = 1000, multiplier = 5.0, maxDelay = 30000),
        retryTopicSuffix = "-retry",
        dltTopicSuffix = "-dlt"
    )
    @KafkaListener(topics = "marketplace.events.inbound", groupId = "saep-marketplace-worker")
    @Transactional
    public void onEcosystemEvent(String message, Acknowledgment acknowledgment) {
        try {
            JsonNode root = objectMapper.readTree(message);
            String eventType = root.path("eventType").asText();
            String eventId = root.path("eventId").asText();
            
            // OutboxProcessor sends the raw JSON, not a wrapper.
            JsonNode data = root; 
            
            String correlationId = data.path("correlationId").asText(); // Points to hireId
            UUID tenantId = UUID.fromString(data.path("tenantId").asText());

            org.slf4j.MDC.put("correlationId", correlationId);
            org.slf4j.MDC.put("tenantId", tenantId.toString());
            org.slf4j.MDC.put("eventId", eventId);
            
            long eventVersion = data.path("version").asLong(0);

            // Atomic Inbox Pattern Check
            String consumerGroup = "saep-marketplace-worker";
            if (processedEventRepository.existsByEventIdAndConsumerGroup(eventId, consumerGroup)) {
                log.info("Event {} already processed by {}, skipping.", eventId, consumerGroup);
                acknowledgment.acknowledge();
                return;
            }

            AgentHireRecord hireRecord = agentHireRepository.findByTenantIdAndId(tenantId, correlationId)
                    .orElseThrow(() -> new IllegalStateException("Hire record not found for correlationId: " + correlationId));

            // Out-of-order event protection via Aggregate lifecycleVersion
            if (eventVersion > 0 && hireRecord.getLifecycleVersion() >= eventVersion) {
                log.warn("Stale event received: {}. Aggregate version is {}, but event version is {}. Dropping.", eventId, hireRecord.getLifecycleVersion(), eventVersion);
                acknowledgment.acknowledge();
                return;
            }

            if ("payment.confirmed.v1".equals(eventType)) {
                handlePaymentConfirmed(hireRecord, data);
            } else if ("payment.failed.v1".equals(eventType)) {
                handlePaymentFailed(hireRecord, data);
            } else if ("agent.provisioned.v1".equals(eventType)) {
                handleProvisioned(hireRecord, data);
            } else if ("agent.provision_failed.v1".equals(eventType)) {
                handleProvisionFailed(hireRecord, data);
            } else if ("refund.completed.v1".equals(eventType)) {
                handleRefundCompleted(hireRecord, data);
            } else {
                log.warn("Unknown event type received: {}", eventType);
            }

            // Mark as processed atomically
            processedEventRepository.save(ProcessedEventEntity.builder()
                    .eventId(eventId)
                    .eventType(eventType)
                    .consumerGroup(consumerGroup)
                    .build());
            
            agentHireRepository.save(hireRecord);
            acknowledgment.acknowledge();

        } catch (IllegalStateException e) {
            // Typically means invalid state transition (Out-of-order event). Let RetryableTopic backoff and retry later.
            log.warn("Invalid state transition, throwing to allow retry: {}", e.getMessage());
            meterRegistry.counter("marketplace.state_transition_failures.total").increment();
            throw e;
        } catch (Exception e) {
            log.error("Failed to process inbound event", e);
            throw new RuntimeException("Kafka error", e);
        } finally {
            org.slf4j.MDC.clear();
        }
    }

    private void handlePaymentConfirmed(AgentHireRecord hireRecord, JsonNode data) throws Exception {
        hireRecord.transitionTo(HireStatus.PAYMENT_CONFIRMED);
        hireRecord.transitionTo(HireStatus.PROVISIONING);
        log.info("Payment confirmed for hire {}, transitioning to PROVISIONING and emitting request", hireRecord.getId());

        // Emit provisioning request
        AgentProvisionRequestedEvent eventDto = AgentProvisionRequestedEvent.builder()
                .eventId(UUID.randomUUID().toString())
                .correlationId(hireRecord.getId())
                .causationId(data.get("eventId").asText())
                .tenantId(hireRecord.getTenantId())
                .hireId(hireRecord.getId())
                .agentTemplateId(hireRecord.getAgentTemplateId())
                .hiredAgentName(hireRecord.getHiredAgentName())
                .timestamp(Instant.now().toString())
                .build();

        OutboxEvent outboxEvent = OutboxEvent.builder()
                .eventId(eventDto.getEventId())
                .eventType("agent.provision.requested.v1")
                .topic("workforce.events")
                .tenantId(hireRecord.getTenantId().toString())
                .payload(objectMapper.writeValueAsString(eventDto))
                .createdAt(java.time.LocalDateTime.now())
                .status(com.saep.outbox.domain.EventStatus.PENDING)
                .retryCount(0)
                .build();

        outboxEventRepository.save(outboxEvent);
    }

    private void handlePaymentFailed(AgentHireRecord hireRecord, JsonNode data) {
        hireRecord.transitionTo(HireStatus.FAILED);
        log.error("Payment failed for hire {}", hireRecord.getId());
        meterRegistry.counter("marketplace.hire_failures.total", "reason", "payment_failed").increment();
    }

    private void handleProvisioned(AgentHireRecord hireRecord, JsonNode data) {
        hireRecord.transitionTo(HireStatus.ACTIVE);
        log.info("Agent provisioned and active for hire {}", hireRecord.getId());
    }

    private void handleProvisionFailed(AgentHireRecord hireRecord, JsonNode data) throws Exception {
        hireRecord.transitionTo(HireStatus.FAILED);
        log.error("Provisioning failed for hire {}, initiating refund saga", hireRecord.getId());
        meterRegistry.counter("marketplace.saga_compensations.total").increment();

        // Emit refund request to Treasury
        AgentRefundRequestedEvent eventDto = AgentRefundRequestedEvent.builder()
                .eventId(UUID.randomUUID().toString())
                .correlationId(hireRecord.getId())
                .causationId(data.get("eventId").asText())
                .tenantId(hireRecord.getTenantId())
                .hireId(hireRecord.getId())
                .reason("Provisioning Failed")
                .timestamp(Instant.now().toString())
                .build();

        OutboxEvent outboxEvent = OutboxEvent.builder()
                .eventId(eventDto.getEventId())
                .eventType("agent.refund.requested.v1")
                .topic("treasury.events")
                .tenantId(hireRecord.getTenantId().toString())
                .payload(objectMapper.writeValueAsString(eventDto))
                .createdAt(java.time.LocalDateTime.now())
                .status(com.saep.outbox.domain.EventStatus.PENDING)
                .retryCount(0)
                .build();

        outboxEventRepository.save(outboxEvent);
    }

    private void handleRefundCompleted(AgentHireRecord hireRecord, JsonNode data) {
        if (hireRecord.getStatus() == HireStatus.FAILED) {
            hireRecord.transitionTo(HireStatus.REFUND_PENDING);
        }
        hireRecord.transitionTo(HireStatus.REFUNDED);
        log.info("Refund completed successfully for hire {}", hireRecord.getId());
    }

    @org.springframework.kafka.annotation.DltHandler
    public void handleDltMessage(String message, @org.springframework.messaging.handler.annotation.Header(org.springframework.kafka.support.KafkaHeaders.RECEIVED_TOPIC) String topic, Acknowledgment acknowledgment) {
        log.error("Poison pill event sent to DLQ from topic: {}. Message: {}", topic, message);
        try {
            JsonNode root = objectMapper.readTree(message);
            String eventType = root.path("eventType").asText();
            JsonNode data = root;
            String correlationId = data.path("correlationId").asText();
            java.util.UUID tenantId = java.util.UUID.fromString(data.path("tenantId").asText());
            
            AgentHireRecord hireRecord = agentHireRepository.findByTenantIdAndId(tenantId, correlationId).orElse(null);
            if (hireRecord != null) {
                // If the message that failed permanently was a confirmation or provision failure, we MUST fail the aggregate
                // and we should manually attempt to emit a compensation if it hasn't been refunded.
                log.error("Saga poison pill detected for hireRecord: {}. Manually failing aggregate.", hireRecord.getId());
                hireRecord.transitionTo(HireStatus.FAILED);
                agentHireRepository.save(hireRecord);
                meterRegistry.counter("marketplace.saga_failures.dlq.total").increment();
            }
        } catch (Exception e) {
            log.error("Failed to parse DLQ message for aggregate compensation update", e);
        } finally {
            acknowledgment.acknowledge();
        }
    }
}
