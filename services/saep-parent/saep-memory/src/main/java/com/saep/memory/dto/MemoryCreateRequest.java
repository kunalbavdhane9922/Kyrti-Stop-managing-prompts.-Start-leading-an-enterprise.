package com.saep.memory.dto;

import com.saep.memory.domain.enums.MemoryScope;
import com.saep.memory.domain.enums.MemoryVisibility;
import com.saep.memory.domain.enums.OwnerType;
import com.saep.memory.domain.enums.SourceType;
import lombok.Data;

import java.util.UUID;

@Data
public class MemoryCreateRequest {
    private UUID tenantId;
    private UUID ownerId;
    private OwnerType ownerType;
    private MemoryScope scope;
    private MemoryVisibility visibility;
    private String content;
    private Integer importanceScore;
    private SourceType sourceType;
    private String sourceReference;
    
    // Provenance / Lineage Tracking
    private UUID originMemoryId;
    private UUID transferId;
    
    // Agent Lineage
    private String agentId;
    private String workflowId;
    private String taskId;
}
