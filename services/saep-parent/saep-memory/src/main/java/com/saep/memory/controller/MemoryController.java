package com.saep.memory.controller;

import com.saep.common.security.TenantContext;
import com.saep.memory.model.MemoryMetadata;
import com.saep.memory.repository.MemoryMetadataRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/memory")
public class MemoryController {

    private final MemoryMetadataRepository metadataRepository;

    public MemoryController(MemoryMetadataRepository metadataRepository) {
        this.metadataRepository = metadataRepository;
    }

    @PostMapping("/store")
    public ResponseEntity<MemoryMetadata> storeMemory(@RequestBody StoreMemoryRequest request) {
        UUID tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            return ResponseEntity.status(403).build();
        }

        // Generate a naive content hash to represent the vector payload
        String hash = generateHash(request.getContent());

        MemoryMetadata metadata = new MemoryMetadata();
        metadata.setTenantId(tenantId);
        metadata.setProfessionalId(request.getProfessionalId());
        metadata.setContentHash(hash);
        metadata.setSource(request.getSource());

        // In a real implementation, we would synchronously or asynchronously call Qdrant here.
        // For scaffold, we just save the metadata.
        MemoryMetadata saved = metadataRepository.save(metadata);

        return ResponseEntity.status(201).body(saved);
    }

    @PostMapping("/search")
    public ResponseEntity<List<MemoryMetadata>> searchMemory(@RequestBody SearchMemoryRequest request) {
        UUID tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            return ResponseEntity.status(403).build();
        }

        // In a real implementation, we query Qdrant using the text embedding,
        // filtering by tenantId and professionalId, and then return the merged metadata.
        // For scaffold, we return the metadata directly from postgres.
        List<MemoryMetadata> results = metadataRepository.findByTenantIdAndProfessionalId(tenantId, request.getProfessionalId());
        return ResponseEntity.ok(results);
    }

    private String generateHash(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            return UUID.randomUUID().toString(); // Fallback
        }
    }
}

class StoreMemoryRequest {
    private UUID professionalId;
    private String content;
    private String source;

    public UUID getProfessionalId() { return professionalId; }
    public void setProfessionalId(UUID professionalId) { this.professionalId = professionalId; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
}

class SearchMemoryRequest {
    private UUID professionalId;
    private String query;

    public UUID getProfessionalId() { return professionalId; }
    public void setProfessionalId(UUID professionalId) { this.professionalId = professionalId; }
    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }
}
