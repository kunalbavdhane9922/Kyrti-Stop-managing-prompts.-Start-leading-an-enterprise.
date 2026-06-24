package com.saep.communication.controller;

import com.saep.communication.domain.NotificationEntity;
import com.saep.communication.security.TenantAuthenticationToken;
import com.saep.communication.service.IdempotencyService;
import com.saep.communication.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/communication/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final IdempotencyService idempotencyService;

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('notification.create')")
    public ResponseEntity<?> createNotification(
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

        String correlationId = (String) body.get("correlationId");
        String userId = (String) body.get("userId");
        String notificationType = (String) body.get("notificationType");
        String topic = (String) body.get("topic");
        String message = (String) body.get("message");

        try {
            NotificationEntity notification = notificationService.createNotification(tenantId, correlationId, userId, notificationType, topic, message);
            idempotencyService.saveResponse(tenantId, idempotencyKey, notification, HttpStatus.CREATED.value());
            return ResponseEntity.status(HttpStatus.CREATED).body(notification);
        } catch (Exception e) {
            idempotencyService.saveResponse(tenantId, idempotencyKey, Map.of("error", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR.value());
            throw e;
        }
    }

    @PatchMapping("/{id}/read")
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('notification.read')")
    public ResponseEntity<?> markAsRead(
            @PathVariable("id") String notificationId,
            @RequestHeader(value = "X-Idempotency-Key", required = false) String idempotencyKey) {
            
        TenantAuthenticationToken auth = (TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        UUID tenantId = auth.getTenantId();
        String currentUserId = auth.getPrincipal().toString();

        var existingKeyOpt = idempotencyService.checkOrStoreIdempotencyKey(tenantId, idempotencyKey, "READ_NOTIF_" + notificationId);
        if (existingKeyOpt.isPresent()) {
            return ResponseEntity.status(existingKeyOpt.get().getStatusCode()).body(existingKeyOpt.get().getResponsePayload());
        }

        try {
            NotificationEntity notification = notificationService.markAsRead(tenantId, notificationId, currentUserId);
            idempotencyService.saveResponse(tenantId, idempotencyKey, notification, HttpStatus.OK.value());
            return ResponseEntity.ok(notification);
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
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('notification.view')")
    public ResponseEntity<?> getNotifications() {
        TenantAuthenticationToken auth = (TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        UUID tenantId = auth.getTenantId();
        String currentUserId = auth.getPrincipal().toString();
        java.util.List<NotificationEntity> notifications = notificationService.getUserNotifications(tenantId, currentUserId);
        return ResponseEntity.ok(notifications);
    }

    @DeleteMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('notification.archive')")
    public ResponseEntity<?> archiveNotification(
            @PathVariable("id") String notificationId,
            @RequestHeader(value = "X-Idempotency-Key", required = false) String idempotencyKey) {
            
        TenantAuthenticationToken auth = (TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        UUID tenantId = auth.getTenantId();
        String currentUserId = auth.getPrincipal().toString();

        var existingKeyOpt = idempotencyService.checkOrStoreIdempotencyKey(tenantId, idempotencyKey, "ARCHIVE_NOTIF_" + notificationId);
        if (existingKeyOpt.isPresent()) {
            return ResponseEntity.status(existingKeyOpt.get().getStatusCode()).build();
        }

        try {
            notificationService.archiveNotification(tenantId, notificationId, currentUserId);
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
