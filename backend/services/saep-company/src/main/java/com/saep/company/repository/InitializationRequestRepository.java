package com.saep.company.repository;

import com.saep.company.domain.InitializationRequestEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface InitializationRequestRepository extends JpaRepository<InitializationRequestEntity, UUID> {
}
