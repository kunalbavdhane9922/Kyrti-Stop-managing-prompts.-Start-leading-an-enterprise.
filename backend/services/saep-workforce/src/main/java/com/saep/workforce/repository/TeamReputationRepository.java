package com.saep.workforce.repository;

import com.saep.workforce.domain.TeamReputationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface TeamReputationRepository extends JpaRepository<TeamReputationEntity, UUID> {    java.util.Optional<com.saep.workforce.domain.TeamReputationEntity> findByTenantIdAndTeamId(String tenantId, String teamId);
}

