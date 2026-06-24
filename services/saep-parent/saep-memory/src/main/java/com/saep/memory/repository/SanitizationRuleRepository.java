package com.saep.memory.repository;

import com.saep.memory.domain.SanitizationRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SanitizationRuleRepository extends JpaRepository<SanitizationRule, UUID> {
    List<SanitizationRule> findByTenantId(UUID tenantId);
}
