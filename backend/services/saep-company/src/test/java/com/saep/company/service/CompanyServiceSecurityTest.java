package com.saep.company.service;

import com.saep.company.domain.AuditLogEntity;
import com.saep.company.domain.CompanyEntity;
import com.saep.company.domain.CompanyStatus;
import com.saep.company.repository.AuditLogRepository;
import com.saep.company.repository.CompanyRepository;
import com.saep.outbox.repository.OutboxEventRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@ActiveProfiles("test")
public class CompanyServiceSecurityTest {

    @Autowired
    private CompanyService companyService;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private OutboxEventRepository outboxEventRepository;

    @MockBean
    private OrganizationBootstrapService bootstrapService;

    @Test
    @Transactional
    public void testTenantIsolation_cannotInitializeOtherTenantCompany() {
        // Arrange
        String tenantA = "tenant-A";
        String tenantB = "tenant-B";
        String userA = UUID.randomUUID().toString();

        CompanyEntity companyA = companyService.createCompany("Company A", "comp-a.com", tenantA, userA, null, null, null, null, null, null, null, null, null, null, null, null);

        // Act & Assert
        // Tenant B tries to initialize Tenant A's company
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            companyService.initializeCompany(companyA.getId(), tenantB, 1, "{}", userA);
        });

        assertThat(exception.getMessage()).isEqualTo("Tenant mismatch");
    }

    @Test
    @Transactional
    public void testAuditCompleteness_happyPath() {
        // Arrange
        String tenantId = "tenant-1";
        String userId = UUID.randomUUID().toString();

        // Act - 1: Create (DRAFT)
        CompanyEntity company = companyService.createCompany("Test Corp", "test.com", tenantId, userId, null, null, null, null, null, null, null, null, null, null, null, null);
        
        // Act - 2: Initialize (INITIALIZING)
        companyService.initializeCompany(company.getId(), tenantId, 1, "{}", userId);
        
        // Act - 3: Complete (ACTIVE)
        companyService.processOrganizationProvisionCompleted(tenantId, "build-123", null);

        // Assert
        List<AuditLogEntity> audits = auditLogRepository.findByEntityIdOrderByTimestampAsc(UUID.fromString(company.getId()));
        
        assertThat(audits).hasSize(3);
        assertThat(audits.get(0).getNewState()).isEqualTo("DRAFT");
        assertThat(audits.get(1).getOldState()).isEqualTo("DRAFT");
        assertThat(audits.get(1).getNewState()).isEqualTo("INITIALIZING");
        assertThat(audits.get(2).getOldState()).isEqualTo("INITIALIZING");
        assertThat(audits.get(2).getNewState()).isEqualTo("ACTIVE");
    }

    @Test
    @Transactional
    public void testAuditCompleteness_failurePath() {
        // Arrange
        String tenantId = "tenant-2";
        String userId = UUID.randomUUID().toString();

        // Act - 1: Create (DRAFT)
        CompanyEntity company = companyService.createCompany("Fail Corp", "fail.com", tenantId, userId, null, null, null, null, null, null, null, null, null, null, null, null);
        
        // Act - 2: Initialize (INITIALIZING)
        companyService.initializeCompany(company.getId(), tenantId, 1, "{}", userId);
        
        // Act - 3: Fail (FAILED)
        companyService.processOrganizationProvisionFailed(tenantId, "Timeout", null);

        // Assert
        List<AuditLogEntity> audits = auditLogRepository.findByEntityIdOrderByTimestampAsc(UUID.fromString(company.getId()));
        
        assertThat(audits).hasSize(3);
        assertThat(audits.get(0).getNewState()).isEqualTo("DRAFT");
        assertThat(audits.get(1).getNewState()).isEqualTo("INITIALIZING");
        assertThat(audits.get(2).getNewState()).isEqualTo("FAILED");
    }
}
