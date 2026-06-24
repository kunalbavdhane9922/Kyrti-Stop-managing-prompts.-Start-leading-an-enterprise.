package com.saep.workflow.activities;

import io.temporal.activity.ActivityInterface;
import io.temporal.activity.ActivityMethod;
import java.util.Map;

@ActivityInterface
public interface MarketplaceActivities {

    @ActivityMethod
    String registerProfession(Map<String, Object> request);

    @ActivityMethod
    void requestProfessionApproval(String professionId, String workflowId);

    @ActivityMethod
    void activateProfession(String professionId);

    @ActivityMethod
    void rejectProfession(String professionId);
}
