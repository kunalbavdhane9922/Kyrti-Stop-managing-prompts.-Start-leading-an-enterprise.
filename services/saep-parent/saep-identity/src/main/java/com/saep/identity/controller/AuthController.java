package com.saep.identity.controller;

import com.saep.common.security.JwtUtils;
import com.saep.identity.model.IdentityUser;
import com.saep.identity.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("username");
        String password = loginRequest.get("password");

        Optional<IdentityUser> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            IdentityUser user = userOpt.get();
            // In a real implementation, we would verify passwordHash via BCrypt
            // For Milestone 1 scaffolding, we verify directly
            if (user.getPasswordHash().equals(password)) {
                String token = jwtUtils.generateJwtToken(user.getEmail(), new java.util.HashMap<>());
                return ResponseEntity.ok(Map.of("accessToken", token, "expiresIn", 86400));
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwtUtils.validateJwtToken(token)) {
                return ResponseEntity.ok("Valid");
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
    }
}
