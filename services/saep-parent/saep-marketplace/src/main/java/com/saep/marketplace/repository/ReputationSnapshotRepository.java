package com.saep.marketplace.repository;

import com.saep.marketplace.domain.ReputationSnapshotEntity;
import org.springframework.data.repository.Repository;

import java.util.Optional;

@org.springframework.stereotype.Repository
public interface ReputationSnapshotRepository extends Repository<ReputationSnapshotEntity, String> {
    
    Optional<ReputationSnapshotEntity> findById(String agentId);

    ReputationSnapshotEntity save(ReputationSnapshotEntity entity);
}
