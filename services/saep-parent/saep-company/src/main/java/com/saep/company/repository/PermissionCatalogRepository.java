package com.saep.company.repository;

import com.saep.company.domain.PermissionCatalogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PermissionCatalogRepository extends JpaRepository<PermissionCatalogEntity, String> {
}
