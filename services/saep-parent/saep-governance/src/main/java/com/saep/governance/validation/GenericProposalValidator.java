package com.saep.governance.validation;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

@Component
public class GenericProposalValidator implements ProposalPayloadValidator {
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String type;

    public GenericProposalValidator(String type) {
        this.type = type;
    }

    @Override
    public String getSupportedType() {
        return type;
    }

    @Override
    public void validate(String payload) {
        try {
            objectMapper.readTree(payload);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid JSON payload for type " + type + ": " + e.getMessage());
        }
    }
}
