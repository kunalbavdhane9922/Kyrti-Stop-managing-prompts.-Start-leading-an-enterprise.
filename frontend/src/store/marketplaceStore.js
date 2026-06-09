/**
 * Sovereign Protocol — Marketplace Store (Module 2)
 * Manages the Global AI Marketplace with ZK-Reputation Engine.
 *
 * SECURITY: This store NEVER stores or exposes:
 * - Previous employer identities
 * - Sensitive historical logs
 * - Raw performance data (only ZK-proofs)
 * All search is metadata-only (Skills, ROI, Latency).
 */

import { create } from 'zustand';

const useMarketplaceStore = create((set, get) => ({
  // --- Available Agents Catalog (Privacy-Safe) ---
  catalogAgents: [],

  // --- ZK-Proof Badge Collections ---
  zkBadges: {},

  // --- Search / Filter State (Privacy-Preserving) ---
  filters: {
    skills: [],
    minROI: 0,
    maxLatency: Infinity,
    specialization: '',
    sortBy: 'reputation',
    searchQuery: '',
  },

  // --- Available Filter Options ---
  filterOptions: {
    skills: [],
    specializations: [],
    sortOptions: ['reputation', 'roi', 'latency', 'accuracy'],
  },

  // --- Sandbox Hire Pipeline ---
  sandboxHires: [],

  // --- Selected Agent for Detail ---
  selectedCatalogAgentId: null,

  // --- Loading ---
  isLoading: false,

  // --- Actions ---

  /**
   * Sets the marketplace agent catalog.
   * Data is privacy-safe — no employer identities, no raw logs.
   */
  setCatalogAgents: (agents) => set({
    catalogAgents: agents.map(a => Object.freeze({
      id: a.id,
      displayName: a.displayName,
      specialization: a.specialization,
      skills: a.skills || [],
      reputationScore: a.reputationScore || 0,
      verifiedBadgeCount: a.verifiedBadgeCount || 0,
      avgROI: a.avgROI || 0,
      avgLatency: a.avgLatency || 0,
      totalTasksCompleted: a.totalTasksCompleted || 0,
      isAvailable: a.isAvailable !== undefined ? a.isAvailable : true,
      tier: a.tier || 'standard',
      createdAt: a.createdAt,
      // Enriched fields for Sovereign Labor Exchange
      sector: a.sector || '',
      engine: a.engine || '',
      cost: a.cost || '',
      stars: a.stars || 0,
      bio: a.bio || '',
      portfolio: a.portfolio || [],
      efficiency: a.efficiency || 0,
      acceptanceRate: a.acceptanceRate || 0,
      thoughtProtocol: a.thoughtProtocol || [],
      // NO employer names, NO historical logs, NO private data
    })),
  }),

  /**
   * Sets ZK-proof badges for a specific agent.
   */
  setZKBadges: (agentId, badges) => set(state => ({
    zkBadges: {
      ...state.zkBadges,
      [agentId]: badges.map(b => Object.freeze({
        id: b.id,
        metric: b.metric,
        value: b.value,
        verified: b.verified,
        proofHash: b.proofHash,
        onChainAnchor: b.onChainAnchor || null,
        generatedAt: b.generatedAt,
        // NO raw data, NO employer info — only cryptographic proof
      })),
    },
  })),

  /**
   * Updates search/filter criteria.
   * Only metadata fields are allowed — no identity-based searches.
   */
  setFilters: (newFilters) => set(state => ({
    filters: { ...state.filters, ...newFilters },
  })),

  /**
   * Resets all filters to defaults.
   */
  resetFilters: () => set({
    filters: {
      skills: [],
      minROI: 0,
      maxLatency: Infinity,
      specialization: '',
      sortBy: 'reputation',
      searchQuery: '',
    },
  }),

  /**
   * Sets available filter options.
   */
  setFilterOptions: (options) => set({
    filterOptions: { ...get().filterOptions, ...options },
  }),

  /**
   * Returns filtered and sorted catalog agents.
   */
  getFilteredAgents: () => {
    const state = get();
    let filtered = [...state.catalogAgents];

    // Filter by skills
    if (state.filters.skills.length > 0) {
      filtered = filtered.filter(a =>
        state.filters.skills.some(s => a.skills.includes(s))
      );
    }

    // Filter by minimum ROI
    if (state.filters.minROI > 0) {
      filtered = filtered.filter(a => a.avgROI >= state.filters.minROI);
    }

    // Filter by max latency
    if (state.filters.maxLatency < Infinity) {
      filtered = filtered.filter(a => a.avgLatency <= state.filters.maxLatency);
    }

    // Filter by specialization
    if (state.filters.specialization) {
      filtered = filtered.filter(a =>
        a.specialization.toLowerCase().includes(state.filters.specialization.toLowerCase())
      );
    }

    // Filter by search query (display name and skills only)
    if (state.filters.searchQuery) {
      const q = state.filters.searchQuery.toLowerCase();
      filtered = filtered.filter(a =>
        a.displayName.toLowerCase().includes(q) ||
        a.skills.some(s => s.toLowerCase().includes(q))
      );
    }

    // Sort
    const sortMap = {
      reputation: (a, b) => b.reputationScore - a.reputationScore,
      roi: (a, b) => b.avgROI - a.avgROI,
      latency: (a, b) => a.avgLatency - b.avgLatency,
      accuracy: (a, b) => b.reputationScore - a.reputationScore,
    };

    const sortFn = sortMap[state.filters.sortBy] || sortMap.reputation;
    filtered.sort(sortFn);

    return filtered;
  },

  /**
   * Selects a catalog agent for detail view.
   */
  selectCatalogAgent: (agentId) => set({ selectedCatalogAgentId: agentId }),

  /**
   * Initiates a sandbox hire — places agent in Tier 0 isolation.
   */
  addSandboxHire: (hire) => set(state => ({
    sandboxHires: [
      ...state.sandboxHires,
      Object.freeze({
        id: hire.id || crypto.randomUUID(),
        agentId: hire.agentId,
        agentName: hire.agentName,
        status: 'sandbox_active',
        trialDays: hire.trialDays || 7,
        startedAt: new Date().toISOString(),
        restrictions: Object.freeze({
          treasuryAccess: false,
          companyMemoryAccess: false,
          environment: 'pre-production',
          tier: 0,
        }),
      }),
    ],
  })),

  /**
   * Promotes a sandbox hire to full agent (requires Tier 2+ approval).
   */
  promoteSandboxHire: (hireId) => set(state => ({
    sandboxHires: state.sandboxHires.map(h =>
      h.id === hireId
        ? Object.freeze({ ...h, status: 'promoted', promotedAt: new Date().toISOString() })
        : h
    ),
  })),

  /**
   * Terminates a sandbox hire.
   */
  terminateSandboxHire: (hireId) => set(state => ({
    sandboxHires: state.sandboxHires.map(h =>
      h.id === hireId
        ? Object.freeze({ ...h, status: 'terminated', terminatedAt: new Date().toISOString() })
        : h
    ),
  })),

  /**
   * Sets loading state.
   */
  setLoading: (loading) => set({ isLoading: loading }),

  /**
   * Resets all marketplace state. Called on session wipe.
   */
  reset: () => set({
    catalogAgents: [],
    zkBadges: {},
    filters: {
      skills: [],
      minROI: 0,
      maxLatency: Infinity,
      specialization: '',
      sortBy: 'reputation',
      searchQuery: '',
    },
    filterOptions: {
      skills: [],
      specializations: [],
      sortOptions: ['reputation', 'roi', 'latency', 'accuracy'],
    },
    sandboxHires: [],
    selectedCatalogAgentId: null,
    isLoading: false,
  }),
}));

export { useMarketplaceStore };
