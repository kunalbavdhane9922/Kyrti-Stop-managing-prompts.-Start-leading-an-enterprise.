/**
 * Sovereign Protocol — Agent OS Store (Module 2)
 * Manages the Bipartite Cognitive Architecture state.
 * Separates immutable Skill Modules from stateful Episodic Memory.
 *
 * SECURITY: This store is PHYSICALLY ISOLATED from treasuryStore.
 * Agents managed here have ZERO visibility into financial metadata.
 */

import { create } from 'zustand';

const useAgentOSStore = create((set, get) => ({
  // --- Agent Roster ---
  agents: [],

  // --- Selected Agent for Detail View ---
  selectedAgentId: null,

  // --- Skill Module Registry (Immutable, Read-Only) ---
  skillModules: [],

  // --- Memory Vault State ---
  memoryVaults: {},

  // --- Detachment State Machine ---
  detachmentState: {
    isActive: false,
    targetAgentId: null,
    confirmationStep: 0, // 0=idle, 1=confirm, 2=executing, 3=completed
    completedAt: null,
  },

  // --- Loading ---
  isLoading: false,

  // --- Actions ---

  /**
   * Sets the full agent roster with bipartite architecture data.
   */
  setAgents: (agents) => set({
    agents: agents.map(a => Object.freeze({
      id: a.id,
      name: a.name,
      role: a.role,
      department: a.department,
      status: a.status || 'active',
      executionState: a.executionState || 'idle',
      hiredAt: a.hiredAt,
      skills: a.skills || [],
      memoryAccess: a.memoryAccess || 'encrypted',
      contextWindowSize: a.contextWindowSize || 8192,
      lastActiveAt: a.lastActiveAt || null,
      taskCount: a.taskCount || 0,
      completedTasks: a.completedTasks || 0,
      accuracy: a.accuracy || 0,
      avgLatency: a.avgLatency || 0,
      tier: a.tier || 3, // Default to Tier 3 (Specialist)
      model: a.model || 'Llama-3-8B',
    })),
  }),

  /**
   * Selects an agent for the detail workspace view.
   */
  selectAgent: (agentId) => set({ selectedAgentId: agentId }),

  /**
   * Returns the currently selected agent object.
   */
  getSelectedAgent: () => {
    const state = get();
    return state.agents.find(a => a.id === state.selectedAgentId) || null;
  },

  /**
   * Sets the immutable skill module library.
   * These are READ-ONLY manifests — no modification allowed.
   */
  setSkillModules: (modules) => set({
    skillModules: modules.map(m => Object.freeze({
      id: m.id,
      name: m.name,
      category: m.category,
      version: m.version,
      description: m.description,
      isPortable: m.isPortable !== undefined ? m.isPortable : true,
      immutable: true,
    })),
  }),

  /**
   * Sets the memory vault data for a specific agent.
   */
  setMemoryVault: (agentId, vaultData) => set(state => ({
    memoryVaults: {
      ...state.memoryVaults,
      [agentId]: Object.freeze({
        agentId,
        episodicMemory: {
          status: vaultData.episodicMemory?.status || 'encrypted',
          entryCount: vaultData.episodicMemory?.entryCount || 0,
          lastSyncAt: vaultData.episodicMemory?.lastSyncAt || null,
          encryptionAlgorithm: 'AES-256-GCM',
          accessLevel: vaultData.episodicMemory?.accessLevel || 'company_isolated',
        },
        semanticSkill: {
          status: vaultData.semanticSkill?.status || 'active',
          experienceScore: vaultData.semanticSkill?.experienceScore || 0,
          isPortable: true,
          migratable: true,
        },
        contextWindow: {
          activeTokens: vaultData.contextWindow?.activeTokens || 0,
          maxTokens: vaultData.contextWindow?.maxTokens || 128000,
          utilizationPercent: vaultData.contextWindow?.utilizationPercent || 0,
        },
      }),
    },
  })),

  /**
   * Initiates the detachment (kill switch) flow for an agent.
   * Step 1: Request confirmation.
   */
  initiateDetachment: (agentId) => set({
    detachmentState: {
      isActive: true,
      targetAgentId: agentId,
      confirmationStep: 1,
      completedAt: null,
    },
  }),

  /**
   * Confirms detachment — executes memory wipe and access revocation.
   */
  confirmDetachment: () => set(state => {
    const targetId = state.detachmentState.targetAgentId;
    if (!targetId) return state;

    return {
      detachmentState: {
        ...state.detachmentState,
        confirmationStep: 3,
        completedAt: new Date().toISOString(),
      },
      agents: state.agents.map(a =>
        a.id === targetId
          ? Object.freeze({
              ...a,
              status: 'terminated',
              memoryAccess: 'revoked',
              executionState: 'terminated',
            })
          : a
      ),
      memoryVaults: {
        ...state.memoryVaults,
        [targetId]: state.memoryVaults[targetId]
          ? Object.freeze({
              ...state.memoryVaults[targetId],
              episodicMemory: {
                ...state.memoryVaults[targetId].episodicMemory,
                status: 'orphaned',
                accessLevel: 'revoked',
              },
            })
          : undefined,
      },
    };
  }),

  /**
   * Cancels the detachment flow.
   */
  cancelDetachment: () => set({
    detachmentState: {
      isActive: false,
      targetAgentId: null,
      confirmationStep: 0,
      completedAt: null,
    },
  }),

  /**
   * Promotes an agent to a new tier, upgrading model and context window.
   */
  promoteAgent: (agentId, newTier) => set(state => {
    const roleMap = {
      1: 'Director',
      2: 'Senior Manager',
      3: 'Specialist'
    };
    const modelMap = {
      1: 'GPT-4o',
      2: 'Llama-3-70B',
      3: 'Llama-3-8B'
    };
    const contextMap = {
      1: 128000,
      2: 64000,
      3: 8192
    };

    return {
      agents: state.agents.map(a => {
        if (a.id === agentId) {
          return Object.freeze({
            ...a,
            tier: newTier,
            model: modelMap[newTier],
            role: `${roleMap[newTier]} (${a.department})`,
            contextWindowSize: contextMap[newTier],
          });
        }
        return a;
      }),
      memoryVaults: {
        ...state.memoryVaults,
        [agentId]: state.memoryVaults[agentId]
          ? Object.freeze({
              ...state.memoryVaults[agentId],
              contextWindow: {
                ...state.memoryVaults[agentId].contextWindow,
                maxTokens: contextMap[newTier],
                utilizationPercent: Math.round((state.memoryVaults[agentId].contextWindow.activeTokens / contextMap[newTier]) * 100) || 0,
              }
            })
          : undefined,
      }
    };
  }),

  /**
   * Sets loading state.
   */
  setLoading: (loading) => set({ isLoading: loading }),

  /**
   * Resets all Agent OS state. Called on session wipe.
   */
  reset: () => set({
    agents: [],
    selectedAgentId: null,
    skillModules: [],
    memoryVaults: {},
    detachmentState: {
      isActive: false,
      targetAgentId: null,
      confirmationStep: 0,
      completedAt: null,
    },
    isLoading: false,
  }),
}));

export { useAgentOSStore };
