package com.saep.marketplace.service;

import com.saep.marketplace.domain.MarketplaceAgentEntity;
import com.saep.marketplace.domain.ReputationEventEntity;
import com.saep.marketplace.domain.ReputationSnapshotEntity;
import com.saep.marketplace.repository.MarketplaceRepository;
import com.saep.marketplace.repository.ReputationEventRepository;
import com.saep.marketplace.repository.ReputationSnapshotRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReputationRebuildService {

    private final MarketplaceRepository agentRepository;
    private final ReputationEventRepository reputationEventRepository;
    private final ReputationSnapshotRepository reputationSnapshotRepository;

    /**
     * Recalculates the agent's reputation score by replaying the entire ledger of ReputationEvents.
     * This acts as an anti-corruption mechanism for the materialized aggregate view.
     */
    @Transactional
    public void rebuildReputationForAgent(String agentId, UUID tenantId) {
        log.info("Rebuilding reputation from ledger for agent: {}", agentId);

        MarketplaceAgentEntity agent = agentRepository.findByIdAndTenantId(agentId, tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Agent not found: " + agentId));

        // Fetch Snapshot
        Optional<ReputationSnapshotEntity> snapshotOpt = reputationSnapshotRepository.findById(agentId);
        
        Double currentScore = 0.0;
        Long expectedSequence = 1L;
        Long eventCount = 0L;
        String lastEventId = null;

        List<ReputationEventEntity> ledger;

        if (snapshotOpt.isPresent()) {
            ReputationSnapshotEntity snapshot = snapshotOpt.get();
            currentScore = snapshot.getScore();
            expectedSequence = snapshot.getEventCount() + 1;
            eventCount = snapshot.getEventCount();
            lastEventId = snapshot.getLastEventId();

            ledger = reputationEventRepository.findByAgentIdAndSequenceNumberGreaterThanOrderBySequenceNumberAsc(agentId, snapshot.getEventCount());
            log.info("Loaded snapshot for {}: score={}, eventCount={}. Found {} new events.", agentId, currentScore, eventCount, ledger.size());
        } else {
            ledger = reputationEventRepository.findByAgentIdOrderBySequenceNumberAsc(agentId);
            log.info("No snapshot found for {}. Full replay of {} events.", agentId, ledger.size());
        }

        for (ReputationEventEntity event : ledger) {
            // Gap Detection (Corruption check)
            if (!event.getSequenceNumber().equals(expectedSequence)) {
                String errorMsg = String.format("Event stream corruption detected for agent %s: Expected sequence %d but got %d", 
                        agentId, expectedSequence, event.getSequenceNumber());
                log.error(errorMsg);
                throw new IllegalStateException(errorMsg); // Circuit breaker
            }

            currentScore += event.getScoreDelta();
            expectedSequence++;
            eventCount++;
            lastEventId = event.getId().toString();
        }

        // Clamp or normalize score if necessary
        currentScore = Math.max(0.0, Math.min(100.0, currentScore));

        agent.setReputationScore(currentScore);
        agentRepository.save(agent);
        
        // Save new Snapshot
        ReputationSnapshotEntity updatedSnapshot = ReputationSnapshotEntity.builder()
                .agentId(agentId)
                .score(currentScore)
                .lastEventId(lastEventId)
                .eventCount(eventCount)
                .snapshotCreatedAt(Instant.now())
                .build();
                
        reputationSnapshotRepository.save(updatedSnapshot);

        log.info("Successfully rebuilt reputation for agent {}. New score: {}", agentId, currentScore);
    }
}
