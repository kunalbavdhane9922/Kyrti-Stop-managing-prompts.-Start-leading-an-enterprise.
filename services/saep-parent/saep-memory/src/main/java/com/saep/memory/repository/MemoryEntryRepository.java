package com.saep.memory.repository;

import com.saep.memory.domain.MemoryEntry;
import com.saep.memory.domain.enums.MemoryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MemoryEntryRepository extends JpaRepository<MemoryEntry, UUID> {
    Optional<MemoryEntry> findByIdAndTenantId(UUID id, UUID tenantId);
    
    Optional<MemoryEntry> findByTenantIdAndIdempotencyKey(UUID tenantId, String idempotencyKey);
    
    List<MemoryEntry> findByStatusIn(List<MemoryStatus> statuses);
}
