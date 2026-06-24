package com.saep.marketplace.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.stereotype.Component;

@Component
public class SnapshotSanitizer {

    private final ObjectMapper objectMapper;

    public SnapshotSanitizer(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    /**
     * Removes sensitive PII or security tokens from agent snapshots before saving to Career History.
     */
    public String sanitizeAgentSnapshot(String rawJson) {
        try {
            JsonNode root = objectMapper.readTree(rawJson);
            if (root.isObject()) {
                ObjectNode obj = (ObjectNode) root;
                obj.remove("api_key");
                obj.remove("access_token");
                obj.remove("credentials");
            }
            return objectMapper.writeValueAsString(root);
        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to parse and sanitize snapshot JSON", e);
        }
    }
}
