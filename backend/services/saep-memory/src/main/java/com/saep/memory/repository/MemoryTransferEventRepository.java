package com.saep.memory.repository;

import com.saep.memory.domain.MemoryTransferEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface MemoryTransferEventRepository extends JpaRepository<MemoryTransferEvent, UUID> {
}
