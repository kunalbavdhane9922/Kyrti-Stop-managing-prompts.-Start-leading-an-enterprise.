package com.saep.company.controller;

import com.saep.company.model.Project;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/projects")
public class ProjectController {

    // Note: In a full implementation, this would inject a ProjectService 
    // to handle the actual database operations and event publishing.

    @GetMapping
    @PreAuthorize("hasAuthority('project.read')")
    public ResponseEntity<List<Project>> getAllProjects() {
        // Return dummy data for now
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('project.read')")
    public ResponseEntity<Project> getProjectById(@PathVariable UUID id) {
        return ResponseEntity.ok(new Project());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('project.create')")
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        return ResponseEntity.ok(project);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('project.update')")
    public ResponseEntity<Project> updateProject(@PathVariable UUID id, @RequestBody Project project) {
        return ResponseEntity.ok(project);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('project.delete')")
    public ResponseEntity<Void> deleteProject(@PathVariable UUID id) {
        return ResponseEntity.noContent().build();
    }
}
