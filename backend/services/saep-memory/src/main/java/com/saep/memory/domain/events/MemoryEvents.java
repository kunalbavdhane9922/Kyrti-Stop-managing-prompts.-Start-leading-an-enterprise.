package com.saep.memory.domain.events;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class MemoryEvents {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MemoryCreatedEvent {
        @Builder.Default
        private String eventVersion = "1.0";
        private String memoryId;
        private String tenantId;
        private String scope;
        private String traceId;
        private LocalDateTime createdAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MemoryUpdatedEvent {
        @Builder.Default
        private String eventVersion = "1.0";
        private String memoryId;
        private String tenantId;
        private Integer versionNumber;
        private LocalDateTime updatedAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MemoryArchivedEvent {
        @Builder.Default
        private String eventVersion = "1.0";
        private String memoryId;
        private String tenantId;
        private String archivedBy;
        private String archiveReason;
        private LocalDateTime archivedAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EmbeddingGeneratedEvent {
        @Builder.Default
        private String eventVersion = "1.0";
        private String memoryId;
        private String tenantId;
        private String modelUsed;
        private LocalDateTime generatedAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MemoryDeletedEvent {
        @Builder.Default
        private String eventVersion = "1.0";
        private String memoryId;
        private String tenantId;
        private String scope;
        private java.util.List<String> vectorIds;
        private LocalDateTime deletedAt;
    }
}
