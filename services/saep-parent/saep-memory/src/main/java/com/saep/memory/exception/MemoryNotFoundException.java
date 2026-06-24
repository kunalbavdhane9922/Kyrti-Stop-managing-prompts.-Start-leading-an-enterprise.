package com.saep.memory.exception;

public class MemoryNotFoundException extends MemoryException {
    public MemoryNotFoundException(String message) {
        super(message, "MEMORY_001");
    }
}
