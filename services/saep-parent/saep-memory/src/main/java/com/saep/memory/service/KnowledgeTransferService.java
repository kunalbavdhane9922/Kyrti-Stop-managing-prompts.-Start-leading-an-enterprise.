package com.saep.memory.service;

import com.saep.memory.domain.MemoryEntry;
import com.saep.memory.domain.MemoryTransfer;
import com.saep.memory.domain.MemoryTransferEvent;
import com.saep.memory.domain.enums.MemoryScope;
import com.saep.memory.domain.enums.MemoryStatus;
import com.saep.memory.exception.KnowledgeTransferException;
import com.saep.memory.exception.MemoryNotFoundException;
import com.saep.memory.repository.MemoryEntryRepository;
import com.saep.memory.repository.MemoryTransferEventRepository;
import com.saep.memory.repository.MemoryTransferRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class KnowledgeTransferService {

    private final MemoryEntryRepository memoryEntryRepository;
    private final SanitizationEngine sanitizationEngine;
    private final MemoryTransferRepository memoryTransferRepository;
    private final MemoryTransferEventRepository memoryTransferEventRepository;

    public KnowledgeTransferService(MemoryEntryRepository memoryEntryRepository,
                                    SanitizationEngine sanitizationEngine,
                                    MemoryTransferRepository memoryTransferRepository,
                                    MemoryTransferEventRepository memoryTransferEventRepository) {
        this.memoryEntryRepository = memoryEntryRepository;
        this.sanitizationEngine = sanitizationEngine;
        this.memoryTransferRepository = memoryTransferRepository;
        this.memoryTransferEventRepository = memoryTransferEventRepository;
    }

    @Transactional
    public UUID requestTransfer(UUID sourceMemoryId, MemoryScope targetScope, UUID targetTenantId, UUID requestorId) {
        MemoryEntry source = memoryEntryRepository.findById(sourceMemoryId)
                .orElseThrow(() -> new MemoryNotFoundException("Memory not found with ID: " + sourceMemoryId));

        if (source.getScope() == MemoryScope.COMPANY && targetScope == MemoryScope.COMPANY) {
            throw new KnowledgeTransferException("Forbidden: Cannot transfer between Company scopes");
        }

        source.setStatus(MemoryStatus.PENDING_TRANSFER);
        memoryEntryRepository.save(source);

        MemoryTransfer transfer = MemoryTransfer.builder()
                .tenantId(source.getTenantId())
                .sourceMemoryId(source.getId())
                .targetScope(targetScope.name())
                .targetTenantId(targetTenantId)
                .status("PENDING")
                .build();
        MemoryTransfer savedTransfer = memoryTransferRepository.save(transfer);

        logEvent(savedTransfer, "TRANSFER_REQUESTED", requestorId, "Transfer request initiated");

        // Execute deterministic sanitization
        SanitizationEngine.SanitizationResult result = sanitizationEngine.sanitize(source.getContent(), source.getTenantId());
        
        if (result.isWasModified()) {
            savedTransfer.setStatus("SANITIZED");
            memoryTransferRepository.save(savedTransfer);
            logEvent(savedTransfer, "SANITIZED", requestorId, "Sanitization engine redacted " + result.getItemsRedacted() + " items");
        }

        return savedTransfer.getId();
    }

    @Transactional
    public MemoryEntry approveTransfer(UUID transferId, UUID reviewerId) {
        
        MemoryTransfer transfer = memoryTransferRepository.findById(transferId)
                .orElseThrow(() -> new KnowledgeTransferException("Transfer not found with ID: " + transferId));

        // Idempotency Guard
        if ("APPROVED".equals(transfer.getStatus()) || "EXECUTED".equals(transfer.getStatus())) {
            throw new KnowledgeTransferException("Transfer already approved or executed");
        }

        MemoryEntry source = memoryEntryRepository.findById(transfer.getSourceMemoryId())
                .orElseThrow(() -> new MemoryNotFoundException("Source Memory not found"));

        SanitizationEngine.SanitizationResult result = sanitizationEngine.sanitize(source.getContent(), source.getTenantId());
        String finalContent = result.getSanitizedText();

        UUID finalOwnerId = reviewerId;
        if (MemoryScope.valueOf(transfer.getTargetScope()) == MemoryScope.COMPANY) {
            finalOwnerId = transfer.getTargetTenantId();
        }

        MemoryEntry cloned = MemoryEntry.builder()
                .tenantId(transfer.getTargetTenantId())
                .ownerId(finalOwnerId)
                .ownerType(source.getOwnerType())
                .scope(MemoryScope.valueOf(transfer.getTargetScope()))
                .visibility(source.getVisibility())
                .content(finalContent)
                .importanceScore(source.getImportanceScore())
                .sourceType(source.getSourceType())
                .sourceReference(source.getSourceReference())
                .originMemoryId(source.getId())
                .transferId(transferId)
                .agentId(source.getAgentId())
                .workflowId(source.getWorkflowId())
                .taskId(source.getTaskId())
                .status(MemoryStatus.PENDING_EMBEDDING)
                .build();
                
        MemoryEntry saved = memoryEntryRepository.save(cloned);

        transfer.setStatus("EXECUTED");
        transfer.setReviewerId(reviewerId);
        memoryTransferRepository.save(transfer);

        logEvent(transfer, "APPROVED", reviewerId, "Transfer approved by reviewer");
        logEvent(transfer, "EXECUTED", reviewerId, "Memory cloned with ID: " + saved.getId());

        source.setStatus(MemoryStatus.ACTIVE);
        memoryEntryRepository.save(source);

        return saved;
    }

    private void logEvent(MemoryTransfer transfer, String action, UUID actorId, String reason) {
        MemoryTransferEvent event = MemoryTransferEvent.builder()
                .transfer(transfer)
                .action(action)
                .actorId(actorId)
                .reason(reason)
                .timestamp(LocalDateTime.now())
                .build();
        memoryTransferEventRepository.save(event);
    }
}
