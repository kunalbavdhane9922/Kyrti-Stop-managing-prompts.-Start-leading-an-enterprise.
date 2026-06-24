package com.saep.common.governance;

import com.saep.common.tenant.TenantContext;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class GovernanceVerifier {

    private final RestTemplate restTemplate;
    
    // In-memory cache for V1 event-driven verification
    // Consumers can update this map when they receive Kafka events
    private final Map<UUID, Boolean> approvedProposalsCache = new ConcurrentHashMap<>();

    @Value("${saep.governance.url:http://localhost:8086}")
    private String governanceServiceUrl;

    @Value("${SAEP_INTERNAL_SERVICE_KEY:saep-internal-secret-dev-only}")
    private String internalServiceKey;

    public GovernanceVerifier(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder.build();
    }

    public void cacheApproval(UUID proposalId, boolean isApproved) {
        approvedProposalsCache.put(proposalId, isApproved);
    }

    public boolean isApproved(UUID proposalId, String expectedType) {
        UUID tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            throw new IllegalStateException("Tenant context required to verify governance approval");
        }

        // 1. Check local event-driven cache
        if (approvedProposalsCache.containsKey(proposalId)) {
            return approvedProposalsCache.get(proposalId);
        }

        // 2. Fallback to synchronous HTTP verification
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-Internal-Service-Key", internalServiceKey);
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            String url = String.format("%s/api/internal/v1/governance/proposals/%s/verify?tenantId=%s&type=%s", 
                    governanceServiceUrl, proposalId, tenantId, expectedType);
            
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Boolean approved = (Boolean) response.getBody().get("approved");
                if (Boolean.TRUE.equals(approved)) {
                    cacheApproval(proposalId, true);
                    return true;
                }
            }
        } catch (Exception e) {
            System.err.println("Failed to verify governance approval fallback for " + proposalId + ": " + e.getMessage());
        }

        return false;
    }
}
