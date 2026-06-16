package com.saep.company.repository;

import com.saep.company.domain.MembershipEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MembershipRepository extends JpaRepository<MembershipEntity, UUID> {
    Optional<MembershipEntity> findByTenantIdAndUserId(String tenantId, UUID userId);
    List<MembershipEntity> findByTenantId(String tenantId);
    List<MembershipEntity> findByTenantIdAndStatus(String tenantId, String status);
    long countByTenantIdAndMembershipTypeAndStatus(String tenantId, String membershipType, String status);
    long countByUserIdAndMembershipType(UUID userId, String membershipType);
}
