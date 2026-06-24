package com.saep.identity.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.UUID;

@Data
public class SelectTenantRequest {

    @NotBlank(message = "Tenant selection token is required")
    private String tenantSelectionToken;

    private String tenantId;

    private String fingerprint;
}
