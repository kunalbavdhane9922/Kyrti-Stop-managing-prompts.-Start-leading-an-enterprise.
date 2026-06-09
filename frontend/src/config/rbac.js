/**
 * Sovereign Protocol — Role-Based Access Control (RBAC) Matrix
 * Defines permissions for each human role in the governance hierarchy.
 * AI agents have ZERO permissions in this matrix — they are operational only.
 */

export const ROLES = Object.freeze({
  FOUNDER: 'founder',
  SUPERVISOR: 'supervisor',
  AUDITOR: 'auditor',
});

/**
 * Complete permission matrix.
 * Each permission is a boolean flag indicating whether the role can perform the action.
 */
export const PERMISSIONS = Object.freeze({
  [ROLES.FOUNDER]: {
    // Agent Management
    canHireAgents: true,
    canTerminateAgents: true,
    canModifyAgentConfig: true,

    // Governance
    canApproveProposals: true,
    canRejectProposals: true,
    canExecuteProposals: true,
    canModifyPolicies: true,
    canAssignRoles: true,

    // Treasury
    canViewTreasury: true,
    canFundOpsWallet: true,
    canFundAgentWallets: true,
    canInitiateMultiSig: true,

    // Audit
    canViewAuditLogs: true,
    canExportAuditLogs: true,
    canViewBlockerReports: true,

    // Operational
    canAssignTasks: true,
    canReviewOutputs: true,
    canViewDashboard: true,
    canViewSecurityDashboard: true,

    // Strategic
    canApproveStrategicChanges: true,
    canModifyCompanyPolicies: true,

    // Module 2: Command Center
    canViewAgentOS: true,
    canWipeAgentMemory: true,
    canHireFromMarketplace: true,
    canViewServiceFees: true,
    canSignPayDistribution: true,
  },

  [ROLES.SUPERVISOR]: {
    // Agent Management
    canHireAgents: false,
    canTerminateAgents: false,
    canModifyAgentConfig: false,

    // Governance
    canApproveProposals: true,
    canRejectProposals: true,
    canExecuteProposals: false,
    canModifyPolicies: false,
    canAssignRoles: false,

    // Treasury
    canViewTreasury: false,
    canFundOpsWallet: false,
    canFundAgentWallets: false,
    canInitiateMultiSig: false,

    // Audit
    canViewAuditLogs: true,
    canExportAuditLogs: false,
    canViewBlockerReports: true,

    // Operational
    canAssignTasks: true,
    canReviewOutputs: true,
    canViewDashboard: true,
    canViewSecurityDashboard: false,

    // Strategic
    canApproveStrategicChanges: false,
    canModifyCompanyPolicies: false,

    // Module 2: Command Center
    canViewAgentOS: true,
    canWipeAgentMemory: false,
    canHireFromMarketplace: false,
    canViewServiceFees: true,
    canSignPayDistribution: false,
  },

  [ROLES.AUDITOR]: {
    // Agent Management
    canHireAgents: false,
    canTerminateAgents: false,
    canModifyAgentConfig: false,

    // Governance
    canApproveProposals: false,
    canRejectProposals: false,
    canExecuteProposals: false,
    canModifyPolicies: false,
    canAssignRoles: false,

    // Treasury
    canViewTreasury: false,
    canFundOpsWallet: false,
    canFundAgentWallets: false,
    canInitiateMultiSig: false,

    // Audit
    canViewAuditLogs: true,
    canExportAuditLogs: true,
    canViewBlockerReports: true,

    // Operational
    canAssignTasks: false,
    canReviewOutputs: true,
    canViewDashboard: true,
    canViewSecurityDashboard: true,

    // Strategic
    canApproveStrategicChanges: false,
    canModifyCompanyPolicies: false,

    // Module 2: Command Center
    canViewAgentOS: true,
    canWipeAgentMemory: false,
    canHireFromMarketplace: false,
    canViewServiceFees: true,
    canSignPayDistribution: false,
  },
});

/**
 * Checks if a role has a specific permission.
 * @param {string} role - The user's role (from ROLES enum)
 * @param {string} permission - The permission key to check
 * @returns {boolean} Whether the role has the permission
 */
export function hasPermission(role, permission) {
  const rolePermissions = PERMISSIONS[role];
  if (!rolePermissions) return false;
  return rolePermissions[permission] === true;
}

/**
 * Returns all permissions for a given role.
 * @param {string} role - The user's role
 * @returns {Object} The permissions object for the role
 */
export function getRolePermissions(role) {
  return PERMISSIONS[role] || {};
}

/**
 * Returns the display name for a role.
 * @param {string} role - The role identifier
 * @returns {string} Human-readable role name
 */
export function getRoleDisplayName(role) {
  const names = {
    [ROLES.FOUNDER]: 'Founder',
    [ROLES.SUPERVISOR]: 'AI Supervisor',
    [ROLES.AUDITOR]: 'Auditor',
  };
  return names[role] || 'Unknown Role';
}
