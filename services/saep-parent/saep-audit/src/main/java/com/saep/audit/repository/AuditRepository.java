package com.saep.audit.repository;

import com.saep.audit.domain.AuditEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AuditRepository extends JpaRepository<AuditEvent, UUID> {
    
    List<AuditEvent> findByTenantIdOrderByOccurredAtDesc(String tenantId);

    Optional<AuditEvent> findFirstByTenantIdOrderByOccurredAtDesc(String tenantId);
}
