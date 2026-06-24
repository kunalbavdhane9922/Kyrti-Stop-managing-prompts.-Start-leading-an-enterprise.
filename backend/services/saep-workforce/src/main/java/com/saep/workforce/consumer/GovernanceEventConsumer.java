package com.saep.workforce.consumer;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.saep.workforce.dto.CreateProfessionalRequest;
import com.saep.workforce.dto.HireProfessionalRequest;
import com.saep.workforce.dto.TerminationRequest;
import com.saep.workforce.service.DigitalProfessionalService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class GovernanceEventConsumer {

    private final ObjectMapper objectMapper;
    private final DigitalProfessionalService digitalProfessionalService;

    @KafkaListener(topics = "governance-events", groupId = "saep-workforce-group")
    public void consumeGovernanceEvent(String message) {
        try {
            JsonNode event = objectMapper.readTree(message);
            
            String status = event.path("status").asText();
            if (!"APPROVED".equals(status)) {
                // We only execute approved governance decisions
                return;
            }

            String type = event.path("type").asText();
            String tenantId = event.path("tenantId").asText();
            JsonNode payload = event.path("payload");
            
            log.info("Received APPROVED governance event of type: {}", type);

            if ("HIRING".equals(type) || "EXECUTIVE_HIRE".equals(type)) {
                // Wait, is it creating a professional or just hiring an existing one?
                // Let's support both. If workerId is provided, we hire. Else we create.
                if (payload.has("workerId") && !payload.path("workerId").asText().isBlank()) {
                    UUID workerId = UUID.fromString(payload.path("workerId").asText());
                    HireProfessionalRequest request = new HireProfessionalRequest();
                    if (payload.has("companyId")) {
                        request.setCompanyId(UUID.fromString(payload.path("companyId").asText()));
                    }
                    if (payload.has("newRole")) {
                        request.setNewRole(payload.path("newRole").asText());
                    }
                    request.setReason(payload.path("reason").asText("Hired via Governance"));
                    digitalProfessionalService.hireProfessional(tenantId, workerId, "system", "system", request);
                } else if (payload.has("professionCode")) {
                    CreateProfessionalRequest request = new CreateProfessionalRequest();
                    request.setProfessionCode(payload.path("professionCode").asText());
                    if (payload.has("templateVersion")) {
                        request.setTemplateVersion(payload.path("templateVersion").asInt());
                    }
                    if (payload.has("companyId")) {
                        request.setCompanyId(UUID.fromString(payload.path("companyId").asText()));
                    }
                    digitalProfessionalService.createProfessional(tenantId, "system", "system", request);
                }
            } else if ("TERMINATION".equals(type)) {
                if (payload.has("workerId")) {
                    UUID workerId = UUID.fromString(payload.path("workerId").asText());
                    TerminationRequest request = new TerminationRequest();
                    request.setReason(payload.path("reason").asText("Terminated via Governance"));
                    digitalProfessionalService.terminateProfessional(tenantId, workerId, "system", "system", request);
                }
            }
            
        } catch (Exception e) {
            log.error("Failed to process governance event: {}", message, e);
        }
    }
}
