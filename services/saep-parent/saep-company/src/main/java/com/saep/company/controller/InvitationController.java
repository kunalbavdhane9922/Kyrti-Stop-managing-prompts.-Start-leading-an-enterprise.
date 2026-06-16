package com.saep.company.controller;

import com.saep.company.domain.InvitationEntity;
import com.saep.company.service.InvitationService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class InvitationController {

    private final InvitationService invitationService;

    @PostMapping("/companies/{tenantId}/invites")
    public ResponseEntity<?> createInvitation(
            @PathVariable String tenantId,
            @RequestHeader("X-User-Id") String userId,
            @RequestBody CreateInviteRequest request) {
        try {
            InvitationEntity invite = invitationService.createInvitation(tenantId, request.getEmail(), UUID.fromString(userId));
            return ResponseEntity.ok(invite);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/invites/{token}")
    public ResponseEntity<?> getInvitation(@PathVariable String token) {
        try {
            InvitationEntity invite = invitationService.getInvitationByToken(token);
            return ResponseEntity.ok(invite);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.GONE).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/invites/{token}/accept")
    public ResponseEntity<?> acceptInvitation(
            @PathVariable String token,
            @RequestHeader("X-User-Id") String userId,
            @RequestHeader(value = "X-User-Email", required = false) String userEmail) {
        try {
            if (userEmail == null || userEmail.isBlank()) {
                // In a real system, the API gateway should also pass X-User-Email.
                // If not, we might need to fetch it from identity or pass it from frontend temporarily.
                // Let's assume the frontend passes it in the body for now, or the gateway sets it.
            }
            invitationService.acceptInvitation(token, UUID.fromString(userId), userEmail);
            return ResponseEntity.ok().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.GONE).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/companies/{tenantId}/invites/{inviteId}/revoke")
    public ResponseEntity<?> revokeInvitation(
            @PathVariable String tenantId,
            @PathVariable UUID inviteId,
            @RequestHeader("X-User-Id") String userId) {
        try {
            invitationService.revokeInvitation(tenantId, inviteId, UUID.fromString(userId));
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Data
    public static class CreateInviteRequest {
        private String email;
    }
}
