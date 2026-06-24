package com.saep.memory.controller;

import com.saep.memory.domain.MemoryEntry;
import com.saep.memory.domain.enums.MemoryScope;
import com.saep.memory.dto.MemoryCreateRequest;
import com.saep.memory.dto.MemorySearchRequest;
import com.saep.memory.dto.MemorySearchResult;
import com.saep.memory.security.TenantAuthenticationToken;
import com.saep.memory.service.KnowledgeTransferService;
import com.saep.memory.service.MemoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/memory")
public class MemoryController {

    private final MemoryService memoryService;
    private final KnowledgeTransferService knowledgeTransferService;

    public MemoryController(MemoryService memoryService, KnowledgeTransferService knowledgeTransferService) {
        this.memoryService = memoryService;
        this.knowledgeTransferService = knowledgeTransferService;
    }

    private TenantAuthenticationToken getAuth() {
        return (TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
    }

    @PostMapping
    public ResponseEntity<MemoryEntry> createMemory(
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey,
            @RequestBody MemoryCreateRequest request) {
        
        TenantAuthenticationToken auth = getAuth();
        
        MemoryEntry entry = MemoryEntry.builder()
                .tenantId(auth.getTenantId()) // Overwrite from secure context
                .ownerId(request.getOwnerId() != null ? request.getOwnerId() : (UUID) auth.getPrincipal()) 
                .ownerType(request.getOwnerType())
                .scope(request.getScope())
                .visibility(request.getVisibility())
                .content(request.getContent())
                .importanceScore(request.getImportanceScore() != null ? request.getImportanceScore() : 5)
                .sourceType(request.getSourceType())
                .sourceReference(request.getSourceReference())
                .originMemoryId(request.getOriginMemoryId())
                .transferId(request.getTransferId())
                .agentId(request.getAgentId())
                .workflowId(request.getWorkflowId())
                .taskId(request.getTaskId())
                .idempotencyKey(idempotencyKey)
                .build();
                
        return ResponseEntity.ok(memoryService.createMemory(entry));
    }

    @PostMapping("/learn")
    public ResponseEntity<MemoryEntry> learnMemory(
            @RequestBody MemoryCreateRequest request) {
        
        TenantAuthenticationToken auth = getAuth();
        
        MemoryEntry entry = MemoryEntry.builder()
                .tenantId(auth.getTenantId()) // Enforce secure tenant context
                .ownerId(request.getOwnerId() != null ? request.getOwnerId() : (UUID) auth.getPrincipal())
                .ownerType(request.getOwnerType())
                .scope(MemoryScope.PERSONAL) // Learning always hits PERSONAL first
                .visibility(request.getVisibility())
                .content(request.getContent())
                .importanceScore(request.getImportanceScore() != null ? request.getImportanceScore() : 5)
                .sourceType(request.getSourceType())
                .sourceReference(request.getSourceReference())
                .agentId(request.getAgentId())
                .workflowId(request.getWorkflowId())
                .taskId(request.getTaskId())
                .build();
                
        return ResponseEntity.ok(memoryService.createMemory(entry));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MemoryEntry> getMemory(@PathVariable UUID id) {
        TenantAuthenticationToken auth = getAuth();
        return ResponseEntity.ok(memoryService.getMemoryWithAuthCheck(id, auth.getTenantId(), (UUID) auth.getPrincipal()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MemoryEntry> updateMemory(
            @PathVariable UUID id,
            @RequestBody String newContent) {
        TenantAuthenticationToken auth = getAuth();
        return ResponseEntity.ok(memoryService.updateMemory(id, auth.getTenantId(), (UUID) auth.getPrincipal(), newContent));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMemory(@PathVariable UUID id) {
        TenantAuthenticationToken auth = getAuth();
        memoryService.deleteMemory(id, auth.getTenantId(), (UUID) auth.getPrincipal());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/archive")
    public ResponseEntity<Void> archiveMemory(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body) {
        TenantAuthenticationToken auth = getAuth();
        String reason = body.getOrDefault("reason", "Archived by user");
        memoryService.archiveMemory(id, auth.getTenantId(), (UUID) auth.getPrincipal(), reason);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/transfer-request")
    public ResponseEntity<Map<String, String>> requestTransfer(
            @PathVariable UUID id,
            @RequestParam MemoryScope targetScope) {
        TenantAuthenticationToken auth = getAuth();
        UUID transferId = knowledgeTransferService.requestTransfer(id, targetScope, auth.getTenantId(), (UUID) auth.getPrincipal());
        return ResponseEntity.ok(Map.of("transferId", transferId.toString(), "status", "PENDING_APPROVAL"));
    }

    @PostMapping("/transfer/{transferId}/approve")
    public ResponseEntity<MemoryEntry> approveTransfer(@PathVariable UUID transferId) {
        TenantAuthenticationToken auth = getAuth();
        MemoryEntry entry = knowledgeTransferService.approveTransfer(transferId, (UUID) auth.getPrincipal());
        return ResponseEntity.ok(entry);
    }

    @PostMapping("/search")
    public ResponseEntity<List<MemorySearchResult>> searchMemories(@RequestBody MemorySearchRequest request) {
        TenantAuthenticationToken auth = getAuth();
        return ResponseEntity.ok(memoryService.searchMemories(auth.getTenantId(), (UUID) auth.getPrincipal(), request.getQuery(), request.getLimit()));
    }
}
