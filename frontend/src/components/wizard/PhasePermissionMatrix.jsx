import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useWizard } from './WizardShell.jsx';
import { Shield, ChevronDown, ChevronUp, Plus, Check, User, AlertTriangle } from 'lucide-react';
import { organizationApi } from '../../services/organizationApi.js';

/**
 * Phase 7 — Permission Matrix Builder
 * Fetches permission catalog from DB (system + custom).
 * User selects permissions for each unique role.
 * 
 * RBAC Security Rules (based on industry best practices):
 * 1. Restricted permissions (admin, production deploy, budget approve) 
 *    can only be assigned to elevated roles (Board, Executive, Dept Leaders).
 * 2. "Select All" respects restrictions — non-elevated roles only get non-restricted perms.
 * 3. Default permissions are pre-populated based on role tier/function.
 * 4. AI roles cannot have permissions that no human possesses.
 */

// Fallback catalog if backend is unreachable during wizard
const FALLBACK_CATALOG = [
  { category: 'TASK_MANAGEMENT', permissionKey: 'task.view', label: 'View Tasks' },
  { category: 'TASK_MANAGEMENT', permissionKey: 'task.create', label: 'Create Tasks' },
  { category: 'TASK_MANAGEMENT', permissionKey: 'task.edit_own', label: 'Edit Own Tasks' },
  { category: 'TASK_MANAGEMENT', permissionKey: 'task.assign', label: 'Assign Tasks' },
  { category: 'TASK_MANAGEMENT', permissionKey: 'task.approve', label: 'Approve Tasks' },
  { category: 'CODE_ENGINEERING', permissionKey: 'code.access_repo', label: 'Access Code Repository' },
  { category: 'CODE_ENGINEERING', permissionKey: 'code.create_pr', label: 'Create Pull Requests' },
  { category: 'CODE_ENGINEERING', permissionKey: 'code.merge', label: 'Merge Code' },
  { category: 'CODE_ENGINEERING', permissionKey: 'code.review', label: 'Code Review' },
  { category: 'DEPLOYMENT', permissionKey: 'deploy.staging', label: 'Deploy to Staging' },
  { category: 'DEPLOYMENT', permissionKey: 'deploy.production', label: 'Deploy to Production' },
  { category: 'DEPLOYMENT', permissionKey: 'deploy.rollback', label: 'Rollback Deployment' },
  { category: 'BUDGET_FINANCE', permissionKey: 'budget.view', label: 'View Budget' },
  { category: 'BUDGET_FINANCE', permissionKey: 'budget.approve', label: 'Approve Budget' },
  { category: 'ANALYTICS', permissionKey: 'analytics.team', label: 'View Team Analytics' },
  { category: 'ANALYTICS', permissionKey: 'analytics.company', label: 'View Company Analytics' },
  { category: 'ANALYTICS', permissionKey: 'analytics.export', label: 'Export Reports' },
  { category: 'HR_PEOPLE', permissionKey: 'hr.view_records', label: 'View Employee Records' },
  { category: 'HR_PEOPLE', permissionKey: 'hr.manage_leave', label: 'Manage Leave' },
  { category: 'PROJECT_MANAGEMENT', permissionKey: 'sprint.manage', label: 'Sprint Management' },
  { category: 'PROJECT_MANAGEMENT', permissionKey: 'release.approve', label: 'Release Approval' },
  { category: 'ADMINISTRATION', permissionKey: 'admin.manage_roles', label: 'Manage Roles' },
  { category: 'ADMINISTRATION', permissionKey: 'admin.manage_permissions', label: 'Manage Permissions' },
  { category: 'ADMINISTRATION', permissionKey: 'admin.system_config', label: 'System Configuration' },
];

/**
 * Human-Exclusive permissions based on SAEP Governance and Financial Governance policies.
 * "Humans Govern. AI Operates."
 * "Only humans may: Approve budgets, Approve payments, etc."
 */
const HUMAN_EXCLUSIVE_PERMISSIONS = new Set([
  'admin.manage_roles',
  'admin.manage_permissions',
  'admin.system_config',
  'budget.approve',
  'finance.payments',
  'hr.manage_payroll',
  'security.manage_access',
  'release.approve',
]);

/**
 * Elevated permissions based on Principle of Least Privilege.
 * High-risk operational/financial actions restricted to leadership.
 */
