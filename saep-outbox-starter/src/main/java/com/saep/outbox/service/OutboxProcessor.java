package com.saep.outbox.service;

import com.saep.outbox.domain.EventStatus;
import com.saep.outbox.domain.OutboxEvent;
import com.saep.outbox.repository.OutboxEventRepository;
import io.micrometer.core.instrument.MeterRegistry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

import java.time.LocalDateTime;
import java.util.List;

import java.util.concurrent.atomic.AtomicLong;
import jakarta.annotation.PostConstruct;

@Slf4j
@Service
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "saep.outbox", name = "enabled", havingValue = "true", matchIfMissing = true)
public class OutboxProcessor {

    private final OutboxEventRepository outboxEventRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final MeterRegistry meterRegistry;
    
    private final AtomicLong pendingEventsGauge = new AtomicLong(0);

    @Value("${saep.outbox.max-retries:15}")
    private int maxRetries;
    
    @Value("${spring.application.name:unknown-service}")
    private String applicationName;

    @PostConstruct
    public void init() {
        meterRegistry.gauge("outbox.pending.total", pendingEventsGauge);
    }
    
    @Scheduled(fixedDelay = 10000)
    public void updatePendingGauge() {
        // Safe, cached metric update every 10 seconds
        long pendingCount = outboxEventRepository.countByStatus(EventStatus.PENDING);
        pendingEventsGauge.set(pendingCount);
    }

    @Scheduled(fixedDelayString = "${saep.outbox.poll-interval-ms:1000}")
    @Transactional
    public void processOutboxEvents() {
        List<OutboxEvent> events = outboxEventRepository.findAndLockNextEvents(
                List.of(EventStatus.PENDING.name(), EventStatus.FAILED.name()),
                100
        );

        for (OutboxEvent event : events) {
            try {
                event.setStatus(EventStatus.PROCESSING);
                event.setLastAttemptAt(LocalDateTime.now());
                outboxEventRepository.save(event); // Mark as processing

                // Send to Kafka, using tenantId as the partition key
                kafkaTemplate.send(event.getTopic(), event.getTenantId(), event.getPayload()).get();

                event.setStatus(EventStatus.PUBLISHED);
                outboxEventRepository.save(event);

                long publishLatencyMs = java.time.temporal.ChronoUnit.MILLIS.between(event.getCreatedAt(), LocalDateTime.now());
                meterRegistry.counter("event.publish.success.total", "topic", event.getTopic()).increment();
                log.info("Successfully published event {} with publish latency: {} ms", event.getEventId(), publishLatencyMs);

            } catch (Exception e) {
                event.setRetryCount(event.getRetryCount() + 1);
                event.setFailureReason(e.getMessage());
                
                if (event.getRetryCount() >= maxRetries) {
                    event.setStatus(EventStatus.PERMANENTLY_FAILED);
                } else {
                    event.setStatus(EventStatus.FAILED);
                    int backoffSeconds = (int) Math.pow(2, event.getRetryCount() - 1) * 5;
                    backoffSeconds = Math.min(backoffSeconds, 900); // Cap at 15 minutes
                    event.setNextAttemptAt(LocalDateTime.now().plusSeconds(backoffSeconds));
                }
                outboxEventRepository.save(event);

                meterRegistry.counter("event.publish.failure.total", 
                        "topic", event.getTopic(), 
                        "service", applicationName,
                        "reason", e.getClass().getSimpleName()).increment();
                log.error("Failed to publish event {}: {}", event.getEventId(), e.getMessage());
            }
        }
    }
}
