package com.saep.company;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(scanBasePackages = {"com.saep.company", "com.saep.common.tracing"})
@EnableScheduling
@EntityScan(basePackages = {"com.saep.company.domain", "com.saep.outbox.domain"})
@EnableJpaRepositories(basePackages = {"com.saep.company.repository", "com.saep.outbox.repository"})
public class SaepCompanyApplication {
    public static void main(String[] args) {
        SpringApplication.run(SaepCompanyApplication.class, args);
    }
}
