package com.saep.memory.repository;

import com.saep.memory.domain.MemoryTransfer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface MemoryTransferRepository extends JpaRepository<MemoryTransfer, UUID> {
}
