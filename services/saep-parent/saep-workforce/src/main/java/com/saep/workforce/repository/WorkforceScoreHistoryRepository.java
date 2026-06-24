package com.saep.workforce.repository;

import com.saep.workforce.domain.WorkforceScoreHistoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface WorkforceScoreHistoryRepository extends JpaRepository<WorkforceScoreHistoryEntity, UUID> {}
