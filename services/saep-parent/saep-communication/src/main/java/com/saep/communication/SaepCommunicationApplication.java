package com.saep.communication;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"com.saep.communication", "com.saep.common", "com.saep.outbox"})
@EntityScan(basePackages = {"com.saep.communication.domain", "com.saep.outbox.domain"})
@EnableJpaRepositories(basePackages = {"com.saep.communication.repository", "com.saep.outbox.repository"})
public class SaepCommunicationApplication {

    public static void main(String[] args) {
        SpringApplication.run(SaepCommunicationApplication.class, args);
    }
}