const ELEVATED_PERMISSIONS = new Set([
  'deploy.production',
  'deploy.rollback',
  'infra.manage',
  'budget.approve',
  'finance.payments',
  'admin.system_config',
  'admin.manage_permissions',
  'security.manage_access'
]);

/**
 * Determines if a role is occupied by a human.
 * AI roles cannot receive Human-Exclusive permissions.
 */
function isHumanRole(role) {
  return role.occupantType === 'HUMAN';
}

/**
 * Determines if a role is a leadership/executive role.
 * Non-elevated roles cannot receive Elevated permissions.
 */
function isElevatedRole(role) {
  if (role.category === 'Board' || role.category === 'Executive') return true;
  return !!role.title.toLowerCase().match(/(vp|director|manager|head|lead)/);
}

/**
 * Returns default permission grants for a role based on RBAC best practices.
 * Following the principle of least privilege with role-appropriate defaults.
 */
function getDefaultPermissions(role, catalogKeys) {
  const grants = {};
  
  // Helper to grant a set of permissions
  const grant = (...keys) => {
    keys.forEach(k => { if (catalogKeys.has(k)) grants[k] = true; });
  };

  const titleLower = role.title.toLowerCase();
  const category = role.category;
  const deptLower = category.toLowerCase();
  const isTechDept = ['engineering', 'product', 'data science', 'security', 'research', 'it'].some(d => deptLower.includes(d));

  // ─── Board Members ───
  if (category === 'Board') {
    grant(
      'task.view', 'budget.view', 'budget.approve',
      'analytics.team', 'analytics.company', 'analytics.export',
      'hr.view_records', 'admin.manage_roles', 'admin.audit_logs'
    );
    if (titleLower.includes('chairman') || titleLower.includes('chairperson')) {
      grant('admin.manage_permissions', 'admin.system_config');
    }
  } 
  // ─── CEO ───
  else if (titleLower === 'ceo' || titleLower === 'chief executive officer') {
    catalogKeys.forEach(k => { grants[k] = true; });
  } 
  // ─── C-Suite Executives ───
  else if (category === 'Executive') {
    grant(
      'task.view', 'task.create', 'task.edit_own', 'task.assign', 'task.approve', 'task.edit_any',
      'analytics.team', 'analytics.company', 'analytics.export',
      'budget.view', 'budget.request', 'hr.view_records', 'project.create'
    );

    if (['cto', 'cio'].some(r => titleLower.includes(r))) {
      grant(
        'code.access_repo', 'code.create_pr', 'code.merge', 'code.review', 'code.branch_manage',
        'deploy.staging', 'deploy.production', 'deploy.rollback', 'infra.manage',
        'sprint.manage', 'release.approve',
        'admin.system_config', 'admin.manage_integrations', 'security.manage_access'
      );
    }
    if (titleLower.includes('cfo')) {
      grant('budget.approve', 'finance.payments', 'finance.invoices', 'analytics.export');
    }
    if (titleLower.includes('coo')) {
      grant('sprint.manage', 'release.approve', 'hr.manage_leave', 'budget.approve');
    }
    if (titleLower.includes('chro')) {
      grant('hr.manage_leave', 'hr.conduct_reviews', 'hr.manage_payroll', 'admin.manage_roles', 'comm.send_announcements');
    }
    if (titleLower.includes('cmo')) {
      grant('analytics.export', 'comm.send_announcements', 'comm.manage_channels');
    }
    if (titleLower.includes('cpo')) {
      grant('sprint.manage', 'release.approve', 'project.create', 'project.archive');
    }
    if (titleLower.includes('ciso')) {
      grant('security.view_incidents', 'security.manage_access', 'security.data_classification', 'admin.audit_logs');
    }
  } 
  // ─── Department Leaders ───
  else if (category !== 'Board' && category !== 'Executive' && titleLower.match(/(vp|director|manager|head|lead)/)) {
    grant(
      'task.view', 'task.create', 'task.edit_own', 'task.assign', 'task.approve', 'task.edit_any',
      'analytics.team', 'budget.view', 'budget.request', 'hr.view_records', 'hr.conduct_reviews',
      'project.create', 'comm.manage_channels'
    );

    if (isTechDept) {
      grant('code.access_repo', 'code.create_pr', 'code.merge', 'code.review', 'code.branch_manage', 'deploy.staging', 'sprint.manage', 'release.approve');
    }
    
    // VP / Director gets more
    if (titleLower.match(/(vp|director)/)) {
      grant('analytics.company', 'analytics.export', 'hr.manage_leave');
      if (isTechDept) {
        grant('deploy.production');
      }
    }
  } 
  // ─── Senior Team Members ───
  else if (titleLower.includes('senior')) {
    // Seniors can assign and approve tasks for juniors
    grant('task.view', 'task.create', 'task.edit_own', 'task.assign', 'task.approve', 'analytics.team');
    if (isTechDept) {
      grant('code.access_repo', 'code.create_pr', 'code.review', 'code.merge', 'sprint.manage', 'deploy.staging');
    }
  } 
  // ─── Mid-Level / Standard IC ───
  else if (!titleLower.includes('junior') && !titleLower.includes('intern')) {
    // Standard contributor can create tasks and review code, but cannot assign or approve tasks
    grant('task.view', 'task.create', 'task.edit_own');
    if (isTechDept) {
      grant('code.access_repo', 'code.create_pr', 'code.review');
    }
  } 
  // ─── Junior / Intern ───
  else {
    // Juniors ONLY view tasks and edit their own assigned tasks. They do not create, assign, or approve.
    grant('task.view', 'task.edit_own');
    if (isTechDept) {
      // Juniors can submit code, but cannot review or merge
      grant('code.access_repo', 'code.create_pr');
    }
  }

  // ENFORCE DUAL-LAYER SECURITY: Remove restricted permissions
  const isHuman = isHumanRole(role);
  const isElevated = isElevatedRole(role);

  for (const key of Object.keys(grants)) {
    if (!isHuman && HUMAN_EXCLUSIVE_PERMISSIONS.has(key)) {
      delete grants[key];
    }
    if (!isElevated && ELEVATED_PERMISSIONS.has(key)) {
      delete grants[key];
    }
  }

  return grants;
}

