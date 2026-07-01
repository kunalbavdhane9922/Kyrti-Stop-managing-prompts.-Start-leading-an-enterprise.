import { create } from 'zustand';

const createUISlice = (set) => ({
  marketplaceOpen: false,
  dashboardOpen: false,
  expansionModalOpen: false,
  activeChatTarget: null,
  activeNav: 'dashboard',
  
  toggleMarketplace: () => set((s) => ({ marketplaceOpen: !s.marketplaceOpen })),
  toggleDashboard: () => set((s) => ({ dashboardOpen: !s.dashboardOpen })),
  toggleExpansionModal: () => set((s) => ({ expansionModalOpen: !s.expansionModalOpen })),
  closeMarketplace: () => set({ marketplaceOpen: false }),
  closeDashboard: () => set({ dashboardOpen: false }),
  closeExpansionModal: () => set({ expansionModalOpen: false }),
  
  openChat: (target) => set({ activeChatTarget: target }),
  closeChat: () => set({ activeChatTarget: null }),
  setActiveNav: (nav) => set({ activeNav: nav }),
});

const createEconomySlice = (set) => ({
  budget: 50000,
  deductBudget: (amount) => set((s) => ({ budget: Math.max(0, s.budget - amount) })),
});

const createGameSlice = (set) => ({
  gameReady: false,
  playerPosition: { x: 0, y: 0 },
  currentZone: 'Lobby',
  connectedUsers: 12,
  agents: {},
  
  addAgent: (agent) => set((s) => ({
    agents: { ...s.agents, [agent.id]: agent }
  })),
  
  setGameReady: (ready) => set({ gameReady: ready }),
  setPlayerPosition: (pos) => set({ playerPosition: pos }),
  setCurrentZone: (zone) => set({ currentZone: zone }),
  setConnectedUsers: (count) => set({ connectedUsers: count }),
});

const useSpatialStore = create((...a) => ({
  ...createUISlice(...a),
  ...createEconomySlice(...a),
  ...createGameSlice(...a),
}));

export default useSpatialStore;
