package com.saep.organization.consumer;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.saep.organization.service.OrganizationProvisioningService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class CompanyEventConsumer {

    private final ObjectMapper objectMapper;
    private final OrganizationProvisioningService provisioningService;

    @KafkaListener(topics = "organization.events", groupId = "saep-organization-group")
    public void consume(String message) {
        try {
            JsonNode root = objectMapper.readTree(message);
            String eventType = root.get("eventType").asText();

            if ("OrganizationProvisionRequested".equals(eventType)) {
                String tenantId = root.get("tenantId").asText();
                String correlationId = root.has("correlationId") ? root.get("correlationId").asText() : null;
                JsonNode payload = root.get("payload");
                
                String initializationRequestId = payload.has("initializationRequestId") ? payload.get("initializationRequestId").asText() : null;
                String industry = payload.has("industry") ? payload.get("industry").asText() : "Unknown";
                String growthStage = payload.has("growthStage") ? payload.get("growthStage").asText() : "Startup";
                int employeeCount = payload.has("employeeCount") && !payload.get("employeeCount").isNull() ? payload.get("employeeCount").asInt() : 0;
                String creatorId = payload.has("creatorId") ? payload.get("creatorId").asText() : null;

                // Provisioning happens in a separate transaction inside the service
                provisioningService.provisionOrganization(initializationRequestId, tenantId, industry, growthStage, employeeCount, creatorId, correlationId);
            }
        } catch (Exception e) {
            log.error("Failed to process event in saep-organization", e);
        }
    }
}
