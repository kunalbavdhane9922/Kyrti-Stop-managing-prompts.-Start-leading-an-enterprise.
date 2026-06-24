package com.saep.workforce.repository;

import com.saep.workforce.domain.ProfessionTemplateEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProfessionTemplateRepository extends JpaRepository<ProfessionTemplateEntity, UUID> {
    
    Optional<ProfessionTemplateEntity> findByTenantIdAndId(String tenantId, UUID id);
    
    List<ProfessionTemplateEntity> findByTenantIdAndProfessionCode(String tenantId, String professionCode);
    
    Optional<ProfessionTemplateEntity> findByTenantIdAndProfessionCodeAndActiveFlagTrue(String tenantId, String professionCode);
    
    Optional<ProfessionTemplateEntity> findByTenantIdAndProfessionCodeAndTemplateVersion(String tenantId, String professionCode, Integer templateVersion);
}
