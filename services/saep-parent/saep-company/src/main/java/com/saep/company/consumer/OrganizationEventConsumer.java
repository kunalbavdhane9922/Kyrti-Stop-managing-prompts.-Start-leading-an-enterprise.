package com.saep.company.consumer;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.saep.company.domain.CompanyEntity;
import com.saep.company.domain.CompanyStatus;
import com.saep.company.domain.InitializationRequestEntity;
import com.saep.company.domain.InitializationRequestStatus;
import com.saep.company.repository.CompanyRepository;
import com.saep.company.repository.InitializationRequestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;

@Slf4j
@Component
@RequiredArgsConstructor
public class OrganizationEventConsumer {

    private final ObjectMapper objectMapper;
    private final com.saep.company.service.CompanyService companyService;
    private final io.micrometer.core.instrument.MeterRegistry meterRegistry;

    @KafkaListener(topics = "organization.events", groupId = "saep-company-org-group")
    public void consume(String message, @Header(value = KafkaHeaders.DELIVERY_ATTEMPT, required = false) Integer attempt) {
        int currentAttempt = attempt != null ? attempt : 1;
        log.info("Received organization.events message (Attempt #{}): {}", currentAttempt, message);
        
        if (currentAttempt > 1) {
            meterRegistry.counter("consumer.retry.total", "topic", "organization.events").increment();
        }
        try {
            JsonNode root = objectMapper.readTree(message);
            String eventType = root.get("eventType").asText();
            String tenantId = root.get("tenantId").asText();
            JsonNode payload = root.get("payload");

            if ("OrganizationProvisionCompleted".equals(eventType)) {
                String buildId = payload.get("buildId").asText();
                String initializationRequestId = payload.has("initializationRequestId") ? payload.get("initializationRequestId").asText() : null;

                companyService.processOrganizationProvisionCompleted(tenantId, buildId, initializationRequestId);

                if (tenantId != null && tenantId.contains("chaos-crash-after-commit")) {
                    log.error("Chaos condition triggered: throwing exception after successful DB commit for tenant {}", tenantId);
                    throw new RuntimeException("Simulated consumer crash after commit");
                }

            } else if ("OrganizationProvisionFailed".equals(eventType)) {
                String failureReason = payload.has("failureReason") ? payload.get("failureReason").asText() : "Unknown";
                String initializationRequestId = payload.has("initializationRequestId") ? payload.get("initializationRequestId").asText() : null;

                companyService.processOrganizationProvisionFailed(tenantId, failureReason, initializationRequestId);
            }
            
            // To simulate Poison Message, if tenantId contains chaos-poison, we throw before doing anything. 
            // Wait, we can just let a bad JSON string be sent. Or we can manually throw an exception to fail processing.
            if (tenantId != null && tenantId.contains("chaos-poison")) {
                log.error("Chaos condition triggered: throwing exception to trigger Poison Message DLQ routing for tenant {}", tenantId);
                throw new RuntimeException("Simulated poison message exception");
            }
            
        } catch (Exception e) {
            log.error("Failed to process organization.events", e);
            throw new RuntimeException(e); // MUST rethrow for DLQ/Retry to work!
        }
    }
}
