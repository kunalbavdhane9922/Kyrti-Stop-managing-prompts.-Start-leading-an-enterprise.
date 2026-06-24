package com.saep.identity.repository;

import com.saep.identity.domain.TrustedDevice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TrustedDeviceRepository extends JpaRepository<TrustedDevice, UUID> {
    Optional<TrustedDevice> findByUserIdAndDeviceIdHashAndRevokedFalse(UUID userId, String deviceIdHash);
    List<TrustedDevice> findByUserIdAndRevokedFalse(UUID userId);
}
