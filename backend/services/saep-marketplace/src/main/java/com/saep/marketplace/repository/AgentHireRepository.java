package com.saep.marketplace.repository;

import com.saep.marketplace.domain.AgentHireRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AgentHireRepository extends JpaRepository<AgentHireRecord, String> {
    Optional<AgentHireRecord> findByTenantIdAndId(UUID tenantId, String id);
    Optional<AgentHireRecord> findByTenantIdAndRequestId(UUID tenantId, String requestId);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(h) FROM AgentHireRecord h WHERE h.agentTemplateId = :agentId AND h.status = 'ACTIVE'")
    int countActiveContractsForAgent(@org.springframework.data.repository.query.Param("agentId") String agentId);

    @org.springframework.data.jpa.repository.Query("SELECT h.tenantId as tenantId, " +
            "SUM(CASE WHEN h.status = 'REQUESTED' THEN 1 ELSE 0 END) as requestedCount, " +
            "SUM(CASE WHEN h.status = 'ACTIVE' THEN 1 ELSE 0 END) as completedCount, " +
            "SUM(CASE WHEN h.status = 'FAILED' THEN 1 ELSE 0 END) as failedCount " +
            "FROM AgentHireRecord h GROUP BY h.tenantId")
    java.util.List<TenantMetricProjection> aggregateMetrics();

    interface TenantMetricProjection {
        UUID getTenantId();
        Long getRequestedCount();
        Long getCompletedCount();
        Long getFailedCount();
    }
}
