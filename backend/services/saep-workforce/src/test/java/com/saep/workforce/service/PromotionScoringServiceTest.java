package com.saep.workforce.service;

import com.saep.workforce.domain.ProfessionTemplateDefinition;
import com.saep.workforce.domain.PromotionModelDefinition;
import com.saep.workforce.domain.WorkerEntity;
import com.saep.workforce.dto.PromotionEligibilityDto;
import com.saep.workforce.repository.WorkerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PromotionScoringServiceTest {

    @Mock
    private WorkerRepository workerRepository;

    @InjectMocks
    private PromotionScoringService service;

    private WorkerEntity worker;
    private UUID workerId;
    private ProfessionTemplateDefinition templateSnapshot;
    private PromotionModelDefinition promotionModel;

    @BeforeEach
    void setUp() {
        workerId = UUID.randomUUID();
        
        promotionModel = new PromotionModelDefinition();
        promotionModel.setPromotionThreshold(new BigDecimal("80"));
        promotionModel.setStrongCandidateThreshold(new BigDecimal("90"));
        promotionModel.setExperienceWeight(new BigDecimal("20"));
        promotionModel.setReputationWeight(new BigDecimal("40"));
        promotionModel.setWorkforceWeight(new BigDecimal("40"));

        templateSnapshot = new ProfessionTemplateDefinition();
        templateSnapshot.setPromotionModel(promotionModel);

        worker = new WorkerEntity();
        worker.setId(workerId);
        worker.setTenantId("tenant-1");
        worker.setOriginTemplateSnapshot(templateSnapshot);
    }

    @Test
    void calculateEligibility_strongCandidate_returnsCorrectScore() {
        // Experience: 10/10 tasks = 100% * 20 weight = 20
        worker.setCompletedTaskCount(10);
        worker.setFailedTaskCount(0);
        
        // Reputation: 9500 / 100 = 95 * 40 weight = 38
        worker.setCurrentReputationScore(9500.0);
        
        // Capability: 8500 / 100 = 85 * 40 weight = 34
        worker.setCurrentCapabilityScore(8500.0);
        
        // Total = 20 + 38 + 34 = 92
        
        when(workerRepository.findByTenantIdAndId("tenant-1", workerId)).thenReturn(Optional.of(worker));

        PromotionEligibilityDto result = service.calculateEligibility("tenant-1", workerId.toString());

        assertEquals(92.0, result.getTotalScore());
        assertTrue(result.isEligible());
        assertEquals("Strong Promotion Candidate", result.getEligibilityStatus());
    }

    @Test
    void calculateEligibility_notEligible_returnsCorrectStatus() {
        // Experience: 5/10 tasks = 50% * 20 weight = 10
        worker.setCompletedTaskCount(5);
        worker.setFailedTaskCount(5);
        
        // Reputation: 5000 / 100 = 50 * 40 weight = 20
        worker.setCurrentReputationScore(5000.0);
        
        // Capability: 6000 / 100 = 60 * 40 weight = 24
        worker.setCurrentCapabilityScore(6000.0);
        
        // Total = 10 + 20 + 24 = 54
        
        when(workerRepository.findByTenantIdAndId("tenant-1", workerId)).thenReturn(Optional.of(worker));

        PromotionEligibilityDto result = service.calculateEligibility("tenant-1", workerId.toString());

        assertEquals(54.0, result.getTotalScore());
        assertFalse(result.isEligible());
        assertEquals("Not Eligible", result.getEligibilityStatus());
    }

    @Test
    void calculateEligibility_missingTemplateModel_returnsZero() {
        worker.setOriginTemplateSnapshot(null);
        when(workerRepository.findByTenantIdAndId("tenant-1", workerId)).thenReturn(Optional.of(worker));

        PromotionEligibilityDto result = service.calculateEligibility("tenant-1", workerId.toString());

        assertEquals(0.0, result.getTotalScore());
        assertFalse(result.isEligible());
        assertTrue(result.getEligibilityStatus().contains("No Model"));
    }
}
