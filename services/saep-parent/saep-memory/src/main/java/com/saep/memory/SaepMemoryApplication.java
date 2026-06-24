package com.saep.memory;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.retry.annotation.EnableRetry;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableScheduling
@EnableRetry
@EntityScan(basePackages = {"com.saep.memory.domain", "com.saep.outbox.domain"})
@EnableJpaRepositories(basePackages = {"com.saep.memory.repository", "com.saep.outbox.repository"})
public class SaepMemoryApplication {

    public static void main(String[] args) {
        SpringApplication.run(SaepMemoryApplication.class, args);
    }
}
