package com.saep.identity.config;

import com.saep.identity.domain.Role;
import com.saep.identity.domain.User;
import com.saep.identity.domain.UserTenantMembership;
import com.saep.identity.repository.RoleRepository;
import com.saep.identity.repository.UserRepository;
import com.saep.identity.repository.UserTenantMembershipRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class TestDataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserTenantMembershipRepository membershipRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        log.info("Checking and seeding test user accounts for frontend verification...");

        seedUser("admin@enterprise.com", "Admin1234!", "Admin", "Enterprise", 
                 UUID.fromString("11111111-1111-1111-1111-111111111111"), "tenant-enterprise-1");

        seedUser("test@enterprise.com", "Test1234!", "Test", "User", 
                 UUID.fromString("22222222-2222-2222-2222-222222222222"), "tenant-enterprise-1");
    }

    private void seedUser(String email, String rawPassword, String firstName, String lastName, UUID userId, String tenantId) {
        Optional<User> existing = userRepository.findByEmail(email);
        User user;
        if (existing.isEmpty()) {
            user = new User();
            user.setId(userId);
            user.setEmail(email);
            user.setPasswordHash(passwordEncoder.encode(rawPassword));
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setStatus("ACTIVE");
            user.setTwoFactorEnabled(false);

            Set<Role> roles = new HashSet<>();
            roleRepository.findByName("SYSTEM_ADMIN").ifPresent(roles::add);
            roleRepository.findByName("TENANT_ADMIN").ifPresent(roles::add);
            roleRepository.findByName("COMPANY_ADMIN").ifPresent(roles::add);
            user.setRoles(roles);

            user = userRepository.save(user);
            log.info("Created test user: {} (ID: {})", email, user.getId());
        } else {
            user = existing.get();
        }

        if (membershipRepository.findByUserIdAndStatus(user.getId(), "ACTIVE").isEmpty()) {
            UserTenantMembership membership = new UserTenantMembership();
            membership.setUserId(user.getId());
            membership.setTenantId(tenantId);
            membership.setStatus("ACTIVE");
            membershipRepository.save(membership);
            log.info("Assigned test user {} to tenant: {}", email, tenantId);
        }
    }
}
