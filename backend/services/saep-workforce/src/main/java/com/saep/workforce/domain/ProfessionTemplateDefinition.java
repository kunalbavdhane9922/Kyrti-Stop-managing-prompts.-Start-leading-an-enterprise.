package com.saep.workforce.domain;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class ProfessionTemplateDefinition {
    private List<String> skills;
    private List<String> responsibilities;
    private List<ProfessionPermission> permissions;
    private List<String> careerPath;
    private List<String> learningPaths;
    
    // Typed models for dynamic evaluation rules and behavior profiles
    private EvaluationRulesDefinition evaluationRules;
    private BehaviorProfileDefinition behaviorProfile;
    private PromotionModelDefinition promotionModel;
}
