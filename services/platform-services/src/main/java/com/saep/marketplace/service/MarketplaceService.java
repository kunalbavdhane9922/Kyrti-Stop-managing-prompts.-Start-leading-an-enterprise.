package com.saep.marketplace.service;

import com.saep.marketplace.domain.ProfessionTemplate;
import com.saep.marketplace.repository.ProfessionTemplateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MarketplaceService {

    private final ProfessionTemplateRepository templateRepository;

    @Transactional(readOnly = true)
    public List<ProfessionTemplate> getAllTemplates() {
        return templateRepository.findAll();
    }

    @Transactional
    public ProfessionTemplate createTemplate(ProfessionTemplate template) {
        // Here we would also fire a ProfessionCreated Kafka Event using the Outbox pattern.
        return templateRepository.save(template);
    }
}
