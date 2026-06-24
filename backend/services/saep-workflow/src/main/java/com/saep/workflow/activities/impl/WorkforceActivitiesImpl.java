package com.saep.workflow.activities.impl;

import com.saep.workflow.activities.WorkforceActivities;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Map;

/**
 * Production implementation of WorkforceActivities.
 * Dispatches termination and promotion operations to saep-workforce and saep-governance.
 * Uses the shared RestTemplate bean (X-Tenant-Id + M2M auth injected).
 */
@Component
public class WorkforceActivitiesImpl implements WorkforceActivities {

    private final RestTemplate restTemplate;

    @Value("${saep.services.workforce}")
    private String workforceServiceUrl;

    @Value("${saep.services.governance}")
    private String governanceServiceUrl;

    public WorkforceActivitiesImpl(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Override
    public void validateTermination(String companyId, String professionalId) {
        String url = UriComponentsBuilder.fromHttpUrl(workforceServiceUrl)
                .path("/api/v1/workforce/termination/validate")
                .toUriString();

        Map<String, Object> payload = Map.of(
                "companyId", companyId,
                "professionalId", professionalId
        );

        restTemplate.postForEntity(url, payload, Void.class);
    }

    @Override
    public void requestTerminationApproval(String companyId, String professionalId, String workflowId, String reason) {
        String url = UriComponentsBuilder.fromHttpUrl(governanceServiceUrl)
                .path("/api/v1/governance/approvals/request")
                .toUriString();

        Map<String, Object> payload = Map.of(
                "companyId", companyId,
                "professionalId", professionalId,
                "workflowId", workflowId,
                "reason", reason,
                "type", "TERMINATION"
        );

        restTemplate.postForEntity(url, payload, Void.class);
    }

    @Override
    public String executeTermination(String companyId, String professionalId) {
        String url = UriComponentsBuilder.fromHttpUrl(workforceServiceUrl)
                .path("/api/v1/workforce/termination/execute")
                .toUriString();

        Map<String, Object> payload = Map.of(
                "companyId", companyId,
                "professionalId", professionalId
        );

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                new HttpEntity<>(payload),
                new ParameterizedTypeReference<Map<String, Object>>() {}
        );

        Map<String, Object> body = response.getBody();
        if (body != null && body.containsKey("terminationId")) {
            return (String) body.get("terminationId");
        }
        throw new IllegalStateException("Failed to extract terminationId from workforce service response");
    }

    @Override
    public void validatePromotion(String companyId, String professionalId, String targetLevel) {
        String url = UriComponentsBuilder.fromHttpUrl(workforceServiceUrl)
                .path("/api/v1/workforce/promotion/validate")
                .toUriString();

        Map<String, Object> payload = Map.of(
                "companyId", companyId,
                "professionalId", professionalId,
                "targetLevel", targetLevel
        );

        restTemplate.postForEntity(url, payload, Void.class);
    }

    @Override
    public void requestPromotionApproval(String companyId, String professionalId, String workflowId, String targetLevel) {
        String url = UriComponentsBuilder.fromHttpUrl(governanceServiceUrl)
                .path("/api/v1/governance/approvals/request")
                .toUriString();

        Map<String, Object> payload = Map.of(
                "companyId", companyId,
                "professionalId", professionalId,
                "workflowId", workflowId,
                "targetLevel", targetLevel,
                "type", "PROMOTION"
        );

        restTemplate.postForEntity(url, payload, Void.class);
    }

    @Override
    public String executePromotion(String companyId, String professionalId, String targetLevel) {
        String url = UriComponentsBuilder.fromHttpUrl(workforceServiceUrl)
                .path("/api/v1/workforce/promotion/execute")
                .toUriString();

        Map<String, Object> payload = Map.of(
                "companyId", companyId,
                "professionalId", professionalId,
                "targetLevel", targetLevel
        );

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                new HttpEntity<>(payload),
                new ParameterizedTypeReference<Map<String, Object>>() {}
        );

        Map<String, Object> body = response.getBody();
        if (body != null && body.containsKey("promotionId")) {
            return (String) body.get("promotionId");
        }
        throw new IllegalStateException("Failed to extract promotionId from workforce service response");
    }

    @Override
    public void publishWorkforceEvent(String companyId, String professionalId, String eventType) {
        String url = UriComponentsBuilder.fromHttpUrl(workforceServiceUrl)
                .path("/api/v1/workforce/events/publish")
                .toUriString();

        Map<String, Object> payload = Map.of(
                "companyId", companyId,
                "professionalId", professionalId,
                "eventType", eventType
        );

        restTemplate.postForEntity(url, payload, Void.class);
    }
}
