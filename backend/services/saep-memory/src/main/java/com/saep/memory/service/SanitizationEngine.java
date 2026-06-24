package com.saep.memory.service;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.google.re2j.Matcher;
import com.google.re2j.Pattern;
import com.saep.memory.domain.SanitizationRule;
import com.saep.memory.repository.SanitizationRuleRepository;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
public class SanitizationEngine {

    private final SanitizationRuleRepository sanitizationRuleRepository;
    
    // Caffeine Cache for precompiled RE2J patterns to prevent recompilation on every transfer
    private final Cache<UUID, List<SanitizationRule>> rulesCache;
    private final Cache<String, Pattern> compiledPatternCache;

    public SanitizationEngine(SanitizationRuleRepository sanitizationRuleRepository) {
        this.sanitizationRuleRepository = sanitizationRuleRepository;
        
        this.rulesCache = Caffeine.newBuilder()
                .expireAfterWrite(10, TimeUnit.MINUTES)
                .maximumSize(1000)
                .build();
                
        this.compiledPatternCache = Caffeine.newBuilder()
                .expireAfterWrite(1, TimeUnit.HOURS)
                .maximumSize(5000)
                .build();
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SanitizationResult {
        private String sanitizedText;
        private boolean wasModified;
        private int itemsRedacted;
    }

    public SanitizationResult sanitize(String text, UUID tenantId) {
        if (text == null || text.trim().isEmpty()) {
            return new SanitizationResult(text, false, 0);
        }

        List<SanitizationRule> rules = rulesCache.get(tenantId, 
                key -> sanitizationRuleRepository.findByTenantId(key));

        if (rules == null || rules.isEmpty()) {
            return new SanitizationResult(text, false, 0);
        }

        int redactedCount = 0;
        String result = text;

        for (SanitizationRule rule : rules) {
            Pattern pattern = compiledPatternCache.get(rule.getRegexPattern(), 
                    key -> Pattern.compile(key, Pattern.CASE_INSENSITIVE));

            if (pattern != null) {
                Matcher matcher = pattern.matcher(result);
                int localCount = 0;
                while (matcher.find()) {
                    localCount++;
                }
                if (localCount > 0) {
                    redactedCount += localCount;
                    result = matcher.replaceAll(rule.getReplacementText());
                }
            }
        }

        return new SanitizationResult(result, redactedCount > 0, redactedCount);
    }
}
