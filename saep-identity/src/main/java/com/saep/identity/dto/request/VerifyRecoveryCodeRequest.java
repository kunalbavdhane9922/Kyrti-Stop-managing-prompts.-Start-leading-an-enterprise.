package com.saep.identity.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VerifyRecoveryCodeRequest {

    @NotBlank(message = "Partial token is required")
    private String partialToken;

    @NotBlank(message = "Recovery code is required")
    private String code;
}
