package com.saep.workforce.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.saep.outbox.repository.OutboxEventRepository;
import com.saep.workforce.domain.*;
import com.saep.workforce.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class WorkforceScoringServiceTest {

    @Mock private ProcessedSignalRepository processedSignalRepository;
    @Mock private EvidenceRecordRepository evidenceRecordRepository;
    @Mock private SignalDefinitionRepository signalDefinitionRepository;
    @Mock private WorkforceSignalRepository workforceSignalRepository;
    @Mock private WorkforceScoreRepository workforceScoreRepository;
    @Mock private WorkforceScoreHistoryRepository historyRepository;
    @Mock private OutboxEventRepository outboxEventRepository;
    @Mock private ObjectMapper objectMapper;

    @InjectMocks
    private WorkforceScoringService service;

    private final String tenantId = "tenant1";
    private final String workerId = "worker1";
    private final String eventId = "evt1";

    @BeforeEach
    void setUp() {
        lenient().when(processedSignalRepository.existsByTenantIdAndSourceEventId(tenantId, eventId))
                .thenReturn(false);
    }

    @Test
    void testProcessSignal_ScoreIncreasesAndIsBounded() {
        SignalDefinitionEntity def = new SignalDefinitionEntity();
        def.setId(java.util.UUID.randomUUID());
        def.setCapabilityWeight(5000.0);
        def.setSkillWeight(2000.0);
        def.setReadinessWeight(50.0);
        
        when(signalDefinitionRepository.findByTenantIdAndSignalCodeAndActiveFlagTrue(tenantId, "TASK_COMPLETED"))
                .thenReturn(Optional.of(def));
                
        WorkforceScoreEntity existingScore = new WorkforceScoreEntity();
        existingScore.setCapabilityScore(8000.0); // Will hit 10000 bound when adding 5000
        existingScore.setSkillScore(100.0);
        existingScore.setReadinessScore(80.0); // Will hit 100 bound when adding 50
        
        when(workforceScoreRepository.findByTenantIdAndWorkerId(tenantId, workerId))
                .thenReturn(Optional.of(existingScore));

        service.processSignal(tenantId, eventId, "comm", "task.completed", workerId, "TASK_COMPLETED", null);

        ArgumentCaptor<WorkforceScoreEntity> scoreCaptor = ArgumentCaptor.forClass(WorkforceScoreEntity.class);
        verify(workforceScoreRepository).save(scoreCaptor.capture());
        
        WorkforceScoreEntity saved = scoreCaptor.getValue();
        assertEquals(10000.0, saved.getCapabilityScore(), "Capability bounded to 10000");
        assertEquals(2100.0, saved.getSkillScore(), "Skill accumulated");
        assertEquals(100.0, saved.getReadinessScore(), "Readiness bounded to 100");
        
        verify(evidenceRecordRepository).save(any());
        verify(historyRepository).save(any());
        verify(outboxEventRepository).save(any());
    }
}
