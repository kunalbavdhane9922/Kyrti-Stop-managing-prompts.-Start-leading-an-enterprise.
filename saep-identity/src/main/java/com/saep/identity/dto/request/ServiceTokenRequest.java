package com.saep.identity.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ServiceTokenRequest {
    @NotBlank(message = "client_id is required")
    private String clientId;

    @NotBlank(message = "client_secret is required")
    private String clientSecret;
}
