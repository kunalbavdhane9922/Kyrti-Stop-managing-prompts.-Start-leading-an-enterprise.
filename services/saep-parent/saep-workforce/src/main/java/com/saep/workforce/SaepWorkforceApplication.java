package com.saep.workforce;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = {"com.saep.workforce.domain"})
@EnableJpaRepositories(basePackages = {"com.saep.workforce.repository"})
public class SaepWorkforceApplication {
    public static void main(String[] args) {
        SpringApplication.run(SaepWorkforceApplication.class, args);
    }
}
