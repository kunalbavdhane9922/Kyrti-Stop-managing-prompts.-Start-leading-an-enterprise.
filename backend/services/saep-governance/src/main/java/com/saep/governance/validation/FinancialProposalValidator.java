package com.saep.governance.validation;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

@Component
public class FinancialProposalValidator implements ProposalPayloadValidator {
    
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String getSupportedType() {
        return "FINANCIAL";
    }

    @Override
    public void validate(String payload) {
        try {
            JsonNode node = objectMapper.readTree(payload);
            if (!node.has("amount") || node.get("amount").asDouble() <= 0) {
                throw new IllegalArgumentException("Financial proposal requires positive amount");
            }
            if (!node.has("destinationAccount") || node.get("destinationAccount").asText().isBlank()) {
                throw new IllegalArgumentException("Financial proposal requires destinationAccount");
            }
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid FINANCIAL payload: " + e.getMessage());
        }
    }
}
