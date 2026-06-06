package com.saep.workflow.config;

import com.saep.workflow.orchestration.TaskActivities;
import com.saep.workflow.orchestration.TaskOrchestrationWorkflow;
import io.temporal.spring.boot.WorkerOptionsCustomizer;
import io.temporal.worker.WorkerFactory;
import io.temporal.worker.WorkerOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.annotation.Nonnull;

@Configuration
public class TemporalConfig {

    // The Spring Boot Starter auto-discovers and registers Workflow implementations annotated with @WorkflowImpl
    // and Activity implementations annotated with @ActivityImpl. 
    // This config ensures standard defaults for the Worker factory.

    @Bean
    public WorkerOptionsCustomizer customWorkerOptions() {
        return new WorkerOptionsCustomizer() {
            @Nonnull
            @Override
            public WorkerOptions.Builder customize(
                    @Nonnull WorkerOptions.Builder optionsBuilder,
                    @Nonnull String workerName,
                    @Nonnull String taskQueue) {
                
                // You can customize worker options here
                return optionsBuilder;
            }
        };
    }
}
