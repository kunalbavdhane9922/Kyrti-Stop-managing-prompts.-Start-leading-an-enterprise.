package com.saep.governance.repository;

import com.saep.governance.model.Approval;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ApprovalRepository extends JpaRepository<Approval, UUID> {
    List<Approval> findByTenantId(UUID tenantId);
    Optional<Approval> findByIdAndTenantId(UUID id, UUID tenantId);
}
