package com.saep.workforce.service;

import com.saep.workforce.domain.CareerHistoryEntity;
import com.saep.workforce.domain.WorkerEntity;
import com.saep.workforce.dto.ResumeDto;
import com.saep.workforce.repository.CareerHistoryRepository;
import com.saep.workforce.repository.WorkerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfessionalResumeService {

    private final WorkerRepository workerRepository;
    private final CareerHistoryRepository careerHistoryRepository;

    public ResumeDto getResume(String tenantId, UUID workerId) {
        WorkerEntity worker = workerRepository.findByTenantIdAndId(tenantId, workerId)
                .orElseThrow(() -> new IllegalArgumentException("Digital Professional not found"));

        List<CareerHistoryEntity> history = careerHistoryRepository
                .findByTenantIdAndWorkerIdOrderByOccurredAtDesc(tenantId, worker.getId().toString());

        long yearsActive = ChronoUnit.YEARS.between(worker.getHireDate() != null ? worker.getHireDate() : worker.getCreatedAt(), java.time.LocalDateTime.now());

        List<ResumeDto.CareerMilestoneDto> milestones = history.stream()
                .map(h -> ResumeDto.CareerMilestoneDto.builder()
                        .eventType(h.getEventType())
                        .description(h.getReason() != null ? h.getReason() : h.getNewValue())
                        .timestamp(h.getOccurredAt().toString())
                        .build())
                .collect(Collectors.toList());

        List<String> skills = new ArrayList<>();
        if (worker.getOriginTemplateSnapshot() != null && worker.getOriginTemplateSnapshot().getSkills() != null) {
            skills = worker.getOriginTemplateSnapshot().getSkills();
        }

        return ResumeDto.builder()
                .workerId(worker.getId().toString())
                .workerCode(worker.getWorkerCode())
                .displayName(worker.getDisplayName())
                .professionName(worker.getProfessionId())
                .currentLevel(worker.getLevel())
                .status(worker.getStatus())
                .reputationScore(worker.getCurrentReputationScore())
                .capabilityScore(worker.getCurrentCapabilityScore())
                .yearsActive(yearsActive)
                .completedAssignments(0)
                .completedTasks(worker.getCompletedTaskCount())
                .skills(skills)
                .careerMilestones(milestones)
                .build();
    }
}
