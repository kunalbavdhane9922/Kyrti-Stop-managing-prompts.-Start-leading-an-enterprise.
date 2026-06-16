package com.saep.company.service;

import com.saep.company.domain.InitializationRequestEntity;
import com.saep.company.domain.InitializationRequestStatus;
import com.saep.company.domain.CompanyEntity;
import com.saep.company.domain.CompanyStatus;
import com.saep.company.repository.InitializationRequestRepository;
import com.saep.company.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class InitializationTimeoutService {

    private final InitializationRequestRepository initializationRequestRepository;
    private final CompanyRepository companyRepository;

    @Scheduled(fixedRate = 60000) // Runs every minute
    @Transactional
    public void markStaleRequestsAsFailed() {
        LocalDateTime threshold = LocalDateTime.now().minusMinutes(30);

        List<InitializationRequestEntity> staleRequests = initializationRequestRepository.findAll().stream()
                .filter(req -> req.getStatus() == InitializationRequestStatus.PROCESSING)
                .filter(req -> req.getUpdatedAt().isBefore(threshold))
                .collect(Collectors.toList());

        for (InitializationRequestEntity req : staleRequests) {
            req.setStatus(InitializationRequestStatus.FAILED);
            req.setFailureReason("Timeout after 30 minutes");
            initializationRequestRepository.save(req);
            log.error("Initialization request {} failed due to timeout", req.getId());

            Optional<CompanyEntity> companyOpt = companyRepository.findById(req.getCompanyId());
            if (companyOpt.isPresent()) {
                CompanyEntity company = companyOpt.get();
                if (company.getStatus() == CompanyStatus.INITIALIZING) {
                    company.setStatus(CompanyStatus.FAILED);
                    companyRepository.save(company);
                    log.error("Company {} marked as FAILED due to timeout", company.getId());
                }
            }
        }
    }
}
