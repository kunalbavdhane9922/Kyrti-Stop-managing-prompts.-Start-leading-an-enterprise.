package com.saep.marketplace;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"com.saep.common", "com.saep.marketplace"})
@EntityScan(basePackages = {"com.saep.common.domain", "com.saep.marketplace.domain"})
@EnableJpaRepositories(basePackages = "com.saep.marketplace.repository")
public class MarketplaceApplication {
    public static void main(String[] args) {
        SpringApplication.run(MarketplaceApplication.class, args);
    }
}
