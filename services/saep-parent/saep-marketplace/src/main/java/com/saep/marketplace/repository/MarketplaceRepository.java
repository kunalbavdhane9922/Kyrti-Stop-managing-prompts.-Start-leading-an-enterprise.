package com.saep.marketplace.repository;

import com.saep.marketplace.domain.MarketplaceAgentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MarketplaceRepository extends JpaRepository<MarketplaceAgentEntity, String> {
    List<MarketplaceAgentEntity> findByIsAvailableTrue();
}
