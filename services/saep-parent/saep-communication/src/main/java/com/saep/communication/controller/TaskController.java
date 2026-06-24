package com.saep.communication.controller;

import com.saep.communication.domain.TaskEntity;
import com.saep.communication.security.TenantAuthenticationToken;
import com.saep.communication.service.IdempotencyService;
import com.saep.communication.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/communication/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final IdempotencyService idempotencyService;

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('task.assign')")
    public ResponseEntity<?> assignTask(
            @RequestHeader(value = "X-Idempotency-Key", required = false) String idempotencyKey,
            @RequestBody Map<String, Object> body) {
        
        TenantAuthenticationToken auth = (TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        UUID tenantId = auth.getTenantId();

        var existingKeyOpt = idempotencyService.checkOrStoreIdempotencyKey(tenantId, idempotencyKey, String.valueOf(body.hashCode()));
        if (existingKeyOpt.isPresent()) {
            var existing = existingKeyOpt.get();
            // Idempotency Response Replay
            return ResponseEntity.status(existing.getStatusCode())
                    .body(existing.getResponsePayload());
        }

        String correlationId = (String) body.get("correlationId");
        String assignerId = (String) body.get("assignerId");
        String assigneeId = (String) body.get("assigneeId");
        String payload = (String) body.get("payload");

        try {
            TaskEntity task = taskService.assignTask(tenantId, correlationId, assignerId, assigneeId, payload);
            idempotencyService.saveResponse(tenantId, idempotencyKey, task, HttpStatus.CREATED.value());
            return ResponseEntity.status(HttpStatus.CREATED).body(task);
        } catch (Exception e) {
            idempotencyService.saveResponse(tenantId, idempotencyKey, Map.of("error", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR.value());
            throw e;
        }
    }

    @PostMapping("/{taskId}/complete")
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('task.receive')")
    public ResponseEntity<?> completeTask(
            @PathVariable("taskId") String taskId,
            @RequestHeader(value = "X-Idempotency-Key", required = false) String idempotencyKey) {
            
        TenantAuthenticationToken auth = (TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        UUID tenantId = auth.getTenantId();
        
        var existingKeyOpt = idempotencyService.checkOrStoreIdempotencyKey(tenantId, idempotencyKey, "COMPLETE_" + taskId);
        if (existingKeyOpt.isPresent()) {
            return ResponseEntity.status(existingKeyOpt.get().getStatusCode()).body(existingKeyOpt.get().getResponsePayload());
        }
        
        try {
            TaskEntity task = taskService.completeTask(tenantId, taskId);
            idempotencyService.saveResponse(tenantId, idempotencyKey, task, HttpStatus.OK.value());
            return ResponseEntity.ok(task);
        } catch (IllegalArgumentException e) {
            idempotencyService.saveResponse(tenantId, idempotencyKey, Map.of("error", e.getMessage()), HttpStatus.NOT_FOUND.value());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            idempotencyService.saveResponse(tenantId, idempotencyKey, Map.of("error", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR.value());
            throw e;
        }
    }

    @GetMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('task.receive')")
    public ResponseEntity<?> getUserTasks() {
        TenantAuthenticationToken auth = (TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        UUID tenantId = auth.getTenantId();
        String currentUserId = auth.getPrincipal().toString();
        java.util.List<TaskEntity> tasks = taskService.getUserTasks(tenantId, currentUserId);
        return ResponseEntity.ok(tasks);
    }

    @PostMapping("/{taskId}/transfer")
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('task.receive')")
    public ResponseEntity<?> transferTask(
            @PathVariable("taskId") String taskId,
            @RequestHeader(value = "X-Idempotency-Key", required = false) String idempotencyKey,
            @RequestBody Map<String, Object> body) {
            
        TenantAuthenticationToken auth = (TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        UUID tenantId = auth.getTenantId();
        String currentUserId = auth.getPrincipal().toString();
        
        var existingKeyOpt = idempotencyService.checkOrStoreIdempotencyKey(tenantId, idempotencyKey, "TRANSFER_" + taskId);
        if (existingKeyOpt.isPresent()) {
            return ResponseEntity.status(existingKeyOpt.get().getStatusCode()).body(existingKeyOpt.get().getResponsePayload());
        }
        
        String newAssigneeId = (String) body.get("newAssigneeId");
        String reason = (String) body.get("reason");
        
        try {
            TaskEntity task = taskService.transferTask(tenantId, taskId, currentUserId, newAssigneeId, reason);
            idempotencyService.saveResponse(tenantId, idempotencyKey, task, HttpStatus.OK.value());
            return ResponseEntity.ok(task);
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
