package com.saep.company.domain;

import lombok.Getter;

@Getter
public enum SystemPermission {
    // Workspace & Company Management
    COMPANY_VIEW("company:view", "COMPANY", "Can view company details"),
    COMPANY_MANAGE("company:manage", "COMPANY", "Can manage company settings and delete workspace"),

    // Membership Management
    MEMBERS_VIEW("members:view", "MEMBERS", "Can view workspace members"),
    MEMBERS_INVITE("members:invite", "MEMBERS", "Can invite new members to the workspace"),
    MEMBERS_SUSPEND("members:suspend", "MEMBERS", "Can suspend workspace members"),
    MEMBERS_REMOVE("members:remove", "MEMBERS", "Can remove workspace members"),

    // Role Management
    ROLES_VIEW("roles:view", "ROLES", "Can view roles and permission assignments"),
    ROLES_CREATE("roles:create", "ROLES", "Can create custom roles"),
    ROLES_UPDATE("roles:update", "ROLES", "Can update existing roles"),
    ROLES_ARCHIVE("roles:archive", "ROLES", "Can archive custom roles");

    private final String code;
    private final String module;
    private final String description;

    SystemPermission(String code, String module, String description) {
        this.code = code;
        this.module = module;
        this.description = description;
    }
}
