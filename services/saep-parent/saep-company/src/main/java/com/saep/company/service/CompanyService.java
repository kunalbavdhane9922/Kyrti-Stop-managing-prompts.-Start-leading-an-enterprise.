package com.saep.company.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.saep.common.event.DomainEvents;
import com.saep.common.event.EventEnvelope;
import com.saep.company.domain.CompanyEntity;
import com.saep.company.repository.CompanyRepository;
import com.saep.outbox.domain.EventStatus;
import com.saep.outbox.domain.OutboxEvent;
import com.saep.outbox.repository.OutboxEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final OutboxEventRepository outboxEventRepository;
    private final ObjectMapper objectMapper;

    @org.springframework.beans.factory.annotation.Value("${saep.test.force-producer-failure:false}")
    private boolean forceProducerFailure;

    @Transactional
    public CompanyEntity createCompany(String name, String domain, String tenantId, String createdBy) {
        CompanyEntity company = CompanyEntity.builder()
                .id(UUID.randomUUID().toString())
                .name(name)
                .domain(domain)
                .tenantId(tenantId)
                .build();

        companyRepository.save(company);

        DomainEvents.CompanyCreated payload = new DomainEvents.CompanyCreated(
                company.getId(),
                company.getName(),
                company.getDomain(),
                createdBy
        );

        EventEnvelope<DomainEvents.CompanyCreated> envelope = EventEnvelope.wrap(
                payload,
                "CompanyCreated",
                DomainEvents.VERSION_1,
                tenantId
        );

        try {
            String payloadJson = objectMapper.writeValueAsString(envelope);

            OutboxEvent outboxEvent = OutboxEvent.builder()
                    .eventId(envelope.getEventId())
                    .eventType(envelope.getEventType())
                    .topic("company.created")
                    .tenantId(envelope.getTenantId())
                    .payload(payloadJson)
                    .createdAt(LocalDateTime.now())
                    .status(EventStatus.PENDING)
                    .retryCount(0)
                    .build();

            outboxEventRepository.save(outboxEvent);

            if (forceProducerFailure) {
                throw new RuntimeException("Forced producer failure for Level 4 testing");
            }
            
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize event", e);
        }

        return company;
    }
}
