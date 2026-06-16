package com.saep.company.service;

import com.saep.company.domain.PermissionCatalogEntity;
import com.saep.company.domain.SystemPermission;
import com.saep.company.repository.PermissionCatalogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import jakarta.persistence.EntityManager;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@RequiredArgsConstructor
public class PermissionSeeder implements CommandLineRunner {

    private final PermissionCatalogRepository permissionCatalogRepository;
    private final EntityManager entityManager;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        log.info("Starting Permission Catalog Seeder...");

        List<PermissionCatalogEntity> entities = Arrays.stream(SystemPermission.values())
                .map(p -> PermissionCatalogEntity.builder()
                        .code(p.getCode())
                        .name(generateName(p.name()))
                        .module(p.getModule())
                        .description(p.getDescription())
                        .isSystem(true)
                        .build())
                .collect(Collectors.toList());

        for (PermissionCatalogEntity entity : entities) {
            if (!permissionCatalogRepository.existsById(entity.getCode())) {
                permissionCatalogRepository.save(entity);
                log.info("Seeded system permission: {}", entity.getCode());
            }
        }
        
        log.info("Permission Catalog Seeder completed.");
    }

    private String generateName(String enumName) {
        // MEMBERS_INVITE -> "Members Invite"
        return Arrays.stream(enumName.split("_"))
                .map(word -> word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase())
                .collect(Collectors.joining(" "));
    }
}
