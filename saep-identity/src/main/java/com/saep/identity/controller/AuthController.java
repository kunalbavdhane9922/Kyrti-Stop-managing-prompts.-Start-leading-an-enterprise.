package com.saep.identity.controller;

import com.saep.identity.domain.User;
import com.saep.identity.dto.response.SessionDto;
import com.saep.identity.service.AuthService;
import com.saep.identity.service.JwtService;
import com.saep.identity.service.RedisTokenService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import com.saep.identity.dto.request.*;

import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    private final RedisTokenService redisTokenService;

    @Value("${app.cookie.secure:false}")
    private boolean secureCookie;

    public AuthController(AuthService authService, JwtService jwtService, RedisTokenService redisTokenService) {
        this.authService = authService;
        this.jwtService = jwtService;
        this.redisTokenService = redisTokenService;
    }

    private UUID getUserIdFromHeader(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) throw new IllegalArgumentException("Missing token");
        Claims claims = jwtService.validateAndGetClaims(authHeader.substring(7));
        // Access tokens use email as subject; userId is stored as a separate claim
        String userId = (String) claims.get("userId");
        if (userId == null) {
            // Fallback: partial tokens use userId as subject
            userId = claims.getSubject();
        }
        return UUID.fromString(userId);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            String name = request.getName();
            String[] parts = name != null ? name.split(" ", 2) : new String[]{"", ""};
            User user = authService.register(request.getEmail(), request.getPassword(), parts[0], parts.length > 1 ? parts[1] : "");
            return ResponseEntity.ok(Map.of("success", true, "data", Map.of("userId", user.getId(), "email", user.getEmail())));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", Map.of("message", e.getMessage())));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        try {
            boolean trustDevice = Boolean.TRUE.equals(request.getTrustDevice());
            AuthService.AuthResult result = authService.authenticate(request.getEmail(), request.getPassword(), 
                    request.getFingerprint() != null ? request.getFingerprint() : "unknown", httpRequest.getRemoteAddr(), httpRequest.getHeader("User-Agent"), trustDevice);
            
            return handleAuthResult(result);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("success", false, "error", Map.of("message", e.getMessage())));
        }
    }

    @PostMapping("/verify-2fa")
    public ResponseEntity<?> verify2fa(@Valid @RequestBody Verify2FaRequest request, HttpServletRequest httpRequest) {
        try {
            boolean trustDevice = Boolean.TRUE.equals(request.getTrustDevice());
            AuthService.AuthResult result = authService.verify2FA(request.getPartialToken(), request.getCode(), 
                    request.getFingerprint() != null ? request.getFingerprint() : "unknown", httpRequest.getRemoteAddr(), httpRequest.getHeader("User-Agent"), trustDevice);
            
            return handleAuthResult(result);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("success", false, "error", Map.of("message", e.getMessage())));
        }
    }

    @PostMapping("/verify-recovery-code")
    public ResponseEntity<?> verifyRecoveryCode(@Valid @RequestBody VerifyRecoveryCodeRequest request) {
        try {
            AuthService.AuthResult result = authService.verifyRecoveryCode(request.getPartialToken(), request.getCode());
            return handleAuthResult(result);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("success", false, "error", Map.of("message", e.getMessage())));
        }
    }

    @PostMapping("/select-tenant")
    public ResponseEntity<?> selectTenant(@Valid @RequestBody SelectTenantRequest request, HttpServletRequest httpRequest) {
        try {
            AuthService.AuthResult result = authService.selectTenant(request.getTenantSelectionToken(), request.getTenantId(),
                    request.getFingerprint() != null ? request.getFingerprint() : "unknown", httpRequest.getRemoteAddr(), httpRequest.getHeader("User-Agent"));
            
            return handleAuthResult(result);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("success", false, "error", Map.of("message", e.getMessage())));
        }
    }

    private ResponseEntity<?> handleAuthResult(AuthService.AuthResult result) {
        if (result.requires2FA()) {
            return ResponseEntity.ok(Map.of("success", true, "data", Map.of("requires2FA", true, "partialToken", result.partialToken())));
        }
        if (result.requiresTenantSelection()) {
            List<Map<String, String>> tenants = authService.getActiveMemberships(result.user().getId())
                    .stream()
                    .map(m -> Map.of("id", m.getTenantId().toString(), "name", "Workspace " + m.getTenantId())) // Assuming tenant name is fetched or appended
                    .collect(Collectors.toList());

            return ResponseEntity.ok(Map.of("success", true, "data", Map.of(
                    "requiresTenantSelection", true, 
                    "tenantSelectionToken", result.partialToken(), 
                    "availableTenants", tenants)));
        }
        
        String accessToken = jwtService.generateAccessToken(result.user(), result.session().getId(), result.session().getTenantId());
        ResponseCookie refreshCookie = ResponseCookie.from("refresh_token", result.rawRefreshToken())
                .httpOnly(true).secure(secureCookie).sameSite("Lax").path("/").maxAge(Duration.ofDays(7)).build();

        java.util.Map<String, Object> userData = new java.util.HashMap<>();
        userData.put("id", result.user().getId());
        userData.put("email", result.user().getEmail());
        userData.put("name", result.user().getFirstName() + " " + result.user().getLastName());
        userData.put("twoFactorEnabled", result.user().isTwoFactorEnabled());

        java.util.Map<String, Object> responseData = new java.util.HashMap<>();
        responseData.put("accessToken", accessToken);
        responseData.put("user", userData);

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(Map.of("success", true, "data", responseData));
    }

    @PostMapping("/setup-2fa")
    public ResponseEntity<?> setup2fa(HttpServletRequest request) {
        try {
            AuthService.Setup2FAResult res = authService.setup2FA(getUserIdFromHeader(request));
            return ResponseEntity.ok(Map.of("success", true, "data", Map.of("setupToken", res.setupToken(), "secret", res.secret(), "totpUri", res.totpUri())));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("success", false, "error", Map.of("message", e.getMessage())));
        }
    }

    @PostMapping("/confirm-2fa")
    public ResponseEntity<?> confirm2fa(@Valid @RequestBody Confirm2FaRequest body, HttpServletRequest request) {
        try {
            List<String> recoveryCodes = authService.confirm2FA(getUserIdFromHeader(request), body.getCode());
            return ResponseEntity.ok(Map.of("success", true, "data", Map.of("recoveryCodes", recoveryCodes)));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("success", false, "error", Map.of("message", e.getMessage())));
        }
    }

    @PostMapping("/disable-2fa")
    public ResponseEntity<?> disable2fa(@Valid @RequestBody Disable2FaRequest body, HttpServletRequest request) {
        try {
            authService.disable2FA(getUserIdFromHeader(request), body.getPassword(), body.getCode());
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("success", false, "error", Map.of("message", e.getMessage())));
        }
    }

    public static class Reset2FaRequest {
        private String partialToken;
        public String getPartialToken() { return partialToken; }
        public void setPartialToken(String partialToken) { this.partialToken = partialToken; }
    }

    @PostMapping("/reset-2fa")
    public ResponseEntity<?> reset2fa(@RequestBody Reset2FaRequest request) {
        try {
            Claims claims = jwtService.validateAndGetClaims(request.getPartialToken());
            if (!"2fa".equals(claims.get("purpose"))) throw new IllegalArgumentException("Invalid token purpose");
            UUID userId = UUID.fromString(claims.getSubject());
            authService.reset2FA(userId);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("success", false, "error", Map.of("message", e.getMessage())));
        }
    }

    public static class RefreshRequest {
        private String fingerprint;
        public String getFingerprint() { return fingerprint; }
        public void setFingerprint(String fingerprint) { this.fingerprint = fingerprint; }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@CookieValue(name = "refresh_token", required = false) String refreshToken, @RequestBody(required = false) RefreshRequest body, HttpServletRequest httpRequest) {
        if (refreshToken == null || refreshToken.isBlank()) return ResponseEntity.status(401).body(Map.of("success", false, "error", Map.of("message", "No refresh token")));
        try {
            String deviceId = (body != null && body.getFingerprint() != null) ? body.getFingerprint() : "unknown";
            AuthService.AuthResult result = authService.refreshToken(refreshToken, deviceId, httpRequest.getRemoteAddr(), httpRequest.getHeader("User-Agent"));
            return handleAuthResult(result);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("success", false, "error", Map.of("message", e.getMessage())));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@CookieValue(name = "refresh_token", required = false) String refreshToken) {
        if (refreshToken != null && !refreshToken.isBlank()) { try { authService.logout(refreshToken); } catch (Exception ignored) {} }
        ResponseCookie deleteCookie = ResponseCookie.from("refresh_token", "").httpOnly(true).secure(secureCookie).sameSite("Lax").path("/").maxAge(0).build();
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, deleteCookie.toString()).body(Map.of("success", true));
    }

    @PostMapping("/logout-all")
    public ResponseEntity<?> logoutAll(HttpServletRequest request) {
        try {
            authService.logoutAll(getUserIdFromHeader(request));
            return logout(null); // Clear local cookie too
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("success", false, "error", Map.of("message", e.getMessage())));
        }
    }

    @GetMapping("/sessions")
    public ResponseEntity<?> getSessions(HttpServletRequest request) {
        try {
            List<SessionDto> sessions = authService.getUserSessions(getUserIdFromHeader(request));
            List<Map<String, Object>> res = sessions.stream().map(s -> {
                Map<String, Object> map = new java.util.HashMap<>();
                map.put("sessionId", s.getId().toString());
                map.put("device", s.getDeviceId());
                map.put("lastActivity", s.getLastAccessedAt() != null ? s.getLastAccessedAt().toString() : null);
                map.put("expiresAt", s.getCreatedAt() != null ? s.getCreatedAt().plusDays(30).toString() : null);
                return map;
            }).collect(Collectors.toList());
            return ResponseEntity.ok(Map.of("success", true, "data", res));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("success", false, "error", Map.of("message", e.getMessage())));
        }
    }

    @DeleteMapping("/sessions/{id}")
    public ResponseEntity<?> deleteSession(@PathVariable UUID id, HttpServletRequest request) {
        try {
            authService.deleteSession(getUserIdFromHeader(request), id);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("success", false, "error", Map.of("message", e.getMessage())));
        }
    }

    @PostMapping("/heartbeat")
    public ResponseEntity<?> heartbeat(HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) throw new IllegalArgumentException("Missing token");
            Claims claims = jwtService.validateAndGetClaims(authHeader.substring(7));
            
            String sessionId = (String) claims.get("sessionId");
            if (sessionId != null) {
                redisTokenService.heartbeatSession(sessionId);
                return ResponseEntity.ok(Map.of("success", true));
            } else {
                throw new IllegalArgumentException("No session ID in token");
            }
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("success", false, "error", Map.of("message", e.getMessage())));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> me() {
        return ResponseEntity.ok(Map.of("success", true, "data", Map.of("message", "Token is valid")));
    }
}
