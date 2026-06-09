/**
 * Sovereign Virtual Office — Main Page
 * 
 * The "Visual Nervous System" — assembles the Phaser spatial engine
 * with institutional light-mode React overlays.
 * Wires EventBus ↔ Zustand ↔ Socket.io with privacy zone logic.
 */
import { useEffect, useRef, useCallback, useState } from 'react';
import { PhaserGame } from '../game/PhaserGame.jsx';
import { EventBus } from '../game/EventBus.js';
import { socketService } from '../services/socketService.js';
import { useVirtualOfficeStore } from '../store/virtualOfficeStore.js';
import { useAuthStore } from '../store/authStore.js';
import { ChatPanel } from '../components/virtual-office/ChatPanel.jsx';
import { Toolbar } from '../components/virtual-office/Toolbar.jsx';
import { ParticipantList } from '../components/virtual-office/ParticipantList.jsx';
import { MiniMap } from '../components/virtual-office/MiniMap.jsx';

function VirtualOfficePage() {
  const gameRef = useRef(null);
  const user = useAuthStore(s => s.user);
  const store = useVirtualOfficeStore();
  const [privacyZone, setPrivacyZone] = useState(null);
  const [fps, setFps] = useState(60);
  const [ping, setPing] = useState(0);

  const {
    setConnected, setLocalPlayer, updateRemotePlayer,
    removeRemotePlayer, updateProximity, addMessage,
    setChatHistory, enterPrivacyZone, exitPrivacyZone,
  } = store;

  useEffect(() => {
    const roomId = 'main-office';
    const userData = {
      userId: user?.id || `ceo-${Date.now()}`,
      displayName: user?.name || 'CEO',
      avatarKey: 'avatar-ceo',
    };

    setLocalPlayer(userData);
    socketService.connect(roomId, userData);

    const unsubs = [
      EventBus.on('socket-connected', () => setConnected(true, roomId)),
      EventBus.on('socket-disconnected', () => setConnected(false, null)),
      EventBus.on('remote-player-joined', d => updateRemotePlayer(d.userId, d)),
      EventBus.on('remote-player-left', d => removeRemotePlayer(d.userId)),
      EventBus.on('remote-player-moved', d => updateRemotePlayer(d.userId, d)),
      EventBus.on('player-moved', d => setLocalPlayer({ tileX: d.tileX, tileY: d.tileY, direction: d.direction })),
      EventBus.on('proximity-update', d => updateProximity(d.userId, d.distance)),
      EventBus.on('chat-message', m => addMessage(m)),
      EventBus.on('chat-history', ms => setChatHistory(ms)),
      EventBus.on('player-status-changed', d => updateRemotePlayer(d.userId, { status: d.status })),
      EventBus.on('room-state', d => {
        if (d.members) d.members.forEach(m => updateRemotePlayer(m.userId, m));
      }),
      EventBus.on('enter-privacy-zone', d => { setPrivacyZone(d); enterPrivacyZone(d.zoneId); }),
      EventBus.on('exit-privacy-zone', () => { setPrivacyZone(null); exitPrivacyZone(); }),
      EventBus.on('fps-update', f => setFps(f)),
    ];

    return () => {
      unsubs.forEach(u => { if (typeof u === 'function') u(); });
      socketService.disconnect();
      store.reset();
    };
  }, []);

  return (
    <div className="vo-page">
      {/* Phaser 2D Spatial Engine */}
      <div className="vo-canvas-container">
        <PhaserGame ref={gameRef} />
      </div>

      {/* React UI Overlays — Institutional Light Mode */}
      <div className="vo-overlay">
        {/* Top Bar */}
        <div className="vo-topbar">
          <div className="vo-room-info">
            <div className={`vo-connection-dot ${store.isConnected ? 'connected' : ''}`} />
            <span className="vo-room-name">{store.currentRoomName}</span>
          </div>
          <div className="vo-zone-label">{store.currentZone}</div>
          <div className="vo-metrics">
            <div className="vo-metric-item">
              <span>FPS</span>
              <span className="vo-metric-value">{fps}</span>
            </div>
            <div className="vo-metric-item">
              <span>POS</span>
              <span className="vo-metric-value">
                {store.localPlayer.tileX},{store.localPlayer.tileY}
              </span>
            </div>
            <div className="vo-metric-item">
              <span>CONN</span>
              <span className="vo-metric-value">{store.nearbyUsers.length}</span>
            </div>
          </div>
        </div>

        {/* Privacy Zone Indicator */}
        {privacyZone && (
          <div className="vo-privacy-indicator">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>{privacyZone.zoneName} — Secure Audio Mesh Active</span>
          </div>
        )}

        <ChatPanel />
        <ParticipantList />
        <MiniMap />
        <Toolbar />
      </div>

      {/* Controls hint */}
      <div className="vo-controls-hint">
        <span>WASD / Arrow Keys to navigate</span>
      </div>
    </div>
  );
}

export default VirtualOfficePage;
