package com.saep.organization.repository;

import com.saep.organization.domain.RoleTemplateEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface RoleTemplateRepository extends JpaRepository<RoleTemplateEntity, UUID> {
}
