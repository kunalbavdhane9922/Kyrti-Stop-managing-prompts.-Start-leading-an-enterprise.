# Virtual Office Architecture & Complete Codebase

## Architecture Overview
This is a web application structured as a **React** frontend wrapping a **Phaser 4** game engine canvas. The frontend connects to a backend via **WebSocket** for real-time multiplayer/agent states.

### Project Structure
```
virtual-office-web/
├── public/
│   └── assets/
│       ├── office-bg.png            // High-res isometric pre-rendered office background (2816x1536)
│       └── player_spritesheet.png   // 1024x1024 character spritesheet
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.jsx        // Main UI wrapper
│   │   │   ├── LeftSidebar.jsx      // Sidebar navigation
│   │   │   └── TopNavigation.jsx    // Top HUD/search
│   │   └── spatial/
│   │       ├── DashboardOverlay.jsx
│   │       ├── ProximityChatPanel.jsx
│   │       ├── SpatialExpansionModal.jsx
│   │       └── SpatialMarketplace.jsx
│   ├── store/
│   │   └── spatialStore.js          // Zustand state management
│   ├── App.jsx                      // Main React entry, handles WebSockets & Jitsi
│   ├── EventBus.js                  // Singleton event emitter for React <-> Phaser bridge
│   ├── GameComponent.jsx            // Core Phaser game logic, rendering, physics, NPCs
│   ├── index.css                    // Global styles
│   └── main.jsx                     // React DOM mount
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 1. Configuration Files

### `package.json`
```json
{
  "name": "virtual-office-web",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@jitsi/react-sdk": "^1.4.4",
    "lucide-react": "^1.16.0",
    "phaser": "^4.1.0",
    "react": "^19.2.6",
    "react-dom": "^19.2.6",
    "react-router-dom": "^7.15.1",
    "zustand": "^5.0.14"
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "@tailwindcss/postcss": "^4.3.0",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "autoprefixer": "^10.5.0",
    "eslint": "^10.3.0",
    "eslint-plugin-react-hooks": "^7.1.1",
    "eslint-plugin-react-refresh": "^0.5.2",
    "globals": "^17.6.0",
    "postcss": "^8.5.15",
    "tailwindcss": "^4.3.0",
    "vite": "^8.0.12"
  }
}
```

### `vite.config.js`
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
```

### `tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sovereign: {
          bg: '#0A0A0A',
          surface: '#111111', 
          surfaceHover: '#1A1A1A',
          border: '#2A2A2A',
          indigo: '#5E6AD2',
          emerald: '#10B981',
          text: '#EEEEEE',
          muted: '#888888',
        }
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.5)',
        'neon-indigo': '0 0 20px rgba(94, 106, 210, 0.4)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'ui-monospace', 'SFMono-Regular'],
      },
    },
  },
  plugins: [],
}
```

---

## 2. Root Entry & Styles

### `src/main.jsx`
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### `src/index.css`
```css
@import "tailwindcss";

@theme {
  --shadow-glass: 0 4px 30px rgba(0, 0, 0, 0.5);
  --shadow-neon-indigo: 0 0 20px rgba(94, 106, 210, 0.4);
}

@layer base {
  html, body {
    background-color: #0A0A0A;
    color: #EEEEEE;
    overflow: hidden;
    margin: 0;
    padding: 0;
    font-family: 'Inter', sans-serif;
  }

  /* Custom scrollbar for webkit (Linear/Arc style) */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: #2A2A2A;
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #3A3A3A;
  }
}

@layer utilities {
  .text-glow {
    text-shadow: 0 0 10px rgba(94, 106, 210, 0.5);
  }
}
```

---

## 3. State & Event Bus

### `src/store/spatialStore.js`
```javascript
import { create } from 'zustand';

const useSpatialStore = create((set, get) => ({
  // ── Budget & Economy ──
  budget: 50000,

  // ── UI Panel States ──
  marketplaceOpen: false,
  dashboardOpen: false,
  expansionModalOpen: false,
  activeChatTarget: null, // { id, name }

  // ── Game State (synced from Phaser via EventBus) ──
  gameReady: false,
  playerPosition: { x: 0, y: 0 },
  currentZone: 'Lobby',
  connectedUsers: 12,

  // ── AI Agents ──
  agents: {},

  // ── Active Navigation Tab ──
  activeNav: 'dashboard',

  // ── UI Panel Toggles ──
  toggleMarketplace: () => set((s) => ({ marketplaceOpen: !s.marketplaceOpen })),
  toggleDashboard: () => set((s) => ({ dashboardOpen: !s.dashboardOpen })),
  toggleExpansionModal: () => set((s) => ({ expansionModalOpen: !s.expansionModalOpen })),

  closeMarketplace: () => set({ marketplaceOpen: false }),
  closeDashboard: () => set({ dashboardOpen: false }),
  closeExpansionModal: () => set({ expansionModalOpen: false }),

  // ── Chat ──
  openChat: (target) => set({ activeChatTarget: target }),
  closeChat: () => set({ activeChatTarget: null }),

  // ── Economy ──
  deductBudget: (amount) => set((s) => ({ budget: Math.max(0, s.budget - amount) })),

  // ── Agent Management ──
  addAgent: (agent) => set((s) => ({
    agents: { ...s.agents, [agent.id]: agent }
  })),

  // ── Game State Setters (called from EventBus listeners) ──
  setGameReady: (ready) => set({ gameReady: ready }),
  setPlayerPosition: (pos) => set({ playerPosition: pos }),
  setCurrentZone: (zone) => set({ currentZone: zone }),
  setConnectedUsers: (count) => set({ connectedUsers: count }),

  // ── Navigation ──
  setActiveNav: (nav) => set({ activeNav: nav }),
}));

export default useSpatialStore;
```

### `src/EventBus.js`
```javascript
/**
 * EventBus — Singleton event emitter for React ↔ Phaser communication.
 * Replaces raw window.addEventListener patterns with a clean, testable API.
 *
 * Usage:
 *   EventBus.emit('spawn_agent', { x: 10, y: 5 });
 *   EventBus.on('spawn_agent', (data) => { ... });
 *   EventBus.off('spawn_agent', handler);
 */

const listeners = {};

const EventBus = {
  on(event, callback) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(callback);
  },

  off(event, callback) {
    if (!listeners[event]) return;
    listeners[event] = listeners[event].filter((cb) => cb !== callback);
  },

  emit(event, data) {
    if (!listeners[event]) return;
    listeners[event].forEach((cb) => cb(data));
  },

  removeAllListeners(event) {
    if (event) {
      delete listeners[event];
    } else {
      Object.keys(listeners).forEach((key) => delete listeners[key]);
    }
  },
};

export default EventBus;
```

---

## 4. Main React Container

### `src/App.jsx`
```jsx
import React, { useState, useEffect, useRef } from 'react';
import GameComponent from './GameComponent';
import EventBus from './EventBus';
import { Video, X } from 'lucide-react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import useSpatialStore from './store/spatialStore';
import SpatialMarketplace from './components/spatial/SpatialMarketplace';
import ProximityChatPanel from './components/spatial/ProximityChatPanel';
import DashboardOverlay from './components/spatial/DashboardOverlay';
import SpatialExpansionModal from './components/spatial/SpatialExpansionModal';
import { AppLayout } from './components/layout/AppLayout';

