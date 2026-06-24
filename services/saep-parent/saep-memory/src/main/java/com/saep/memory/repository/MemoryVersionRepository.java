package com.saep.memory.repository;

import com.saep.memory.domain.MemoryVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MemoryVersionRepository extends JpaRepository<MemoryVersion, UUID> {
    List<MemoryVersion> findByMemoryEntryIdOrderByVersionNumberDesc(UUID memoryEntryId);
}
