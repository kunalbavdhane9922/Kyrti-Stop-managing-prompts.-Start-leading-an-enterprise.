package com.saep.governance.validation;

import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class ProposalValidatorFactory {

    private final Map<String, ProposalPayloadValidator> validators;

    public ProposalValidatorFactory(List<ProposalPayloadValidator> validatorList) {
        validators = validatorList.stream()
                .collect(Collectors.toMap(ProposalPayloadValidator::getSupportedType, v -> v));
    }

    public void validatePayload(String type, String payload) {
        ProposalPayloadValidator validator = validators.get(type);
        if (validator == null) {
            throw new IllegalArgumentException("Unsupported proposal type: " + type);
        }
        validator.validate(payload);
    }
}
