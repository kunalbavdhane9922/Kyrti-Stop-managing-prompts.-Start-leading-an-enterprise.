package com.saep.memory.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class MemorySearchRequest {
    private UUID tenantId;
    private UUID userId;
    private String query;
    private int limit = 10;
}
