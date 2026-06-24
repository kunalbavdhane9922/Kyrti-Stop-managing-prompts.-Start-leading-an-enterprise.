package com.saep.identity.repository;

import com.saep.identity.domain.UserTenantMembership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserTenantMembershipRepository extends JpaRepository<UserTenantMembership, UUID> {
    List<UserTenantMembership> findByUserId(UUID userId);
    List<UserTenantMembership> findByUserIdAndStatus(UUID userId, String status);
    Optional<UserTenantMembership> findByUserIdAndTenantId(UUID userId, String tenantId);
}
