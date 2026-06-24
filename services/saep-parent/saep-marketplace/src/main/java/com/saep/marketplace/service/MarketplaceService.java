package com.saep.marketplace.service;

import com.saep.marketplace.domain.MarketplaceAgentEntity;
import com.saep.marketplace.repository.MarketplaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
public class MarketplaceService {

    private final MarketplaceRepository repository;

    public List<MarketplaceAgentEntity> getAllAgents() {
        return repository.findAll();
    }

    public Map<String, Object> getFilters() {
        Map<String, Object> filters = new HashMap<>();
        filters.put("skills", Arrays.asList("Python", "React", "Node.js", "PostgreSQL", "SEO", "Copywriting", "Social Media", "Market Analysis", "Forecasting", "ETL", "Spark", "Data Modeling", "ML Pipelines", "Contract Review", "Compliance", "Vulnerability Scan", "Incident Response"));
        filters.put("specializations", Arrays.asList("Full-Stack Engineering", "Business Strategy", "Content Marketing", "Data Engineering", "Legal Documentation", "Security Operations"));
        return filters;
    }

    @Transactional
    public Map<String, Object> hireAgent(String agentId, int trialDays, String tenantId) {
        // In a real ecosystem, this would communicate with saep-workforce 
        // to instantiate the agent and decrement balance from saep-treasury.
        
        Optional<MarketplaceAgentEntity> opt = repository.findById(agentId);
        if (opt.isEmpty()) {
            throw new IllegalArgumentException("Agent not found in marketplace.");
        }
        
        MarketplaceAgentEntity agent = opt.get();
        if (!agent.getIsAvailable()) {
            throw new IllegalStateException("Agent is already deployed.");
        }

        // Mark as deployed
        agent.setIsAvailable(false);
        repository.save(agent);

        Map<String, Object> hireRecord = new HashMap<>();
        hireRecord.put("id", "hire_" + UUID.randomUUID().toString().substring(0, 8));
        hireRecord.put("agentId", agentId);
        hireRecord.put("status", "sandbox_active");
        hireRecord.put("trialDays", trialDays);
        hireRecord.put("tenantId", tenantId);
        hireRecord.put("startedAt", Instant.now().toString());
        
        Map<String, Object> restrictions = new HashMap<>();
        restrictions.put("treasuryAccess", false);
        restrictions.put("companyMemoryAccess", false);
        restrictions.put("environment", "pre-production");
        restrictions.put("tier", 0);
        
        hireRecord.put("restrictions", restrictions);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("hire", hireRecord);
        return response;
    }
}
