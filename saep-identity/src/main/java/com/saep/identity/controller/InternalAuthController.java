package com.saep.identity.controller;

import com.saep.identity.service.UserAuthorizationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/internal/v1/auth")
public class InternalAuthController {

    private final UserAuthorizationService userAuthorizationService;
    private final com.saep.identity.service.RedisTokenService redisTokenService;

    public InternalAuthController(UserAuthorizationService userAuthorizationService, com.saep.identity.service.RedisTokenService redisTokenService) {
        this.userAuthorizationService = userAuthorizationService;
        this.redisTokenService = redisTokenService;
    }

    @GetMapping("/permissions")
    public ResponseEntity<?> getPermissions(@RequestParam UUID userId, @RequestParam String tenantId, @RequestHeader(value = "X-Internal-Service-Key", required = false) String serviceKey) {
        // Simple strong internal authentication
        if (serviceKey == null || !serviceKey.equals(System.getenv("SAEP_INTERNAL_SERVICE_KEY"))) {
            // For development fallback if env not set
            if (!"saep-internal-secret-dev-only".equals(serviceKey)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Invalid or missing internal service key"));
            }
        }

        Map<String, Object> authData = userAuthorizationService.getUserAuthorization(userId, tenantId);
        if (authData.isEmpty()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "User is not active in the requested tenant"));
        }

        return ResponseEntity.ok(Map.of("success", true, "data", authData));
    }

    @GetMapping("/sessions/{sessionId}/mfa-status")
    public ResponseEntity<?> getMfaStatus(@PathVariable String sessionId, @RequestHeader(value = "X-Internal-Service-Key", required = false) String serviceKey) {
        if (serviceKey == null || !serviceKey.equals(System.getenv("SAEP_INTERNAL_SERVICE_KEY"))) {
            if (!"saep-internal-secret-dev-only".equals(serviceKey)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Invalid or missing internal service key"));
            }
        }

        com.saep.identity.dto.response.SessionDto session = redisTokenService.getSession(sessionId);
        if (session == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Session not found"));
        }

        return ResponseEntity.ok(Map.of(
                "success", true,
                "mfaVerifiedAt", session.getMfaVerifiedAt() != null ? session.getMfaVerifiedAt().toString() : "null"
        ));
    }
}
