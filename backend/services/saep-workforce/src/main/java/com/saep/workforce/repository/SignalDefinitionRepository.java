package com.saep.workforce.repository;

import com.saep.workforce.domain.SignalDefinitionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface SignalDefinitionRepository extends JpaRepository<SignalDefinitionEntity, UUID> {    java.util.Optional<com.saep.workforce.domain.SignalDefinitionEntity> findByTenantIdAndSignalCodeAndActiveFlagTrue(String tenantId, String signalCode);
}

