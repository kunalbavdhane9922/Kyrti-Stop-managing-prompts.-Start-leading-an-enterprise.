package com.saep.workflow.config;

import com.saep.workflow.activities.impl.CompanyActivitiesImpl;
import com.saep.workflow.activities.impl.HiringActivitiesImpl;
import com.saep.workflow.activities.impl.MarketplaceActivitiesImpl;
import com.saep.workflow.activities.impl.WorkforceActivitiesImpl;
import com.saep.workflow.workflows.impl.CompanyCreationWorkflowImpl;
import com.saep.workflow.workflows.impl.HiringWorkflowImpl;
import com.saep.workflow.workflows.impl.ProfessionCreationWorkflowImpl;
import com.saep.workflow.workflows.impl.PromotionWorkflowImpl;
import com.saep.workflow.workflows.impl.TerminationWorkflowImpl;
import io.temporal.worker.Worker;
import io.temporal.worker.WorkerFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

/**
 * Bootstraps the Temporal Worker on application startup.
 * Registers all V1 workflow implementations and activity beans.
 */
@Component
public class TemporalWorkerInitializer implements ApplicationListener<ApplicationReadyEvent> {

    private static final Logger log = LoggerFactory.getLogger(TemporalWorkerInitializer.class);

    private final WorkerFactory workerFactory;
    private final String taskQueue;
    private final HiringActivitiesImpl hiringActivities;
    private final CompanyActivitiesImpl companyActivities;
    private final MarketplaceActivitiesImpl marketplaceActivities;
    private final WorkforceActivitiesImpl workforceActivities;

    public TemporalWorkerInitializer(WorkerFactory workerFactory,
                                     @Value("${temporal.task-queue}") String taskQueue,
                                     HiringActivitiesImpl hiringActivities,
                                     CompanyActivitiesImpl companyActivities,
                                     MarketplaceActivitiesImpl marketplaceActivities,
                                     WorkforceActivitiesImpl workforceActivities) {
        this.workerFactory = workerFactory;
        this.taskQueue = taskQueue;
        this.hiringActivities = hiringActivities;
        this.companyActivities = companyActivities;
        this.marketplaceActivities = marketplaceActivities;
        this.workforceActivities = workforceActivities;
    }

    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        Worker worker = workerFactory.newWorker(taskQueue);

        // Register all V1 business workflows
        worker.registerWorkflowImplementationTypes(
                HiringWorkflowImpl.class,
                CompanyCreationWorkflowImpl.class,
                ProfessionCreationWorkflowImpl.class,
                TerminationWorkflowImpl.class,
                PromotionWorkflowImpl.class
        );

        // Register all activity implementations
        worker.registerActivitiesImplementations(
                hiringActivities,
                companyActivities,
                marketplaceActivities,
                workforceActivities
        );

        workerFactory.start();
        log.info("Temporal Worker started on task queue: {}", taskQueue);
    }
}
