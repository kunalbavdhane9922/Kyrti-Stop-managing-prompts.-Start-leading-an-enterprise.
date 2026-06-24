package com.saep.workforce.repository;

import com.saep.workforce.domain.DigitalProfessional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;
import java.util.List;

@Repository
public interface DigitalProfessionalRepository extends JpaRepository<DigitalProfessional, UUID> {
    List<DigitalProfessional> findByTenantId(UUID tenantId);
}
