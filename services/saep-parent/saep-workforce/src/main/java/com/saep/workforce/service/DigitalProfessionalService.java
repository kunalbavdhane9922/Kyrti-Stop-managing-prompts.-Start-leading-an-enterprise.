package com.saep.workforce.service;

import com.saep.workforce.domain.CareerHistoryEntity;
import com.saep.workforce.domain.ProfessionTemplateEntity;
import com.saep.workforce.domain.WorkerEntity;
import com.saep.workforce.dto.CreateProfessionalRequest;
import com.saep.workforce.repository.CareerHistoryRepository;
import com.saep.workforce.repository.ProfessionTemplateRepository;
import com.saep.workforce.repository.WorkerRepository;
import com.saep.outbox.domain.EventStatus;
import com.saep.outbox.domain.OutboxEvent;
import com.saep.outbox.repository.OutboxEventRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class DigitalProfessionalService {

    private final WorkerRepository workerRepository;
    private final ProfessionTemplateRepository templateRepository;
    private final CareerHistoryRepository careerHistoryRepository;
    private final jakarta.persistence.EntityManager entityManager;
    private final OutboxEventRepository outboxEventRepository;
    private final ObjectMapper objectMapper;
    private final PromotionScoringService promotionScoringService;

    @Transactional
    public WorkerEntity createProfessional(String tenantId, String createdBy, String approverId, CreateProfessionalRequest request) {
        
        // Find the template
        ProfessionTemplateEntity template;
        if (request.getTemplateVersion() != null) {
            template = templateRepository.findByTenantIdAndProfessionCodeAndTemplateVersion(
                    tenantId, request.getProfessionCode(), request.getTemplateVersion())
                    .orElseThrow(() -> new IllegalArgumentException("Template version not found"));
        } else {
            template = templateRepository.findByTenantIdAndProfessionCodeAndActiveFlagTrue(
                    tenantId, request.getProfessionCode())
                    .orElseThrow(() -> new IllegalArgumentException("Active template not found"));
        }
        
        // Generate worker code via sequence
        Long seq = ((Number) entityManager.createNativeQuery("SELECT nextval('worker_code_seq')").getSingleResult()).longValue();
        String workerCode = String.format("DP-%06d", seq);

        String initialLevel = "Entry";
        if (template.getDefinition() != null && template.getDefinition().getCareerPath() != null 
                && !template.getDefinition().getCareerPath().isEmpty()) {
            initialLevel = template.getDefinition().getCareerPath().get(0);
        }

        WorkerEntity worker = WorkerEntity.builder()
                .id(UUID.randomUUID())
                .tenantId(tenantId)
                .workerCode(workerCode)
                .displayName(workerCode + " (" + template.getProfessionName() + ")")
                .professionId(template.getProfessionCode())
                .level(initialLevel)
                .workerType("AI")
                .originTemplateId(template.getId().toString())
                .originTemplateVersion(template.getTemplateVersion())
                .originTemplateSnapshot(template.getDefinition())
                .status(request.getCompanyId() != null ? "EMPLOYED" : "AVAILABLE")
                .currentCompanyId(request.getCompanyId() != null ? request.getCompanyId().toString() : null)
                .hireDate(LocalDateTime.now())
                .activeAssignmentCount(0)
                .completedTaskCount(0)
                .failedTaskCount(0)
                .currentCapabilityScore(0.0)
                .currentReputationScore(0.0)
                .build();
                
        worker = workerRepository.save(worker);
        
        // Create initial career history
        CareerHistoryEntity history = CareerHistoryEntity.builder()
                .id(UUID.randomUUID())
                .tenantId(tenantId)
                .workerId(worker.getId().toString())
                .eventType("PROFESSIONAL_CREATED")
                .professionalName(worker.getDisplayName())
                .roleTitle(template.getProfessionName())
                .level(initialLevel)
                .companyId(worker.getCurrentCompanyId())
                .actorId(createdBy)
                .approverId(approverId != null ? approverId : createdBy)
                .previousValue(null)
                .newValue(template.getProfessionName() + " " + initialLevel)
                .occurredAt(LocalDateTime.now())
                .reason("Source Template: " + template.getProfessionCode() + " v" + template.getTemplateVersion())
                .build();
                
        careerHistoryRepository.save(history);
        
        publishOutboxEvent(tenantId, "workforce.professional.created.v1", Map.of(
            "workerId", worker.getId().toString(),
            "professionCode", worker.getProfessionId(),
            "status", worker.getStatus(),
            "occurredAt", LocalDateTime.now().toString()
        ));
        
        return worker;
    }

    private void saveHistorySnapshot(WorkerEntity worker, String eventType, String previousValue, String newValue, String reason, String actorId, String approverId, Double promotionScore, Double promotionThreshold) {
        CareerHistoryEntity history = CareerHistoryEntity.builder()
                .id(UUID.randomUUID())
                .tenantId(worker.getTenantId())
                .workerId(worker.getId().toString())
                .eventType(eventType)
                .professionalName(worker.getDisplayName())
                .roleTitle(worker.getProfessionId())
                .level(worker.getLevel())
                .companyId(worker.getCurrentCompanyId())
                .actorId(actorId)
                .approverId(approverId != null ? approverId : actorId)
                .previousValue(previousValue)
                .newValue(newValue)
                .occurredAt(LocalDateTime.now())
                .reason(reason)
                .promotionScore(promotionScore)
                .promotionThreshold(promotionThreshold)
                .build();
        careerHistoryRepository.save(history);
    }

    @Transactional
    public WorkerEntity hireProfessional(String tenantId, UUID workerId, String actorId, String approverId, com.saep.workforce.dto.HireProfessionalRequest request) {
        WorkerEntity worker = workerRepository.findByTenantIdAndId(tenantId, workerId)
                .orElseThrow(() -> new IllegalArgumentException("Professional not found"));
        
        if (!"AVAILABLE".equals(worker.getStatus())) {
            throw new IllegalStateException("Professional is not AVAILABLE to be hired.");
        }
        
        String previousStatus = worker.getStatus();
        worker.setStatus("EMPLOYED");
        worker.setCurrentCompanyId(request.getCompanyId().toString());
        
        if (request.getNewRole() != null && !request.getNewRole().isBlank()) {
            worker.setProfessionId(request.getNewRole());
        }
        
        worker = workerRepository.save(worker);
        
        saveHistorySnapshot(worker, "HIRED", previousStatus, "EMPLOYED", request.getReason(), actorId, approverId, null, null);
        publishOutboxEvent(tenantId, "workforce.professional.hired.v1", Map.of(
            "workerId", workerId.toString(),
            "companyId", request.getCompanyId().toString(),
            "status", "EMPLOYED",
            "occurredAt", LocalDateTime.now().toString()
        ));
        return worker;
    }

    @Transactional
    public WorkerEntity promoteProfessional(String tenantId, UUID workerId, String actorId, String approverId, com.saep.workforce.dto.PromotionRequest request) {
        WorkerEntity worker = workerRepository.findByTenantIdAndId(tenantId, workerId)
                .orElseThrow(() -> new IllegalArgumentException("Professional not found"));

        if (!"EMPLOYED".equals(worker.getStatus())) {
            throw new IllegalStateException("Professional must be EMPLOYED to be promoted.");
        }

        var eligibility = promotionScoringService.calculateEligibility(tenantId, workerId.toString());

        String previousLevel = worker.getLevel();
        worker.setLevel(request.getNewLevel());
        worker = workerRepository.save(worker);

        saveHistorySnapshot(worker, "PROMOTED", previousLevel, request.getNewLevel(), request.getReason(), actorId, approverId, eligibility.getTotalScore(), eligibility.getRequiredThreshold());
        publishOutboxEvent(tenantId, "workforce.professional.promoted.v1", Map.of(
            "workerId", workerId.toString(),
            "oldLevel", previousLevel,
            "newLevel", request.getNewLevel(),
            "promotionScore", eligibility.getTotalScore(),
            "threshold", eligibility.getRequiredThreshold()
        ));
        return worker;
    }

    @Transactional
    public WorkerEntity terminateProfessional(String tenantId, UUID workerId, String actorId, String approverId, com.saep.workforce.dto.TerminationRequest request) {
        WorkerEntity worker = workerRepository.findByTenantIdAndId(tenantId, workerId)
                .orElseThrow(() -> new IllegalArgumentException("Professional not found"));

        if (!"EMPLOYED".equals(worker.getStatus())) {
            throw new IllegalStateException("Professional must be EMPLOYED to be terminated.");
        }

        String previousCompany = worker.getCurrentCompanyId();
        worker.setStatus("AVAILABLE");
        worker.setCurrentCompanyId(null);
        worker = workerRepository.save(worker);

        saveHistorySnapshot(worker, "TERMINATED", previousCompany, "AVAILABLE", request.getReason(), actorId, approverId, null, null);
        publishOutboxEvent(tenantId, "workforce.professional.terminated.v1", Map.of(
            "workerId", workerId.toString(),
            "status", "AVAILABLE",
            "occurredAt", LocalDateTime.now().toString()
        ));
        return worker;
    }

    @Transactional
    public WorkerEntity retireProfessional(String tenantId, UUID workerId, String actorId, String approverId, com.saep.workforce.dto.RetirementRequest request) {
        WorkerEntity worker = workerRepository.findByTenantIdAndId(tenantId, workerId)
                .orElseThrow(() -> new IllegalArgumentException("Professional not found"));

        if ("RETIRED".equals(worker.getStatus())) {
            throw new IllegalStateException("Professional is already RETIRED.");
        }

        String previousStatus = worker.getStatus();
        worker.setStatus("RETIRED");
        worker.setCurrentCompanyId(null);
        worker.setRetirementDate(LocalDateTime.now());
        worker = workerRepository.save(worker);

        saveHistorySnapshot(worker, "RETIRED", previousStatus, "RETIRED", request.getReason(), actorId, approverId, null, null);
        publishOutboxEvent(tenantId, "workforce.professional.retired.v1", Map.of(
            "workerId", workerId.toString(),
            "status", "RETIRED",
            "occurredAt", LocalDateTime.now().toString()
        ));
        return worker;
    }

    @Transactional
    public void recordAchievement(String tenantId, UUID workerId, String actorId, String approverId, com.saep.workforce.dto.AchievementRequest request) {
        WorkerEntity worker = workerRepository.findByTenantIdAndId(tenantId, workerId)
                .orElseThrow(() -> new IllegalArgumentException("Professional not found"));

        saveHistorySnapshot(worker, "ACHIEVEMENT", null, request.getTitle(), request.getDescription(), actorId, approverId, null, null);
        publishOutboxEvent(tenantId, "workforce.professional.achievement-recorded.v1", Map.of(
            "workerId", workerId.toString(),
            "achievement", request.getTitle(),
            "occurredAt", LocalDateTime.now().toString()
        ));
    }

    private void publishOutboxEvent(String tenantId, String eventType, Map<String, Object> payload) {
        try {
            OutboxEvent outbox = OutboxEvent.builder()
                    .eventId(UUID.randomUUID().toString())
                    .eventType(eventType)
                    .topic("workforce.lifecycle")
                    .tenantId(tenantId)
                    .payload(objectMapper.writeValueAsString(payload))
                    .createdAt(LocalDateTime.now())
                    .status(EventStatus.PENDING)
                    .retryCount(0)
                    .build();
            outboxEventRepository.save(outbox);
        } catch (Exception e) {
            log.error("Failed to publish outbox event {}", eventType, e);
        }
    }
}
