package com.saep.memory.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemorySearchResult {
    private UUID memoryId;
    private double score;
    private String matchedChunk;
    private int chunkIndex;
    private String fullContent;
}
