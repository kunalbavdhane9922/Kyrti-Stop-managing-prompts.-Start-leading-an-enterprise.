package com.saep.company.controller;

import com.saep.company.domain.MembershipEntity;
import com.saep.company.service.MembershipService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/companies/{tenantId}/members")
@RequiredArgsConstructor
public class MembershipController {

    private final MembershipService membershipService;

    @GetMapping
    public ResponseEntity<List<MembershipEntity>> getMemberships(
            @PathVariable String tenantId,
            @RequestParam(required = false) String status) {
        List<MembershipEntity> members = membershipService.getMemberships(tenantId, status);
        return ResponseEntity.ok(members);
    }

    @DeleteMapping("/{membershipId}")
    public ResponseEntity<?> removeMembership(
            @PathVariable String tenantId,
            @PathVariable UUID membershipId,
            @RequestHeader("X-User-Id") String userId) {
        try {
            membershipService.removeMembership(tenantId, membershipId, UUID.fromString(userId));
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{membershipId}/suspend")
    public ResponseEntity<?> suspendMembership(
            @PathVariable String tenantId,
            @PathVariable UUID membershipId,
            @RequestHeader("X-User-Id") String userId) {
        try {
            membershipService.suspendMembership(tenantId, membershipId, UUID.fromString(userId));
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