function App() {
  const [jitsiRoom, setJitsiRoom] = useState(null);
  const wsRef = useRef(null);
  const [wsInstance, setWsInstance] = useState(null);

  // ── WebSocket Connection (single mount, StrictMode safe) ──
  useEffect(() => {
    const clientId = 'client_' + Math.floor(Math.random() * 10000);
    const ws = new WebSocket(`ws://localhost:8000/ws/${clientId}`);
    wsRef.current = ws;

    ws.onopen = () => setWsInstance(ws);

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      } else {
        ws.onopen = () => ws.close();
      }
    };
  }, []);

  // ── EventBus Listeners (React ← Phaser) ──
  useEffect(() => {
    const onGameReady = () => useSpatialStore.getState().setGameReady(true);
    const onPlayerMoved = (pos) => useSpatialStore.getState().setPlayerPosition(pos);
    const onProximity = (data) => useSpatialStore.getState().openChat({ id: data.id, name: data.name });
    const onProximityLost = () => useSpatialStore.getState().closeChat();
    const onJitsiJoin = (data) => setJitsiRoom(data.roomName);
    const onJitsiLeave = () => setJitsiRoom(null);

    EventBus.on('game_ready', onGameReady);
    EventBus.on('player_moved', onPlayerMoved);
    EventBus.on('ai_proximity', onProximity);
    EventBus.on('ai_proximity_lost', onProximityLost);
    EventBus.on('jitsi_join', onJitsiJoin);
    EventBus.on('jitsi_leave', onJitsiLeave);

    return () => {
      EventBus.off('game_ready', onGameReady);
      EventBus.off('player_moved', onPlayerMoved);
      EventBus.off('ai_proximity', onProximity);
      EventBus.off('ai_proximity_lost', onProximityLost);
      EventBus.off('jitsi_join', onJitsiJoin);
      EventBus.off('jitsi_leave', onJitsiLeave);
    };
  }, []);

  return (
    <AppLayout>
      {/* Z-0: Virtual Office Canvas */}
      <div className="absolute inset-0 w-full h-full">
        <GameComponent ws={wsInstance} />
      </div>

      {/* Jitsi Meeting Overlay (slides in from right) */}
      <div
        className={`fixed right-0 top-0 h-full z-50 pointer-events-auto flex flex-col
          bg-[#020617] border-l border-[#1e293b] shadow-2xl
          transition-all duration-500 ease-in-out
          ${jitsiRoom ? 'w-[450px] opacity-100 translate-x-0' : 'w-[450px] opacity-0 translate-x-full'}`}
      >
        <div className="bg-[#0f172a] text-white p-5 flex items-center justify-between border-b border-[#1e293b]">
          <div className="flex items-center gap-3 font-semibold text-sm tracking-widest uppercase text-slate-300">
            <Video size={18} className="text-blue-400" />
            Session: {jitsiRoom}
          </div>
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs text-emerald-400 font-mono tracking-wider">LIVE</span>
            <button onClick={() => setJitsiRoom(null)} className="text-slate-400 hover:text-white transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 relative bg-black">
          {jitsiRoom && (
            <JitsiMeeting
              domain="meet.jit.si"
              roomName={`VirtualOffice_Corp_${jitsiRoom}`}
              configOverwrite={{ startWithAudioMuted: false, disableModeratorIndicator: true }}
              interfaceConfigOverwrite={{ DISABLE_JOIN_LEAVE_NOTIFICATIONS: true, SHOW_JITSI_WATERMARK: false }}
              userInfo={{ displayName: 'Executive User' }}
              getIFrameRef={(ref) => { ref.style.height = '100%'; ref.style.width = '100%'; }}
            />
          )}
        </div>
      </div>

      {/* Modals & Overlays */}
      <div className="pointer-events-auto">
        <SpatialMarketplace ws={wsInstance} />
        <ProximityChatPanel ws={wsInstance} />
        <DashboardOverlay />
        <SpatialExpansionModal />
      </div>
    </AppLayout>
  );
}

export default App;
```

---

## 5. UI Layout Components

### `src/components/layout/AppLayout.jsx`
```jsx
import React from 'react';
import { TopNavigation } from './TopNavigation';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar'; // Note: Assuming this exists similarly if imported

export const AppLayout = ({ children }) => {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0A0A0A] text-[#EEEEEE] font-sans selection:bg-[#5E6AD2]/30">
      
      {/* Z-0: The Hero Element (Virtual Office Canvas) */}
      <div className="absolute inset-0 z-0 w-full h-full">
        {children}
      </div>
      
      {/* Z-10: Glassmorphic HUD Overlays */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col">
        
        <TopNavigation />

        <div className="flex-1 flex justify-between px-4 pb-4 mt-4 h-[calc(100vh-80px)]">
          <LeftSidebar />
          
          {/* Main interactive void space (Allows clicking the canvas) */}
          <div className="flex-1 pointer-events-auto" />
          
          {/* <RightSidebar /> */}
        </div>
      </div>
      
    </div>
  );
};
```

### `src/components/layout/LeftSidebar.jsx`
```jsx
import React from 'react';
import { LayoutDashboard, Users, Video, BrainCircuit, Store, Building2, LineChart } from 'lucide-react';
import useSpatialStore from '../../store/spatialStore';

const navItems = [
  { section: 'Workspace', items: [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', action: 'toggleDashboard' },
    { id: 'team', icon: Users, label: 'Team Roster' },
    { id: 'meetings', icon: Video, label: 'Meetings' },
  ]},
  { section: 'Operations', items: [
    { id: 'ai', icon: BrainCircuit, label: 'AI Workforce' },
    { id: 'marketplace', icon: Store, label: 'Marketplace', action: 'toggleMarketplace' },
    { id: 'treasury', icon: Building2, label: 'Treasury' },
  ]},
];

const NavItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
      active
        ? 'bg-[#5E6AD2]/10 text-[#5E6AD2]'
        : 'text-[#888888] hover:bg-white/5 hover:text-white'
    }`}
  >
    <Icon size={16} />
    <span className="font-medium">{label}</span>
  </button>
);

export const LeftSidebar = () => {
  const activeNav = useSpatialStore((s) => s.activeNav);
  const setActiveNav = useSpatialStore((s) => s.setActiveNav);
  const toggleDashboard = useSpatialStore((s) => s.toggleDashboard);
  const toggleMarketplace = useSpatialStore((s) => s.toggleMarketplace);
  const budget = useSpatialStore((s) => s.budget);

  const handleClick = (item) => {
    setActiveNav(item.id);
    if (item.action === 'toggleDashboard') toggleDashboard();
    if (item.action === 'toggleMarketplace') toggleMarketplace();
  };

  return (
    <div className="pointer-events-auto w-60 h-full bg-[#111111]/60 backdrop-blur-[20px] border border-white/5 rounded-2xl flex flex-col py-4 shadow-glass transition-all duration-300">
      
      {navItems.map((section) => (
        <div key={section.section} className="px-4 mb-6">
          <div className="text-[10px] font-bold tracking-widest text-[#888888] uppercase mb-2">
            {section.section}
          </div>
          <div className="space-y-1">
            {section.items.map((item) => (
              <NavItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                active={activeNav === item.id}
                onClick={() => handleClick(item)}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Budget Display */}
      <div className="mt-auto px-4 space-y-3">
        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
          <div className="text-[10px] font-bold tracking-widest text-[#888888] uppercase mb-1">Treasury</div>
          <div className="text-lg font-bold text-[#10B981] font-mono">${budget.toLocaleString()}</div>
        </div>
        <NavItem icon={LineChart} label="Analytics" active={activeNav === 'analytics'} onClick={() => setActiveNav('analytics')} />
      </div>
    </div>
  );
};
```

### `src/components/layout/TopNavigation.jsx`
```jsx
import React from 'react';
import { Search, Bell, Settings, UserCircle, MapPin } from 'lucide-react';
import useSpatialStore from '../../store/spatialStore';

export const TopNavigation = () => {
  const currentZone = useSpatialStore((s) => s.currentZone);
  const connectedUsers = useSpatialStore((s) => s.connectedUsers);

  return (
    <div className="pointer-events-auto mt-4 mx-4 h-14 bg-[#111111]/60 backdrop-blur-[20px] border border-white/5 rounded-2xl flex items-center justify-between px-6 shadow-glass transition-all duration-300">
      
      {/* Left: Branding + Zone Indicator */}
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-[#5E6AD2] shadow-neon-indigo animate-pulse" />
        <span className="font-semibold tracking-tight text-sm text-white">Sovereign Headquarters</span>
        <div className="hidden sm:flex items-center gap-1.5 ml-3 text-[11px] text-[#888888] bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
          <MapPin size={10} className="text-[#5E6AD2]" />
          {currentZone}
        </div>
      </div>

      {/* Center: Command Palette Trigger */}
      <div className="w-96 h-8 bg-[#0A0A0A]/50 border border-white/10 rounded-lg flex items-center px-3 gap-2 text-[#888888] hover:border-white/20 hover:text-white transition-all cursor-pointer">
        <Search size={14} />
        <span className="text-xs">Search employees, rooms, or actions...</span>
        <span className="ml-auto text-[10px] font-mono border border-white/10 px-1.5 py-0.5 rounded bg-white/5">Cmd K</span>
      </div>

      {/* Right: User Menu */}
      <div className="flex items-center gap-4 text-[#888888]">
        <div className="text-[10px] bg-white/5 px-2 py-1 rounded-full border border-white/10 text-[#10B981]">
          {connectedUsers} online
        </div>
        <button className="hover:text-white transition-colors"><Bell size={18} /></button>
        <button className="hover:text-white transition-colors"><Settings size={18} /></button>
        <div className="w-[1px] h-4 bg-white/10" />
        <button className="flex items-center gap-2 hover:text-white transition-colors">
          <UserCircle size={20} className="text-[#5E6AD2]" />
          <span className="text-xs font-medium">CEO Profile</span>
        </button>
      </div>
    </div>
  );
};
```

