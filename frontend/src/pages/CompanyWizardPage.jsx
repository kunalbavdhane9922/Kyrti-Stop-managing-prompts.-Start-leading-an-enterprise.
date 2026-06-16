import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { companyApi } from '../services/companyApi.js';
import { organizationApi } from '../services/organizationApi.js';
import { authApi } from '../services/authApi.js';
import { CryptoService } from '../security/CryptoService.js';
import { useAuthStore } from '../store/authStore.js';
import { useIdentityStore } from '../store/identityStore.js';

import { WizardShell } from '../components/wizard/WizardShell.jsx';
import { PhaseCompanyRegistration } from '../components/wizard/PhaseCompanyRegistration.jsx';
import { PhaseGovernance } from '../components/wizard/PhaseGovernance.jsx';
import { PhaseExecutiveLeadership } from '../components/wizard/PhaseExecutiveLeadership.jsx';
import { PhaseDepartmentBuilder } from '../components/wizard/PhaseDepartmentBuilder.jsx';
import { PhaseDepartmentHierarchy } from '../components/wizard/PhaseDepartmentHierarchy.jsx';
import { PhaseRoleAssignment } from '../components/wizard/PhaseRoleAssignment.jsx';
import { PhasePermissionMatrix } from '../components/wizard/PhasePermissionMatrix.jsx';
import { PhaseOrgChartPreview } from '../components/wizard/PhaseOrgChartPreview.jsx';
import { PhaseHumanInvitations } from '../components/wizard/PhaseHumanInvitations.jsx';
import { PhaseAIRecruitment } from '../components/wizard/PhaseAIRecruitment.jsx';

/**
 * CompanyWizardPage — 10-Phase Enterprise Organization Initialization System
 * 
 * Orchestrates the full wizard flow:
 * 1. Company Registration
 * 2. Board of Directors
 * 3. Executive Leadership
 * 4. Department Builder
 * 5. Department Hierarchy (teams + headcount)
 * 6. Role Assignment (review)
 * 7. Permission Matrix
 * 8. Org Chart Preview
 * 9. Human Invitations
 * 10. AI Recruitment (optional)
 * 
 * On submit:
 * - Creates the company via companyApi
 * - Initializes organization via companyApi
 * - Submits the full org build (nodes, departments, permissions) via organizationApi
 * - Joins the tenant and navigates to dashboard
 */
function CompanyWizardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const loginAction = useAuthStore(s => s.login);
  const completeLayerA = useIdentityStore(s => s.completeLayerA);

  const handleSubmit = useCallback(async (wizardData, setPhase) => {
    if (loading) return;
    setLoading(true);

    // ─── Global Production Validation ──────────────────────────────
    // Validates data even if the component is unmounted
    const c = wizardData.company;
    if (!c.name?.trim()) { setLoading(false); setPhase(1); throw new Error('Phase 1: Company Name is required.'); }
    if (!c.legalName?.trim()) { setLoading(false); setPhase(1); throw new Error('Phase 1: Legal Company Name is required.'); }
    if (!c.domain?.trim()) { setLoading(false); setPhase(1); throw new Error('Phase 1: Company Domain is required.'); }
    if (!c.industry?.trim()) { setLoading(false); setPhase(1); throw new Error('Phase 1: Industry is required.'); }
    if (!c.companyType?.trim()) { setLoading(false); setPhase(1); throw new Error('Phase 1: Company Type is required.'); }
    if (!c.hqCountry?.trim()) { setLoading(false); setPhase(1); throw new Error('Phase 1: Headquarters Country is required.'); }
    if (!c.hqState?.trim()) { setLoading(false); setPhase(1); throw new Error('Phase 1: Headquarters State is required.'); }
    if (!c.hqCity?.trim()) { setLoading(false); setPhase(1); throw new Error('Phase 1: Headquarters City is required.'); }
    if (!c.employeeCount || parseInt(c.employeeCount, 10) <= 0) { setLoading(false); setPhase(1); throw new Error('Phase 1: Current Employee Count must be a positive number'); }
    if (!c.growthStage) { setLoading(false); setPhase(1); throw new Error('Phase 1: Growth Stage is required'); }

    if (wizardData.departments.length === 0) { setLoading(false); setPhase(4); throw new Error('Phase 4: At least one department is required.'); }

    try {
      const tenantId = c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      
      // Acquire a valid access token for the initial company creation call
      let activeToken = window.__sovereignAccessToken;
      
      if (!activeToken) {
        // Try refreshing the session to get a new token
        try {
          const refreshRes = await authApi.refresh();
          activeToken = refreshRes.data?.accessToken;
          if (activeToken) window.__sovereignAccessToken = activeToken;
        } catch (e) {
          console.warn('Token refresh failed, proceeding as unauthenticated guest:', e.message);
        }
      }

      // ─── Step 1: Create Company ─────────────────────────────────────
      const companyPayload = {};
      Object.entries(c).forEach(([k, v]) => {
        if (v !== '' && v !== null && v !== undefined) {
          companyPayload[k] = k === 'employeeCount' ? Number(v) : v;
        }
      });

      if (!activeToken) {
        throw new Error('Authentication required. Please log in or register first.');
      }

      try {
        await companyApi.createCompany({ ...companyPayload, tenantId }, { token: activeToken });
      } catch (createErr) {
        // Handle unique constraint or existing company gracefully
        if (createErr.status === 409 || createErr.message.includes('duplicate') || createErr.message.includes('unique')) {
           // Company already created previously, we can proceed to initialize
           console.warn('Company or membership already exists. Resuming initialization...', createErr);
        } else {
           throw createErr;
        }
      }

      // ─── Step 2: Ensure Session is Updated ──────────────────────────
      // Since the company was just created, our current token has tenantId: null.
      // In a production-grade system, the API gateway allows initialization routes
      // without tenantId. So we can proceed to Step 3 using our current activeToken.
      // We will refresh the session AFTER initialization is fully complete.

      // ─── Step 3: Initialize Organization (now with tenant-scoped JWT) ─
      try {
        await companyApi.initializeCompany(
          tenantId,
          {
            tenantId,
            schemaVersion: 1,
            payload: JSON.stringify({ departments: [], roles: [], nodes: [] })
          },
          { token: activeToken }
        );
      } catch (initErr) {
        console.warn('Initialization response:', initErr.status, initErr.message);
        // Non-blocking — the company is created, initialization can be retried
        if (initErr.status !== 401 && initErr.status !== 403 && !initErr.message.includes('already')) {
          throw new Error(initErr.message || `Initialization failed (HTTP ${initErr.status})`);
        }
      }

      // ─── Step 4: Submit Full Org Build ──────────────────────────────
      const buildPayload = transformWizardDataToBuildPayload(wizardData);
      try {
        await organizationApi.createBuild(tenantId, buildPayload, { token: activeToken });
      } catch (buildErr) {
        console.warn('Organization build submission failed (non-blocking):', buildErr.message);
        // Non-blocking — the company is created, org build can be retried later
      }

      // After successful build, switch the frontend state to the new tenant.
      // This assumes the backend has auto-joined the user to the created company.
      // Force a session refresh to get a token WITH the new tenantId.
      try {
        const refreshRes = await authApi.refresh();
        if (refreshRes.data?.accessToken) {
          window.__sovereignAccessToken = refreshRes.data.accessToken;
          loginAction({
            ...refreshRes.data.user,
            tenantId,
          });
        }
      } catch (e) {
        console.warn('Post-creation session refresh failed:', e.message);
      }

      navigate('/dashboard');
    } catch (err) {
      console.error('Enterprise creation failed:', err);
      setLoading(false);
      // The WizardShell will show the error via setError
      throw err;
    }
  }, [loading, loginAction, completeLayerA, navigate]);

  const handleSubmitSafe = useCallback(async (wizardData, setPhase) => {
    try {
      await handleSubmit(wizardData, setPhase);
    } catch (err) {
      // Error is already logged
      throw err;
    }
  }, [handleSubmit]);

  return (
    <WizardShell onSubmit={handleSubmitSafe} loading={loading}>
      <PhaseCompanyRegistration />
      <PhaseGovernance />
      <PhaseExecutiveLeadership />
      <PhaseDepartmentBuilder />
      <PhaseDepartmentHierarchy />
      <PhaseRoleAssignment />
      <PhasePermissionMatrix />
      <PhaseOrgChartPreview />
      <PhaseHumanInvitations />
      <PhaseAIRecruitment />
    </WizardShell>
  );
}

/**
 * Transform the wizard's nested state into the flat build payload
 * expected by the OrganizationController.
 */
