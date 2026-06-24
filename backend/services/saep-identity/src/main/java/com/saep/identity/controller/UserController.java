package com.saep.identity.controller;

import com.saep.identity.service.UserAuthorizationService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserAuthorizationService authorizationService;

    public UserController(UserAuthorizationService authorizationService) {
        this.authorizationService = authorizationService;
    }

    @GetMapping("/me/authorization")
    public ResponseEntity<?> getAuthorization(HttpServletRequest request) {
        String userIdHeader = request.getHeader("X-User-Id");
        String tenantIdHeader = request.getHeader("X-Tenant-Id");

        if (userIdHeader == null || tenantIdHeader == null || tenantIdHeader.isBlank()) {
            return ResponseEntity.status(403).body(Map.of("success", false, "error", Map.of("message", "Missing tenant context")));
        }

        UUID userId = UUID.fromString(userIdHeader);
        Map<String, Object> authData = authorizationService.getUserAuthorization(userId, tenantIdHeader);
        return ResponseEntity.ok(Map.of("success", true, "data", authData));
    }
}
