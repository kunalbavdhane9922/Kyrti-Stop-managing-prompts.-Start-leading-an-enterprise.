/**
 * Sovereign Protocol — Service Fee Store (Module 2)
 * Manages deterministic revenue distribution and financial visualization.
 *
 * SECURITY: This store is ISOLATED from agentOSStore.
 * Agents cannot view revenue data or distribution breakdowns.
 * Every "Pay" action requires Human-in-the-Loop (HITL) signature.
 */

import { create } from 'zustand';

const useServiceFeeStore = create((set, get) => ({
  // --- Revenue Distribution (Sankey Diagram Data) ---
  revenueDistribution: {
    totalRevenue: 0,
    treasury: { amount: 0, percent: 0 },
    operations: { amount: 0, percent: 0 },
    agentFees: { amount: 0, percent: 0 },
    platform: { amount: 0, percent: 0 },
    period: 'monthly',
    lastUpdatedAt: null,
  },

  // --- Compute Burn Rate ---
  burnRate: {
    currentRate: 0,
    dailyAverage: 0,
    weeklyTotal: 0,
    opsWalletBalance: 0,
    runwayDays: 0,
    providers: [],
    lastUpdatedAt: null,
  },

  // --- Agent ROI Data ---
  agentROI: [],

  // --- Pay Action Queue (HITL Required) ---
  payQueue: [],

  // --- Historical Distribution Records ---
  distributionHistory: [],

  // --- Loading ---
  isLoading: false,

  // --- Actions ---

  /**
   * Sets the revenue distribution breakdown.
   * Formula: R_total = C_treasury + C_ops + C_agent_fee + C_platform
   */
  setRevenueDistribution: (data) => set({
    revenueDistribution: Object.freeze({
      totalRevenue: data.totalRevenue || 0,
      treasury: Object.freeze({
        amount: data.treasury?.amount || 0,
        percent: data.treasury?.percent || 0,
      }),
      operations: Object.freeze({
        amount: data.operations?.amount || 0,
        percent: data.operations?.percent || 0,
      }),
      agentFees: Object.freeze({
        amount: data.agentFees?.amount || 0,
        percent: data.agentFees?.percent || 0,
      }),
      platform: Object.freeze({
        amount: data.platform?.amount || 0,
        percent: data.platform?.percent || 0,
      }),
      period: data.period || 'monthly',
      lastUpdatedAt: new Date().toISOString(),
    }),
  }),

  /**
   * Sets the compute burn rate metrics.
   */
  setBurnRate: (data) => set({
    burnRate: Object.freeze({
      currentRate: data.currentRate || 0,
      dailyAverage: data.dailyAverage || 0,
      weeklyTotal: data.weeklyTotal || 0,
      opsWalletBalance: data.opsWalletBalance || 0,
      runwayDays: data.runwayDays || 0,
      providers: (data.providers || []).map(p => Object.freeze({
        name: p.name,
        type: p.type,
        costPerHour: p.costPerHour || 0,
        usageHours: p.usageHours || 0,
        totalCost: p.totalCost || 0,
      })),
      lastUpdatedAt: new Date().toISOString(),
    }),
  }),

  /**
   * Sets agent ROI data — value generated vs. maintenance costs.
   */
  setAgentROI: (roiData) => set({
    agentROI: roiData.map(r => Object.freeze({
      agentId: r.agentId,
      agentName: r.agentName,
      valueGenerated: r.valueGenerated || 0,
      maintenanceCost: r.maintenanceCost || 0,
      computeCost: r.computeCost || 0,
      memoryCost: r.memoryCost || 0,
      apiCost: r.apiCost || 0,
      roi: r.roi || 0,
      trend: r.trend || 'stable',
    })),
  }),

  /**
   * Adds a pay distribution request to the queue.
   * Requires HITL signature before execution.
   */
  requestPayDistribution: (distribution) => set(state => ({
    payQueue: [
      ...state.payQueue,
      Object.freeze({
        id: distribution.id || crypto.randomUUID(),
        type: distribution.type || 'service_fee',
        amount: distribution.amount,
        currency: distribution.currency || 'ETH',
        recipient: distribution.recipient,
        description: distribution.description,
        status: 'awaiting_signature',
        requestedAt: new Date().toISOString(),
        signedBy: null,
        signedAt: null,
        executedAt: null,
      }),
    ],
  })),

  /**
   * Signs a pay distribution (HITL approval).
   */
  signPayDistribution: (payId, signerId) => set(state => ({
    payQueue: state.payQueue.map(p =>
      p.id === payId
        ? Object.freeze({
            ...p,
            status: 'signed',
            signedBy: signerId,
            signedAt: new Date().toISOString(),
          })
        : p
    ),
  })),

  /**
   * Executes a signed pay distribution.
   */
  executePayDistribution: (payId) => set(state => ({
    payQueue: state.payQueue.map(p =>
      p.id === payId && p.status === 'signed'
        ? Object.freeze({
            ...p,
            status: 'executed',
            executedAt: new Date().toISOString(),
          })
        : p
    ),
  })),

  /**
   * Rejects a pay distribution request.
   */
  rejectPayDistribution: (payId, reason) => set(state => ({
    payQueue: state.payQueue.map(p =>
      p.id === payId
        ? Object.freeze({ ...p, status: 'rejected', rejectionReason: reason })
        : p
    ),
  })),

  /**
   * Sets loading state.
   */
  setLoading: (loading) => set({ isLoading: loading }),

  /**
   * Resets all service fee state. Called on session wipe.
   */
  reset: () => set({
    revenueDistribution: {
      totalRevenue: 0,
      treasury: { amount: 0, percent: 0 },
      operations: { amount: 0, percent: 0 },
      agentFees: { amount: 0, percent: 0 },
      platform: { amount: 0, percent: 0 },
      period: 'monthly',
      lastUpdatedAt: null,
    },
    burnRate: {
      currentRate: 0,
      dailyAverage: 0,
      weeklyTotal: 0,
      opsWalletBalance: 0,
      runwayDays: 0,
      providers: [],
      lastUpdatedAt: null,
    },
    agentROI: [],
    payQueue: [],
    distributionHistory: [],
    isLoading: false,
  }),
}));

export { useServiceFeeStore };
