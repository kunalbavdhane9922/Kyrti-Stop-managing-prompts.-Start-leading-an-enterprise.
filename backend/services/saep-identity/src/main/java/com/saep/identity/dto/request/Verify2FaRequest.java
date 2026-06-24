package com.saep.identity.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class Verify2FaRequest {

    @NotBlank(message = "Partial token is required")
    private String partialToken;

    @NotBlank(message = "Code is required")
    private String code;

    private String fingerprint;

    private Boolean trustDevice;
}
