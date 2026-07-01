import { create } from 'zustand';

interface SpatialState {
  wsConnected: boolean;
  dashboardOpen: boolean;
  expansionModalOpen: boolean;
  players: Record<string, { x: number, y: number, state: number }>;
  
  setWsConnected: (status: boolean) => void;
  toggleDashboard: () => void;
  toggleExpansionModal: () => void;
  updatePlayerPosition: (id: string, x: number, y: number, state: number) => void;
}

export const useSpatialStore = create<SpatialState>((set) => ({
  wsConnected: false,
  dashboardOpen: false,
  expansionModalOpen: false,
  players: {},

  setWsConnected: (status) => set({ wsConnected: status }),
  toggleDashboard: () => set((state) => ({ dashboardOpen: !state.dashboardOpen })),
  toggleExpansionModal: () => set((state) => ({ expansionModalOpen: !state.expansionModalOpen })),
  
  updatePlayerPosition: (id, x, y, stateCode) => set((state) => ({
    players: {
      ...state.players,
      [id]: { x, y, state: stateCode }
    }
  }))
}));
