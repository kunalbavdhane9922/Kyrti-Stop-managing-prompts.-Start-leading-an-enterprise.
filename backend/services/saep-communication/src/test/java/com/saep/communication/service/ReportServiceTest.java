package com.saep.communication.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.saep.communication.domain.ReportEntity;
import com.saep.communication.domain.ReportStatus;
import com.saep.communication.domain.ReportType;
import com.saep.communication.domain.ReportVisibility;
import com.saep.communication.repository.ReportRepository;
import com.saep.outbox.repository.OutboxEventRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class ReportServiceTest {

    @Mock
    private ReportRepository reportRepository;

    @Mock
    private OutboxEventRepository outboxEventRepository;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private ReportService reportService;

    private UUID tenantId = UUID.randomUUID();
    private String reportId = "report-123";
    private String userId = "user-123";

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        when(reportRepository.save(any(ReportEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));
    }

    // --- State Machine Tests ---


    @Test
    void cannotTransitionFailedToReady() {
        ReportEntity failedReport = new ReportEntity();
        failedReport.setStatus(ReportStatus.FAILED);

        when(reportRepository.findByTenantIdAndIdAndDeletedAtIsNull(tenantId, reportId))
                .thenReturn(Optional.of(failedReport));

        assertThrows(IllegalStateException.class, () -> {
            reportService.markCompleted(tenantId, reportId, "summary", null, "engine", null, null, null);
        });
    }

    @Test
    void cannotTransitionReadyToFailed() {
        ReportEntity readyReport = new ReportEntity();
        readyReport.setStatus(ReportStatus.READY);

        when(reportRepository.findByTenantIdAndIdAndDeletedAtIsNull(tenantId, reportId))
                .thenReturn(Optional.of(readyReport));

        assertThrows(IllegalStateException.class, () -> {
            reportService.markFailed(tenantId, reportId, "ERROR", "reason", "engine");
        });
    }

    @Test
    void cannotCompleteAlreadyReadyReport() {
        ReportEntity readyReport = new ReportEntity();
        readyReport.setStatus(ReportStatus.READY);

        when(reportRepository.findByTenantIdAndIdAndDeletedAtIsNull(tenantId, reportId))
                .thenReturn(Optional.of(readyReport));

        assertThrows(IllegalStateException.class, () -> {
            reportService.markCompleted(tenantId, reportId, "new summary", null, "engine", null, null, null);
        });
    }

    // --- Visibility Tests ---
    @Test
    void privateReportOwnerCanAccess() {
        ReportEntity privateReport = new ReportEntity();
        privateReport.setVisibility(ReportVisibility.PRIVATE);
        privateReport.setRequestedBy(userId);

        when(reportRepository.findByTenantIdAndIdAndDeletedAtIsNull(tenantId, reportId))
                .thenReturn(Optional.of(privateReport));

        ReportEntity result = reportService.getReportById(tenantId, reportId, userId);
        assertNotNull(result);
    }

    @Test
    void privateReportNonOwnerDenied() {
        ReportEntity privateReport = new ReportEntity();
        privateReport.setVisibility(ReportVisibility.PRIVATE);
        privateReport.setRequestedBy("another-user");

        when(reportRepository.findByTenantIdAndIdAndDeletedAtIsNull(tenantId, reportId))
                .thenReturn(Optional.of(privateReport));

        assertThrows(org.springframework.security.access.AccessDeniedException.class, () -> {
            reportService.getReportById(tenantId, reportId, userId);
        });
    }

    @Test
    void privateReportsExcludedFromListForNonOwners() {
        ReportEntity report = new ReportEntity();
        Page<ReportEntity> page = new PageImpl<>(List.of(report));
        
        when(reportRepository.findTenantReports(tenantId, null, null, null, userId, PageRequest.of(0, 10)))
                .thenReturn(page);
                
        Page<ReportEntity> result = reportService.getTenantReports(tenantId, null, null, null, userId, PageRequest.of(0, 10));
        assertEquals(1, result.getContent().size());
        verify(reportRepository).findTenantReports(tenantId, null, null, null, userId, PageRequest.of(0, 10));
    }

    // --- Tenant Isolation Tests ---
    @Test
    void cannotAccessOtherTenantReport() {
        when(reportRepository.findByTenantIdAndIdAndDeletedAtIsNull(tenantId, reportId))
                .thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> {
            reportService.getReportById(tenantId, reportId, userId);
        });
    }

    @Test
    void cannotArchiveOtherTenantReport() {
        when(reportRepository.findByTenantIdAndIdAndDeletedAtIsNull(tenantId, reportId))
                .thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> {
            reportService.archiveReport(tenantId, reportId, userId, false);
        });
    }
}
