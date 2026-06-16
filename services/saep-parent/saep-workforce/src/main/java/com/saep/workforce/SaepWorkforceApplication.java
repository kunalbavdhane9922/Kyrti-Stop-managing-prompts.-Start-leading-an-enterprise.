package com.saep.workforce;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"com.saep.workforce", "com.saep.common.tracing"})
@EntityScan(basePackages = {"com.saep.workforce.domain", "com.saep.outbox.domain"})
@EnableJpaRepositories(basePackages = {"com.saep.workforce.repository", "com.saep.outbox.repository"})
public class SaepWorkforceApplication {
    public static void main(String[] args) {
        SpringApplication.run(SaepWorkforceApplication.class, args);
    }
}
