package com.saep.common.event;

public class DomainEvents {

    public static final String VERSION_1 = "1";

    public record CompanyCreated(
            String companyId,
            String name,
            String domain,
            String createdBy
    ) {}

    public record TeamCreated(
            String teamId,
            String companyId,
            String name
    ) {}

    public record HiringRequested(
            String hiringRequestId,
            String companyId,
            String role,
            String requirements
    ) {}

    public record ProfessionalCreated(
            String professionalId,
            String companyId,
            String name,
            String skills
    ) {}

    public record PromotionGranted(
            String professionalId,
            String companyId,
            String newRole
    ) {}

    public record GovernanceApproved(
            String approvalId,
            String resourceId,
            String status
    ) {}
}
