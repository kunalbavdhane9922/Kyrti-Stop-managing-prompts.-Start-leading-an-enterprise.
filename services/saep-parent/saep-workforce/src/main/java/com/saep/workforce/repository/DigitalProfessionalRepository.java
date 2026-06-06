package com.saep.workforce.repository;

import com.saep.workforce.model.DigitalProfessional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DigitalProfessionalRepository extends JpaRepository<DigitalProfessional, UUID> {
    List<DigitalProfessional> findByTenantId(UUID tenantId);
    Optional<DigitalProfessional> findByIdAndTenantId(UUID id, UUID tenantId);
}
