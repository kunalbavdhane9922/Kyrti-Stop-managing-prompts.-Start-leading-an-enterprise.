package com.saep.workforce.service;

import com.saep.workforce.domain.CareerHistoryEntity;
import com.saep.workforce.domain.WorkerEntity;
import com.saep.workforce.dto.ResumeDto;
import com.saep.workforce.repository.CareerHistoryRepository;
import com.saep.workforce.repository.WorkerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProfessionalResumeServiceTest {

    @Mock
    private WorkerRepository workerRepository;
    @Mock
    private CareerHistoryRepository careerHistoryRepository;

    @InjectMocks
    private ProfessionalResumeService service;

    private WorkerEntity worker;
    private UUID workerId;

    @BeforeEach
    void setUp() {
        workerId = UUID.randomUUID();
        worker = new WorkerEntity();
        worker.setId(workerId);
        worker.setTenantId("tenant-1");
        worker.setWorkerCode("DP-0001");
        worker.setHireDate(LocalDateTime.now().minusYears(2));
    }

    @Test
    void getResume_returnsCorrectTimelineOrder() {
        when(workerRepository.findByTenantIdAndId("tenant-1", workerId)).thenReturn(Optional.of(worker));

        // Note: The repository returns them ordered by occurredAt DESC (latest first)
        List<CareerHistoryEntity> historyDesc = List.of(
                buildHistory("RETIRED", LocalDateTime.now()),
                buildHistory("TERMINATED", LocalDateTime.now().minusDays(1)),
                buildHistory("ACHIEVEMENT", LocalDateTime.now().minusDays(10)),
                buildHistory("PROMOTED", LocalDateTime.now().minusMonths(1)),
                buildHistory("HIRED", LocalDateTime.now().minusMonths(5)),
                buildHistory("PROFESSIONAL_CREATED", LocalDateTime.now().minusMonths(6))
        );

        when(careerHistoryRepository.findByTenantIdAndWorkerIdOrderByOccurredAtDesc("tenant-1", workerId.toString()))
                .thenReturn(historyDesc);

        ResumeDto resume = service.getResume("tenant-1", workerId);

        assertEquals(6, resume.getCareerMilestones().size());
        assertEquals("RETIRED", resume.getCareerMilestones().get(0).getEventType());
        assertEquals("TERMINATED", resume.getCareerMilestones().get(1).getEventType());
        assertEquals("ACHIEVEMENT", resume.getCareerMilestones().get(2).getEventType());
        assertEquals("PROMOTED", resume.getCareerMilestones().get(3).getEventType());
        assertEquals("HIRED", resume.getCareerMilestones().get(4).getEventType());
        assertEquals("PROFESSIONAL_CREATED", resume.getCareerMilestones().get(5).getEventType());
    }

    private CareerHistoryEntity buildHistory(String eventType, LocalDateTime occurredAt) {
        CareerHistoryEntity entity = new CareerHistoryEntity();
        entity.setEventType(eventType);
        entity.setOccurredAt(occurredAt);
        entity.setReason("Test reason");
        return entity;
    }
}
