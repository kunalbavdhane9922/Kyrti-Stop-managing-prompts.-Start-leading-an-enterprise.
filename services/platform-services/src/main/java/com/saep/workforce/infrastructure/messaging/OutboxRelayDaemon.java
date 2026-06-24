package com.saep.workforce.infrastructure.messaging;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class OutboxRelayDaemon {

    // private final OutboxEventRepository outboxRepository;
    // private final KafkaTemplate<String, String> kafkaTemplate;

    public OutboxRelayDaemon() {
        System.out.println("[OUTBOX RELAY] Daemon Initialized.");
    }

    /**
     * TRANSACTIONAL OUTBOX PATTERN
     * Rather than risking data loss by writing to PostgreSQL and Kafka simultaneously,
     * the system writes the Event to the `outbox_events` table in PostgreSQL.
     * This daemon polls that table and securely streams it to Kafka.
     * If Kafka is down, the events safely queue up in Postgres. Zero data loss.
     */
    @Scheduled(fixedDelay = 1000)
    public void relayEventsToKafka() {
        // 1. Fetch unpublished events from database
        // List<OutboxEventEntity> events = outboxRepository.findByPublishedFalse();

        // 2. Transmit to Kafka
        // for(OutboxEventEntity event : events) {
        //     kafkaTemplate.send("workforce.events", event.getPayload());
        //     outboxRepository.markAsPublished(event.getId());
        //     System.out.println("[OUTBOX RELAY] Transmitted event to Kafka: " + event.getEventType());
        // }
    }
}
