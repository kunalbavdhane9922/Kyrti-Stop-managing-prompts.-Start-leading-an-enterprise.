package com.saep.memory.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

public class ContextDTOs {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ContextCandidate {
        private String memoryId;
        private double semanticScore;
        private double recencyScore;
        private double accessPriority;
        private String content;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AgentContextResponse {
        @Builder.Default
        private String contextVersion = "1.0";
        private int estimatedTokens;
        private double averageRankingScore;
        private List<ContextCandidate> semanticResults;
    }
}
