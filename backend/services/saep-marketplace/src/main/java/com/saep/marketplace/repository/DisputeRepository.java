package com.saep.marketplace.repository;

import com.saep.marketplace.domain.DisputeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface DisputeRepository extends JpaRepository<DisputeEntity, String> {

    @Query("SELECT COUNT(d) FROM DisputeEntity d WHERE d.agentId = :agentId AND d.status = 'OPEN'")
    int countOpenDisputesForAgent(@Param("agentId") String agentId);

}
