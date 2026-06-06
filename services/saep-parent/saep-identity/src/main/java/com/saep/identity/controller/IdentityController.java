package com.saep.identity.controller;

import com.saep.identity.model.IdentityUser;
import com.saep.identity.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/identities")
public class IdentityController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<IdentityUser> createIdentity(@RequestBody IdentityUser request) {
        // Simple scaffolding: Hash password in a real environment
        request.setPasswordHash(request.getPasswordHash());
        IdentityUser saved = userRepository.save(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
