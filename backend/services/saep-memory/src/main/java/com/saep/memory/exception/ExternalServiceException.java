package com.saep.memory.exception;

public class ExternalServiceException extends MemoryException {
    public ExternalServiceException(String message) {
        super(message, "EXTERNAL_001");
    }

    public ExternalServiceException(String message, Throwable cause) {
        super(message, "EXTERNAL_001", cause);
    }
}