---

## 6. Spatial Overlay Components

### `src/components/spatial/DashboardOverlay.jsx`
```jsx
import React, { useState, useEffect } from 'react';
import useSpatialStore from '../../store/spatialStore';
import { 
    LayoutGrid, Users, Wallet, Landmark, RefreshCcw, 
    TrendingUp, CheckCircle, User, Users as UsersIcon, 
    Building, MessageSquare, X, Send, ChevronRight 
} from 'lucide-react';

export default function DashboardOverlay() {
  const { dashboardOpen, closeDashboard } = useSpatialStore();
  const [isRendered, setIsRendered] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');

  useEffect(() => {
    if (dashboardOpen) requestAnimationFrame(() => setIsRendered(true));
    else setIsRendered(false);
  }, [dashboardOpen]);

  if (!dashboardOpen && !isRendered) return null;

  return (
    <div className={`fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden font-['Inter',sans-serif]`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-[#020617]/60 backdrop-blur-md pointer-events-auto transition-opacity duration-500 ease-in-out ${isRendered ? 'opacity-100' : 'opacity-0'}`}
        onClick={closeDashboard}
      />
      
      {/* Main Dashboard Container */}
      <div className={`relative w-[1100px] max-w-[95vw] h-[750px] max-h-[90vh] bg-[#0F172A]/95 backdrop-blur-2xl rounded-2xl border border-[#1E293B] shadow-[0_0_50px_rgba(37,99,235,0.15)] pointer-events-auto transform transition-all duration-500 flex ${isRendered ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        
        {/* Left Sidebar */}
        <div className="w-[240px] border-r border-[#1E293B] flex flex-col py-6">
          <div className="px-6 mb-8 flex items-center gap-3">
            <div className="text-cyan-400">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
            </div>
            <h1 className="text-white font-bold tracking-wider text-sm">SOVEREIGN PROTOCOL</h1>
          </div>
          
          <nav className="flex-1 flex flex-col gap-2 px-3">
            {[
              { id: 'Dashboard', icon: <LayoutGrid size={18} /> },
              { id: 'Workforce', icon: <Users size={18} /> },
              { id: 'Treasury', icon: <Wallet size={18} /> },
              { id: 'Governance', icon: <Landmark size={18} /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id 
                    ? 'text-white bg-[#1E293B]' 
                    : 'text-slate-400 hover:text-white hover:bg-[#1E293B]/50'
                }`}
              >
                {activeTab === tab.id && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-r-full" />
                )}
                <span className={activeTab === tab.id ? "text-cyan-400" : ""}>{tab.icon}</span>
                {tab.id}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative">
            {/* Top Right Address indicator */}
            <div className="absolute top-6 right-6">
                <div className="flex items-center gap-2 bg-[#1E293B]/50 border border-[#334155] rounded-full px-4 py-2 text-xs text-slate-300">
                    <Wallet size={14} />
                    <span className="font-mono">0x...1234 | Connected</span>
                </div>
            </div>

            <div className="p-8 pb-4">
                <h2 className="text-white text-2xl font-semibold mb-6">{activeTab}</h2>
                
                {/* Metric Cards Row */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                    {/* Card 1 */}
                    <div className="bg-[#1E293B]/40 border border-[#334155] rounded-xl p-5 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <span className="text-slate-400 text-sm">Total price</span>
                            <button className="text-cyan-400 p-1.5 bg-cyan-400/10 rounded-md"><RefreshCcw size={14} /></button>
                        </div>
                        <div className="text-3xl font-bold text-white tracking-tight">$30,233.36</div>
                        <button className="w-full bg-cyan-400 hover:bg-cyan-300 text-[#020617] font-semibold py-2.5 rounded-lg text-sm transition-colors shadow-[0_0_15px_rgba(34,211,238,0.3)] mt-2">
                            Primary action
                        </button>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-[#1E293B]/40 border border-[#334155] rounded-xl p-5 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <span className="text-slate-400 text-sm">Total accounts</span>
                            <button className="text-cyan-400 p-1.5 bg-cyan-400/10 rounded-md"><TrendingUp size={14} /></button>
                        </div>
                        <div className="text-3xl font-bold text-white tracking-tight">$2,392</div>
                        <button className="w-full bg-cyan-400 hover:bg-cyan-300 text-[#020617] font-semibold py-2.5 rounded-lg text-sm transition-colors shadow-[0_0_15px_rgba(34,211,238,0.3)] mt-2">
                            Primary action
                        </button>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-[#1E293B]/40 border border-[#334155] rounded-xl p-5 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <span className="text-slate-400 text-sm">Success states</span>
                            <button className="text-emerald-400 p-1.5 bg-emerald-400/10 rounded-md"><CheckCircle size={14} /></button>
                        </div>
                        <div className="text-3xl font-bold text-emerald-400 tracking-tight">$12,600</div>
                        <button className="w-full bg-emerald-400/10 border border-emerald-400/30 hover:bg-emerald-400/20 text-emerald-400 font-semibold py-2.5 rounded-lg text-sm transition-colors mt-2">
                            Success state
                        </button>
                    </div>
                </div>

                {/* Bottom Lists Row */}
                <div className="grid grid-cols-3 gap-6 h-[320px]">
                    {/* Workforce Table */}
                    <div className="col-span-2 bg-[#1E293B]/40 border border-[#334155] rounded-xl p-6 flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-white font-medium text-lg">Workforce</h3>
                            <button className="text-cyan-400 text-sm hover:text-cyan-300 font-medium">See all</button>
                        </div>
                        
                        <div className="grid grid-cols-12 text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 border-b border-[#334155]">
                            <div className="col-span-5">Name</div>
                            <div className="col-span-3">Price</div>
                            <div className="col-span-3">Entrance</div>
                            <div className="col-span-1 text-right">Action</div>
                        </div>

                        <div className="flex-1 overflow-y-auto mt-2 space-y-1 pr-2">
                            {[
                                { name: "Danis Smith", time: "3 months ago", tag: "#0F1704", price: "$30,350.00", entrance: "+18.71%", color: "emerald" },
                                { name: "John Amith", time: "2 months ago", tag: "#06B6D4", price: "$7,300.00", entrance: "+06.39%", color: "emerald" },
                                { name: "Bariny Martan", time: "2 months ago", tag: "#0F1704", price: "$2,330.00", entrance: "+18.71%", color: "emerald" },
                                { name: "Danid Woeh", time: "4 months ago", tag: "#06B6D4", price: "$13,100.00", entrance: "+69.96%", color: "emerald" },
                            ].map((user, idx) => (
                                <div key={idx} className="grid grid-cols-12 items-center py-3 border-b border-[#334155]/50 last:border-0 hover:bg-[#1E293B]/50 rounded-lg px-2 -mx-2 transition-colors">
                                    <div className="col-span-5 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 overflow-hidden">
                                            <User size={16} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-white">{user.name}</span>
                                            <span className="text-xs text-slate-500">{user.time}</span>
                                        </div>
                                    </div>
                                    <div className="col-span-3 text-sm text-cyan-400 font-mono">{user.tag}</div>
                                    <div className="col-span-3 text-sm text-white">{user.price}</div>
                                    <div className="col-span-1 text-right text-sm font-medium text-emerald-400">{user.entrance}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Treasury List */}
                    <div className="col-span-1 bg-[#1E293B]/40 border border-[#334155] rounded-xl p-6 flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-white font-medium text-lg">Treasury</h3>
                            <button className="text-cyan-400 text-sm hover:text-cyan-300 font-medium">See all</button>
                        </div>
                        
                        <div className="flex flex-col gap-4 mt-2">
                            {[
                                { title: "Account", sub: "2 utilities", value: "199", icon: <User size={18} /> },
                                { title: "Workforce", sub: "23.131", value: "$2.36%", icon: <UsersIcon size={18} />, highlight: true },
                                { title: "Treasury", sub: "273.31", value: "", icon: <Landmark size={18} /> },
                                { title: "Governance", sub: "", value: "", icon: <Building size={18} />, dim: true }
                            ].map((item, idx) => (
                                <div key={idx} className={`flex items-center justify-between ${item.dim ? 'opacity-40' : ''}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full border border-[#334155] bg-[#0F172A] flex items-center justify-center text-slate-400">
                                            {item.icon}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm text-white">{item.title}</span>
                                            {item.sub && <span className="text-xs text-slate-500">{item.sub}</span>}
                                        </div>
                                    </div>
                                    <div className={`text-sm ${item.highlight ? 'text-emerald-400 font-medium' : 'text-emerald-400'}`}>
                                        {item.value}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-auto pt-4">
                            <button className="w-full bg-emerald-400/10 border border-emerald-400/30 hover:bg-emerald-400/20 text-emerald-400 font-semibold py-2.5 rounded-lg text-sm transition-colors">
                                Apply now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Mock Chat Popup overlayed on dashboard */}
            <div className="absolute bottom-6 right-6 w-[320px] bg-[#1E293B] border border-[#334155] rounded-xl shadow-2xl flex flex-col overflow-hidden">
                <div className="p-3 border-b border-[#334155] flex justify-between items-center bg-[#0F172A]/80">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">
                            <User size={12} />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-xs font-semibold text-white">John Amith</span>
                            <span className="text-[10px] text-slate-500">Chat</span>
                        </div>
                    </div>
                    <div className="flex gap-2 text-slate-400">
                        <button className="hover:text-white"><div className="w-2 h-0.5 bg-current rounded-full" /></button>
                        <button className="hover:text-white"><X size={14} /></button>
                    </div>
                </div>
                <div className="p-4 bg-[#0F172A]/40 min-h-[80px] flex items-end">
                    <div className="bg-[#1E293B] border border-[#334155] rounded-lg rounded-tl-none p-3 text-xs text-slate-300 leading-relaxed shadow-sm">
                        Hello that's the artifact along to your past new notification now. 🙃
                    </div>
                </div>
                <div className="p-3 border-t border-[#334155] bg-[#0F172A]/80 flex items-center gap-2">
                    <input type="text" placeholder="Type a message..." className="flex-1 bg-transparent border-none text-xs text-white placeholder-slate-500 focus:outline-none" />
                    <button className="text-cyan-400 p-1 hover:text-cyan-300"><Send size={14} /></button>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}
```

### `src/components/spatial/ProximityChatPanel.jsx`
```jsx
import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import useSpatialStore from '../../store/spatialStore';

export default function ProximityChatPanel({ ws }) {
  const { activeChatTarget, closeChat } = useSpatialStore();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  // Listen to chat_reply globally
  React.useEffect(() => {
    const handleReceiveChat = (e) => {
      setMessages(prev => [...prev, e.detail.message]);
    };
    window.addEventListener('receive_ai_chat', handleReceiveChat);
    return () => window.removeEventListener('receive_ai_chat', handleReceiveChat);
  }, []);

  if (!activeChatTarget) return null;

  const handleSend = () => {
    if (!input.trim() || !ws || ws.readyState !== WebSocket.OPEN) return;
    
    ws.send(JSON.stringify({ 
      type: 'chat', 
      message: input,
      targetId: activeChatTarget.id 
    }));
    
    setMessages(prev => [...prev, `[CEO]: ${input}`]);
    setInput('');
  };

  return (
    <div className="absolute right-0 top-0 h-full w-[420px] bg-[#0f172a]/92 backdrop-blur-md border-l border-white/10 flex flex-col z-50 pointer-events-auto transform transition-transform duration-400 translate-x-0 font-mono shadow-2xl">
      <div className="p-5 border-b border-[#1e293b] flex justify-between items-center bg-[#020617]/60">
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-1">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            <span className="font-bold text-sm tracking-widest text-white uppercase">
              {activeChatTarget.name}
            </span>
          </div>
          <span className="text-[10px] text-blue-400 uppercase tracking-widest ml-6">Status: Idle</span>
        </div>
        <button onClick={closeChat} className="text-slate-400 hover:text-white transition-colors p-2 text-xl leading-none">
          &times;
        </button>
      </div>
      
      <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-3 scrollbar-thin scrollbar-thumb-[#1e293b]">
        <div className="bg-[#1e293b]/50 border border-[#334155] p-3 rounded-lg text-xs text-slate-300 leading-relaxed shadow-inner">
          <span className="text-blue-400 font-bold">[SYS] </span> Proximity engaged.<br/>
          <span className="text-blue-400 font-bold">[AI] </span> I am ready for your instructions.
        </div>
        {messages.map((msg, idx) => (
          <div key={idx} className="bg-[#1e293b]/50 border border-[#334155] p-3 rounded-lg text-xs text-slate-300 leading-relaxed shadow-inner">
            {msg}
          </div>
        ))}
      </div>
      
      <div className="p-5 border-t border-[#1e293b] bg-[#020617]/60 flex gap-3 items-center">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Enter command..." 
          className="flex-1 bg-[#1e293b] border border-[#334155] rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors shadow-inner" 
        />
        <button 
          onClick={handleSend}
          className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-500 transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)]"
        >
          <MessageSquare size={18} />
        </button>
      </div>
    </div>
  );
}
```

### `src/components/spatial/SpatialExpansionModal.jsx`
```jsx
import React, { useState, useEffect } from 'react';
import useSpatialStore from '../../store/spatialStore';
import { X, Maximize, Activity } from 'lucide-react';

export default function SpatialExpansionModal() {
  const { expansionModalOpen, closeExpansionModal } = useSpatialStore();
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (expansionModalOpen) requestAnimationFrame(() => setIsRendered(true));
    else setIsRendered(false);
  }, [expansionModalOpen]);

  if (!expansionModalOpen && !isRendered) return null;

  return (
    <div className={`fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden font-['Inter',sans-serif]`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-[#020617]/80 backdrop-blur-md pointer-events-auto transition-opacity duration-500 ease-in-out ${isRendered ? 'opacity-100' : 'opacity-0'}`}
        onClick={closeExpansionModal}
      />
      
      {/* Main Container */}
      <div className={`relative w-[1200px] max-w-[95vw] bg-[#0F172A] rounded-xl border border-[#334155] shadow-[0_0_80px_rgba(34,211,238,0.15)] pointer-events-auto transform transition-all duration-500 flex flex-col overflow-hidden ${isRendered ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        
        {/* Header */}
        <div className="p-4 border-b border-[#334155] flex justify-between items-center bg-gradient-to-r from-[#1E293B] to-[#0F172A]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-400/10 rounded border border-cyan-400/20 text-cyan-400">
                <Activity size={18} />
            </div>
            <div className="flex flex-col">
                <h2 className="text-white text-lg font-bold tracking-widest uppercase">Spatial Expansion Protocol</h2>
                <span className="text-xs text-cyan-400 font-mono tracking-widest">PROTOCOL VERSION 1.1</span>
            </div>
          </div>
          <button 
            onClick={closeExpansionModal} 
            className="text-slate-400 hover:text-white bg-[#1E293B] hover:bg-[#334155] p-2 rounded-lg transition-colors border border-[#334155]"
          >
            <X size={20}/>
          </button>
        </div>

        {/* Content Area - Displaying the Protocol Image */}
        <div className="flex-1 bg-black/50 p-6 flex justify-center items-center">
            <div className="relative w-full border border-[#334155]/50 rounded-lg overflow-hidden bg-[#1E293B]/20">
                <img 
                    src="/upgrade.png" 
                    alt="Spatial Expansion Protocol Phases" 
                    className="w-full h-auto object-contain max-h-[70vh]"
                    onError={(e) => {
                        // Fallback if not in public dir: try relative to source or show a placeholder
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                    }}
                />
                <div className="hidden flex-col items-center justify-center p-12 text-slate-400 gap-4 min-h-[400px]">
                    <Maximize size={48} className="text-cyan-400/50" />
                    <p>Expansion Protocol infographic loaded.</p>
                    <p className="text-xs font-mono text-slate-500">Asset: upgrade.png</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
```

### `src/components/spatial/SpatialMarketplace.jsx`
```jsx
import React, { useState, useEffect } from 'react';
import useSpatialStore from '../../store/spatialStore';
import { Cpu, Maximize, X, ArrowRight } from 'lucide-react';

export default function SpatialMarketplace({ ws }) {
  const { marketplaceOpen, closeMarketplace, budget, deductBudget } = useSpatialStore();
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (marketplaceOpen) requestAnimationFrame(() => setIsRendered(true));
    else setIsRendered(false);
  }, [marketplaceOpen]);

  const deployInfrastructure = (type, cost, config) => {
    if (budget < cost) return alert("Insufficient Corporate Capital.");
    
    // The exact WebSocket payload connecting React to Phaser -> Python
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'purchase:request',
        itemType: type,
        itemConfig: config
      }));
    }
    
    deductBudget(cost);
    closeMarketplace();
  };

  return (
    <div className={`fixed inset-0 z-50 pointer-events-none flex justify-end overflow-hidden font-['Fira_Code']`}>
      {/* Dynamic Backdrop */}
      <div 
        className={`absolute inset-0 bg-[#020617]/40 backdrop-blur-md pointer-events-auto transition-opacity duration-500 ease-in-out ${isRendered ? 'opacity-100' : 'opacity-0'}`}
        onClick={closeMarketplace}
      />
      
      {/* Sliding Glassmorphic Drawer */}
      <div className={`relative w-[450px] h-full bg-[#0F172A]/90 backdrop-blur-2xl border-l border-[#334155] shadow-[-20px_0_60px_rgba(34,197,94,0.1)] pointer-events-auto transform transition-transform duration-500 flex flex-col ${isRendered ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="p-8 border-b border-[#334155] flex justify-between items-center bg-gradient-to-r from-[#1E293B] to-transparent">
          <h2 className="text-[#F8FAFC] text-xl font-bold tracking-tight">Infrastructure Deploy</h2>
          <button onClick={closeMarketplace} className="text-slate-400 hover:text-white transition-colors cursor-pointer"><X size={20}/></button>
        </div>

        <div className="p-8 flex-1 overflow-y-auto space-y-6">
          {/* Card: Map Expansion */}
          <div className="group bg-[#1E293B] border border-[#334155] rounded-xl p-5 hover:border-[#22C55E]/50 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-[#0F172A] rounded-lg border border-[#334155]"><Maximize size={20} className="text-[#22C55E]"/></div>
              <span className="text-[#22C55E] font-bold">$2,500</span>
            </div>
            <h3 className="text-[#F8FAFC] font-semibold text-lg mb-1">Executive Expansion</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">Dynamically calculate grid bounds and inject a premium 10x10 acoustic cabin.</p>
            <button 
              onClick={() => deployInfrastructure('office_cabin', 2500, { width: 10, height: 10, chairs: 2 })}
              className="w-full py-3 rounded-lg bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20 hover:bg-[#22C55E] hover:text-[#020617] font-bold text-sm transition-all flex justify-center items-center gap-2 group/btn cursor-pointer"
            >
              Deploy Asset <ArrowRight size={16} className="transform group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="group bg-[#1E293B] border border-[#334155] rounded-xl p-5 hover:border-[#14B8A6]/50 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-[#0F172A] rounded-lg border border-[#334155]"><Maximize size={20} className="text-[#14B8A6]"/></div>
              <span className="text-[#14B8A6] font-bold">$800</span>
            </div>
            <h3 className="text-[#F8FAFC] font-semibold text-lg mb-1">Operations Cluster</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">Append a collaborative 4-person desk cluster.</p>
            <button 
              onClick={() => deployInfrastructure('desk_cluster', 800, { width: 6, height: 5 })}
              className="w-full py-3 rounded-lg bg-[#14B8A6]/10 text-[#14B8A6] border border-[#14B8A6]/20 hover:bg-[#14B8A6] hover:text-[#020617] font-bold text-sm transition-all flex justify-center items-center gap-2 group/btn cursor-pointer"
            >
              Deploy Asset <ArrowRight size={16} className="transform group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Card: AI Agent */}
          <div className="group bg-[#1E293B] border border-[#334155] rounded-xl p-5 hover:border-[#3B82F6]/50 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-[#0F172A] rounded-lg border border-[#334155]"><Cpu size={20} className="text-[#3B82F6]"/></div>
              <span className="text-[#3B82F6] font-bold">$1,200</span>
            </div>
            <h3 className="text-[#F8FAFC] font-semibold text-lg mb-1">Autonomous Agent</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">Instantiate an intelligent entity. Automatically finds and locks to the nearest unoccupied operations desk.</p>
            <button 
              onClick={() => deployInfrastructure('ai_agent', 1200, {})}
              className="w-full py-3 rounded-lg bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20 hover:bg-[#3B82F6] hover:text-[#020617] font-bold text-sm transition-all flex justify-center items-center gap-2 group/btn cursor-pointer"
            >
              Spawn Entity <ArrowRight size={16} className="transform group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 7. Game Engine

### `src/GameComponent.jsx`
```jsx
import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import EventBus from './EventBus';

// ═══════════════════════════════════════════════════════════════════════════
// MODULE-LEVEL SINGLETON — survives React hot-reloads and StrictMode
// ═══════════════════════════════════════════════════════════════════════════
let gameInstance = null;

// ═══════════════════════════════════════════════════════════════════════════
// WORLD CONSTANTS — Based on office-bg.png (2816×1536)
// ═══════════════════════════════════════════════════════════════════════════
const WORLD_W = 2816;
const WORLD_H = 1536;
const FRAME_W = Math.floor(1024 / 5);  // 204
const FRAME_H = Math.floor(1024 / 4);  // 256
const CHAR_SCALE = 0.32;               // Character scale to match the background art

// ═══════════════════════════════════════════════════════════════════════════
// COLLISION ZONES — Mapped to office-bg.png pixel coordinates
// Rectangles defining walls and major furniture the player cannot pass through
// ═══════════════════════════════════════════════════════════════════════════
const COLLISION_ZONES = [
  // ── Outer Walls ──
  { x: 0,    y: 0,    w: WORLD_W, h: 16 },
  { x: 0,    y: 0,    w: 16,      h: WORLD_H },
  { x: WORLD_W - 16, y: 0, w: 16, h: WORLD_H },
  { x: 0, y: WORLD_H - 16, w: WORLD_W, h: 16 },

  // ── CEO Office (top-left) ──
  { x: 80,  y: 100, w: 360, h: 230 },   // CEO L-desk + chair
  { x: 22,  y: 22,  w: 100, h: 180 },   // Bookshelf left wall
  { x: 22,  y: 370, w: 180, h: 85 },    // Leather sofa

  // ── CEO Office Glass Walls ──
  { x: 530, y: 16,  w: 14, h: 290 },    // Right glass (top section)
  { x: 530, y: 410, w: 14, h: 130 },    // Right glass (below door)
  { x: 16,  y: 530, w: 320, h: 14 },    // Bottom glass (left section)
  { x: 430, y: 530, w: 114, h: 14 },    // Bottom glass (right section)

  // ── Top Center Furniture ──
  { x: 570, y: 28,  w: 290, h: 95 },    // Cabinet/shelf with items
  { x: 900, y: 28,  w: 160, h: 80 },    // Additional top shelf

  // ── Open Office Desk Clusters (2 rows × 3 cols) ──
  { x: 460, y: 310, w: 210, h: 140 },   // Desk 1 (top-left)
  { x: 720, y: 310, w: 210, h: 140 },   // Desk 2 (top-center)
  { x: 980, y: 310, w: 210, h: 140 },   // Desk 3 (top-right)
  { x: 460, y: 555, w: 210, h: 140 },   // Desk 4 (bottom-left)
  { x: 720, y: 555, w: 210, h: 140 },   // Desk 5 (bottom-center)
  { x: 980, y: 555, w: 210, h: 140 },   // Desk 6 (bottom-right)

  // ── Open Office Glass Walls ──
  { x: 425, y: 265, w: 14, h: 260 },    // Left glass (top)
  { x: 425, y: 625, w: 14, h: 260 },    // Left glass (bottom)
  { x: 1220, y: 265, w: 14, h: 620 },   // Right glass

  // ── Kitchen / Break Area (top-right) ──
  { x: 1440, y: 28,  w: 370, h: 120 },  // Kitchen counter & appliances
  { x: 1860, y: 28,  w: 80,  h: 140 },  // Fridge

  // ── Break Lounge (right-center) ──
  { x: 1540, y: 430, w: 250, h: 85 },   // Top sofa set
  { x: 1620, y: 525, w: 110, h: 65 },   // Coffee table
  { x: 1540, y: 600, w: 250, h: 85 },   // Bottom sofa set
  { x: 1840, y: 430, w: 100, h: 75 },   // Round table + chairs

  // ── Reception Desk (bottom-left) ──
  { x: 70,  y: 660, w: 240, h: 100 },   // Reception counter

  // ── Server / Filing Room (far right) ──
  { x: 2230, y: 28,  w: 260, h: 370 },  // Server racks
  { x: 2540, y: 28,  w: 250, h: 370 },  // Filing cabinets

  // ── Boardroom (bottom-right) ──
  { x: 1750, y: 880, w: 1050, h: 14 },  // Top wall
  { x: 1750, y: 880, w: 14,   h: 640 }, // Left wall
  { x: 1940, y: 1030, w: 520, h: 210 }, // Conference table
  { x: 2460, y: 910, w: 320,  h: 35 },  // Presentation screen

  // ── Interior Dividing Walls ──
  { x: 1300, y: 265, w: 14, h: 310 },   // Between open office and break area (top)
  { x: 1300, y: 665, w: 14, h: 220 },   // Between open office and break area (bottom)
  { x: 1300, y: 16,  w: 14, h: 200 },   // Upper divider

  // ── Bottom Area Walls ──
  { x: 16,  y: 900, w: 530, h: 14 },    // Wall below reception
  { x: 600, y: 900, w: 700, h: 14 },    // Mid-bottom wall
];

// ═══════════════════════════════════════════════════════════════════════════
// NPC DEFINITIONS — ALL characters use animated spritesheet, no circles
// Positions are pixel coordinates on the office-bg.png
// ═══════════════════════════════════════════════════════════════════════════
const NPC_DEFS = [
  // ── Executives ──
  { name: 'CTO',       dept: 'Executive',   tint: null,    x: 350, y: 380,
    patrol: { x1: 200, y1: 200, x2: 500, y2: 500 }, sitting: false },
  { name: 'CFO',       dept: 'Executive',   tint: null,    x: 2200, y: 1150,
    patrol: { x1: 1800, y1: 950, x2: 2700, y2: 1400 }, sitting: false },

  // ── Reception ──
  { name: 'Maya R.',   dept: 'Reception',   tint: 0xFFCCDD, x: 200, y: 730,
    patrol: { x1: 100, y1: 650, x2: 400, y2: 850 }, sitting: true },

  // ── Engineers (at open office desks — sitting) ──
  { name: 'Alex C.',   dept: 'Engineering', tint: null,    x: 565, y: 420,
    patrol: { x1: 460, y1: 310, x2: 670, y2: 500 }, sitting: true },
  { name: 'Wei Z.',    dept: 'Engineering', tint: null,    x: 825, y: 420,
    patrol: { x1: 720, y1: 310, x2: 930, y2: 500 }, sitting: true },

  // ── Designer ──
  { name: 'Luna R.',   dept: 'Design',      tint: null,    x: 1085, y: 420,
    patrol: { x1: 980, y1: 310, x2: 1190, y2: 500 }, sitting: true },

  // ── AI Workforce (at desks, teal tint + glow) ──
  { name: 'AI-01',     dept: 'AI',          tint: 0x66EEBB, x: 565, y: 665,
    patrol: { x1: 460, y1: 555, x2: 670, y2: 750 }, sitting: true, isAI: true },
  { name: 'AI-02',     dept: 'AI',          tint: 0x66EEBB, x: 825, y: 665,
    patrol: { x1: 720, y1: 555, x2: 930, y2: 750 }, sitting: true, isAI: true },
  { name: 'AI-03',     dept: 'AI',          tint: 0x66EEBB, x: 1085, y: 665,
    patrol: { x1: 980, y1: 555, x2: 1190, y2: 750 }, sitting: true, isAI: true },

  // ── Other Staff ──
  { name: 'Priya M.',  dept: 'Product',     tint: null,    x: 700, y: 800,
    patrol: { x1: 450, y1: 700, x2: 1200, y2: 900 }, sitting: false },
  { name: 'Omar F.',   dept: 'HR',          tint: null,    x: 1700, y: 520,
    patrol: { x1: 1400, y1: 400, x2: 1900, y2: 700 }, sitting: false },
  { name: 'James L.',  dept: 'IT',          tint: null,    x: 2350, y: 250,
    patrol: { x1: 2200, y1: 100, x2: 2700, y2: 400 }, sitting: false },
];

// ═══════════════════════════════════════════════════════════════════════════
// ROOM LABELS — Positioned in pixel coords on office-bg.png
// ═══════════════════════════════════════════════════════════════════════════
const ROOM_LABELS = [
  { text: 'CEO Office',       x: 270,  y: 60 },
  { text: 'Open Workspace',   x: 740,  y: 270 },
  { text: 'Reception',        x: 200,  y: 620 },
  { text: 'Kitchen',          x: 1600, y: 55 },
  { text: 'Break Lounge',     x: 1650, y: 400 },
  { text: 'Server Room',      x: 2400, y: 55 },
  { text: 'Boardroom',        x: 2200, y: 920 },
];

// ═══════════════════════════════════════════════════════════════════════════
// GAME SCENE — Premium Virtual Office on pre-rendered background
// ═══════════════════════════════════════════════════════════════════════════
class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.agents = [];
    this.npcs = [];
    this.moveSpeed = 180;
    this.facingDirection = 'down';
  }

  // ─── PRELOAD ───────────────────────────────────────────────────────────
  preload() {
    // The stunning pre-rendered office background
    this.load.image('office-bg', 'assets/office-bg.png');
    // CEO spritesheet (JPEG with white/grid background — processed in create)
    this.load.image('ceo-sprite-raw', 'assets/player_spritesheet.png');
  }

  // ─── CREATE ────────────────────────────────────────────────────────────
  create() {
    this.cameras.main.setBackgroundColor('#050505');

    // 1. Process the spritesheet: remove white background → transparent
    this.processSpritesheetTexture();

    // 2. Create walk/idle animations
    this.createAnimations();

    // 3. Render the beautiful office background
    const bg = this.add.image(0, 0, 'office-bg');
    bg.setOrigin(0, 0);
    bg.setDepth(0);

    // 4. Physics world bounds = office image size
    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H);

    // 5. Build collision zones (invisible physics bodies)
    this.createCollisionZones();

    // 6. CEO spawn — in the CEO office walkable area
    this.createCEOCharacter(300, 320);

    // 7. NPC characters — ALL animated, no circles
    this.createNPCs();

    // 8. Room labels
    this.createRoomLabels();

    // 9. Camera — follow CEO, zoom to match reference art scale
    this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H);
    this.cameras.main.startFollow(this.playerContainer, true, 0.08, 0.08);
    this.cameras.main.setZoom(1.6);
    this.cameras.main.setRoundPixels(true);

    // 10. Minimap — overview of entire office
    const mmW = 240;
    const mmH = Math.round((WORLD_H / WORLD_W) * mmW);
    this.minimap = this.cameras.add(
      this.scale.width - mmW - 14,
      this.scale.height - mmH - 14,
      mmW, mmH
    );
    this.minimap.setZoom(mmW / WORLD_W);
    this.minimap.setBounds(0, 0, WORLD_W, WORLD_H);
    this.minimap.setBackgroundColor(0x050505);
    this.minimap.startFollow(this.playerContainer);
    this.minimap.setAlpha(0.9);

    // Minimap border
    const border = this.add.rectangle(0, 0, mmW + 4, mmH + 4);
    border.setStrokeStyle(2, 0x5E6AD2, 0.7);
    border.setFillStyle(0x000000, 0);
    border.setScrollFactor(0);
    border.setPosition(this.scale.width - mmW / 2 - 14, this.scale.height - mmH / 2 - 14);
    border.setDepth(1000);

    // 11. Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,A,S,D');

    // 12. EventBus bridge to React
    EventBus.on('spawn_agent', this.handleSpawnAgent.bind(this));
    EventBus.on('map_reload', this.handleMapReload.bind(this));
    EventBus.emit('game_ready', true);
  }

  // ═══════════════════════════════════════════════════════════════════════
  // PROCESS SPRITESHEET — Remove white/gray grid background at runtime
  // The spritesheet is a JPEG saved with .png extension, has a white
  // checkerboard background instead of transparency. We fix it here.
  // ═══════════════════════════════════════════════════════════════════════
  processSpritesheetTexture() {
    const rawTexture = this.textures.get('ceo-sprite-raw');
    const source = rawTexture.getSourceImage();
    const sw = source.naturalWidth || source.width;
    const sh = source.naturalHeight || source.height;

    // Create a canvas texture in Phaser
    const canvasTex = this.textures.createCanvas('ceo-sprite', sw, sh);
    const ctx = canvasTex.context;

    // Draw the raw JPEG image
    ctx.drawImage(source, 0, 0);

    // Process pixels: make white/near-white/grid pixels transparent
    const imageData = ctx.getImageData(0, 0, sw, sh);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const brightness = (r + g + b) / 3;

      if (brightness > 215) {
        // Clearly background (white or light gray grid)
        data[i + 3] = 0;
      } else if (brightness > 195) {
        // Edge transition — smooth alpha falloff
        data[i + 3] = Math.max(0, Math.round(255 * (1 - (brightness - 195) / 25)));
      }
      // All other pixels (the actual character) keep full alpha
    }

    ctx.putImageData(imageData, 0, 0);
    canvasTex.refresh();

    // Add spritesheet frames manually (5 cols × 4 rows)
    const texture = this.textures.get('ceo-sprite');
    let frameIdx = 0;
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 5; col++) {
        texture.add(frameIdx, 0, col * FRAME_W, row * FRAME_H, FRAME_W, FRAME_H);
        frameIdx++;
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // CREATE ANIMATIONS — Walk + Idle for all 4 directions
  // Row 0: Down (0-4), Row 1: Left (5-9), Row 2: Right (10-14), Row 3: Up (15-19)
  // ═══════════════════════════════════════════════════════════════════════
  createAnimations() {
    const walkAnims = [
      { key: 'walk-down',  start: 0,  end: 4 },
      { key: 'walk-left',  start: 5,  end: 9 },
      { key: 'walk-right', start: 10, end: 14 },
      { key: 'walk-up',    start: 15, end: 19 },
    ];

    walkAnims.forEach(a => {
      if (!this.anims.exists(a.key)) {
        this.anims.create({
          key: a.key,
          frames: this.anims.generateFrameNumbers('ceo-sprite', { start: a.start, end: a.end }),
          frameRate: 8,
          repeat: -1,
        });
      }
    });

    const idleAnims = [
      { key: 'idle-down',  frame: 0 },
      { key: 'idle-left',  frame: 5 },
      { key: 'idle-right', frame: 10 },
      { key: 'idle-up',    frame: 15 },
    ];

    idleAnims.forEach(a => {
      if (!this.anims.exists(a.key)) {
        this.anims.create({
          key: a.key,
          frames: [{ key: 'ceo-sprite', frame: a.frame }],
          frameRate: 1,
          repeat: 0,
        });
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════
  // COLLISION ZONES — Invisible static physics bodies
  // ═══════════════════════════════════════════════════════════════════════
  createCollisionZones() {
    this.collisionGroup = this.physics.add.staticGroup();

    COLLISION_ZONES.forEach(zone => {
      const rect = this.add.rectangle(
        zone.x + zone.w / 2,
        zone.y + zone.h / 2,
        zone.w, zone.h,
        0xff0000, 0  // Invisible (alpha = 0)
      );
      this.physics.add.existing(rect, true); // true = static
      this.collisionGroup.add(rect);
    });
  }

  // ═══════════════════════════════════════════════════════════════════════
  // CEO CHARACTER — Animated sprite with shadow, label, glow
  // ═══════════════════════════════════════════════════════════════════════
  createCEOCharacter(spawnX, spawnY) {
    this.playerContainer = this.add.container(spawnX, spawnY);

    // Shadow
    const shadow = this.add.ellipse(0, 34, 36, 12, 0x000000, 0.4);

    // CEO animated sprite
    this.ceoSprite = this.add.sprite(0, 0, 'ceo-sprite', 0);
    this.ceoSprite.setScale(CHAR_SCALE);
    this.ceoSprite.play('idle-down');

    // Executive glow ring
    const glow = this.add.circle(0, 12, 22, 0x5E6AD2, 0);
    glow.setStrokeStyle(1.5, 0x818CF8, 0.5);
    this.tweens.add({
      targets: glow,
      scaleX: { from: 1.0, to: 1.5 },
      scaleY: { from: 1.0, to: 1.5 },
      alpha: { from: 0.5, to: 0 },
      duration: 2200,
      repeat: -1,
      ease: 'Sine.easeOut',
    });

    // Name label
    const label = this.add.text(0, 40, '  CEO  ', {
      font: 'bold 10px Inter, sans-serif',
      fill: '#ffffff',
      backgroundColor: '#5E6AD2',
      padding: { x: 6, y: 2 },
    }).setOrigin(0.5);

    this.playerContainer.add([shadow, glow, this.ceoSprite, label]);
    this.playerContainer.setDepth(200);

    // Physics
    this.physics.add.existing(this.playerContainer);
    this.playerContainer.body.setCircle(16, -16, -16);
    this.playerContainer.body.setCollideWorldBounds(true);

    // Collide with furniture/walls
    this.physics.add.collider(this.playerContainer, this.collisionGroup);

    this.player = this.playerContainer;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // CREATE NPCs — ALL animated sprites with patrol AI
  // ═══════════════════════════════════════════════════════════════════════
  createNPCs() {
    this.npcs = [];

    // Department → badge color
    const DEPT_COLORS = {
      'Executive':   '#F59E0B',
      'Reception':   '#EC4899',
      'Engineering': '#8B5CF6',
      'Design':      '#06B6D4',
      'AI':          '#10B981',
      'Product':     '#3B82F6',
      'HR':          '#F97316',
      'IT':          '#6366F1',
    };

    NPC_DEFS.forEach((def) => {
      const container = this.add.container(def.x, def.y);

      // Shadow
      const shadow = this.add.ellipse(0, 34, 32, 10, 0x000000, 0.35);

      // Animated sprite (same spritesheet as CEO)
      const sprite = this.add.sprite(0, 0, 'ceo-sprite', 0);
      sprite.setScale(CHAR_SCALE * 0.95); // Slightly smaller than CEO
      sprite.play('idle-down');

      // Apply tint if specified (AI robots get teal tint)
      if (def.tint) {
        sprite.setTint(def.tint);
      }

      // Name label with department color
      const badgeColor = DEPT_COLORS[def.dept] || '#64748B';
      const label = this.add.text(0, 40, ` ${def.name} `, {
        font: 'bold 8px Inter, sans-serif',
        fill: '#ffffff',
        backgroundColor: badgeColor,
        padding: { x: 4, y: 2 },
      }).setOrigin(0.5);

      // Dept tag (small text above character)
      const deptTag = this.add.text(0, -42, def.dept, {
        font: '7px Inter, sans-serif',
        fill: '#94a3b8',
      }).setOrigin(0.5);

      container.add([shadow, sprite, label, deptTag]);

      // AI workers get pulsing glow
      if (def.isAI) {
        const aiGlow = this.add.circle(0, 12, 20, 0x10B981, 0);
        aiGlow.setStrokeStyle(2, 0x34D399);
        this.tweens.add({
          targets: aiGlow,
          scaleX: 2.5, scaleY: 2.5,
          alpha: { from: 0.5, to: 0 },
          duration: 1400,
          repeat: -1,
          ease: 'Sine.easeOut',
        });
        container.add(aiGlow);
        container.sendToBack(aiGlow);

        // "Processing" status indicator
        const statusDot = this.add.circle(18, -30, 4, 0x10B981, 1);
        this.tweens.add({
          targets: statusDot,
          alpha: { from: 1, to: 0.3 },
          duration: 800,
          yoyo: true,
          repeat: -1,
        });
        container.add(statusDot);
      }

      // Physics
      this.physics.add.existing(container);
      container.body.setCircle(14, -14, -14);
      container.body.setCollideWorldBounds(true);
      this.physics.add.collider(container, this.collisionGroup);
      container.setDepth(200 + def.y);

      // NPC state machine
      this.npcs.push({
        container,
        sprite,
        def,
        state: def.sitting ? 'SITTING' : 'IDLE',
        timer: Phaser.Math.Between(2000, 6000),
        targetX: def.x,
        targetY: def.y,
        homeX: def.x,
        homeY: def.y,
        walkSpeed: Phaser.Math.Between(35, 65),
        facingDir: 'down',
        lookTimer: 0,
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════════════
  // ROOM LABELS — Floating text with dark semi-transparent backgrounds
  // ═══════════════════════════════════════════════════════════════════════
  createRoomLabels() {
    ROOM_LABELS.forEach((room) => {
      const bg = this.add.rectangle(room.x, room.y, 0, 0, 0x0f172a, 0.7);
      bg.setStrokeStyle(1, 0x334155, 0.4);

      const text = this.add.text(room.x, room.y, room.text, {
        font: 'bold 11px Inter, sans-serif',
        fill: '#e2e8f0',
        padding: { x: 8, y: 4 },
      }).setOrigin(0.5);

      bg.setSize(text.width + 16, text.height + 8);
      bg.setOrigin(0.5);
      bg.setDepth(150);
      text.setDepth(151);
    });
  }

  // ─── UPDATE (every frame) ──────────────────────────────────────────
  update(time, delta) {
    if (!this.player || !this.player.body) return;

    this.updatePlayerMovement();
    this.updateNPCs(delta);

    // Y-depth sorting for CEO
    this.player.setDepth(200 + this.player.y);

    // Emit position to React (throttled)
    if (this.game.getFrame() % 10 === 0) {
      EventBus.emit('player_moved', {
        x: Math.round(this.player.x),
        y: Math.round(this.player.y),
      });
    }
  }

  // ─── PLAYER MOVEMENT — Smooth with sprite animation ───────────────
  updatePlayerMovement() {
    const speed = this.moveSpeed;
    let vx = 0, vy = 0;

    if (this.cursors.left.isDown  || this.wasd.A.isDown) vx = -1;
    else if (this.cursors.right.isDown || this.wasd.D.isDown) vx = 1;

    if (this.cursors.up.isDown   || this.wasd.W.isDown) vy = -1;
    else if (this.cursors.down.isDown  || this.wasd.S.isDown) vy = 1;

    // Normalize diagonal
    if (vx !== 0 && vy !== 0) {
      const n = 1 / Math.SQRT2;
      vx *= n;
      vy *= n;
    }

    const body = this.player.body;
    const accel = 0.18;
    body.setVelocity(
      Phaser.Math.Linear(body.velocity.x, vx * speed, accel),
      Phaser.Math.Linear(body.velocity.y, vy * speed, accel)
    );

    const isMoving = Math.abs(body.velocity.x) > 8 || Math.abs(body.velocity.y) > 8;

    if (isMoving) {
      if (Math.abs(vx) > Math.abs(vy)) {
        this.facingDirection = vx > 0 ? 'right' : 'left';
      } else if (vy !== 0) {
        this.facingDirection = vy > 0 ? 'down' : 'up';
      }
      const anim = `walk-${this.facingDirection}`;
      if (this.ceoSprite.anims.currentAnim?.key !== anim) {
        this.ceoSprite.play(anim, true);
      }
    } else {
      const anim = `idle-${this.facingDirection}`;
      if (this.ceoSprite.anims.currentAnim?.key !== anim) {
        this.ceoSprite.play(anim, true);
      }
    }
  }

  // ─── NPC PATROL AI — State machine with animations ────────────────
  updateNPCs(delta) {
    this.npcs.forEach((npc) => {
      npc.timer -= delta;

      switch (npc.state) {
        case 'SITTING':
        case 'IDLE': {
          if (npc.container.body) {
            npc.container.body.setVelocity(0, 0);
          }

          // Occasional look-around while sitting/idle
          npc.lookTimer -= delta;
          if (npc.lookTimer <= 0) {
            const dirs = ['down', 'left', 'right', 'up'];
            npc.facingDir = dirs[Phaser.Math.Between(0, 3)];
            const anim = `idle-${npc.facingDir}`;
            if (npc.sprite.anims.currentAnim?.key !== anim) {
              npc.sprite.play(anim, true);
            }
            npc.lookTimer = Phaser.Math.Between(2000, 5000);
          }

          if (npc.timer <= 0) {
            // Decide: walk to a random nearby point
            const area = npc.def.patrol;
            npc.targetX = Phaser.Math.Between(area.x1, area.x2);
            npc.targetY = Phaser.Math.Between(area.y1, area.y2);
            npc.state = 'WALKING';
            npc.timer = Phaser.Math.Between(4000, 10000);
          }
          break;
        }

        case 'WALKING': {
          if (!npc.container.body) break;

          const dx = npc.targetX - npc.container.x;
          const dy = npc.targetY - npc.container.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 10 || npc.timer <= 0) {
            npc.container.body.setVelocity(0, 0);
            npc.state = npc.def.sitting ? 'SITTING' : 'IDLE';
            npc.timer = Phaser.Math.Between(3000, 8000);
            // Return to idle
            const anim = `idle-${npc.facingDir}`;
            if (npc.sprite.anims.currentAnim?.key !== anim) {
              npc.sprite.play(anim, true);
            }
          } else {
            const angle = Math.atan2(dy, dx);
            npc.container.body.setVelocity(
              Math.cos(angle) * npc.walkSpeed,
              Math.sin(angle) * npc.walkSpeed
            );

            // Determine walk animation direction
            if (Math.abs(dx) > Math.abs(dy)) {
              npc.facingDir = dx > 0 ? 'right' : 'left';
            } else {
              npc.facingDir = dy > 0 ? 'down' : 'up';
            }
            const anim = `walk-${npc.facingDir}`;
            if (npc.sprite.anims.currentAnim?.key !== anim) {
              npc.sprite.play(anim, true);
            }
          }
          break;
        }
      }

      // Y-depth sorting
      npc.container.setDepth(200 + npc.container.y);
    });
  }

  // ─── AGENT SPAWNING (from WebSocket/EventBus) ─────────────────────
  handleSpawnAgent(data) {
    const { x, y } = data;
    const spawnX = x * 32 + 16;
    const spawnY = y * 32 + 16;

    const container = this.add.container(spawnX, spawnY);

    const shadow = this.add.ellipse(0, 34, 32, 10, 0x000000, 0.35);

    // Animated sprite with teal tint
    const sprite = this.add.sprite(0, 0, 'ceo-sprite', 0);
    sprite.setScale(CHAR_SCALE * 0.9);
    sprite.setTint(0x66EEBB);
    sprite.play('idle-down');

    const pulseRing = this.add.circle(0, 12, 20, 0x10B981, 0);
    pulseRing.setStrokeStyle(1.5, 0x34D399);
    this.tweens.add({
      targets: pulseRing,
      scaleX: 2.5, scaleY: 2.5,
      alpha: { from: 0.5, to: 0 },
      duration: 1400,
      repeat: -1,
      ease: 'Sine.easeOut',
    });

    const label = this.add.text(0, 40, `AI-${String(this.agents.length + 1).padStart(2, '0')}`, {
      font: 'bold 8px Inter, sans-serif',
      fill: '#ffffff',
      backgroundColor: '#10B981',
      padding: { x: 4, y: 2 },
    }).setOrigin(0.5);

    container.add([shadow, pulseRing, sprite, label]);
    container.setDepth(200 + spawnY);
    this.agents.push(container);
  }

  // ─── MAP RELOAD ────────────────────────────────────────────────────
  handleMapReload() {
    this.scene.restart();
  }

  // ─── CLEANUP ───────────────────────────────────────────────────────
  shutdown() {
    EventBus.off('spawn_agent', this.handleSpawnAgent);
    EventBus.off('map_reload', this.handleMapReload);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// REACT COMPONENT — Wraps the Phaser Game instance
// ═══════════════════════════════════════════════════════════════════════════
export default function GameComponent({ ws }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!gameInstance && containerRef.current) {
        gameInstance = new Phaser.Game({
          type: Phaser.WEBGL,
          width: window.innerWidth,
          height: window.innerHeight,
          parent: containerRef.current,
          scene: [GameScene],
          pixelArt: true,
          antialias: false,
          physics: {
            default: 'arcade',
            arcade: { debug: false, gravity: { y: 0 } },
          },
          scale: {
            mode: Phaser.Scale.RESIZE,
            autoCenter: Phaser.Scale.CENTER_BOTH,
          },
          render: {
            pixelArt: true,
            roundPixels: true,
          },
        });
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (gameInstance) {
        gameInstance.destroy(true);
        gameInstance = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!ws) return;

    const handleMessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'MAP_UPDATED' || data.type === 'map_reload') {
          EventBus.emit('map_reload');
        } else if (
          data.type === 'AGENT_SPAWNED' ||
          data.type === 'agent_spawned' ||
          data.type === 'spawn_ai_agent'
        ) {
          EventBus.emit('spawn_agent', { x: data.x, y: data.y });
        }
      } catch (e) {
        console.error('WS parse error:', e);
      }
    };

    ws.addEventListener('message', handleMessage);
    return () => ws.removeEventListener('message', handleMessage);
  }, [ws]);

  return <div ref={containerRef} id="phaser-game" style={{ width: '100%', height: '100%' }} />;
}
```
