package com.saep.marketplace.repository;

import com.saep.marketplace.domain.MarketplaceSearchDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MarketplaceSearchRepository extends JpaRepository<MarketplaceSearchDocument, String> {
}
