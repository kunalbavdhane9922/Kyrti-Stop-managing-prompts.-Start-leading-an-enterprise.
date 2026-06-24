package com.saep.memory.service;

import com.saep.memory.dto.ContextDTOs.ContextCandidate;
import org.springframework.stereotype.Component;

@Component
public class DefaultRankingStrategy implements RankingStrategy {

    @Override
    public double score(ContextCandidate candidate) {
        // V1 Formula without Graph:
        // 0.6 Semantic + 0.3 Recency + 0.1 Access Priority
        
        return (0.6 * candidate.getSemanticScore()) + 
               (0.3 * candidate.getRecencyScore()) + 
               (0.1 * candidate.getAccessPriority());
    }
}
