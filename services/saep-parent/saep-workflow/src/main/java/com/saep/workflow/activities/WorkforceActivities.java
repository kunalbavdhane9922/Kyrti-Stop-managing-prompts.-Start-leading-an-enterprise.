package com.saep.workflow.activities;

import io.temporal.activity.ActivityInterface;
import io.temporal.activity.ActivityMethod;

@ActivityInterface
public interface WorkforceActivities {

    @ActivityMethod
    void validateTermination(String companyId, String professionalId);

    @ActivityMethod
    void requestTerminationApproval(String companyId, String professionalId, String workflowId, String reason);

    @ActivityMethod
    String executeTermination(String companyId, String professionalId);

    @ActivityMethod
    void validatePromotion(String companyId, String professionalId, String targetLevel);

    @ActivityMethod
    void requestPromotionApproval(String companyId, String professionalId, String workflowId, String targetLevel);

    @ActivityMethod
    String executePromotion(String companyId, String professionalId, String targetLevel);

    @ActivityMethod
    void publishWorkforceEvent(String companyId, String professionalId, String eventType);
}
