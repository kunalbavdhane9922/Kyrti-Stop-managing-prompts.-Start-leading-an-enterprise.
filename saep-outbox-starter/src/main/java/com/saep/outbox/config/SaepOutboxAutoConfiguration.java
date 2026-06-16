package com.saep.outbox.config;

import com.saep.outbox.service.IdempotencyService;
import com.saep.outbox.service.OutboxProcessor;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@AutoConfiguration
@EnableScheduling
@ComponentScan(basePackages = "com.saep.outbox.service")
public class SaepOutboxAutoConfiguration {
}
