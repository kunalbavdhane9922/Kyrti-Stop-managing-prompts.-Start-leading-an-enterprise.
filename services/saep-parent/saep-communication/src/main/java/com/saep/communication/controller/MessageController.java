package com.saep.communication.controller;

import com.saep.communication.domain.MessageEntity;
import com.saep.communication.security.TenantAuthenticationToken;
import com.saep.communication.service.IdempotencyService;
import com.saep.communication.service.MessagingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/communication/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessagingService messagingService;
    private final IdempotencyService idempotencyService;

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('message.send')")
    public ResponseEntity<?> sendMessage(
            @RequestHeader(value = "X-Idempotency-Key", required = false) String idempotencyKey,
            @RequestBody Map<String, Object> body) {
        
        TenantAuthenticationToken auth = (TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        UUID tenantId = auth.getTenantId();

        var existingKeyOpt = idempotencyService.checkOrStoreIdempotencyKey(tenantId, idempotencyKey, String.valueOf(body.hashCode()));
        if (existingKeyOpt.isPresent()) {
            var existing = existingKeyOpt.get();
            return ResponseEntity.status(existing.getStatusCode())
                    .body(existing.getResponsePayload());
        }

        String conversationId = (String) body.get("conversationId");
        String correlationId = (String) body.get("correlationId");
        String senderId = (String) body.get("senderId");
        String recipientId = (String) body.get("recipientId");
        String content = (String) body.get("content");
        String messageType = (String) body.get("messageType");

        try {
            MessageEntity message = messagingService.sendMessage(tenantId, conversationId, correlationId, senderId, recipientId, content, messageType);
            idempotencyService.saveResponse(tenantId, idempotencyKey, message, HttpStatus.CREATED.value());
            return ResponseEntity.status(HttpStatus.CREATED).body(message);
        } catch (Exception e) {
            idempotencyService.saveResponse(tenantId, idempotencyKey, Map.of("error", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR.value());
            throw e;
        }
    }

    @DeleteMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('message.delete')")
    public ResponseEntity<?> deleteMessage(
            @PathVariable("id") String id,
            @RequestHeader(value = "X-Idempotency-Key", required = false) String idempotencyKey) {
            
        TenantAuthenticationToken auth = (TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        UUID tenantId = auth.getTenantId();
        String currentUserId = auth.getPrincipal().toString();
        
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("admin"));

        var existingKeyOpt = idempotencyService.checkOrStoreIdempotencyKey(tenantId, idempotencyKey, "DELETE_" + id);
        if (existingKeyOpt.isPresent()) {
            return ResponseEntity.status(existingKeyOpt.get().getStatusCode()).build();
        }

        try {
            messagingService.deleteMessage(tenantId, id, currentUserId, isAdmin);
            idempotencyService.saveResponse(tenantId, idempotencyKey, Map.of("status", "deleted"), HttpStatus.NO_CONTENT.value());
            return ResponseEntity.noContent().build();
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
    @GetMapping("/conversation/{conversationId}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('message.read')")
    public ResponseEntity<?> getMessages(@PathVariable("conversationId") String conversationId) {
        TenantAuthenticationToken auth = (TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        UUID tenantId = auth.getTenantId();
        String currentUserId = auth.getPrincipal().toString();
        try {
            java.util.List<MessageEntity> messages = messagingService.getConversationMessages(tenantId, conversationId, currentUserId);
            return ResponseEntity.ok(messages);
        } catch (org.springframework.security.access.AccessDeniedException e) {
            throw e;
        }
    }
}
