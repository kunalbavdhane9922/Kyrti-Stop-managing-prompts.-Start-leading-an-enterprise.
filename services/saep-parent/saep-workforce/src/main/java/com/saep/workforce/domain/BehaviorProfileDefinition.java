package com.saep.workforce.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class BehaviorProfileDefinition {

    @JsonProperty("reasoning_profile")
    private ReasoningProfile reasoningProfile;

    @JsonProperty("communication_profile")
    private CommunicationProfile communicationProfile;

    @JsonProperty("decision_profile")
    private DecisionProfile decisionProfile;

    @JsonProperty("collaboration_profile")
    private CollaborationProfile collaborationProfile;

    @JsonProperty("learning_profile")
    private LearningProfile learningProfile;

    @Data
    public static class ReasoningProfile {
        @JsonProperty("reasoning_type")
        private String reasoningType;
        @JsonProperty("planning_depth")
        private String planningDepth;
        @JsonProperty("risk_tolerance")
        private String riskTolerance;
    }

    @Data
    public static class CommunicationProfile {
        @JsonProperty("communication_style")
        private String communicationStyle;
        @JsonProperty("detail_level")
        private String detailLevel;
        @JsonProperty("reporting_style")
        private String reportingStyle;
    }

    @Data
    public static class DecisionProfile {
        @JsonProperty("decision_speed")
        private String decisionSpeed;
        @JsonProperty("approval_requirements")
        private String approvalRequirements;
        @JsonProperty("risk_preference")
        private String riskPreference;
    }

    @Data
    public static class CollaborationProfile {
        @JsonProperty("leadership_level")
        private String leadershipLevel;
        @JsonProperty("delegation_style")
        private String delegationStyle;
        @JsonProperty("coordination_scope")
        private String coordinationScope;
    }

    @Data
    public static class LearningProfile {
        @JsonProperty("learning_speed")
        private String learningSpeed;
        @JsonProperty("specialization_preference")
        private String specializationPreference;
        @JsonProperty("adaptation_rate")
        private String adaptationRate;
    }
}
