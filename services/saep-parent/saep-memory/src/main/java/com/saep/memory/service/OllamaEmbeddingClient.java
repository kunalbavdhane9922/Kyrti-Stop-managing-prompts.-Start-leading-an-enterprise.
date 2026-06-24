package com.saep.memory.service;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OllamaEmbeddingClient {

    private static final Logger log = LoggerFactory.getLogger(OllamaEmbeddingClient.class);

    @Value("${saep.ollama.url}")
    private String ollamaUrl;

    @Value("${saep.ollama.embedding.model}")
    private String embeddingModel;

    private final RestTemplate restTemplate;
    private final MeterRegistry meterRegistry;

    public OllamaEmbeddingClient(RestTemplate restTemplate, MeterRegistry meterRegistry) {
        this.restTemplate = restTemplate;
        this.meterRegistry = meterRegistry;
    }

    @CircuitBreaker(name = "ollamaCircuitBreaker", fallbackMethod = "embeddingFallback")
    @Retry(name = "ollamaRetry")
    public List<Double> generateEmbedding(String text) {
        String endpoint = ollamaUrl + "/api/embeddings";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", embeddingModel);
        requestBody.put("prompt", text);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        Timer.Sample sample = Timer.start(meterRegistry);
        try {
            Map<String, Object> response = restTemplate.postForObject(endpoint, request, Map.class);
            sample.stop(meterRegistry.timer("ollama.embedding.generation.duration"));
            
            if (response != null && response.containsKey("embedding")) {
                return (List<Double>) response.get("embedding");
            }
        } catch (Exception e) {
            meterRegistry.counter("ollama.embedding.generation.failures").increment();
            throw e;
        }

        throw new com.saep.memory.exception.EmbeddingProcessingException("Embedding generation failed, empty response", null);
    }

    private List<Double> embeddingFallback(String text, Throwable ex) {
        log.error("Ollama circuit breaker triggered or retries exhausted. Failed to generate embeddings. Reason: {}", ex.getMessage());
        meterRegistry.counter("ollama.embedding.circuitbreaker.fallback").increment();
        
        throw new com.saep.memory.exception.EmbeddingProcessingException("Embedding generation unavailable: " + ex.getMessage(), ex);
    }

    public String getEmbeddingModel() {
        return embeddingModel;
    }
}
