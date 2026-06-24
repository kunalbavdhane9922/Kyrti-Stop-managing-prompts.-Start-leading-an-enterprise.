package com.saep.governance.validation;

public interface ProposalPayloadValidator {
    String getSupportedType();
    void validate(String payload);
}
