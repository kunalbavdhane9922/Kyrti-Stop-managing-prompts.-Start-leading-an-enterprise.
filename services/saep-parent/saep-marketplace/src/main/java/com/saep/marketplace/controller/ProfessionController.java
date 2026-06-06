package com.saep.marketplace.controller;

import com.saep.common.security.TenantContext;
import com.saep.marketplace.model.Profession;
import com.saep.marketplace.repository.ProfessionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/marketplace/professions")
public class ProfessionController {

    private final ProfessionRepository professionRepository;

    public ProfessionController(ProfessionRepository professionRepository) {
        this.professionRepository = professionRepository;
    }

    @GetMapping
    public ResponseEntity<List<Profession>> getProfessions() {
        // Enforce tenant context existence, even though professions are global templates
        if (TenantContext.getTenantId() == null) {
            return ResponseEntity.status(403).build();
        }
        
        List<Profession> professions = professionRepository.findAll();
        return ResponseEntity.ok(professions);
    }
}
