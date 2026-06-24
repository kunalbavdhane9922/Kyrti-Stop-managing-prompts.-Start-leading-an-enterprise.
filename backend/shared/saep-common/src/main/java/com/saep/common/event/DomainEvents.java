package com.saep.common.event;

public class DomainEvents {

    public static final String VERSION_1 = "1";

    public record CompanyCreated(
            String companyId,
            String name,
            String domain,
            String createdBy
    ) {}

    public record MemberInvited(String invitationId, String tenantId, String email) {}
    public record MembershipCreated(String membershipId, String tenantId, String userId) {}
    public record MemberJoined(String membershipId, String tenantId, String userId, java.time.LocalDateTime joinedAt) {}
    public record MemberSuspended(String membershipId, String tenantId, String userId) {}
    public record MemberRemoved(String membershipId, String tenantId, String userId) {}

    // --- Phase 3: Roles & Permissions ---
    public record RoleCreated(String roleId, String tenantId, String name) {}
    public record MembershipRoleAssigned(String membershipId, String roleId, String tenantId) {}
    public record RolePermissionsUpdated(String roleId, String tenantId) {}

    // Audit Event
    public record AuditEvent(String type, String tenantId, String userId, String resourceId, String details) {}

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
