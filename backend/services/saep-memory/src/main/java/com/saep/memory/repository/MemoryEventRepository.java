package com.saep.memory.repository;

import com.saep.memory.domain.MemoryEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface MemoryEventRepository extends JpaRepository<MemoryEvent, UUID> {
}
