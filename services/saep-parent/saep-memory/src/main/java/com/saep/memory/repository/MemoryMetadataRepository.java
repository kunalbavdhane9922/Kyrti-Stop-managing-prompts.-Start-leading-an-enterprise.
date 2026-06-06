package com.saep.memory.repository;

import com.saep.memory.model.MemoryMetadata;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MemoryMetadataRepository extends JpaRepository<MemoryMetadata, UUID> {
    List<MemoryMetadata> findByTenantIdAndProfessionalId(UUID tenantId, UUID professionalId);
}
