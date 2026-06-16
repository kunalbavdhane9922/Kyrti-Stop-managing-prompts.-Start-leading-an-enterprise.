package com.saep.workforce.repository;

import com.saep.workforce.domain.WorkerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface WorkerRepository extends JpaRepository<WorkerEntity, UUID> {
}
