package com.saep.governance.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.UUID;

@Service
public class IdentityServiceClient {

    private final RestTemplate restTemplate;

    @Value("${saep.identity.url:http://localhost:3002}")
    private String identityServiceUrl;

    @Value("${SAEP_INTERNAL_SERVICE_KEY:saep-internal-secret-dev-only}")
    private String internalServiceKey;

    public IdentityServiceClient(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder.build();
    }

    public LocalDateTime getMfaVerifiedAt(UUID sessionId) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-Internal-Service-Key", internalServiceKey);
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            String url = identityServiceUrl + "/api/internal/v1/auth/sessions/" + sessionId + "/mfa-status";
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                String mfaStr = (String) response.getBody().get("mfaVerifiedAt");
                if (mfaStr != null && !"null".equals(mfaStr)) {
                    return LocalDateTime.parse(mfaStr, DateTimeFormatter.ISO_DATE_TIME);
                }
            }
        } catch (Exception e) {
            // Log error
            System.err.println("Failed to fetch MFA status for session " + sessionId + ": " + e.getMessage());
        }
        return null;
    }
}
