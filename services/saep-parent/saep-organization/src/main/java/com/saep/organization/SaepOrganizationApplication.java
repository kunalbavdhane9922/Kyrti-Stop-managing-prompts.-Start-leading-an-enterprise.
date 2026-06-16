package com.saep.organization;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"com.saep.organization", "com.saep.common.tracing"})
@EntityScan(basePackages = {"com.saep.organization.domain", "com.saep.outbox.domain"})
@EnableJpaRepositories(basePackages = {"com.saep.organization.repository", "com.saep.outbox.repository"})
public class SaepOrganizationApplication {
    public static void main(String[] args) {
        SpringApplication.run(SaepOrganizationApplication.class, args);
    }
}
