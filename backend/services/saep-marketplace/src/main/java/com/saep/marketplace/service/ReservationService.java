package com.saep.marketplace.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.saep.marketplace.domain.AgentStatus;
import com.saep.marketplace.domain.MarketplaceAgentEntity;
import com.saep.marketplace.domain.events.v1.AgentReservationExpiredEvent;
import com.saep.marketplace.repository.MarketplaceRepository;
import com.saep.outbox.domain.EventStatus;
import com.saep.outbox.domain.OutboxEvent;
import com.saep.outbox.repository.OutboxEventRepository;
import io.micrometer.core.instrument.MeterRegistry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class ReservationService {

    private static final Logger log = LoggerFactory.getLogger(ReservationService.class);

    private final MarketplaceRepository agentRepository;
    private final AgentLifecycleStateMachine stateMachine;
    private final OutboxEventRepository outboxEventRepository;
    private final ObjectMapper objectMapper;
    private final MeterRegistry meterRegistry;

    public ReservationService(MarketplaceRepository agentRepository,
                              AgentLifecycleStateMachine stateMachine,
                              OutboxEventRepository outboxEventRepository,
                              ObjectMapper objectMapper,
                              MeterRegistry meterRegistry) {
        this.agentRepository = agentRepository;
        this.stateMachine = stateMachine;
        this.outboxEventRepository = outboxEventRepository;
        this.objectMapper = objectMapper;
        this.meterRegistry = meterRegistry;
    }

    @Transactional
    public void reserveAgent(String agentId, UUID tenantId, Instant expirationTime) {
        MarketplaceAgentEntity agent = agentRepository.findByIdAndTenantId(agentId, tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Agent not found"));
        
        stateMachine.transitionToReserved(agent, tenantId, expirationTime);
        // Note: For production, MarketplaceAgentEntity should have `reservedUntil`, `reservedByTenantId`, `reservationId`
        // We simulate saving those properties logic handled in the updated StateMachine or domain.
        agentRepository.save(agent);
        log.info("Agent {} reserved by tenant {} until {}", agentId, tenantId, expirationTime);
    }

    /**
     * Scheduled job to recover expired reservations and release agents back to AVAILABLE.
     */
    @Scheduled(fixedRate = 60000) // Run every 60 seconds
    @Transactional
    public void recoverExpiredReservations() {
        log.info("Running scheduled recovery for expired agent reservations");
        // Process in batches of 100 to prevent memory bloat
        List<MarketplaceAgentEntity> expiredReservations = agentRepository.findExpiredReservations(Instant.now(), 100);

        for (MarketplaceAgentEntity agent : expiredReservations) {
            try {
                // Strict validation
                if (agent.getStatus() != AgentStatus.RESERVED) {
                    log.warn("Agent {} is no longer in RESERVED state, skipping recovery.", agent.getId());
                    continue;
                }

                log.info("Recovering expired reservation for agent {}", agent.getId());
                
                // Clear state
                stateMachine.transitionToAvailable(agent);
                agentRepository.save(agent);
                
                // Emit event
                String eventId = UUID.randomUUID().toString();
                String occurredAt = Instant.now().toString();
                AgentReservationExpiredEvent expiredEvent = AgentReservationExpiredEvent.builder()
                        .eventId(eventId)
                        .correlationId(agent.getReservationId() != null ? agent.getReservationId() : agent.getId())
                        .causationId(eventId)
                        .tenantId(agent.getReservedByTenantId() != null ? agent.getReservedByTenantId() : agent.getTenantId())
                        .agentId(agent.getId())
                        .occurredAt(occurredAt)
                        .version(1)
                        .build();

                OutboxEvent outboxEvent = OutboxEvent.builder()
                        .eventId(eventId)
                        .eventType("agent.reservation.expired.v1")
                        .topic("marketplace.events")
                        .tenantId(agent.getTenantId().toString())
                        .payload(objectMapper.writeValueAsString(expiredEvent))
                        .createdAt(LocalDateTime.now())
                        .status(EventStatus.PENDING)
                        .retryCount(0)
                        .build();
                        
                outboxEventRepository.save(outboxEvent);
                
                meterRegistry.counter("marketplace.reservations.recovered").increment();

            } catch (Exception e) {
                log.error("Failed to recover expired reservation for agent {}", agent.getId(), e);
                // Intentionally catching per-agent so one failure doesn't halt the entire batch
            }
        }
    }
}
