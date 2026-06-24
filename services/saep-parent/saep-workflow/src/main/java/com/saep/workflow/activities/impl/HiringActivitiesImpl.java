package com.saep.workflow.activities.impl;

import com.saep.workflow.activities.HiringActivities;
import com.saep.workflow.event.WorkflowEventPublisher;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Map;

/**
 * Production implementation of HiringActivities.
 * All methods dispatch via REST to downstream SAEP microservices.
 * Uses the shared RestTemplate bean which injects X-Tenant-Id and M2M auth headers.
 * Never accesses databases directly (per ServiceArchitecture Rule 2).
 */
@Component
public class HiringActivitiesImpl implements HiringActivities {

    private final RestTemplate restTemplate;
    private final WorkflowEventPublisher eventPublisher;

    @Value("${saep.services.marketplace}")
    private String marketplaceServiceUrl;

    @Value("${saep.services.workforce}")
    private String workforceServiceUrl;

    @Value("${saep.services.governance}")
    private String governanceServiceUrl;

    public HiringActivitiesImpl(RestTemplate restTemplate, WorkflowEventPublisher eventPublisher) {
        this.restTemplate = restTemplate;
        this.eventPublisher = eventPublisher;
    }

    @Override
    public List<Map<String, Object>> searchMarketplace(String requiredProfessionId, Map<String, Object> criteria) {
        String url = UriComponentsBuilder.fromHttpUrl(marketplaceServiceUrl)
                .path("/api/v1/marketplace/search")
                .queryParam("professionId", requiredProfessionId)
                .toUriString();

        ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                new HttpEntity<>(criteria),
                new ParameterizedTypeReference<List<Map<String, Object>>>() {}
        );
        return response.getBody();
    }

    @Override
    public Map<String, Object> evaluateCandidates(List<Map<String, Object>> candidates, String companyId) {
        String url = UriComponentsBuilder.fromHttpUrl(workforceServiceUrl)
                .path("/api/v1/workforce/evaluate")
                .toUriString();

        Map<String, Object> payload = Map.of(
                "candidates", candidates,
                "companyId", companyId
        );

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                new HttpEntity<>(payload),
                new ParameterizedTypeReference<Map<String, Object>>() {}
        );
        return response.getBody();
    }

    @Override
    public Map<String, Object> conductInterview(String candidateId, String companyId) {
        String url = UriComponentsBuilder.fromHttpUrl(workforceServiceUrl)
                .path("/api/v1/workforce/interview")
                .toUriString();

        Map<String, Object> payload = Map.of(
                "candidateId", candidateId,
                "companyId", companyId
        );

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                new HttpEntity<>(payload),
                new ParameterizedTypeReference<Map<String, Object>>() {}
        );
        return response.getBody();
    }

    @Override
    public void requestHumanApproval(String companyId, String candidateId, String workflowId) {
        String url = UriComponentsBuilder.fromHttpUrl(governanceServiceUrl)
                .path("/api/v1/governance/approvals/request")
                .toUriString();

        Map<String, Object> payload = Map.of(
                "companyId", companyId,
                "candidateId", candidateId,
                "workflowId", workflowId,
                "type", "HIRING"
        );

        restTemplate.postForEntity(url, payload, Void.class);
    }

    @Override
    public String createEmploymentRecord(String companyId, String candidateId) {
        String url = UriComponentsBuilder.fromHttpUrl(workforceServiceUrl)
                .path("/api/v1/workforce/employment")
                .toUriString();

        Map<String, Object> payload = Map.of(
                "companyId", companyId,
                "candidateId", candidateId
        );

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                new HttpEntity<>(payload),
                new ParameterizedTypeReference<Map<String, Object>>() {}
        );

        Map<String, Object> body = response.getBody();
        if (body != null && body.containsKey("employmentId")) {
            return (String) body.get("employmentId");
        }
        throw new IllegalStateException("Failed to extract employmentId from workforce service response");
    }

    @Override
    public void publishHiringEvent(String companyId, String candidateId, String eventType) {
        String url = UriComponentsBuilder.fromHttpUrl(workforceServiceUrl)
                .path("/api/v1/workforce/events/publish")
                .toUriString();

        Map<String, Object> payload = Map.of(
                "companyId", companyId,
                "candidateId", candidateId,
                "eventType", eventType
        );

        restTemplate.postForEntity(url, payload, Void.class);
    }
}
