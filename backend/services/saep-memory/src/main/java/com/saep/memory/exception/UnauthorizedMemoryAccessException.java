package com.saep.memory.exception;

public class UnauthorizedMemoryAccessException extends MemoryException {
    public UnauthorizedMemoryAccessException(String message) {
        super(message, "MEMORY_003");
    }
}
