package com.saep.memory.service;

import com.saep.memory.dto.ContextDTOs.ContextCandidate;

public interface RankingStrategy {
    double score(ContextCandidate candidate);
}
