import React, { useState, useEffect } from 'react';
import GameComponent from './GameComponent';
import EventBus from './EventBus';
import { Video, X } from 'lucide-react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import useSpatialStore from './store/spatialStore';
import { useWebSocket } from './network/WebSocketProvider';
import SpatialMarketplace from './components/spatial/SpatialMarketplace';
import ProximityChatPanel from './components/spatial/ProximityChatPanel';
import DashboardOverlay from './components/spatial/DashboardOverlay';
import SpatialExpansionModal from './components/spatial/SpatialExpansionModal';
import { AppLayout } from './components/layout/AppLayout';

function App() {
  const [jitsiRoom, setJitsiRoom] = useState(null);
  const ws = useWebSocket();

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
        <GameComponent />
      </div>

      {/* Jitsi Meeting Overlay (slides in from right) */}
      <div
        className={`fixed right-0 top-0 h-full z-50 pointer-events-auto flex flex-col
          bg-[#FFFFFF] border-l border-slate-200 shadow-2xl
          transition-all duration-500 ease-in-out
          ${jitsiRoom ? 'w-[450px] opacity-100 translate-x-0' : 'w-[450px] opacity-0 translate-x-full'}`}
      >
        <div className="bg-[#F8FAFC] text-[#0F172A] p-5 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-3 font-semibold text-sm tracking-widest uppercase text-slate-600">
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
        <SpatialMarketplace />
        <ProximityChatPanel />
        <DashboardOverlay />
        <SpatialExpansionModal />
      </div>
    </AppLayout>
  );
}

export default App;
