package com.saep.identity.repository;

import com.saep.identity.domain.ServiceAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ServiceAccountRepository extends JpaRepository<ServiceAccount, UUID> {
    Optional<ServiceAccount> findByClientId(String clientId);
}
