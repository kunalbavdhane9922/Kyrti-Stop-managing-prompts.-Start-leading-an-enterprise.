package com.saep.workforce.repository;

import com.saep.workforce.model.CareerHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CareerHistoryRepository extends JpaRepository<CareerHistory, UUID> {
    List<CareerHistory> findByProfessionalIdAndTenantIdOrderByCompletedAtDesc(UUID professionalId, UUID tenantId);
}
