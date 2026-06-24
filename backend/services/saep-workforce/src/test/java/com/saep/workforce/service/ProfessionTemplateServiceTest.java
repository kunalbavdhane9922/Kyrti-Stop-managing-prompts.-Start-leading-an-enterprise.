package com.saep.workforce.service;

import com.saep.workforce.domain.ProfessionTemplateDefinition;
import com.saep.workforce.domain.ProfessionTemplateEntity;
import com.saep.workforce.domain.PromotionModelDefinition;
import com.saep.workforce.repository.ProfessionTemplateRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProfessionTemplateServiceTest {

    @Mock
    private ProfessionTemplateRepository repository;

    @InjectMocks
    private ProfessionTemplateService service;

    private ProfessionTemplateDefinition definition;
    private PromotionModelDefinition promotionModel;

    @BeforeEach
    void setUp() {
        promotionModel = new PromotionModelDefinition();
        promotionModel.setPromotionThreshold(new BigDecimal("80"));
        promotionModel.setStrongCandidateThreshold(new BigDecimal("90"));
        promotionModel.setExperienceWeight(new BigDecimal("30"));
        promotionModel.setReputationWeight(new BigDecimal("30"));
        promotionModel.setWorkforceWeight(new BigDecimal("40"));

        definition = new ProfessionTemplateDefinition();
        definition.setPromotionModel(promotionModel);
    }

    @Test
    void createTemplate_validPromotionModel_savesSuccessfully() {
        when(repository.findByTenantIdAndProfessionCode("tenant-1", "ENGINEER")).thenReturn(List.of());
        when(repository.save(any(ProfessionTemplateEntity.class))).thenAnswer(i -> i.getArguments()[0]);

        ProfessionTemplateEntity template = service.createTemplate("tenant-1", "ENGINEER", "Engineer", "Engineering", definition, "user-1");

        assertNotNull(template);
        verify(repository).save(any(ProfessionTemplateEntity.class));
    }

    @Test
    void createTemplate_invalidWeightTotal_throwsException() {
        promotionModel.setExperienceWeight(new BigDecimal("50"));
        // Total = 50 + 30 + 40 = 120

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            service.createTemplate("tenant-1", "ENGINEER", "Engineer", "Engineering", definition, "user-1");
        });

        assertTrue(ex.getMessage().contains("sum exactly to 100"));
        verify(repository, never()).save(any());
    }

    @Test
    void createTemplate_negativeThreshold_throwsException() {
        promotionModel.setPromotionThreshold(new BigDecimal("-10"));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            service.createTemplate("tenant-1", "ENGINEER", "Engineer", "Engineering", definition, "user-1");
        });

        assertTrue(ex.getMessage().contains("must be between 0 and 100"));
        verify(repository, never()).save(any());
    }

    @Test
    void createTemplate_missingThreshold_throwsException() {
        promotionModel.setPromotionThreshold(null);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            service.createTemplate("tenant-1", "ENGINEER", "Engineer", "Engineering", definition, "user-1");
        });

        assertTrue(ex.getMessage().contains("must be between 0 and 100"));
        verify(repository, never()).save(any());
    }
}
