package com.saep.company.repository;

import com.saep.company.domain.MembershipRoleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MembershipRoleRepository extends JpaRepository<MembershipRoleEntity, UUID> {
    List<MembershipRoleEntity> findByMembershipId(UUID membershipId);
    List<MembershipRoleEntity> findByRoleId(UUID roleId);
}
