package com.saep.audit.repository;

import com.saep.audit.domain.AuditRecord;
import com.saep.audit.domain.AuditRecordId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.UUID;

@Repository
public interface AuditSearchRepository extends JpaRepository<AuditRecord, AuditRecordId> {

    Page<AuditRecord> findByTenantIdOrderByOccurredAtDesc(UUID tenantId, Pageable pageable);

    Page<AuditRecord> findByTenantIdAndCorrelationIdOrderByOccurredAtDesc(UUID tenantId, UUID correlationId, Pageable pageable);

    Page<AuditRecord> findByTenantIdAndActorIdOrderByOccurredAtDesc(UUID tenantId, UUID actorId, Pageable pageable);
    
    Page<AuditRecord> findByTenantIdAndActionOrderByOccurredAtDesc(UUID tenantId, String action, Pageable pageable);

    Page<AuditRecord> findByTenantIdAndResourceIdOrderByOccurredAtDesc(UUID tenantId, UUID resourceId, Pageable pageable);

    Page<AuditRecord> findByTenantIdAndOccurredAtBetweenOrderByOccurredAtDesc(UUID tenantId, Instant start, Instant end, Pageable pageable);
}
