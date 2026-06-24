package com.saep.marketplace.repository;

import com.saep.marketplace.domain.MarketplaceAgentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MarketplaceRepository extends JpaRepository<MarketplaceAgentEntity, String> {
    java.util.Optional<MarketplaceAgentEntity> findByIdAndTenantId(String id, java.util.UUID tenantId);

    List<MarketplaceAgentEntity> findByIsAvailableTrue();

    @org.springframework.data.jpa.repository.Query("SELECT a FROM MarketplaceAgentEntity a WHERE a.status = 'RESERVED' AND a.reservedUntil < :now")
    List<MarketplaceAgentEntity> findExpiredReservationsQuery(@org.springframework.data.repository.query.Param("now") java.time.Instant now, org.springframework.data.domain.Pageable pageable);

    default List<MarketplaceAgentEntity> findExpiredReservations(java.time.Instant now, int limit) {
        return findExpiredReservationsQuery(now, org.springframework.data.domain.PageRequest.of(0, limit));
    }
}
