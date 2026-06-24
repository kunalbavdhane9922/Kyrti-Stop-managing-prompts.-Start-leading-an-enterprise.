package com.saep.marketplace.repository;

import com.saep.marketplace.domain.ReputationEventEntity;
import org.springframework.data.repository.Repository;

import java.util.List;
import java.util.UUID;

@org.springframework.stereotype.Repository
public interface ReputationEventRepository extends Repository<ReputationEventEntity, UUID> {
    
    List<ReputationEventEntity> findByAgentIdAndSequenceNumberGreaterThanOrderBySequenceNumberAsc(String agentId, Long sequenceNumber);

    List<ReputationEventEntity> findByAgentIdOrderBySequenceNumberAsc(String agentId);

    ReputationEventEntity save(ReputationEventEntity entity);
}
