/**
 * Sovereign Protocol — Treasury Store
 * Manages the Role-Separated Treasury Dashboard state.
 * AI agents are PHYSICALLY ISOLATED from this store.
 * No agent context, no financial metadata exposure.
 */

import { create } from 'zustand';

const useTreasuryStore = create((set, get) => ({
  // --- Treasury Wallet (Cold Storage / Multi-Sig) ---
  treasuryWallet: {
    address: null,
    balance: '0',
    currency: 'ETH',
    isMultiSig: true,
    requiredSignatures: 2,
    totalSigners: 3,
    lastFundedAt: null,
  },

  // --- Ops Wallet (Hot Wallet / Human-Only) ---
  opsWallet: {
    address: null,
    balance: '0',
    currency: 'ETH',
    dailyLimit: '0',
    spentToday: '0',
    lastTransactionAt: null,
  },

  // --- Agent Execution Wallets (Capped) ---
  agentWallets: [],

  // --- Transaction History ---
  transactions: [],

  // --- Loading States ---
  isLoading: false,

  // --- Actions ---

  /**
   * Sets the treasury wallet data.
   */
  setTreasuryWallet: (data) => set({
    treasuryWallet: Object.freeze({ ...get().treasuryWallet, ...data }),
  }),

  /**
   * Sets the ops wallet data.
   */
  setOpsWallet: (data) => set({
    opsWallet: Object.freeze({ ...get().opsWallet, ...data }),
  }),

  /**
   * Sets agent execution wallets.
   * Each wallet is individually capped and isolated.
   */
  setAgentWallets: (wallets) => set({
    agentWallets: wallets.map(w => Object.freeze({
      id: w.id,
      agentId: w.agentId,
      agentName: w.agentName,
      address: w.address,
      balance: w.balance || '0',
      cap: w.cap || '0',
      utilized: w.utilized || '0',
      status: w.status || 'active',
      createdAt: w.createdAt,
    })),
  }),

  /**
   * Adds a transaction record to history.
   */
  addTransaction: (tx) => set(state => ({
    transactions: [
      Object.freeze({
        id: tx.id || crypto.randomUUID(),
        type: tx.type, // 'fund_ops' | 'fund_agent' | 'fee' | 'refund'
        from: tx.from,
        to: tx.to,
        amount: tx.amount,
        currency: tx.currency || 'ETH',
        status: tx.status || 'pending',
        timestamp: tx.timestamp || new Date().toISOString(),
        hash: tx.hash || null,
        description: tx.description || null,
      }),
      ...state.transactions,
    ],
  })),

  /**
   * Updates a transaction's status.
   */
  updateTransactionStatus: (txId, status) => set(state => ({
    transactions: state.transactions.map(tx =>
      tx.id === txId ? Object.freeze({ ...tx, status }) : tx
    ),
  })),

  /**
   * Sets loading state.
   */
  setLoading: (loading) => set({ isLoading: loading }),

  /**
   * Resets all treasury state. Called on session wipe.
   */
  reset: () => set({
    treasuryWallet: { address: null, balance: '0', currency: 'ETH', isMultiSig: true, requiredSignatures: 2, totalSigners: 3, lastFundedAt: null },
    opsWallet: { address: null, balance: '0', currency: 'ETH', dailyLimit: '0', spentToday: '0', lastTransactionAt: null },
    agentWallets: [],
    transactions: [],
    isLoading: false,
  }),
}));

export { useTreasuryStore };
