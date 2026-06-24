package com.saep.marketplace.repository;

import com.saep.marketplace.domain.AgentWorkflowEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AgentWorkflowRepository extends JpaRepository<AgentWorkflowEntity, String> {

    @Query("SELECT COUNT(w) FROM AgentWorkflowEntity w WHERE w.agentId = :agentId AND w.status = 'RUNNING'")
    int countRunningWorkflowsForAgent(@Param("agentId") String agentId);

}
