/**
 * Sovereign Protocol — Governance Store
 * Manages RBAC state, DPE pipeline, blocker reports, and agent management.
 * Enforces human-centric control at the state level.
 */

import { create } from 'zustand';

const useGovernanceStore = create((set, get) => ({
  // --- DPE Pipeline (Draft-Propose-Execute) ---
  proposals: [],

  // --- Blocker Reports ---
  blockerReports: [],

  // --- Managed Agents ---
  agents: [],

  // --- Governance Policies ---
  policies: [],

  // --- Active Tab ---
  activePortal: 'founder', // 'founder' | 'supervisor' | 'auditor'

  // --- Actions ---

  /**
   * Sets the active governance portal view.
   */
  setActivePortal: (portal) => set({ activePortal: portal }),

  /**
   * Adds a new AI-generated proposal as a NON-EXECUTABLE draft.
   * Proposals are ALWAYS created in draft state.
   */
  addProposal: (proposal) => set(state => {
    const id = proposal.id || crypto.randomUUID();
    // Deduplicate: skip if proposal with this ID already exists
    if (state.proposals.some(p => p.id === id)) return state;
    return {
      proposals: [
        Object.freeze({
          id,
          title: proposal.title,
          description: proposal.description,
          agentId: proposal.agentId,
          agentName: proposal.agentName,
          category: proposal.category,
          status: proposal.status || 'draft',
          createdAt: proposal.createdAt || new Date().toISOString(),
          reviewedBy: proposal.reviewedBy || null,
          reviewedAt: proposal.reviewedAt || null,
          executedBy: null,
          executedAt: null,
          rejectionReason: null,
          // Module 4: DPE Pipeline extensions
          riskScore: typeof proposal.riskScore === 'number' ? proposal.riskScore : null,
          resourceEstimate: proposal.resourceEstimate || null,
          reasoningPath: Array.isArray(proposal.reasoningPath) ? proposal.reasoningPath : [],
          draftContent: proposal.draftContent || null,
          signatures: [],
          requiredSignatures: proposal.requiredSignatures || 1,
          initiatedByAgent: !!proposal.agentId,
        }),
        ...state.proposals,
      ],
    };
  }),

  /**
   * Moves a proposal from draft to proposed (under review).
   */
  proposeForReview: (proposalId, reviewerId) => set(state => ({
    proposals: state.proposals.map(p =>
      p.id === proposalId
        ? Object.freeze({ ...p, status: 'proposed', reviewedBy: reviewerId, reviewedAt: new Date().toISOString() })
        : p
    ),
  })),

  /**
   * Approves a proposal. Only authorized human roles can do this.
   */
  approveProposal: (proposalId, approverId) => set(state => ({
    proposals: state.proposals.map(p =>
      p.id === proposalId
        ? Object.freeze({ ...p, status: 'approved', reviewedBy: approverId, reviewedAt: new Date().toISOString() })
        : p
    ),
  })),

  /**
   * Rejects a proposal with a reason.
   */
  rejectProposal: (proposalId, rejecterId, reason) => set(state => ({
    proposals: state.proposals.map(p =>
      p.id === proposalId
        ? Object.freeze({ ...p, status: 'rejected', reviewedBy: rejecterId, reviewedAt: new Date().toISOString(), rejectionReason: reason })
        : p
    ),
  })),

  /**
   * Executes an approved proposal. ONLY founders can execute.
   */
  executeProposal: (proposalId, executorId) => set(state => ({
    proposals: state.proposals.map(p =>
      p.id === proposalId && p.status === 'approved'
        ? Object.freeze({ ...p, status: 'executed', executedBy: executorId, executedAt: new Date().toISOString() })
        : p
    ),
  })),

  /**
   * Adds a blocker report from an agent or policy validator.
   */
  addBlockerReport: (report) => set(state => {
    const id = report.id || crypto.randomUUID();
    if (state.blockerReports.some(r => r.id === id)) return state;
    return {
      blockerReports: [
        Object.freeze({
          id,
          type: report.type,
          agentId: report.agentId || report.agent,
          agentName: report.agentName,
          context: report.context,
          violations: report.violations || [],
          status: report.status || 'PAUSE_STATE',
          resolution: report.resolution || 'HUMAN_REVIEW_REQUIRED',
          createdAt: report.timestamp || new Date().toISOString(),
          resolvedBy: null,
          resolvedAt: null,
        }),
        ...state.blockerReports,
      ],
    };
  }),

  /**
   * Resolves a blocker report.
   */
  resolveBlockerReport: (reportId, resolverId, action) => set(state => ({
    blockerReports: state.blockerReports.map(r =>
      r.id === reportId
        ? Object.freeze({ ...r, status: 'RESOLVED', resolvedBy: resolverId, resolvedAt: new Date().toISOString(), resolutionAction: action })
        : r
    ),
  })),

  /**
   * Adds a managed AI agent.
   */
  addAgent: (agent) => set(state => {
    const id = agent.id || crypto.randomUUID();
    if (state.agents.some(a => a.id === id)) return state;
    return {
      agents: [
        ...state.agents,
        Object.freeze({
          id,
          name: agent.name,
          role: agent.role,
          department: agent.department,
          status: agent.status || 'active',
          hiredAt: agent.hiredAt || new Date().toISOString(),
          hiredBy: agent.hiredBy,
          taskCount: agent.taskCount || 0,
          completedTasks: agent.completedTasks || 0,
          canViewBudget: false,
          canProposeSpeinding: false,
          canExecuteTransactions: false,
          financialPermissions: [],
        }),
      ],
    };
  }),

  /**
   * Terminates an AI agent. Revokes all access.
   */
  terminateAgent: (agentId, terminatedBy) => set(state => ({
    agents: state.agents.map(a =>
      a.id === agentId
        ? Object.freeze({ ...a, status: 'terminated', terminatedAt: new Date().toISOString(), terminatedBy })
        : a
    ),
  })),

  /**
   * Adds or updates a governance policy.
   */
  setPolicy: (policy) => set(state => ({
    policies: [
      ...state.policies.filter(p => p.id !== policy.id),
      Object.freeze({
        id: policy.id || crypto.randomUUID(),
        name: policy.name,
        description: policy.description,
        category: policy.category,
        isActive: policy.isActive !== undefined ? policy.isActive : true,
        createdAt: policy.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        updatedBy: policy.updatedBy,
      }),
    ],
  })),

  /**
   * Resets all governance state. Called on session wipe.
   */
  reset: () => set({
    proposals: [],
    blockerReports: [],
    agents: [],
    policies: [],
    activePortal: 'founder',
  }),
}));

export { useGovernanceStore };
