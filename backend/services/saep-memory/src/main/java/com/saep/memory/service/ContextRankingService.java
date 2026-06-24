package com.saep.memory.service;

import com.saep.memory.dto.ContextDTOs.ContextCandidate;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContextRankingService {

    private final RankingStrategy rankingStrategy;

    public ContextRankingService(RankingStrategy rankingStrategy) {
        this.rankingStrategy = rankingStrategy;
    }

    public List<ContextCandidate> rankContext(List<ContextCandidate> candidates, int topN) {
        return candidates.stream()
                .sorted(Comparator.comparingDouble(rankingStrategy::score).reversed())
                .limit(topN)
                .collect(Collectors.toList());
    }

    public double calculateAverageScore(List<ContextCandidate> rankedCandidates) {
        if (rankedCandidates.isEmpty()) return 0.0;
        double sum = rankedCandidates.stream().mapToDouble(rankingStrategy::score).sum();
        return sum / rankedCandidates.size();
    }
}
