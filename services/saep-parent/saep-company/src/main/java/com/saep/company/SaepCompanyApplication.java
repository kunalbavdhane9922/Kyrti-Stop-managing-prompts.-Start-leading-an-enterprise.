package com.saep.company;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = {"com.saep.company.domain"})
@EnableJpaRepositories(basePackages = {"com.saep.company.repository"})
public class SaepCompanyApplication {
    public static void main(String[] args) {
        SpringApplication.run(SaepCompanyApplication.class, args);
    }
}
