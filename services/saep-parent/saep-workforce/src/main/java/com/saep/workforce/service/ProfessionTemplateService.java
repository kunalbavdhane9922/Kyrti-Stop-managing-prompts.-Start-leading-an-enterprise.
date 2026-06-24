package com.saep.workforce.service;

import com.saep.workforce.domain.ProfessionTemplateDefinition;
import com.saep.workforce.domain.ProfessionTemplateEntity;
import com.saep.workforce.repository.ProfessionTemplateRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProfessionTemplateService {

    private final ProfessionTemplateRepository repository;

    @Transactional
    public ProfessionTemplateEntity createTemplate(String tenantId, String professionCode, String professionName, 
                                                   String category, ProfessionTemplateDefinition definition, String createdBy) {
        
        validateDefinition(definition);
        List<ProfessionTemplateEntity> existingVersions = repository.findByTenantIdAndProfessionCode(tenantId, professionCode);
        
        int newVersion = 1;
        String supersedesId = null;
        
        if (!existingVersions.isEmpty()) {
            newVersion = existingVersions.stream().mapToInt(ProfessionTemplateEntity::getTemplateVersion).max().orElse(0) + 1;
            
            // Find the currently active one to set as superseded (though it doesn't deactivate it until explicit activation)
            Optional<ProfessionTemplateEntity> activeOpt = repository.findByTenantIdAndProfessionCodeAndActiveFlagTrue(tenantId, professionCode);
            if (activeOpt.isPresent()) {
                supersedesId = activeOpt.get().getId().toString();
            }
        }
        
        ProfessionTemplateEntity template = ProfessionTemplateEntity.builder()
                .id(UUID.randomUUID())
                .tenantId(tenantId)
                .professionCode(professionCode)
                .professionName(professionName)
                .category(category)
                .templateVersion(newVersion)
                .activeFlag(existingVersions.isEmpty()) // Auto-activate if it's the very first version
                .definition(definition)
                .createdAt(LocalDateTime.now())
                .createdBy(createdBy)
                .supersedesTemplateId(supersedesId)
                .build();
                
        return repository.save(template);
    }

    @Transactional
    public ProfessionTemplateEntity activateVersion(String tenantId, String professionCode, Integer version) {
        // Find the template to activate
        ProfessionTemplateEntity templateToActivate = repository.findByTenantIdAndProfessionCodeAndTemplateVersion(tenantId, professionCode, version)
                .orElseThrow(() -> new IllegalArgumentException("Template version not found"));
                
        // Deactivate currently active one
        repository.findByTenantIdAndProfessionCodeAndActiveFlagTrue(tenantId, professionCode)
                .ifPresent(active -> {
                    active.setActiveFlag(false);
                    repository.save(active);
                });
                
        templateToActivate.setActiveFlag(true);
        return repository.save(templateToActivate);
    }

    private void validateDefinition(ProfessionTemplateDefinition definition) {
        if (definition != null && definition.getPromotionModel() != null) {
            var model = definition.getPromotionModel();
            
            // Validate thresholds
            if (model.getPromotionThreshold() == null || model.getPromotionThreshold().compareTo(java.math.BigDecimal.ZERO) < 0 || model.getPromotionThreshold().compareTo(new java.math.BigDecimal("100")) > 0) {
                throw new IllegalArgumentException("Promotion threshold must be between 0 and 100");
            }
            if (model.getStrongCandidateThreshold() == null || model.getStrongCandidateThreshold().compareTo(java.math.BigDecimal.ZERO) < 0 || model.getStrongCandidateThreshold().compareTo(new java.math.BigDecimal("100")) > 0) {
                throw new IllegalArgumentException("Strong candidate threshold must be between 0 and 100");
            }
            
            // Validate weights sum to 100
            java.math.BigDecimal totalWeight = java.math.BigDecimal.ZERO;
            if (model.getExperienceWeight() != null) totalWeight = totalWeight.add(model.getExperienceWeight());
            if (model.getReputationWeight() != null) totalWeight = totalWeight.add(model.getReputationWeight());
            if (model.getWorkforceWeight() != null) totalWeight = totalWeight.add(model.getWorkforceWeight());
            
            if (model.getWeights() != null) {
                for (java.math.BigDecimal weight : model.getWeights().values()) {
                    if (weight != null) {
                        totalWeight = totalWeight.add(weight);
                    }
                }
            }
            
            if (totalWeight.compareTo(new java.math.BigDecimal("100")) != 0) {
                throw new IllegalArgumentException("Promotion model weights must sum exactly to 100");
            }
        }
    }
}
