package com.saep.company.service;

import com.saep.company.domain.CompanyEntity;
import com.saep.company.domain.CompanyStatus;
import com.saep.company.domain.MembershipEntity;
import com.saep.company.repository.CompanyRepository;
import com.saep.company.repository.MembershipRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class CompanyDataSeeder implements CommandLineRunner {

    private final CompanyRepository companyRepository;
    private final MembershipRepository membershipRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        log.info("Checking and seeding enterprise company test data...");

        String tenantId = "tenant-enterprise-1";
        String companyId = "company-enterprise-1";

        if (companyRepository.findById(companyId).isEmpty()) {
            CompanyEntity company = CompanyEntity.builder()
                    .id(companyId)
                    .name("Kyrti Enterprise AI")
                    .domain("enterprise.com")
                    .tenantId(tenantId)
                    .status(CompanyStatus.ACTIVE)
                    .legalName("Kyrti Enterprise AI Solutions Inc.")
                    .industry("Artificial Intelligence & Enterprise Software")
                    .companyType("ENTERPRISE")
                    .registrationNumber("REG-2026-9988")
                    .taxNumber("US-99887766")
                    .hqCountry("United States")
                    .hqState("California")
                    .hqCity("San Francisco")
                    .hqAddress("100 Innovation Way, Suite 500")
                    .employeeCount(250)
                    .revenueRange("$10M - $50M")
                    .growthStage("SERIES_B")
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            companyRepository.save(company);
            log.info("Seeded test enterprise company: {} ({})", company.getName(), company.getId());
        }

        seedMembership(tenantId, UUID.fromString("11111111-1111-1111-1111-111111111111"), "OWNER");
        seedMembership(tenantId, UUID.fromString("22222222-2222-2222-2222-222222222222"), "MEMBER");
    }

    private void seedMembership(String tenantId, UUID userId, String role) {
        if (membershipRepository.findByTenantIdAndUserId(tenantId, userId).isEmpty()) {
            MembershipEntity membership = MembershipEntity.builder()
                    .tenantId(tenantId)
                    .userId(userId)
                    .membershipType(role)
                    .status("ACTIVE")
                    .joinedAt(LocalDateTime.now())
                    .createdBy("SYSTEM")
                    .updatedAt(LocalDateTime.now())
                    .build();
            membershipRepository.save(membership);
            log.info("Assigned user {} to company {} as {}", userId, tenantId, role);
        }
    }
}
