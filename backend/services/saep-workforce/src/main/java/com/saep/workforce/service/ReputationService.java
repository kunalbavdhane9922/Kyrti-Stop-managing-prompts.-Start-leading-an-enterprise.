package com.saep.workforce.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.saep.outbox.domain.EventStatus;
import com.saep.outbox.domain.OutboxEvent;
import com.saep.outbox.repository.OutboxEventRepository;
import com.saep.workforce.domain.*;
import com.saep.workforce.repository.*;
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
public class ReputationService {

    private final ProcessedSignalRepository processedSignalRepository;
    private final EvidenceRecordRepository evidenceRecordRepository;
    private final SignalDefinitionRepository signalDefinitionRepository;
    private final ReputationSignalRepository reputationSignalRepository;
    
    private final ProfessionalReputationRepository professionalRepo;
    private final TeamReputationRepository teamRepo;
    private final CompanyReputationRepository companyRepo;
    
    private final ReputationScoreHistoryRepository historyRepository;
    private final OutboxEventRepository outboxEventRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public void processReputationSignal(String tenantId, String sourceEventId, String sourceSystem, String sourceType, 
                                        String subjectId, String subjectType, String signalCode, JsonNode payload) {
        
        // 1. Check Idempotency
        if (processedSignalRepository.existsByTenantIdAndSourceEventId(tenantId, sourceEventId)) {
            log.info("Signal {} already processed for tenant {}", sourceEventId, tenantId);
            return;
        }

        // 2. Fetch Signal Definition
        var signalDefOpt = signalDefinitionRepository.findByTenantIdAndSignalCodeAndActiveFlagTrue(tenantId, signalCode);
        if (signalDefOpt.isEmpty()) {
            log.warn("Active signal definition not found for code {}", signalCode);
            return;
        }
        var signalDef = signalDefOpt.get();
        if (signalDef.getReputationWeight() == null || signalDef.getReputationWeight() == 0.0) {
            // Signal does not affect reputation
            return;
        }

        // 3. Save Immutable Evidence (If not already saved by scoring service)
        // Usually, evidence should be saved once per event, but for simplicity we save it here if reputation processes independently.
        // Or we could share the evidence logic. Let's create it for now.
        String payloadStr = payload != null ? payload.toString() : "{}";
        String payloadHash = calculateSha256(payloadStr);

        EvidenceRecordEntity evidence = EvidenceRecordEntity.builder()
                .id(UUID.randomUUID())
                .tenantId(tenantId)
                .workerId("WORKER".equals(subjectType) ? subjectId : null)
                .sourceEventId(sourceEventId)
                .sourceSystem(sourceSystem)
                .sourceType(sourceType)
                .payload(payloadStr)
                .payloadHash(payloadHash)
                .occurredAt(LocalDateTime.now())
                .recordedAt(LocalDateTime.now())
                .build();
        evidenceRecordRepository.save(evidence);

        // 4. Create Reputation Signal
        ReputationSignalEntity signal = ReputationSignalEntity.builder()
                .id(UUID.randomUUID())
                .tenantId(tenantId)
                .subjectId(subjectId)
                .subjectType(subjectType)
                .evidenceId(evidence.getId().toString())
                .signalDefinitionId(signalDef.getId().toString())
                .reputationImpact(signalDef.getReputationWeight())
                .occurredAt(LocalDateTime.now())
                .appliedAt(LocalDateTime.now())
                .build();
        reputationSignalRepository.save(signal);

        // 5. Save Processed Record
        processedSignalRepository.save(ProcessedSignalEntity.builder()
                .id(UUID.randomUUID())
                .tenantId(tenantId)
                .sourceEventId(sourceEventId)
                .internalSignalId(signal.getId().toString())
                .processedAt(LocalDateTime.now())
                .build());

        // 6. Update Score based on Subject Type
        double prevScore = 0.0;
        double newScore = 0.0;
        
        if ("WORKER".equals(subjectType)) {
            var score = professionalRepo.findByTenantIdAndWorkerId(tenantId, subjectId)
                    .orElseGet(() -> ProfessionalReputationEntity.builder()
                            .id(UUID.randomUUID())
                            .tenantId(tenantId)
                            .workerId(subjectId)
                            .score(0.0)
                            .build());
            prevScore = score.getScore();
            newScore = applyBounds(prevScore + signal.getReputationImpact(), ScoreBounds.MIN_REPUTATION_SCORE, ScoreBounds.MAX_REPUTATION_SCORE);
            score.setScore(newScore);
            score.setCalculationVersion(signalDef.getCalculationVersion());
            score.setUpdatedAt(LocalDateTime.now());
            professionalRepo.save(score);
        } else if ("TEAM".equals(subjectType)) {
            var score = teamRepo.findByTenantIdAndTeamId(tenantId, subjectId)
                    .orElseGet(() -> TeamReputationEntity.builder()
                            .id(UUID.randomUUID())
                            .tenantId(tenantId)
                            .teamId(subjectId)
                            .score(0.0)
                            .build());
            prevScore = score.getScore();
            newScore = applyBounds(prevScore + signal.getReputationImpact(), ScoreBounds.MIN_REPUTATION_SCORE, ScoreBounds.MAX_REPUTATION_SCORE);
            score.setScore(newScore);
            score.setCalculationVersion(signalDef.getCalculationVersion());
            score.setUpdatedAt(LocalDateTime.now());
            teamRepo.save(score);
        } else if ("COMPANY".equals(subjectType)) {
            var score = companyRepo.findByTenantIdAndCompanyId(tenantId, subjectId)
                    .orElseGet(() -> CompanyReputationEntity.builder()
                            .id(UUID.randomUUID())
                            .tenantId(tenantId)
                            .companyId(subjectId)
                            .score(0.0)
                            .build());
            prevScore = score.getScore();
            newScore = applyBounds(prevScore + signal.getReputationImpact(), ScoreBounds.MIN_REPUTATION_SCORE, ScoreBounds.MAX_REPUTATION_SCORE);
            score.setScore(newScore);
            score.setCalculationVersion(signalDef.getCalculationVersion());
            score.setUpdatedAt(LocalDateTime.now());
            companyRepo.save(score);
        }

        // 7. Save History
        historyRepository.save(ReputationScoreHistoryEntity.builder()
                .id(UUID.randomUUID())
                .tenantId(tenantId)
                .subjectId(subjectId)
                .subjectType(subjectType)
                .previousScore(prevScore)
                .newScore(newScore)
                .signalId(signal.getId().toString())
                .calculationVersion(signalDef.getCalculationVersion())
                .timestamp(LocalDateTime.now())
                .build());

        // 8. Emit Outbox Event
        try {
            OutboxEvent outbox = OutboxEvent.builder()
                    .eventId(UUID.randomUUID().toString())
                    .eventType("reputation.updated.v1")
                    .topic("workforce.reputation")
                    .tenantId(tenantId)
                    .payload(objectMapper.writeValueAsString(Map.of(
                            "subjectId", subjectId,
                            "subjectType", subjectType,
                            "newScore", newScore,
                            "causationId", sourceEventId
                    )))
                    .createdAt(LocalDateTime.now())
                    .status(EventStatus.PENDING)
                    .retryCount(0)
                    .build();
            outboxEventRepository.save(outbox);
        } catch (Exception e) {
            log.error("Failed to serialize outbox event for reputation update", e);
        }
    }

    private double applyBounds(double val, double min, double max) {
        if (val < min) return min;
        if (val > max) return max;
        return val;
    }

    private String calculateSha256(String input) {
        try {
            java.security.MessageDigest digest = java.security.MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder(2 * hash.length);
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (java.security.NoSuchAlgorithmException e) {
            throw new RuntimeException("Failed to calculate SHA-256", e);
        }
    }
}
