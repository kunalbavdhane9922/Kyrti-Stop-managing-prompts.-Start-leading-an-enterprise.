import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import useSpatialStore from '../store/spatialStore';
import EventBus from '../EventBus';

const WebSocketContext = createContext(null);

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};

export const WebSocketProvider = ({ children }) => {
  const [wsInstance, setWsInstance] = useState(null);
  const wsRef = useRef(null);

  useEffect(() => {
    // Generate a simple client ID
    const clientId = 'client_' + Math.floor(Math.random() * 10000);
    const wsBase = import.meta.env.VITE_WS_URL || (import.meta.env.PROD ? 'wss://saep-gateway.onrender.com' : 'ws://localhost:8000');
    const ws = new WebSocket(`${wsBase}/ws/${clientId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setWsInstance(ws);
      console.log('WebSocket Connected:', clientId);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Map updates
        if (data.type === 'MAP_UPDATED' || data.type === 'map_reload') {
          EventBus.emit('map_reload');
        } 
        // Agent Spawning
        else if (
          data.type === 'AGENT_SPAWNED' ||
          data.type === 'agent_spawned' ||
          data.type === 'spawn_ai_agent'
        ) {
          // Add to store and emit to Phaser
          useSpatialStore.getState().addAgent({ id: data.id, name: data.name, x: data.x, y: data.y });
          EventBus.emit('spawn_agent', { x: data.x, y: data.y, id: data.id });
        }
        // AI Chat Replies
        else if (data.type === 'chat_reply') {
          // Dispatch custom event for ProximityChatPanel
          const chatEvent = new CustomEvent('receive_ai_chat', { detail: { message: data.message } });
          window.dispatchEvent(chatEvent);
        }
      } catch (e) {
        console.error('WS parse error:', e);
      }
    };

    ws.onclose = () => {
      setWsInstance(null);
      console.log('WebSocket Disconnected');
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      } else {
        ws.onopen = () => ws.close();
      }
    };
  }, []);

  return (
    <WebSocketContext.Provider value={wsInstance}>
      {children}
    </WebSocketContext.Provider>
  );
};
