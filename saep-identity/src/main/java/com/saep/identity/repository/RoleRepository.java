package com.saep.identity.repository;

import com.saep.identity.domain.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RoleRepository extends JpaRepository<Role, UUID> {
    @org.springframework.cache.annotation.Cacheable("roles")
    Optional<Role> findByName(String name);
}
