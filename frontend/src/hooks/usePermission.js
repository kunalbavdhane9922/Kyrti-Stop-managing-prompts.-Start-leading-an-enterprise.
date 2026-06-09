/**
 * Sovereign Protocol — usePermission Hook
 * Checks RBAC permissions for the current authenticated user.
 * Used to conditionally render UI elements based on role.
 */

import { useCallback } from 'react';
import { useAuthStore } from '../store/authStore.js';
import { hasPermission, getRolePermissions, getRoleDisplayName } from '../config/rbac.js';

export function usePermission() {
  const role = useAuthStore(s => s.role);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  /**
   * Checks if the current user has a specific permission.
   * @param {string} permission - The permission key to check
   * @returns {boolean}
   */
  const can = useCallback((permission) => {
    if (!isAuthenticated || !role) return false;
    return hasPermission(role, permission);
  }, [isAuthenticated, role]);

  /**
   * Returns all permissions for the current user's role.
   * @returns {Object}
   */
  const permissions = getRolePermissions(role);

  /**
   * Returns the display name of the current role.
   * @returns {string}
   */
  const roleName = getRoleDisplayName(role);

  return { can, role, roleName, permissions, isAuthenticated };
}
