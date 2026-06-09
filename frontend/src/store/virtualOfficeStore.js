/**
 * Sovereign Virtual Office — Zustand Store
 * 
 * Spatial state manager tracking CEO avatar, AI workforce positions,
 * proximity distances, privacy zones, and WebRTC connection states.
 */
import { create } from 'zustand';

const HEARING_RADIUS = 4.0;  // tiles — gain attenuation zone
const PRIVACY_ZONE_IDS = ['boardroom', 'meeting-room-a', 'meeting-room-b'];

export const useVirtualOfficeStore = create((set, get) => ({
  // === Connection ===
  isConnected: false,
  currentRoomId: null,
  currentRoomName: 'Main Office',

  // === CEO (Local Player) ===
  localPlayer: {
    userId: '',
    displayName: 'CEO',
    avatarKey: 'avatar-ceo',
    tileX: 25,
    tileY: 20,
    direction: 'down',
    status: 'online',
    isMuted: false,
    isCameraOff: true,
    currentZoneId: null,    // null = open floor, 'boardroom' = privacy zone
    isInPrivacyZone: false,
  },

  // === Remote Players (AI Agents + Humans) ===
  remotePlayers: {},
  // Proximity: Map of userId -> { distance, gainLevel, isSubscribed }
  proximityMap: {},
  nearbyUsers: [],
  videoUsers: [],

  // === Chat ===
  messages: [],
  unreadCount: 0,
  chatOpen: false,

  // === UI ===
  settingsOpen: false,
  participantListOpen: false,
  miniMapVisible: true,
  currentZone: 'Main Office',

  // === Performance Metrics ===
  fps: 60,
  ping: 0,
  activeConnections: 0,

  // ====== ACTIONS ======

  setConnected: (connected, roomId) => set({
    isConnected: connected,
    currentRoomId: roomId || null,
  }),

  setLocalPlayer: (data) => set(s => ({
    localPlayer: { ...s.localPlayer, ...data },
  })),

  updateRemotePlayer: (userId, data) => set(s => ({
    remotePlayers: {
      ...s.remotePlayers,
      [userId]: { ...(s.remotePlayers[userId] || {}), ...data, userId },
    },
  })),

  removeRemotePlayer: (userId) => set(s => {
    const updated = { ...s.remotePlayers };
    delete updated[userId];
    const proxMap = { ...s.proximityMap };
    delete proxMap[userId];
    return {
      remotePlayers: updated,
      proximityMap: proxMap,
      nearbyUsers: s.nearbyUsers.filter(id => id !== userId),
      videoUsers: s.videoUsers.filter(id => id !== userId),
    };
  }),

  /**
   * Core proximity update — calculates gain attenuation and subscription state.
   * Gain = 1.0 at distance 1.0, linear falloff to 0.0 at HEARING_RADIUS.
   * Drops subscription entirely beyond HEARING_RADIUS.
   */
  updateProximity: (userId, distance) => set(s => {
    const inPrivacy = s.localPlayer.isInPrivacyZone;
    const remotePlayer = s.remotePlayers[userId];
    const remoteInSameZone = remotePlayer?.currentZoneId === s.localPlayer.currentZoneId;

    // Privacy Zone Logic: if CEO is in boardroom, only connect to same-zone users
    let shouldSubscribe = false;
    let gainLevel = 0;

    if (inPrivacy) {
      // Only subscribe to users in the SAME privacy zone
      if (remoteInSameZone && distance <= HEARING_RADIUS) {
        shouldSubscribe = true;
        gainLevel = distance <= 1.0 ? 1.0 : Math.max(0, 1.0 - (distance - 1.0) / (HEARING_RADIUS - 1.0));
      }
    } else {
      // Open floor: normal proximity
      if (distance <= HEARING_RADIUS) {
        shouldSubscribe = true;
        gainLevel = distance <= 1.0 ? 1.0 : Math.max(0, 1.0 - (distance - 1.0) / (HEARING_RADIUS - 1.0));
      }
    }

    const nearbyUsers = [...s.nearbyUsers];
    if (shouldSubscribe && !nearbyUsers.includes(userId)) nearbyUsers.push(userId);
    if (!shouldSubscribe) {
      const idx = nearbyUsers.indexOf(userId);
      if (idx !== -1) nearbyUsers.splice(idx, 1);
    }

    return {
      proximityMap: {
        ...s.proximityMap,
        [userId]: { distance, gainLevel, isSubscribed: shouldSubscribe },
      },
      nearbyUsers,
    };
  }),

  // === Privacy Zone ===
  enterPrivacyZone: (zoneId) => set(s => ({
    localPlayer: { ...s.localPlayer, currentZoneId: zoneId, isInPrivacyZone: true },
    currentZone: zoneId === 'boardroom' ? 'The Boardroom' : zoneId,
  })),

  exitPrivacyZone: () => set(s => ({
    localPlayer: { ...s.localPlayer, currentZoneId: null, isInPrivacyZone: false },
    currentZone: 'Main Office',
  })),

  // === Chat ===
  addMessage: (msg) => set(s => ({
    messages: [...s.messages.slice(-99), msg],
    unreadCount: s.chatOpen ? 0 : s.unreadCount + 1,
  })),
  setChatHistory: (messages) => set({ messages }),
  toggleChat: () => set(s => ({ chatOpen: !s.chatOpen, unreadCount: !s.chatOpen ? 0 : s.unreadCount })),

  // === UI ===
  toggleSettings: () => set(s => ({ settingsOpen: !s.settingsOpen })),
  toggleParticipants: () => set(s => ({ participantListOpen: !s.participantListOpen })),
  toggleMiniMap: () => set(s => ({ miniMapVisible: !s.miniMapVisible })),
  toggleMute: () => set(s => ({ localPlayer: { ...s.localPlayer, isMuted: !s.localPlayer.isMuted } })),
  toggleCamera: () => set(s => ({ localPlayer: { ...s.localPlayer, isCameraOff: !s.localPlayer.isCameraOff } })),
  setStatus: (status) => set(s => ({ localPlayer: { ...s.localPlayer, status } })),
  setCurrentZone: (zone) => set({ currentZone: zone }),
  setFps: (fps) => set({ fps }),
  setPing: (ping) => set({ ping }),

  reset: () => set({
    isConnected: false, currentRoomId: null, remotePlayers: {}, proximityMap: {},
    nearbyUsers: [], videoUsers: [], messages: [], unreadCount: 0, chatOpen: false,
    settingsOpen: false, participantListOpen: false,
  }),
}));
