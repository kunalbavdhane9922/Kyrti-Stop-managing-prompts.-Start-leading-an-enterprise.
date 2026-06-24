package com.saep.workflow.activities.impl;

import com.saep.workflow.activities.CompanyActivities;
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
 * Production implementation of CompanyActivities.
 * Uses the shared RestTemplate bean (X-Tenant-Id + M2M auth injected).
 */
@Component
public class CompanyActivitiesImpl implements CompanyActivities {

    private final RestTemplate restTemplate;

    @Value("${saep.services.company}")
    private String companyServiceUrl;

    @Value("${saep.services.governance}")
    private String governanceServiceUrl;

    public CompanyActivitiesImpl(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Override
    public String createCompanyRecord(Map<String, Object> request) {
        String url = UriComponentsBuilder.fromHttpUrl(companyServiceUrl)
                .path("/api/v1/companies")
                .toUriString();

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                new HttpEntity<>(request),
                new ParameterizedTypeReference<Map<String, Object>>() {}
        );
        Map<String, Object> body = response.getBody();
        if (body != null && body.containsKey("companyId")) {
            return (String) body.get("companyId");
        }
        throw new IllegalStateException("Failed to extract companyId from company service response");
    }

    @Override
    public String createInitialDepartment(String companyId, String departmentName) {
        String url = UriComponentsBuilder.fromHttpUrl(companyServiceUrl)
                .path("/api/v1/companies/{companyId}/departments")
                .buildAndExpand(companyId)
                .toUriString();

        Map<String, Object> payload = Map.of(
                "name", departmentName,
                "type", "ROOT"
        );

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                new HttpEntity<>(payload),
                new ParameterizedTypeReference<Map<String, Object>>() {}
        );
        Map<String, Object> body = response.getBody();
        if (body != null && body.containsKey("departmentId")) {
            return (String) body.get("departmentId");
        }
        throw new IllegalStateException("Failed to extract departmentId from company service response");
    }

    @Override
    public String establishHumanAuthority(String companyId, String founderId) {
        String url = UriComponentsBuilder.fromHttpUrl(governanceServiceUrl)
                .path("/api/v1/governance/authorities")
                .toUriString();

        Map<String, Object> payload = Map.of(
                "companyId", companyId,
                "humanId", founderId,
                "role", "FOUNDER"
        );

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                new HttpEntity<>(payload),
                new ParameterizedTypeReference<Map<String, Object>>() {}
        );
        Map<String, Object> body = response.getBody();
        if (body != null && body.containsKey("authorityId")) {
            return (String) body.get("authorityId");
        }
        throw new IllegalStateException("Failed to extract authorityId from governance service response");
    }

    @Override
    public void publishCompanyEvent(String companyId, String eventType) {
        String url = UriComponentsBuilder.fromHttpUrl(companyServiceUrl)
                .path("/api/v1/companies/{companyId}/events")
                .buildAndExpand(companyId)
                .toUriString();

        Map<String, Object> payload = Map.of(
                "eventType", eventType
        );

        restTemplate.postForEntity(url, payload, Void.class);
    }
}
