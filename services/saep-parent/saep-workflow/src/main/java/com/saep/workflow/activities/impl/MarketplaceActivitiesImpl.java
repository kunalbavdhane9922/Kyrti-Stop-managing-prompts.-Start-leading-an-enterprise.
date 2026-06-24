package com.saep.workflow.activities.impl;

import com.saep.workflow.activities.MarketplaceActivities;
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
 * Production implementation of MarketplaceActivities.
 * Uses the shared RestTemplate bean (X-Tenant-Id + M2M auth injected).
 */
@Component
public class MarketplaceActivitiesImpl implements MarketplaceActivities {

    private final RestTemplate restTemplate;

    @Value("${saep.services.marketplace}")
    private String marketplaceServiceUrl;

    @Value("${saep.services.governance}")
    private String governanceServiceUrl;

    public MarketplaceActivitiesImpl(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Override
    public String registerProfession(Map<String, Object> request) {
        String url = UriComponentsBuilder.fromHttpUrl(marketplaceServiceUrl)
                .path("/api/v1/marketplace/professions/draft")
                .toUriString();

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                new HttpEntity<>(request),
                new ParameterizedTypeReference<Map<String, Object>>() {}
        );
        Map<String, Object> body = response.getBody();
        if (body != null && body.containsKey("professionId")) {
            return (String) body.get("professionId");
        }
        throw new IllegalStateException("Failed to extract professionId from marketplace service response");
    }

    @Override
    public void requestProfessionApproval(String professionId, String workflowId) {
        String url = UriComponentsBuilder.fromHttpUrl(governanceServiceUrl)
                .path("/api/v1/governance/approvals/request")
                .toUriString();

        Map<String, Object> payload = Map.of(
                "targetId", professionId,
                "workflowId", workflowId,
                "type", "PROFESSION_APPROVAL"
        );

        restTemplate.postForEntity(url, payload, Void.class);
    }

    @Override
    public void activateProfession(String professionId) {
        String url = UriComponentsBuilder.fromHttpUrl(marketplaceServiceUrl)
                .path("/api/v1/marketplace/professions/{professionId}/activate")
                .buildAndExpand(professionId)
                .toUriString();

        restTemplate.postForEntity(url, null, Void.class);
    }

    @Override
    public void rejectProfession(String professionId) {
        String url = UriComponentsBuilder.fromHttpUrl(marketplaceServiceUrl)
                .path("/api/v1/marketplace/professions/{professionId}/reject")
                .buildAndExpand(professionId)
                .toUriString();

        restTemplate.postForEntity(url, null, Void.class);
    }
}
