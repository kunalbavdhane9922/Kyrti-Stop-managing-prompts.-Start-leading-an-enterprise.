package com.saep.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;


@SpringBootApplication(scanBasePackages = {"com.saep.gateway", "com.saep.common.tracing"})
public class SaepGatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(SaepGatewayApplication.class, args);
    }


}
