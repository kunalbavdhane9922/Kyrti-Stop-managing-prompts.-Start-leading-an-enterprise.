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
public class WorkforceScoringService {

    private final ProcessedSignalRepository processedSignalRepository;
    private final EvidenceRecordRepository evidenceRecordRepository;
    private final SignalDefinitionRepository signalDefinitionRepository;
    private final WorkforceSignalRepository workforceSignalRepository;
    private final WorkforceScoreRepository workforceScoreRepository;
    private final WorkforceScoreHistoryRepository historyRepository;
    private final OutboxEventRepository outboxEventRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public void processSignal(String tenantId, String sourceEventId, String sourceSystem, String sourceType, 
                              String workerId, String signalCode, JsonNode payload) {
        
        // 1. Check Idempotency
        if (processedSignalRepository.existsByTenantIdAndSourceEventId(tenantId, sourceEventId)) {
            log.info("Signal {} already processed for tenant {}", sourceEventId, tenantId);
            return;
        }

        // 2. Fetch Signal Definition
        var signalDefOpt = signalDefinitionRepository.findByTenantIdAndSignalCodeAndActiveFlagTrue(tenantId, signalCode);
        if (signalDefOpt.isEmpty()) {
            log.warn("Active signal definition not found for code {}", signalCode);
            // Optionally, we could still save evidence, but we'll ignore processing for now.
            return;
        }
        var signalDef = signalDefOpt.get();

        String payloadStr = payload != null ? payload.toString() : "{}";
        String payloadHash = calculateSha256(payloadStr);

        // 3. Save Immutable Evidence
        EvidenceRecordEntity evidence = EvidenceRecordEntity.builder()
                .id(UUID.randomUUID())
                .tenantId(tenantId)
                .workerId(workerId)
                .sourceEventId(sourceEventId)
                .sourceSystem(sourceSystem)
                .sourceType(sourceType)
                .payload(payloadStr)
                .payloadHash(payloadHash)
                .occurredAt(LocalDateTime.now())
                .recordedAt(LocalDateTime.now())
                .build();
        evidenceRecordRepository.save(evidence);

        // 4. Create Workforce Signal
        WorkforceSignalEntity signal = WorkforceSignalEntity.builder()
                .id(UUID.randomUUID())
                .tenantId(tenantId)
                .workerId(workerId)
                .evidenceId(evidence.getId().toString())
                .signalDefinitionId(signalDef.getId().toString())
                .capabilityImpact(signalDef.getCapabilityWeight())
                .skillImpact(signalDef.getSkillWeight())
                .readinessImpact(signalDef.getReadinessWeight())
                .occurredAt(LocalDateTime.now())
                .appliedAt(LocalDateTime.now())
                .build();
        workforceSignalRepository.save(signal);

        // 5. Save Processed Idempotency Record
        processedSignalRepository.save(ProcessedSignalEntity.builder()
                .id(UUID.randomUUID())
                .tenantId(tenantId)
                .sourceEventId(sourceEventId)
                .internalSignalId(signal.getId().toString())
                .processedAt(LocalDateTime.now())
                .build());

        // 6. Update Score
        var score = workforceScoreRepository.findByTenantIdAndWorkerId(tenantId, workerId)
                .orElseGet(() -> WorkforceScoreEntity.builder()
                        .id(UUID.randomUUID())
                        .tenantId(tenantId)
                        .workerId(workerId)
                        .capabilityScore(0.0)
                        .skillScore(0.0)
                        .readinessScore(0.0)
                        .calculationVersion(signalDef.getCalculationVersion())
                        .build());

        double prevCap = score.getCapabilityScore();
        double prevSkill = score.getSkillScore();
        double prevRead = score.getReadinessScore();

        score.setCapabilityScore(applyBounds(prevCap + (signal.getCapabilityImpact() != null ? signal.getCapabilityImpact() : 0.0), ScoreBounds.MIN_CAPABILITY_SCORE, ScoreBounds.MAX_CAPABILITY_SCORE));
        score.setSkillScore(applyBounds(prevSkill + (signal.getSkillImpact() != null ? signal.getSkillImpact() : 0.0), ScoreBounds.MIN_SKILL_SCORE, ScoreBounds.MAX_SKILL_SCORE));
        score.setReadinessScore(applyBounds(prevRead + (signal.getReadinessImpact() != null ? signal.getReadinessImpact() : 0.0), ScoreBounds.MIN_READINESS_SCORE, ScoreBounds.MAX_READINESS_SCORE));
        score.setUpdatedAt(LocalDateTime.now());
        score.setCalculationVersion(signalDef.getCalculationVersion());
        
        workforceScoreRepository.save(score);

        // 7. Save History
        historyRepository.save(WorkforceScoreHistoryEntity.builder()
                .id(UUID.randomUUID())
                .tenantId(tenantId)
                .workerId(workerId)
                .previousCapabilityScore(prevCap)
                .newCapabilityScore(score.getCapabilityScore())
                .previousSkillScore(prevSkill)
                .newSkillScore(score.getSkillScore())
                .previousReadinessScore(prevRead)
                .newReadinessScore(score.getReadinessScore())
                .signalId(signal.getId().toString())
                .calculationVersion(signalDef.getCalculationVersion())
                .timestamp(LocalDateTime.now())
                .build());

        // 8. Emit Outbox Event
        try {
            OutboxEvent outbox = OutboxEvent.builder()
                    .eventId(UUID.randomUUID().toString())
                    .eventType("workforce.score.updated.v1")
                    .topic("workforce.scores")
                    .tenantId(tenantId)
                    .payload(objectMapper.writeValueAsString(Map.of(
                            "workerId", workerId,
                            "capabilityScore", score.getCapabilityScore(),
                            "skillScore", score.getSkillScore(),
                            "readinessScore", score.getReadinessScore(),
                            "causationId", sourceEventId
                    )))
                    .createdAt(LocalDateTime.now())
                    .status(EventStatus.PENDING)
                    .retryCount(0)
                    .build();
            outboxEventRepository.save(outbox);
        } catch (Exception e) {
            log.error("Failed to serialize outbox event for score update", e);
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
