package com.saep.governance.validation;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ValidatorConfig {
    
    @Bean
    public ProposalPayloadValidator hiringValidator() {
        return new GenericProposalValidator("HIRING");
    }

    @Bean
    public ProposalPayloadValidator terminationValidator() {
        return new GenericProposalValidator("TERMINATION");
    }

    @Bean
    public ProposalPayloadValidator policyValidator() {
        return new GenericProposalValidator("POLICY");
    }

    @Bean
    public ProposalPayloadValidator permissionValidator() {
        return new GenericProposalValidator("PERMISSION");
    }

    @Bean
    public ProposalPayloadValidator organizationValidator() {
        return new GenericProposalValidator("ORGANIZATION");
    }

    @Bean
    public ProposalPayloadValidator agentLifecycleValidator() {
        return new GenericProposalValidator("AGENT_LIFECYCLE");
    }

    @Bean
    public ProposalPayloadValidator executiveHireValidator() {
        return new GenericProposalValidator("EXECUTIVE_HIRE");
    }
}
