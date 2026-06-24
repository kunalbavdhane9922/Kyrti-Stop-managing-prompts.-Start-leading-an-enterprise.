package com.saep.workflow.activities;

import io.temporal.activity.ActivityInterface;
import io.temporal.activity.ActivityMethod;
import java.util.List;
import java.util.Map;

@ActivityInterface
public interface HiringActivities {

    @ActivityMethod
    List<Map<String, Object>> searchMarketplace(String requiredProfessionId, Map<String, Object> criteria);

    @ActivityMethod
    Map<String, Object> evaluateCandidates(List<Map<String, Object>> candidates, String companyId);

    @ActivityMethod
    Map<String, Object> conductInterview(String candidateId, String companyId);

    @ActivityMethod
    void requestHumanApproval(String companyId, String candidateId, String workflowId);

    @ActivityMethod
    String createEmploymentRecord(String companyId, String candidateId);

    @ActivityMethod
    void publishHiringEvent(String companyId, String candidateId, String eventType);
}
