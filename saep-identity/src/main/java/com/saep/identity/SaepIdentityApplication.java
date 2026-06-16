package com.saep.identity;

import com.saep.common.config.CommonConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;

@SpringBootApplication(scanBasePackages = {"com.saep.identity", "com.saep.common.tracing"})
@Import(CommonConfig.class)
public class SaepIdentityApplication {
    public static void main(String[] args) {
        SpringApplication.run(SaepIdentityApplication.class, args);
    }
}
