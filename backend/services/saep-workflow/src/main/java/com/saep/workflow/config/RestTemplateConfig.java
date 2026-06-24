package com.saep.workflow.config;

import com.saep.common.security.ServiceTokenProvider;
import com.saep.common.tenant.TenantContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.UUID;

/**
 * Configures a RestTemplate bean that automatically injects:
 * - X-Tenant-Id header from TenantContext (tenant isolation enforcement)
 * - Authorization header with M2M service JWT token
 *
 * This ensures all outbound HTTP calls from saep-workflow
 * to other SAEP microservices respect tenant boundaries and
 * authenticate as the workflow service.
 */
@Configuration
public class RestTemplateConfig {

    private final ServiceTokenProvider serviceTokenProvider;

    public RestTemplateConfig(ServiceTokenProvider serviceTokenProvider) {
        this.serviceTokenProvider = serviceTokenProvider;
    }

    @Bean
    public RestTemplate restTemplate() {
        RestTemplate restTemplate = new RestTemplate();

        ClientHttpRequestInterceptor tenantInterceptor = (request, body, execution) -> {
            UUID tenantId = TenantContext.getTenantId();
            if (tenantId != null) {
                request.getHeaders().set("X-Tenant-Id", tenantId.toString());
            }

            String token = serviceTokenProvider.generateServiceToken(
                    "saep-workflow",
                    tenantId != null ? tenantId.toString() : "",
                    UUID.randomUUID().toString(),
                    "saep-workflow"
            );
            request.getHeaders().set("Authorization", "Bearer " + token);

            return execution.execute(request, body);
        };

        restTemplate.setInterceptors(List.of(tenantInterceptor));
        return restTemplate;
    }
}
