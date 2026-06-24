package com.saep.memory.repository;

import com.saep.memory.domain.MemoryChunk;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MemoryChunkRepository extends JpaRepository<MemoryChunk, UUID> {
    List<MemoryChunk> findByMemoryEntryId(UUID memoryEntryId);
    void deleteByMemoryEntryId(UUID memoryEntryId);
}
