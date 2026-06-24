package com.saep.common.security;

import java.util.Set;
import java.util.UUID;

public interface PermissionResolver {
    Set<String> getPermissions(UUID membershipId);
    boolean hasPermission(UUID membershipId, String permission);
}
