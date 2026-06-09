package com.saep.identity.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class Confirm2FaRequest {

    @NotBlank(message = "Code is required")
    private String code;
}
