package com.saep.marketplace.controller;

import com.saep.marketplace.domain.ProfessionTemplate;
import com.saep.marketplace.service.MarketplaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/marketplace/professions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // For Next.js frontend integration
public class MarketplaceController {

    private final MarketplaceService marketplaceService;

    @GetMapping
    public ResponseEntity<List<ProfessionTemplate>> getAllTemplates() {
        return ResponseEntity.ok(marketplaceService.getAllTemplates());
    }

    @PostMapping
    public ResponseEntity<ProfessionTemplate> createTemplate(@RequestBody ProfessionTemplate template) {
        return ResponseEntity.ok(marketplaceService.createTemplate(template));
    }
}
