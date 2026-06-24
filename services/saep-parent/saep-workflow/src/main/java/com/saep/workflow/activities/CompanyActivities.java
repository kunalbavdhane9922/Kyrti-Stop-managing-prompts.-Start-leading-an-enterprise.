package com.saep.workflow.activities;

import io.temporal.activity.ActivityInterface;
import io.temporal.activity.ActivityMethod;
import java.util.Map;

@ActivityInterface
public interface CompanyActivities {

    @ActivityMethod
    String createCompanyRecord(Map<String, Object> request);

    @ActivityMethod
    String createInitialDepartment(String companyId, String departmentName);

    @ActivityMethod
    String establishHumanAuthority(String companyId, String founderId);

    @ActivityMethod
    void publishCompanyEvent(String companyId, String eventType);
}
