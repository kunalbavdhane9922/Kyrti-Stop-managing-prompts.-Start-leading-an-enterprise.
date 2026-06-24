package com.saep.memory.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ChunkingStrategy {

    @Value("${saep.memory.chunking.max-tokens:512}")
    private int maxTokens;

    @Value("${saep.memory.chunking.overlap:50}")
    private int overlap;

    // Simple estimation: 1 token ~= 4 characters
    private int getMaxChars() {
        return maxTokens * 4;
    }

    private int getOverlapChars() {
        return overlap * 4;
    }

    public List<String> splitText(String text) {
        List<String> chunks = new ArrayList<>();
        if (text == null || text.trim().isEmpty()) {
            return chunks;
        }

        int maxChars = getMaxChars();
        int overlapChars = getOverlapChars();
        int step = maxChars - overlapChars;
        if (step <= 0) {
            step = maxChars; // Fallback to prevent infinite loop if overlap is too large
        }

        int length = text.length();
        for (int i = 0; i < length; i += step) {
            int end = Math.min(i + maxChars, length);
            
            // Try to snap to the nearest word boundary if possible, for better semantics
            if (end < length) {
                int lastSpace = text.lastIndexOf(' ', end);
                if (lastSpace > i + overlapChars) {
                    end = lastSpace;
                }
            }
            
            chunks.add(text.substring(i, end).trim());
            
            // Adjust loop step based on where we actually ended to maintain proper overlap
            if (end < length) {
                i = end - step - overlapChars;
                if(i < 0) i = 0; // prevent negative index
            }
        }

        return chunks;
    }
}
