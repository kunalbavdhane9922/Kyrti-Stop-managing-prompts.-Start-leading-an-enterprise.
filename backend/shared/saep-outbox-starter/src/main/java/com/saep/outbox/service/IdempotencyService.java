package com.saep.outbox.service;

import com.saep.outbox.domain.ProcessedEvent;
import com.saep.outbox.repository.ProcessedEventRepository;
import io.micrometer.core.instrument.MeterRegistry;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class IdempotencyService {

    private final ProcessedEventRepository processedEventRepository;
    private final MeterRegistry meterRegistry;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public boolean isAlreadyProcessed(String eventId) {
        if (processedEventRepository.existsById(eventId)) {
            return true;
        }
        
        ProcessedEvent processedEvent = ProcessedEvent.builder()
                .eventId(eventId)
                .processedAt(LocalDateTime.now())
                .build();
                
        try {
            processedEventRepository.saveAndFlush(processedEvent);
            meterRegistry.counter("event.consumed").increment();
            return false;
        } catch (Exception e) {
            // If another thread/node saved it simultaneously, a duplicate key exception will occur
            return true;
        }
    }
}
