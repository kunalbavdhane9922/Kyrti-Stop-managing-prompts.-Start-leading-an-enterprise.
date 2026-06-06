package com.saep.identity.repository;

import com.saep.identity.model.IdentityUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<IdentityUser, UUID> {
    Optional<IdentityUser> findByEmail(String email);
}