export function PhasePermissionMatrix() {
  const { wizardData, updateData, registerValidator } = useWizard();
  // During wizard, company isn't created yet — use 'default' to fetch global permission catalog
  const tenantId = 'default';
  const [catalog, setCatalog] = useState([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [expandedRole, setExpandedRole] = useState({});
  const [customPermKey, setCustomPermKey] = useState('');
  const [customPermLabel, setCustomPermLabel] = useState('');
  const [customPermCategory, setCustomPermCategory] = useState('CUSTOM');
  const [restrictionWarning, setRestrictionWarning] = useState(null);
  const defaultsAppliedRef = useRef(false);

  // Fetch permission catalog from backend
  useEffect(() => {
    async function fetchCatalog() {
      try {
        const { data } = await organizationApi.getPermissionCatalog(tenantId || 'default');
        if (data && data.length > 0) {
          setCatalog(data);
        } else {
          setCatalog(FALLBACK_CATALOG);
        }
      } catch (err) {
        console.warn('Could not fetch permission catalog from backend, using fallback:', err.message);
        setCatalog(FALLBACK_CATALOG);
      } finally {
        setLoadingCatalog(false);
      }
    }
    fetchCatalog();
  }, [tenantId]);

  // Build unique roles from hierarchy
  const uniqueRoles = useMemo(() => {
    const roles = [];
    const seen = new Set();

    const addRole = (title, category, occupantType) => {
      if (!title || seen.has(title)) return;
      seen.add(title);
      roles.push({ title, category, occupantType });
    };

    wizardData.boardMembers.forEach(m => addRole(m.position, 'Board', m.personType));
    wizardData.executives.forEach(ex => addRole(ex.isCustom ? ex.customTitle : ex.role, 'Executive', ex.occupantType));

    wizardData.departments.forEach(dept => {
      const h = wizardData.hierarchy[dept.name];
      if (!h) return;
      h.leaders.forEach(l => {
        const role = l.role === 'CUSTOM' ? l.customRole : `${l.role} ${dept.name}`;
        addRole(role, dept.name, l.occupantType);
      });
      h.teams.forEach(team => {
        if (!team.name) return;
        team.headcount.forEach(hc => {
          if (hc.count > 0) addRole(`${hc.seniority} ${team.name}`, dept.name, 'AI_VACANT');
        });
      });
    });

    return roles;
  }, [wizardData]);

  // Build set of all catalog keys for quick lookup
  const catalogKeySet = useMemo(() => {
    return new Set(catalog.map(c => c.permissionKey));
  }, [catalog]);

  // Auto-populate default permissions when Phase 7 loads for the first time
  useEffect(() => {
    if (loadingCatalog || catalog.length === 0 || uniqueRoles.length === 0) return;
    if (defaultsAppliedRef.current) return;
    
    // Only apply defaults if no permissions have been set yet
    const existingPerms = wizardData.permissions;
    if (existingPerms.length > 0) {
      defaultsAppliedRef.current = true;
      return;
    }

    const defaultPerms = uniqueRoles.map(role => {
      const defaults = getDefaultPermissions(role, catalogKeySet);
      return { roleTitle: role.title, grants: defaults };
    });

    updateData('permissions', defaultPerms);
    defaultsAppliedRef.current = true;
  }, [loadingCatalog, catalog, uniqueRoles, catalogKeySet]);

  // Permission state: { "CEO": { "task.view": true, "task.create": true, ... }, ... }
  const permissions = wizardData.permissions;

  const getPerms = (roleTitle) => {
    const found = permissions.find(p => p.roleTitle === roleTitle);
    return found ? found.grants : {};
  };

  /**
   * Checks if a permission can be toggled for this role.
   * Returns null if allowed, or an error message string if blocked.
   */
  const checkPermissionRestriction = (role, permKey) => {
    const permLabel = catalog.find(c => c.permissionKey === permKey)?.label || permKey;
    
    // Check Human Authority
    if (HUMAN_EXCLUSIVE_PERMISSIONS.has(permKey) && !isHumanRole(role)) {
      return `Security Policy Violation: "${permLabel}" requires Human Authority. AI entities cannot be granted this permission.`;
    }

    // Check Hierarchical Authority
    if (ELEVATED_PERMISSIONS.has(permKey) && !isElevatedRole(role)) {
      return `Security Policy Violation: "${permLabel}" is a high-risk permission restricted to Leadership, Executives, and Board members.`;
    }

    return null;
  };

  const togglePerm = (roleTitle, permKey) => {
    const role = uniqueRoles.find(r => r.title === roleTitle);
    if (role) {
      const currentGrants = getPerms(roleTitle);
      // Only check restriction when trying to ENABLE the permission
      if (!currentGrants[permKey]) {
        const restriction = checkPermissionRestriction(role, permKey);
        if (restriction) {
          setRestrictionWarning(restriction);
          setTimeout(() => setRestrictionWarning(null), 4000);
          return;
        }
      }
    }

    const current = [...permissions];
    const idx = current.findIndex(p => p.roleTitle === roleTitle);
    if (idx >= 0) {
      const grants = { ...current[idx].grants };
      grants[permKey] = !grants[permKey];
      current[idx] = { ...current[idx], grants };
    } else {
      current.push({ roleTitle, grants: { [permKey]: true } });
    }
    updateData('permissions', current);
  };

  const selectAll = (roleTitle) => {
    const role = uniqueRoles.find(r => r.title === roleTitle);
    const isHuman = role ? isHumanRole(role) : false;
    const isElevated = role ? isElevatedRole(role) : false;
    
    const current = [...permissions];
    const idx = current.findIndex(p => p.roleTitle === roleTitle);
    const allGrants = {};
    
    catalog.forEach(c => {
      // AI roles cannot receive Human-Exclusive permissions
      if (!isHuman && HUMAN_EXCLUSIVE_PERMISSIONS.has(c.permissionKey)) return;
      // Non-elevated roles cannot receive Elevated permissions
      if (!isElevated && ELEVATED_PERMISSIONS.has(c.permissionKey)) return;
      allGrants[c.permissionKey] = true;
    });
    
    if (idx >= 0) {
      current[idx] = { ...current[idx], grants: allGrants };
    } else {
      current.push({ roleTitle, grants: allGrants });
    }
    updateData('permissions', current);

    if (!isHuman || !isElevated) {
      const messages = [];
      if (!isHuman) messages.push('Human-exclusive');
      if (!isElevated) messages.push('Leadership-exclusive');
      setRestrictionWarning(`${messages.join(' and ')} permissions were excluded for "${roleTitle}" per security policy.`);
      setTimeout(() => setRestrictionWarning(null), 4000);
    }
  };

  const clearAll = (roleTitle) => {
    const current = permissions.filter(p => p.roleTitle !== roleTitle);
    updateData('permissions', current);
  };

  // Group catalog by category
  const catalogByCategory = useMemo(() => {
    const groups = {};
    catalog.forEach(c => {
      if (!groups[c.category]) groups[c.category] = [];
      groups[c.category].push(c);
    });
    return groups;
  }, [catalog]);

  const categoryLabels = {
    'TASK_MANAGEMENT': 'Task Management',
    'CODE_ENGINEERING': 'Code & Engineering',
    'DEPLOYMENT': 'Deployment & Infrastructure',
    'BUDGET_FINANCE': 'Budget & Finance',
    'ANALYTICS': 'Analytics & Reporting',
    'HR_PEOPLE': 'HR & People',
    'PROJECT_MANAGEMENT': 'Sprint & Project Management',
    'ADMINISTRATION': 'Administration',
    'COMMUNICATION': 'Communication',
    'SECURITY': 'Security',
    'CUSTOM': 'Custom Permissions',
  };

  const addCustomPermission = () => {
    if (!customPermKey.trim() || !customPermLabel.trim()) return;
    setCatalog(prev => [...prev, {
      category: customPermCategory,
      permissionKey: customPermKey.trim(),
      label: customPermLabel.trim(),
    }]);
    setCustomPermKey('');
    setCustomPermLabel('');
  };

  useEffect(() => {
    registerValidator(7, () => {
      for (const role of uniqueRoles) {
        const grants = getPerms(role.title) || {};
        const isHuman = isHumanRole(role);
        const isElevated = isElevatedRole(role);

        for (const [permKey, isGranted] of Object.entries(grants)) {
          if (!isGranted) continue;

          const permDef = catalog.find(c => c.permissionKey === permKey);
          const permLabel = permDef ? permDef.label : permKey;

          // ── Rule 1: Human-exclusive permissions check for AI roles ──
          if (HUMAN_EXCLUSIVE_PERMISSIONS.has(permKey) && !isHuman) {
            return `Security Policy Violation: AI role "${role.title}" has Human-Exclusive permission "${permLabel}". AI cannot have financial or governance authority. Please remove it.`;
          }

          // ── Rule 2: Elevated permissions check for non-leadership roles ──
          if (ELEVATED_PERMISSIONS.has(permKey) && !isElevated) {
            return `Security Policy Violation: Non-leadership role "${role.title}" has Elevated permission "${permLabel}". Only Board, Executives, and Department Leaders can hold this permission. Please remove it.`;
          }
        }
      }

      // ── Rule 3: AI roles must not have permissions that no Human possesses ──
      const humanRoles = uniqueRoles.filter(r => r.occupantType === 'HUMAN').map(r => r.title);
      const humanPerms = new Set();

      humanRoles.forEach(r => {
        const grants = getPerms(r) || {};
        Object.keys(grants).forEach(k => {
          if (grants[k]) humanPerms.add(k);
        });
      });

      const aiRoles = uniqueRoles.filter(r => r.occupantType !== 'HUMAN');
      for (const role of aiRoles) {
        const grants = getPerms(role.title) || {};
        for (const [permKey, isGranted] of Object.entries(grants)) {
          if (isGranted && !humanPerms.has(permKey)) {
            const permDef = catalog.find(c => c.permissionKey === permKey);
            const permLabel = permDef ? permDef.label : permKey;
            return `Security Risk: AI role "${role.title}" has permission "${permLabel}" which no Human possesses. Humans must remain superior.`;
          }
        }
      }
      return null;
    });
  }, [registerValidator, uniqueRoles, permissions, catalog]);

  return (
    <div className="wiz-phase">
      <div className="wiz-phase-header">
        <Shield size={24} className="wiz-phase-icon" />
        <div>
          <h2 className="wiz-phase-title">Permission Matrix Builder</h2>
          <p className="wiz-phase-desc">
            Configure access controls for each role. Permissions follow the Principle of Least Privilege — 
            defaults are pre-configured based on role seniority and function. All permissions are fully editable after launch.
          </p>
        </div>
      </div>

      <div className="wiz-info-note">
        <Shield size={14} style={{ flexShrink: 0 }} />
        <span>
          Permissions enforce a dual-layer security model:
          <b> <User size={10} style={{ verticalAlign: 'middle' }} /> Human Only</b> (Financial/Governance authority restricted to Humans) and
          <b> <Shield size={10} style={{ verticalAlign: 'middle' }} /> Leadership Only</b> (High-risk operational access restricted to Executives/Leaders).
        </span>
      </div>

      {/* Restriction Warning */}
      {restrictionWarning && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px', borderRadius: 8,
          background: 'rgba(107, 66, 38, 0.08)', border: '1px solid rgba(107, 66, 38, 0.2)',
          color: '#6B4226', fontSize: 12, marginBottom: 12,
          animation: 'fadeIn 0.2s ease'
        }}>
          <AlertTriangle size={14} style={{ flexShrink: 0 }} />
          <span>{restrictionWarning}</span>
        </div>
      )}

      {/* Add Custom Permission */}
      <div className="wiz-section">
        <h3 className="wiz-section-title">Add Custom Permission</h3>
        <div className="wiz-grid-3" style={{ alignItems: 'flex-end' }}>
          <div className="wiz-field">
            <label className="wiz-label-sm">Permission Key</label>
            <input className="wiz-input-sm" value={customPermKey} placeholder="e.g. custom.approve_design"
              onChange={e => setCustomPermKey(e.target.value)} />
          </div>
          <div className="wiz-field">
            <label className="wiz-label-sm">Label</label>
            <input className="wiz-input-sm" value={customPermLabel} placeholder="e.g. Approve Design"
              onChange={e => setCustomPermLabel(e.target.value)} />
          </div>
          <button className="wiz-btn-sm wiz-btn--add" onClick={addCustomPermission}
            disabled={!customPermKey.trim() || !customPermLabel.trim()}>
            <Plus size={14} /> Add
          </button>
        </div>
      </div>

      {loadingCatalog ? (
        <div className="wiz-loading">Loading permission catalog...</div>
      ) : uniqueRoles.length === 0 ? (
        <div className="wiz-empty-state">No roles defined yet. Go back and add positions first.</div>
      ) : (
        <div className="wiz-perm-matrix">
          {uniqueRoles.map(role => {
            const grants = getPerms(role.title);
            const grantCount = Object.values(grants).filter(Boolean).length;
            const isOpen = expandedRole[role.title] !== false;
            const isHuman = isHumanRole(role);
            const isElevated = isElevatedRole(role);

            return (
              <div key={role.title} className="wiz-perm-role-block">
                <div className="wiz-perm-role-header" onClick={() => setExpandedRole(p => ({ ...p, [role.title]: !isOpen }))}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                    <span className="wiz-perm-role-name">{role.title}</span>
                    <span className="wiz-perm-role-cat">{role.category}</span>
                    <span className="wiz-perm-count">{grantCount} / {catalog.length}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                    <button className="wiz-btn-xs" onClick={e => { e.stopPropagation(); selectAll(role.title); }}>All</button>
                    <button className="wiz-btn-xs" onClick={e => { e.stopPropagation(); clearAll(role.title); }}>None</button>
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>

                {isOpen && (
                  <div className="wiz-perm-grid">
                    {Object.entries(catalogByCategory).map(([cat, perms]) => (
                      <div key={cat} className="wiz-perm-category">
                        <div className="wiz-perm-cat-title">{categoryLabels[cat] || cat}</div>
                        {perms.map(p => {
                          const isHumanExclusive = HUMAN_EXCLUSIVE_PERMISSIONS.has(p.permissionKey);
                          const isElevatedPerm = ELEVATED_PERMISSIONS.has(p.permissionKey);
                          
                          const blockedByHuman = isHumanExclusive && !isHuman;
                          const blockedByHierarchy = isElevatedPerm && !isElevated;
                          const isBlocked = blockedByHuman || blockedByHierarchy;
                          const isChecked = !!grants[p.permissionKey];

                          let titleText = '';
                          if (blockedByHuman) titleText = 'Human Authority Required: AI cannot be granted this permission';
                          else if (blockedByHierarchy) titleText = 'Leadership Required: Non-elevated roles cannot be granted this permission';

                          return (
                            <label key={p.permissionKey}
                              className={`wiz-perm-checkbox ${isChecked ? 'wiz-perm-checkbox--checked' : ''} ${isBlocked ? 'wiz-perm-checkbox--restricted' : ''}`}
                              title={titleText}
                            >
                              <input type="checkbox"
                                checked={isChecked}
                                onChange={() => togglePerm(role.title, p.permissionKey)} />
                              <Check size={12} className="wiz-perm-check-icon" />
                              <span>{p.label}</span>
                              {isHumanExclusive && (
                                <span className="wiz-perm-restricted-badge" title="Human Exclusive Permission">
                                  <User size={10} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                                  Human Only
                                </span>
                              )}
                              {isElevatedPerm && !isHumanExclusive && (
                                <span className="wiz-perm-restricted-badge" title="Leadership Exclusive Permission">
                                  <Shield size={10} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                                  Leadership
                                </span>
                              )}
                            </label>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
