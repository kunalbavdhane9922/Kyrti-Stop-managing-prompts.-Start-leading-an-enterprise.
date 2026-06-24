package com.saep.marketplace.repository;

import com.saep.marketplace.domain.ProcessedEventEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MarketplaceProcessedEventRepository extends JpaRepository<ProcessedEventEntity, Long> {
    boolean existsByEventIdAndConsumerGroup(String eventId, String consumerGroup);
}
