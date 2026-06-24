package com.saep.communication.repository;

import com.saep.communication.domain.ReportEntity;
import com.saep.communication.domain.ReportStatus;
import com.saep.communication.domain.ReportType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ReportRepository extends JpaRepository<ReportEntity, String> {

    Optional<ReportEntity> findByTenantIdAndIdAndDeletedAtIsNull(UUID tenantId, String id);

    @Query("SELECT r FROM ReportEntity r WHERE r.tenantId = :tenantId AND r.deletedAt IS NULL " +
           "AND (:reportType IS NULL OR r.reportType = :reportType) " +
           "AND (:status IS NULL OR r.status = :status) " +
           "AND (:requestedBy IS NULL OR r.requestedBy = :requestedBy) " +
           "AND (r.visibility = 'TENANT' OR r.requestedBy = :currentUserId)")
    Page<ReportEntity> findTenantReports(
            @Param("tenantId") UUID tenantId,
            @Param("reportType") ReportType reportType,
            @Param("status") ReportStatus status,
            @Param("requestedBy") String requestedBy,
            @Param("currentUserId") String currentUserId,
            Pageable pageable);
}