function toTitleCase(str) {
  if (!str) return str;
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

function transformWizardDataToBuildPayload(wizardData) {
  const departments = [];
  const nodes = [];
  const permissions = [];

  // ─── Departments ────────────────────────────────────────────────────
  wizardData.departments.forEach(d => {
    departments.push({
      tempId: d.tempId,
      name: toTitleCase(d.name),
      description: d.description || '',
      isCustom: d.isCustom || false,
    });
  });

  // ─── Board Members → Nodes ──────────────────────────────────────────
  wizardData.boardMembers.forEach(m => {
    nodes.push({
      tempId: m.id,
      title: m.position || 'Board Member',
      nodeType: 'BOARD_MEMBER',
      occupantType: m.personType === 'HUMAN' ? 'HUMAN' : 'AI_VACANT',
      occupantName: m.personType === 'HUMAN' ? toTitleCase(m.name) : null,
      occupantEmail: m.personType === 'HUMAN' ? m.email : null,
      occupantPhone: m.personType === 'HUMAN' ? m.phone : null,
      assignmentStatus: m.personType === 'HUMAN' ? 'ASSIGNED' : 'AI_VACANT',
      parentNodeId: null,
      departmentId: null,
      groupCount: 1,
    });
  });

  // ─── Executives → Nodes ─────────────────────────────────────────────
  wizardData.executives.forEach(ex => {
    const title = ex.isCustom ? toTitleCase(ex.customTitle) : ex.role;
    let parentNodeId = ex.reportingTo || null;

    // PRODUCTION GRADE ENFORCEMENT: All non-CEO Chiefs MUST report to CEO
    if (!ex.isCustom && ex.role !== 'CEO') {
      const ceo = wizardData.executives.find(e => !e.isCustom && e.role === 'CEO');
      if (ceo) {
        parentNodeId = ceo.id;
      }
    }

    nodes.push({
      tempId: ex.id,
      title,
      nodeType: 'EXECUTIVE',
      occupantType: ex.occupantType === 'HUMAN' ? 'HUMAN' : 'AI_VACANT',
      occupantName: ex.occupantType === 'HUMAN' ? toTitleCase(ex.name) : null,
      occupantEmail: ex.occupantType === 'HUMAN' ? ex.email : null,
      assignmentStatus: ex.occupantType === 'HUMAN' ? 'ASSIGNED' : 'AI_VACANT',
      parentNodeId: parentNodeId,
      departmentId: null,
      groupCount: 1,
    });
  });

  // ─── Department Leaders & Teams → Nodes ─────────────────────────────
  wizardData.departments.forEach(dept => {
    const h = wizardData.hierarchy[dept.name];
    if (!h) return;

    // Leaders
    h.leaders.forEach(l => {
      const role = l.role === 'CUSTOM' ? toTitleCase(l.customRole) : `${l.role} ${toTitleCase(dept.name)}`;
      nodes.push({
        tempId: l.id,
        title: role,
        nodeType: 'DEPT_LEAD',
        occupantType: l.occupantType,
        occupantName: l.occupantType === 'HUMAN' ? toTitleCase(l.name) : null,
        occupantEmail: l.occupantType === 'HUMAN' ? l.email : null,
        assignmentStatus: l.occupantType === 'HUMAN' && l.name ? 'ASSIGNED' : 'AI_VACANT',
        parentNodeId: l.reportingTo || null,
        departmentId: dept.tempId,
        groupCount: 1,
      });
    });

    // Teams
    h.teams.forEach(team => {
      if (!team.name) return;
      team.headcount.forEach(hc => {
        if (hc.count > 0) {
          nodes.push({
            tempId: `${team.id}-${hc.seniority}`,
            title: `${hc.seniority} ${toTitleCase(team.name)}`,
            nodeType: 'POSITION_GROUP',
            occupantType: 'AI_VACANT',
            assignmentStatus: 'AI_VACANT',
            parentNodeId: h.leaders.length > 0 ? h.leaders[0].id : null,
            departmentId: dept.tempId,
            groupCount: hc.count,
            seniority: hc.seniority,
          });
        }
      });
    });
  });

  // ─── Permissions ────────────────────────────────────────────────────
  wizardData.permissions.forEach(p => {
    const nodeRef = nodes.find(n => n.title === p.roleTitle);
    if (!nodeRef) return;
    Object.entries(p.grants).forEach(([key, granted]) => {
      if (granted) {
        permissions.push({
          nodeId: nodeRef.tempId,
          permissionKey: key,
          isGranted: true,
        });
      }
    });
  });

  return { departments, nodes, permissions };
}

export { CompanyWizardPage };
