package com.saep.marketplace.service;

import com.saep.marketplace.domain.SagaInstanceEntity;
import com.saep.marketplace.repository.SagaInstanceRepository; // We'll create this next
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class HireWorkflowSaga {

    private final SagaInstanceRepository sagaInstanceRepository;
    private final AuditEventPublisher auditPublisher;

    @Transactional
    public void initiateHireSaga(String correlationId, String initialPayload, UUID tenantId) {
        log.info("Initiating HireWorkflowSaga for correlationId: {}", correlationId);

        SagaInstanceEntity saga = new SagaInstanceEntity();
        saga.setCorrelationId(correlationId);
        saga.setStatus("STARTED");
        saga.setCurrentStep("MARKETPLACE_RESERVATION");
        saga.setPayload(initialPayload);
        
        sagaInstanceRepository.save(saga);

        auditPublisher.publishAuditEvent(
            "SAGA_STARTED",
            "SYSTEM",
            tenantId,
            saga.getId().toString(),
            "SagaInstance",
            correlationId
        );
        
        // Steps to orchestrate (asynchronous):
        // 1. Reserve Agent
        // 2. Publish to Treasury/Workforce
        // 3. Await Success or Failure
    }

    @Transactional
    public void compensateHireSaga(String correlationId, String reason) {
        log.info("Compensating HireWorkflowSaga for correlationId: {}. Reason: {}", correlationId, reason);

        SagaInstanceEntity saga = sagaInstanceRepository.findByCorrelationId(correlationId)
                .orElseThrow(() -> new IllegalArgumentException("Saga instance not found"));

        saga.setStatus("COMPENSATED");
        saga.setUpdatedAt(Instant.now());
        sagaInstanceRepository.save(saga);

        // Orchestrate compensation actions:
        // 1. Release Reservation (Transition back to AVAILABLE)
        // 2. Publish compensation events
    }

    @Transactional
    public void completeHireSaga(String correlationId) {
        log.info("Completing HireWorkflowSaga for correlationId: {}", correlationId);

        SagaInstanceEntity saga = sagaInstanceRepository.findByCorrelationId(correlationId)
                .orElseThrow(() -> new IllegalArgumentException("Saga instance not found"));

        saga.setStatus("COMPLETED");
        saga.setCurrentStep("HIRE_SUCCESSFUL");
        saga.setUpdatedAt(Instant.now());
        sagaInstanceRepository.save(saga);
    }
}
