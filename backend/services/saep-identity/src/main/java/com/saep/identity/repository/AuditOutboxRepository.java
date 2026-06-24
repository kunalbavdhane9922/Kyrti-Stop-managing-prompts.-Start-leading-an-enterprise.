package com.saep.identity.repository;

import com.saep.identity.domain.AuditOutbox;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AuditOutboxRepository extends JpaRepository<AuditOutbox, UUID> {
    List<AuditOutbox> findByProcessedFalseOrderByCreatedAtAsc();
}
