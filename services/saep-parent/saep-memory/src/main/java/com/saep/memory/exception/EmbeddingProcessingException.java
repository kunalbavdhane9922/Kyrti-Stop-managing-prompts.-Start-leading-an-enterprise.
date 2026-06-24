package com.saep.memory.exception;

public class EmbeddingProcessingException extends MemoryException {
    public EmbeddingProcessingException(String message, Throwable cause) {
        super(message, "MEMORY_004", cause);
    }
}
