package com.saep.common.event;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@EnableScheduling
public class OutboxRelayScheduler {

    private final OutboxEventRepository outboxEventRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;

    public OutboxRelayScheduler(OutboxEventRepository outboxEventRepository, KafkaTemplate<String, String> kafkaTemplate) {
        this.outboxEventRepository = outboxEventRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    @Scheduled(fixedDelay = 5000)
    public void relayEvents() {
        List<OutboxEvent> pendingEvents = outboxEventRepository.findByProcessedFalseOrderByCreatedAtAsc();

        for (OutboxEvent event : pendingEvents) {
            try {
                // Topic name is derived from aggregate type, e.g., "company-events"
                String topic = event.getAggregateType().toLowerCase() + "-events";
                
                // Publish to Kafka
                kafkaTemplate.send(topic, event.getAggregateId(), event.getPayload()).get(); // Synchronous send for outbox guarantee
                
                // Mark as processed
                event.setProcessed(true);
                outboxEventRepository.save(event);
            } catch (Exception e) {
                // Log and stop processing to maintain order for this partition/aggregate
                // In a production system, implement a dead-letter queue and retry mechanism
                System.err.println("Failed to publish event " + event.getId() + ": " + e.getMessage());
                break; 
            }
        }
    }
}
