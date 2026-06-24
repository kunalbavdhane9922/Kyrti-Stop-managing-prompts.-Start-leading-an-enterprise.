package com.saep.governance;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.saep.governance", "com.saep.common"})
public class SaepGovernanceApplication {
    public static void main(String[] args) {
        SpringApplication.run(SaepGovernanceApplication.class, args);
    }
}
