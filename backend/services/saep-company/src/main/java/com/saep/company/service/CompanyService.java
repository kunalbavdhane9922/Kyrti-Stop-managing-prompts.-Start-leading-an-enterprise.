package com.saep.company.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.saep.common.event.DomainEvents;
import com.saep.common.event.EventEnvelope;
import com.saep.company.domain.CompanyEntity;
import com.saep.company.repository.CompanyRepository;
import com.saep.outbox.domain.EventStatus;
import com.saep.outbox.domain.OutboxEvent;
import com.saep.outbox.repository.OutboxEventRepository;
import com.saep.company.repository.MembershipRepository;
import com.saep.company.domain.MembershipEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final OutboxEventRepository outboxEventRepository;
    private final MembershipRepository membershipRepository;
    private final com.saep.company.repository.InitializationRequestRepository initializationRequestRepository;
    private final ObjectMapper objectMapper;
    private final io.micrometer.core.instrument.MeterRegistry meterRegistry;
    private final AuditService auditService;

    private final OrganizationBootstrapService bootstrapService;

    @org.springframework.beans.factory.annotation.Value("${saep.test.force-producer-failure:false}")
    private boolean forceProducerFailure;

    @Transactional
    public CompanyEntity createCompany(
            String name, String domain, String tenantId, String createdBy,
            String legalName, String industry, String companyType,
            String registrationNumber, String taxNumber, String hqCountry,
            String hqState, String hqCity, String hqAddress,
            Integer employeeCount, String revenueRange, String growthStage) {
            
        if (createdBy != null && !createdBy.isBlank()) {
            long existingCompanies = membershipRepository.countByUserIdAndMembershipType(UUID.fromString(createdBy), "OWNER");
            if (existingCompanies > 0) {
                throw new IllegalStateException("User already owns a workspace. Multiple workspaces are not allowed.");
            }
        }
            
        CompanyEntity company = CompanyEntity.builder()
                .id(UUID.randomUUID().toString())
                .name(name)
                .domain(domain)
                .tenantId(tenantId)
                .status(com.saep.company.domain.CompanyStatus.DRAFT)
                .legalName(legalName)
                .industry(industry)
                .companyType(companyType)
                .registrationNumber(registrationNumber)
                .taxNumber(taxNumber)
                .hqCountry(hqCountry)
                .hqState(hqState)
                .hqCity(hqCity)
                .hqAddress(hqAddress)
                .employeeCount(employeeCount)
                .revenueRange(revenueRange)
                .growthStage(growthStage)
                .build();

        companyRepository.save(company);
        
        auditService.recordTransition(company.getId(), "Company", null, "DRAFT", tenantId, createdBy, "onboarding-" + company.getId());

        DomainEvents.CompanyCreated payload = new DomainEvents.CompanyCreated(
                company.getId(),
                company.getName(),
                company.getDomain(),
                createdBy
        );

        String traceId = org.slf4j.MDC.get(com.saep.common.tracing.TracingFilter.TRACE_ID);
        if (traceId == null) traceId = UUID.randomUUID().toString();
        
        String correlationId = org.slf4j.MDC.get(com.saep.common.tracing.TracingFilter.CORRELATION_ID);
        if (correlationId == null) correlationId = "onboarding-" + company.getId();

        company.setSagaCorrelationId(correlationId);
        companyRepository.save(company);

        EventEnvelope<DomainEvents.CompanyCreated> envelope = EventEnvelope.wrap(
                payload,
                "CompanyCreated",
                DomainEvents.VERSION_1,
                tenantId,
                correlationId,
                correlationId,
                traceId
        );
        company.setLatestEventId(envelope.getEventId());
        companyRepository.save(company);

        try {
            String payloadJson = objectMapper.writeValueAsString(envelope);

            OutboxEvent outboxEvent = OutboxEvent.builder()
                    .eventId(envelope.getEventId())
                    .eventType(envelope.getEventType())
                    .topic("company.created")
                    .tenantId(envelope.getTenantId())
                    .payload(payloadJson)
                    .createdAt(LocalDateTime.now())
                    .status(EventStatus.PENDING)
                    .retryCount(0)
                    .build();

            outboxEventRepository.save(outboxEvent);

            if (createdBy != null && !createdBy.isBlank()) {
                MembershipEntity owner = MembershipEntity.builder()
                        .tenantId(tenantId)
                        .userId(UUID.fromString(createdBy))
                        .membershipType("OWNER")
                        .status("ACTIVE")
                        .createdBy("SYSTEM")
                        .build();
                membershipRepository.save(owner);

                bootstrapService.bootstrapCompany(tenantId, owner.getId(), createdBy);

                DomainEvents.MembershipCreated membershipPayload = new DomainEvents.MembershipCreated(
                        owner.getId().toString(), tenantId, createdBy
                );
                EventEnvelope<DomainEvents.MembershipCreated> membershipEnvelope = EventEnvelope.wrap(
                        membershipPayload, "MembershipCreated", DomainEvents.VERSION_1, tenantId, correlationId, envelope.getEventId(), traceId
                );
                
                OutboxEvent membershipOutbox = OutboxEvent.builder()
                        .eventId(membershipEnvelope.getEventId())
                        .eventType(membershipEnvelope.getEventType())
                        .topic("membership.events")
                        .tenantId(tenantId)
                        .payload(objectMapper.writeValueAsString(membershipEnvelope))
                        .createdAt(LocalDateTime.now())
                        .status(EventStatus.PENDING)
                        .retryCount(0)
                        .build();
                outboxEventRepository.save(membershipOutbox);
            }

            if (forceProducerFailure) {
                throw new RuntimeException("Forced producer failure for Level 4 testing");
            }
            
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize event", e);
        }

        return company;
    }

    @Transactional
    public void initializeCompany(String companyIdOrTenantId, String tenantId, Integer schemaVersion, String payloadJson, String createdBy) {
        CompanyEntity company = companyRepository.findById(companyIdOrTenantId)
                .orElseGet(() -> companyRepository.findByTenantId(companyIdOrTenantId)
                        .orElseThrow(() -> new IllegalArgumentException("Company not found by id or tenantId: " + companyIdOrTenantId)));
        
        if (!company.getTenantId().equals(tenantId)) {
            throw new IllegalArgumentException("Tenant mismatch");
        }
        
        if (company.getStatus() != com.saep.company.domain.CompanyStatus.DRAFT && company.getStatus() != com.saep.company.domain.CompanyStatus.FAILED) {
            throw new IllegalStateException("Company is not in DRAFT or FAILED state");
        }

        String payloadReference = "db-storage";

        com.saep.company.domain.InitializationRequestEntity initRequest = com.saep.company.domain.InitializationRequestEntity.builder()
                .companyId(company.getId())
                .tenantId(tenantId)
                .schemaVersion(schemaVersion)
                .payloadReference(payloadReference)
                .payloadData(payloadJson)
                .status(com.saep.company.domain.InitializationRequestStatus.PROCESSING)
                .build();
        
        initRequest = initializationRequestRepository.save(initRequest);
        
        String oldState = company.getStatus().name();
        company.setStatus(com.saep.company.domain.CompanyStatus.INITIALIZING);
        companyRepository.save(company);
        
        auditService.recordTransition(company.getId(), "Company", oldState, "INITIALIZING", tenantId, createdBy, company.getSagaCorrelationId());
        
        String traceId = org.slf4j.MDC.get(com.saep.common.tracing.TracingFilter.TRACE_ID);
        if (traceId == null) traceId = UUID.randomUUID().toString();
        String correlationId = company.getSagaCorrelationId();
        if (correlationId == null) correlationId = UUID.randomUUID().toString();
        String causationId = company.getLatestEventId();
        if (causationId == null) causationId = correlationId;

        java.util.Map<String, Object> payload = new java.util.HashMap<>();
        payload.put("initializationRequestId", initRequest.getId().toString());
        payload.put("industry", company.getIndustry());
        payload.put("growthStage", company.getGrowthStage());
        payload.put("employeeCount", company.getEmployeeCount());
        payload.put("creatorId", createdBy);

        EventEnvelope<java.util.Map<String, Object>> envelope = EventEnvelope.wrap(
                payload, "OrganizationProvisionRequested", DomainEvents.VERSION_1, tenantId, correlationId, causationId, traceId
        );
        
        company.setLatestEventId(envelope.getEventId());
        companyRepository.save(company);
        
        try {
            OutboxEvent outboxEvent = OutboxEvent.builder()
                    .eventId(envelope.getEventId())
                    .eventType(envelope.getEventType())
                    .topic("organization.events")
                    .tenantId(envelope.getTenantId())
                    .payload(objectMapper.writeValueAsString(envelope))
                    .createdAt(LocalDateTime.now())
                    .status(EventStatus.PENDING)
                    .retryCount(0)
                    .build();
            outboxEventRepository.save(outboxEvent);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize OrganizationProvisionRequested event", e);
        }
    }

    @Transactional
    public void processOrganizationProvisionCompleted(String tenantId, String buildId, String initializationRequestId) {
        // Idempotency: Find Company and InitRequest
        java.util.Optional<CompanyEntity> companyOpt = companyRepository.findByTenantId(tenantId);
        if (companyOpt.isPresent()) {
            CompanyEntity company = companyOpt.get();
            if (company.getStatus() == com.saep.company.domain.CompanyStatus.ACTIVE) {
                return;
            }
            if (company.getStatus() == com.saep.company.domain.CompanyStatus.FAILED) {
                return; // Out of order / Delayed
            }
            String oldState = company.getStatus().name();
            company.setStatus(com.saep.company.domain.CompanyStatus.ACTIVE);
            companyRepository.save(company);
            
            auditService.recordTransition(company.getId(), "Company", oldState, "ACTIVE", tenantId, "SYSTEM", company.getSagaCorrelationId());
            
            // Record End-to-End Saga Duration
            long durationMs = java.time.temporal.ChronoUnit.MILLIS.between(company.getCreatedAt(), LocalDateTime.now());
            meterRegistry.timer("onboarding.provisioning.time", "tenantId", tenantId)
                .record(java.time.Duration.ofMillis(durationMs));
                
            org.slf4j.MDC.put("tenantId", tenantId);
            org.slf4j.MDC.put("companyId", company.getId());
            org.slf4j.MDC.put("correlationId", company.getSagaCorrelationId());
        }

        if (initializationRequestId != null) {
            java.util.Optional<com.saep.company.domain.InitializationRequestEntity> reqOpt = initializationRequestRepository.findById(UUID.fromString(initializationRequestId));
            if (reqOpt.isPresent()) {
                com.saep.company.domain.InitializationRequestEntity req = reqOpt.get();
                req.setStatus(com.saep.company.domain.InitializationRequestStatus.SUCCEEDED);
                initializationRequestRepository.save(req);
            }
        }
    }

    @Transactional
    public void processOrganizationProvisionFailed(String tenantId, String failureReason, String initializationRequestId) {
        java.util.Optional<CompanyEntity> companyOpt = companyRepository.findByTenantId(tenantId);
        if (companyOpt.isPresent()) {
            CompanyEntity company = companyOpt.get();
            if (company.getStatus() == com.saep.company.domain.CompanyStatus.FAILED) {
                return; // Idempotent
            }
            String oldState = company.getStatus().name();
            company.setStatus(com.saep.company.domain.CompanyStatus.FAILED);
            companyRepository.save(company);
            
            auditService.recordTransition(company.getId(), "Company", oldState, "FAILED", tenantId, "SYSTEM", company.getSagaCorrelationId());
            
            meterRegistry.counter("saga.failure.total", 
                "tenantId", tenantId,
                "reason", failureReason != null ? failureReason : "unknown").increment();
                
            org.slf4j.MDC.put("tenantId", tenantId);
            org.slf4j.MDC.put("companyId", company.getId());
            org.slf4j.MDC.put("correlationId", company.getSagaCorrelationId());
        }

        if (initializationRequestId != null) {
            java.util.Optional<com.saep.company.domain.InitializationRequestEntity> reqOpt = initializationRequestRepository.findById(UUID.fromString(initializationRequestId));
            if (reqOpt.isPresent()) {
                com.saep.company.domain.InitializationRequestEntity req = reqOpt.get();
                req.setStatus(com.saep.company.domain.InitializationRequestStatus.FAILED);
                req.setFailureReason(failureReason);
                initializationRequestRepository.save(req);
            }
        }
    }
}
