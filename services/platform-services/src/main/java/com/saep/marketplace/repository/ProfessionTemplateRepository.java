package com.saep.marketplace.repository;

import com.saep.marketplace.domain.ProfessionTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;
import java.util.Optional;

@Repository
public interface ProfessionTemplateRepository extends JpaRepository<ProfessionTemplate, UUID> {
    Optional<ProfessionTemplate> findByProfessionName(String professionName);
}
