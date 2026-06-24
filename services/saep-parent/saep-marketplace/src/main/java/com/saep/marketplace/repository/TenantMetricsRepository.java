package com.saep.marketplace.repository;

import com.saep.marketplace.domain.TenantMetricsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TenantMetricsRepository extends JpaRepository<TenantMetricsEntity, UUID> {
}
