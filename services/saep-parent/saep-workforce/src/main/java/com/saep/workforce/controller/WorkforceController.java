package com.saep.workforce.controller;

import com.saep.common.security.TenantContext;
import com.saep.workforce.model.CareerHistory;
import com.saep.workforce.model.DigitalProfessional;
import com.saep.workforce.repository.CareerHistoryRepository;
import com.saep.workforce.repository.DigitalProfessionalRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/workforce")
public class WorkforceController {

    private final DigitalProfessionalRepository professionalRepository;
    private final CareerHistoryRepository historyRepository;

    public WorkforceController(DigitalProfessionalRepository professionalRepository, CareerHistoryRepository historyRepository) {
        this.professionalRepository = professionalRepository;
        this.historyRepository = historyRepository;
    }

    @PostMapping("/hire")
    public ResponseEntity<DigitalProfessional> hireProfessional(@RequestBody HireRequest request) {
        UUID tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            return ResponseEntity.status(403).build();
        }

        DigitalProfessional professional = new DigitalProfessional();
        professional.setTenantId(tenantId);
        professional.setProfessionId(request.getProfessionId());
        professional.setName(request.getName());
        
        DigitalProfessional saved = professionalRepository.save(professional);
        return ResponseEntity.status(201).body(saved);
    }

    @GetMapping("/professionals")
    public ResponseEntity<List<DigitalProfessional>> getProfessionals() {
        UUID tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            return ResponseEntity.status(403).build();
        }

        List<DigitalProfessional> professionals = professionalRepository.findByTenantId(tenantId);
        return ResponseEntity.ok(professionals);
    }

    @GetMapping("/professionals/{id}/history")
    public ResponseEntity<List<CareerHistory>> getHistory(@PathVariable UUID id) {
        UUID tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            return ResponseEntity.status(403).build();
        }

        // We verify the professional actually belongs to the tenant implicitly by passing tenantId to the query
        List<CareerHistory> history = historyRepository.findByProfessionalIdAndTenantIdOrderByCompletedAtDesc(id, tenantId);
        return ResponseEntity.ok(history);
    }
}

class HireRequest {
    private UUID professionId;
    private String name;

    public UUID getProfessionId() { return professionId; }
    public void setProfessionId(UUID professionId) { this.professionId = professionId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
