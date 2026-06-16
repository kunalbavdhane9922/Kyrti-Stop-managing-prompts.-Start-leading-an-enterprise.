package com.saep.company.repository;

import com.saep.company.domain.InvitationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InvitationRepository extends JpaRepository<InvitationEntity, UUID> {
    Optional<InvitationEntity> findByToken(String token);
    
    List<InvitationEntity> findByTenantIdAndEmailAndStatus(String tenantId, String email, String status);

    @Query("SELECT i FROM InvitationEntity i WHERE i.status = 'PENDING' AND i.expiresAt < :now")
    List<InvitationEntity> findExpiredInvitations(LocalDateTime now);
}
