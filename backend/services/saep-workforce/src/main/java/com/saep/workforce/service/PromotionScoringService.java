package com.saep.workforce.service;

import com.saep.workforce.domain.PromotionModelDefinition;
import com.saep.workforce.domain.WorkerEntity;
import com.saep.workforce.dto.PromotionEligibilityDto;
import com.saep.workforce.repository.WorkerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PromotionScoringService {

    private final WorkerRepository workerRepository;

    public PromotionEligibilityDto calculateEligibility(String tenantId, String workerId) {
        WorkerEntity worker = workerRepository.findByTenantIdAndId(tenantId, UUID.fromString(workerId))
                .orElseThrow(() -> new IllegalArgumentException("Worker not found"));

        if (worker.getOriginTemplateSnapshot() == null || worker.getOriginTemplateSnapshot().getPromotionModel() == null) {
            return PromotionEligibilityDto.builder()
                    .totalScore(0.0)
                    .requiredThreshold(0.0)
                    .eligible(false)
                    .eligibilityStatus("Not Eligible (No Model)")
                    .build();
        }

        PromotionModelDefinition model = worker.getOriginTemplateSnapshot().getPromotionModel();
        
        // Experience logic (simplified heuristic: task completion ratio if > 0 tasks)
        double taskExperienceScore = 0.0;
        int totalTasks = (worker.getCompletedTaskCount() != null ? worker.getCompletedTaskCount() : 0) + 
                         (worker.getFailedTaskCount() != null ? worker.getFailedTaskCount() : 0);
        if (totalTasks > 0) {
            taskExperienceScore = ((double) worker.getCompletedTaskCount() / totalTasks) * 100.0;
        }

        // Reputation score out of 10000 normally, let's normalize to 100 for formula
        double reputationScoreNorm = (worker.getCurrentReputationScore() != null ? worker.getCurrentReputationScore() : 0.0) / 100.0;
        if (reputationScoreNorm > 100.0) reputationScoreNorm = 100.0;
        if (reputationScoreNorm < 0.0) reputationScoreNorm = 0.0;

        // Workforce capability score out of 10000, normalized to 100
        double capabilityScoreNorm = (worker.getCurrentCapabilityScore() != null ? worker.getCurrentCapabilityScore() : 0.0) / 100.0;
        if (capabilityScoreNorm > 100.0) capabilityScoreNorm = 100.0;
        if (capabilityScoreNorm < 0.0) capabilityScoreNorm = 0.0;

        double experienceWeight = model.getExperienceWeight() != null ? model.getExperienceWeight().doubleValue() : 0.0;
        double reputationWeight = model.getReputationWeight() != null ? model.getReputationWeight().doubleValue() : 0.0;
        double workforceWeight = model.getWorkforceWeight() != null ? model.getWorkforceWeight().doubleValue() : 0.0;

        double totalScore = (taskExperienceScore * (experienceWeight / 100.0)) +
                            (reputationScoreNorm * (reputationWeight / 100.0)) +
                            (capabilityScoreNorm * (workforceWeight / 100.0));

        // Note: Additional custom weights in model.getWeights() would be processed here for V2/V3
        
        double requiredThreshold = model.getPromotionThreshold() != null ? model.getPromotionThreshold().doubleValue() : 100.0;
        double strongThreshold = model.getStrongCandidateThreshold() != null ? model.getStrongCandidateThreshold().doubleValue() : 100.0;

        boolean eligible = totalScore >= requiredThreshold;
        String status = "Not Eligible";
        
        if (totalScore >= strongThreshold) {
            status = "Strong Promotion Candidate";
        } else if (eligible) {
            status = "Promotion Candidate";
        } else if (totalScore >= (requiredThreshold * 0.8)) {
            status = "Developing";
        }

        return PromotionEligibilityDto.builder()
                .totalScore(totalScore)
                .requiredThreshold(requiredThreshold)
                .eligible(eligible)
                .eligibilityStatus(status)
                .build();
    }
}
