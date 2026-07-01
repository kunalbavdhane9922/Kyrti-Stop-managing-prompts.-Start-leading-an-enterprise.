package com.saep.organization.service;

import com.saep.organization.domain.CompanyNodeEntity;
import com.saep.organization.domain.DepartmentEntity;
import com.saep.organization.domain.OrganizationBuildEntity;
import com.saep.organization.domain.OrganizationBuildStatus;
import com.saep.organization.repository.CompanyNodeRepository;
import com.saep.organization.repository.DepartmentRepository;
import com.saep.organization.repository.OrganizationBuildRepository;
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
public class OrganizationDataSeeder implements CommandLineRunner {

    private final OrganizationBuildRepository buildRepository;
    private final DepartmentRepository departmentRepository;
    private final CompanyNodeRepository companyNodeRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        log.info("Checking and seeding enterprise organization build data...");

        String tenantId = "tenant-enterprise-1";

        if (companyNodeRepository.count() == 0) {
            UUID buildId;
            var existingBuild = buildRepository.findByTenantIdAndStatus(tenantId, OrganizationBuildStatus.ACTIVE);
            if (existingBuild.isPresent()) {
                buildId = existingBuild.get().getId();
                log.info("Found existing active organization build for tenant: {} (Build ID: {})", tenantId, buildId);
            } else {
                OrganizationBuildEntity build = OrganizationBuildEntity.builder()
                        .tenantId(tenantId)
                        .status(OrganizationBuildStatus.ACTIVE)
                        .buildVersion(1)
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build();

                build = buildRepository.save(build);
                buildId = build.getId();
                log.info("Seeded active organization build for tenant: {} (Build ID: {})", tenantId, buildId);
            }

            // 2. Create Departments
            DepartmentEntity engDept = DepartmentEntity.builder()
                    .buildId(buildId)
                    .tenantId(tenantId)
                    .name("Engineering")
                    .description("Core software development and infrastructure")
                    .sortOrder(1)
                    .build();
            engDept = departmentRepository.save(engDept);

            DepartmentEntity prodDept = DepartmentEntity.builder()
                    .buildId(buildId)
                    .tenantId(tenantId)
                    .name("Product")
                    .description("Product strategy and management")
                    .sortOrder(2)
                    .build();
            prodDept = departmentRepository.save(prodDept);

            // 3. Create Nodes (Hierarchy)
            // CEO
            CompanyNodeEntity ceo = CompanyNodeEntity.builder()
                    .buildId(buildId)
                    .tenantId(tenantId)
                    .title("Chief Executive Officer")
                    .nodeType("EXECUTIVE")
                    .occupantType("HUMAN")
                    .occupantName("Admin Test")
                    .occupantEmail("admin@test.com")
                    .assignmentStatus("ASSIGNED")
                    .sortOrder(1)
                    .createdAt(LocalDateTime.now())
                    .build();
            ceo = companyNodeRepository.save(ceo);

            // CTO
            CompanyNodeEntity cto = CompanyNodeEntity.builder()
                    .buildId(buildId)
                    .tenantId(tenantId)
                    .title("Chief Technology Officer")
                    .nodeType("EXECUTIVE")
                    .occupantType("AI_VACANT")
                    .assignmentStatus("AI_VACANT")
                    .parentNodeId(ceo.getId())
                    .sortOrder(2)
                    .createdAt(LocalDateTime.now())
                    .build();
            cto = companyNodeRepository.save(cto);

            // VP Engineering
            CompanyNodeEntity vpEng = CompanyNodeEntity.builder()
                    .buildId(buildId)
                    .tenantId(tenantId)
                    .title("VP of Engineering")
                    .nodeType("DEPT_LEAD")
                    .occupantType("HUMAN")
                    .occupantName("Tech Lead")
                    .assignmentStatus("ASSIGNED")
                    .departmentId(engDept.getId())
                    .parentNodeId(cto.getId())
                    .sortOrder(3)
                    .createdAt(LocalDateTime.now())
                    .build();
            vpEng = companyNodeRepository.save(vpEng);

            // Lead AI Engineer
            CompanyNodeEntity aiLead = CompanyNodeEntity.builder()
                    .buildId(buildId)
                    .tenantId(tenantId)
                    .title("Lead AI Engineer")
                    .nodeType("POSITION_GROUP")
                    .groupCount(3)
                    .occupantType("AI_VACANT")
                    .assignmentStatus("AI_VACANT")
                    .departmentId(engDept.getId())
                    .parentNodeId(vpEng.getId())
                    .sortOrder(4)
                    .createdAt(LocalDateTime.now())
                    .build();
            companyNodeRepository.save(aiLead);

            log.info("Successfully seeded Organization Departments and Hierarchy Nodes.");
        }
    }
}
