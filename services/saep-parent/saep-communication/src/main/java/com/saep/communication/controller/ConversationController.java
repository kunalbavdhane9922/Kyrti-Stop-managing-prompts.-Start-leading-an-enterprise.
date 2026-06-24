package com.saep.communication.controller;

import com.saep.communication.domain.ConversationEntity;
import com.saep.communication.domain.ConversationParticipantEntity;
import com.saep.communication.security.TenantAuthenticationToken;
import com.saep.communication.service.ConversationService;
import com.saep.communication.service.IdempotencyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/communication/conversations")
@RequiredArgsConstructor
public class ConversationController {

    private final ConversationService conversationService;
    private final IdempotencyService idempotencyService;

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('message.send')")
    public ResponseEntity<?> createConversation(
            @RequestHeader(value = "X-Idempotency-Key", required = false) String idempotencyKey,
            @RequestBody Map<String, Object> body) {
            
        TenantAuthenticationToken auth = (TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        UUID tenantId = auth.getTenantId();
        String currentUserId = auth.getPrincipal().toString();

        var existingKeyOpt = idempotencyService.checkOrStoreIdempotencyKey(tenantId, idempotencyKey, String.valueOf(body.hashCode()));
        if (existingKeyOpt.isPresent()) {
            var existing = existingKeyOpt.get();
            return ResponseEntity.status(existing.getStatusCode())
                    .body(existing.getResponsePayload());
        }

        String type = (String) body.get("type");
        List<String> participants = (List<String>) body.get("participants");

        try {
            ConversationEntity conversation = conversationService.createConversation(tenantId, type, currentUserId, participants);
            idempotencyService.saveResponse(tenantId, idempotencyKey, conversation, HttpStatus.CREATED.value());
            return ResponseEntity.status(HttpStatus.CREATED).body(conversation);
        } catch (Exception e) {
            idempotencyService.saveResponse(tenantId, idempotencyKey, Map.of("error", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR.value());
            throw e;
        }
    }

    @PostMapping("/{id}/participants")
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('message.send')")
    public ResponseEntity<?> addParticipant(
            @PathVariable("id") String conversationId,
            @RequestHeader(value = "X-Idempotency-Key", required = false) String idempotencyKey,
            @RequestBody Map<String, Object> body) {
            
        TenantAuthenticationToken auth = (TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        UUID tenantId = auth.getTenantId();
        String currentUserId = auth.getPrincipal().toString();
        
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("admin"));

        var existingKeyOpt = idempotencyService.checkOrStoreIdempotencyKey(tenantId, idempotencyKey, "ADD_PARTICIPANT_" + body.hashCode());
        if (existingKeyOpt.isPresent()) {
            var existing = existingKeyOpt.get();
            return ResponseEntity.status(existing.getStatusCode())
                    .body(existing.getResponsePayload());
        }

        String participantId = (String) body.get("participantId");
        String participantType = (String) body.get("participantType");

        try {
            ConversationParticipantEntity participant = conversationService.addParticipant(tenantId, conversationId, participantId, participantType, currentUserId, isAdmin);
            idempotencyService.saveResponse(tenantId, idempotencyKey, participant, HttpStatus.CREATED.value());
            return ResponseEntity.status(HttpStatus.CREATED).body(participant);
        } catch (org.springframework.security.access.AccessDeniedException e) {
            idempotencyService.saveResponse(tenantId, idempotencyKey, Map.of("error", e.getMessage()), HttpStatus.FORBIDDEN.value());
            throw e;
        } catch (IllegalArgumentException e) {
            idempotencyService.saveResponse(tenantId, idempotencyKey, Map.of("error", e.getMessage()), HttpStatus.NOT_FOUND.value());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            idempotencyService.saveResponse(tenantId, idempotencyKey, Map.of("error", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR.value());
            throw e;
        }
    }

    @GetMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('message.receive')")
    public ResponseEntity<?> getUserConversations() {
        TenantAuthenticationToken auth = (TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        UUID tenantId = auth.getTenantId();
        String currentUserId = auth.getPrincipal().toString();
        List<ConversationEntity> conversations = conversationService.getUserConversations(tenantId, currentUserId);
        return ResponseEntity.ok(conversations);
    }

    @DeleteMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('conversation.archive')")
    public ResponseEntity<?> archiveConversation(
            @PathVariable("id") String conversationId,
            @RequestHeader(value = "X-Idempotency-Key", required = false) String idempotencyKey) {
            
        TenantAuthenticationToken auth = (TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        UUID tenantId = auth.getTenantId();
        String currentUserId = auth.getPrincipal().toString();
        boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("admin"));

        var existingKeyOpt = idempotencyService.checkOrStoreIdempotencyKey(tenantId, idempotencyKey, "ARCHIVE_CONV_" + conversationId);
        if (existingKeyOpt.isPresent()) {
            return ResponseEntity.status(existingKeyOpt.get().getStatusCode()).build();
        }

        try {
            conversationService.archiveConversation(tenantId, conversationId, currentUserId, isAdmin);
            idempotencyService.saveResponse(tenantId, idempotencyKey, Map.of("status", "archived"), HttpStatus.NO_CONTENT.value());
            return ResponseEntity.noContent().build();
        } catch (org.springframework.security.access.AccessDeniedException e) {
            idempotencyService.saveResponse(tenantId, idempotencyKey, Map.of("error", e.getMessage()), HttpStatus.FORBIDDEN.value());
            throw e;
        } catch (Exception e) {
            idempotencyService.saveResponse(tenantId, idempotencyKey, Map.of("error", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR.value());
            throw e;
        }
    }
}
