package com.saep.identity.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class Disable2FaRequest {

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Code is required")
    private String code;
}
