package com.saep.identity.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Must be a valid email format")
    private String email;

    @NotBlank(message = "Password cannot be blank")
    private String password;

    private String fingerprint;

    private Boolean trustDevice;
}
