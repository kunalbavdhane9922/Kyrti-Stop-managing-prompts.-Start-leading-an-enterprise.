package com.saep.communication.controller;

import com.saep.communication.domain.MessageReceiptEntity;
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
public class MessageReceiptController {

    private final MessagingService messagingService;
    private final IdempotencyService idempotencyService;

    @PatchMapping("/{id}/read")
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('message.receive')")
    public ResponseEntity<?> markAsRead(
            @PathVariable("id") String messageId,
            @RequestHeader(value = "X-Idempotency-Key", required = false) String idempotencyKey) {
            
        TenantAuthenticationToken auth = (TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        UUID tenantId = auth.getTenantId();
        String currentUserId = auth.getPrincipal().toString();

        var existingKeyOpt = idempotencyService.checkOrStoreIdempotencyKey(tenantId, idempotencyKey, "MARK_READ_" + messageId);
        if (existingKeyOpt.isPresent()) {
            var existing = existingKeyOpt.get();
            return ResponseEntity.status(existing.getStatusCode())
                    .body(existing.getResponsePayload());
        }

        try {
            MessageReceiptEntity receipt = messagingService.markMessageAsRead(tenantId, messageId, currentUserId);
            idempotencyService.saveResponse(tenantId, idempotencyKey, receipt, HttpStatus.OK.value());
            return ResponseEntity.ok(receipt);
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
}
