/**
 * Sovereign Virtual Office — Socket.io Client Service
 * 
 * Singleton manager for real-time WebSocket connection.
 * Bridges Socket.io events with the EventBus for Phaser,
 * and directly updates the Zustand store for React.
 */
import { io } from 'socket.io-client';
import { EventBus } from '../game/EventBus.js';

const BACKEND_URL = 'http://localhost:3001';

class SocketServiceClass {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.roomId = null;
  }

  /**
   * Connect to the backend and join a room.
   */
  connect(roomId, userData) {
    if (this.socket?.connected) {
      this.disconnect();
    }

    this.roomId = roomId;

    this.socket = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
      timeout: 10000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      this.connected = true;
      console.log('[VO Socket] Connected:', this.socket.id);

      // Join room
      this.socket.emit('room:join', {
        userId: userData.userId,
        displayName: userData.displayName,
        avatarKey: userData.avatarKey,
        roomId,
      });
    });

    this.socket.on('room:joined', (data) => {
      console.log('[VO Socket] Joined room:', data.roomId);
      EventBus.emit('socket-connected', data);
    });

    // --- Room state (initial sync) ---
    this.socket.on('room:state', (data) => {
      EventBus.emit('room-state', data);
    });

    // --- Player events ---
    this.socket.on('player:joined', (data) => {
      EventBus.emit('remote-player-joined', data);
    });

    this.socket.on('player:left', (data) => {
      EventBus.emit('remote-player-left', data);
    });

    this.socket.on('player:moved', (data) => {
      EventBus.emit('remote-player-moved', data);
    });

    this.socket.on('player:status-changed', (data) => {
      EventBus.emit('player-status-changed', data);
    });

    this.socket.on('player:emote', (data) => {
      EventBus.emit('player-emote', data);
    });

    this.socket.on('player:correction', (data) => {
      // Server rejected our position — snap back
      EventBus.emit('position-correction', data);
    });

    // --- Chat events ---
    this.socket.on('chat:message', (data) => {
      EventBus.emit('chat-message', data);
    });

    this.socket.on('chat:dm', (data) => {
      EventBus.emit('chat-dm', data);
    });

    this.socket.on('chat:history', (data) => {
      EventBus.emit('chat-history', data);
    });

    // --- Error/Disconnect ---
    this.socket.on('disconnect', (reason) => {
      this.connected = false;
      console.log('[VO Socket] Disconnected:', reason);
      EventBus.emit('socket-disconnected', { reason });
    });

    this.socket.on('connect_error', (err) => {
      console.error('[VO Socket] Connection error:', err.message);
    });

    // --- Listen for Phaser position updates ---
    EventBus.on('player-moved', (data) => {
      if (this.socket?.connected) {
        this.socket.emit('player:move', data);
      }
    });
  }

  /**
   * Send a chat message.
   */
  sendChat(text, type = 'room') {
    if (this.socket?.connected) {
      this.socket.emit('chat:send', { text, type });
    }
  }

  /**
   * Send a direct message.
   */
  sendDM(targetUserId, text) {
    if (this.socket?.connected) {
      this.socket.emit('chat:dm', { targetUserId, text });
    }
  }

  /**
   * Send an emote.
   */
  sendEmote(emoteKey) {
    if (this.socket?.connected) {
      this.socket.emit('player:emote', { emoteKey });
    }
  }

  /**
   * Update presence status.
   */
  sendStatus(status) {
    if (this.socket?.connected) {
      this.socket.emit('player:status', { status });
    }
  }

  /**
   * Disconnect and clean up.
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.connected = false;
    this.roomId = null;
  }
}

export const socketService = new SocketServiceClass();
