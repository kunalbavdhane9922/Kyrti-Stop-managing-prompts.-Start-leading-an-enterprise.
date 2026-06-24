package com.saep.workforce.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.saep.outbox.domain.OutboxEvent;
import com.saep.outbox.repository.OutboxEventRepository;
import com.saep.workforce.domain.CareerHistoryEntity;
import com.saep.workforce.domain.WorkerEntity;
import com.saep.workforce.dto.*;
import com.saep.workforce.repository.CareerHistoryRepository;
import com.saep.workforce.repository.ProfessionTemplateRepository;
import com.saep.workforce.repository.WorkerRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DigitalProfessionalServiceTest {

    @Mock
    private WorkerRepository workerRepository;
    @Mock
    private ProfessionTemplateRepository templateRepository;
    @Mock
    private CareerHistoryRepository careerHistoryRepository;
    @Mock
    private EntityManager entityManager;
    @Mock
    private OutboxEventRepository outboxEventRepository;
    @Mock
    private ObjectMapper objectMapper;
    @Mock
    private PromotionScoringService promotionScoringService;

    @InjectMocks
    private DigitalProfessionalService service;

    private WorkerEntity availableWorker;
    private WorkerEntity employedWorker;
    private UUID workerId;

    @BeforeEach
    void setUp() {
        workerId = UUID.randomUUID();
        availableWorker = new WorkerEntity();
        availableWorker.setId(workerId);
        availableWorker.setTenantId("tenant-1");
        availableWorker.setStatus("AVAILABLE");
        availableWorker.setLevel("Entry");
        availableWorker.setProfessionId("ENGINEER");

        employedWorker = new WorkerEntity();
        employedWorker.setId(workerId);
        employedWorker.setTenantId("tenant-1");
        employedWorker.setStatus("EMPLOYED");
        employedWorker.setLevel("Entry");
        employedWorker.setProfessionId("ENGINEER");
        employedWorker.setCurrentCompanyId("company-1");
    }

    @Test
    void hireProfessional_whenAvailable_succeedsAndEmitsEvent() {
        when(workerRepository.findByTenantIdAndId("tenant-1", workerId)).thenReturn(Optional.of(availableWorker));
        when(workerRepository.save(any(WorkerEntity.class))).thenAnswer(i -> i.getArguments()[0]);
        
        HireProfessionalRequest request = new HireProfessionalRequest();
        request.setCompanyId(UUID.randomUUID());
        request.setReason("New hire");

        WorkerEntity result = service.hireProfessional("tenant-1", workerId, "actor-1", "approver-1", request);

        assertEquals("EMPLOYED", result.getStatus());
        assertEquals(request.getCompanyId().toString(), result.getCurrentCompanyId());

        verify(careerHistoryRepository).save(any(CareerHistoryEntity.class));
        
        ArgumentCaptor<OutboxEvent> outboxCaptor = ArgumentCaptor.forClass(OutboxEvent.class);
        verify(outboxEventRepository).save(outboxCaptor.capture());
        
        assertEquals("workforce.professional.hired.v1", outboxCaptor.getValue().getEventType());
    }

    @Test
    void hireProfessional_whenEmployed_throwsIllegalStateException() {
        when(workerRepository.findByTenantIdAndId("tenant-1", workerId)).thenReturn(Optional.of(employedWorker));
        
        HireProfessionalRequest request = new HireProfessionalRequest();
        request.setCompanyId(UUID.randomUUID());

        assertThrows(IllegalStateException.class, () -> {
            service.hireProfessional("tenant-1", workerId, "actor-1", "approver-1", request);
        });

        verify(workerRepository, never()).save(any());
        verify(outboxEventRepository, never()).save(any());
    }

    @Test
    void promoteProfessional_whenEmployed_succeedsAndEmitsEvent() {
        when(workerRepository.findByTenantIdAndId("tenant-1", workerId)).thenReturn(Optional.of(employedWorker));
        when(workerRepository.save(any(WorkerEntity.class))).thenAnswer(i -> i.getArguments()[0]);
        
        PromotionEligibilityDto eligibility = PromotionEligibilityDto.builder().totalScore(85.0).requiredThreshold(80.0).build();
        when(promotionScoringService.calculateEligibility(anyString(), anyString())).thenReturn(eligibility);

        PromotionRequest request = new PromotionRequest();
        request.setNewLevel("Senior");
        request.setReason("Good performance");

        WorkerEntity result = service.promoteProfessional("tenant-1", workerId, "actor-1", "approver-1", request);

        assertEquals("Senior", result.getLevel());

        ArgumentCaptor<OutboxEvent> outboxCaptor = ArgumentCaptor.forClass(OutboxEvent.class);
        verify(outboxEventRepository).save(outboxCaptor.capture());
        
        assertEquals("workforce.professional.promoted.v1", outboxCaptor.getValue().getEventType());
    }
}
