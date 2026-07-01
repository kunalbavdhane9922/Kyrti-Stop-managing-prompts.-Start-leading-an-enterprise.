import { useEffect, useRef } from 'react';
import { useSpatialStore } from '../store/useSpatialStore';

export const useWebSocket = (officeId: string) => {
  const wsRef = useRef<WebSocket | null>(null);
  const { setWsConnected, updatePlayerPosition } = useSpatialStore();

  useEffect(() => {
    // In production, this URL is injected via environment variables
    const ws = new WebSocket(`ws://localhost:8000/api/v1/ws/${officeId}`);

    ws.onopen = () => {
      console.log('Connected to Sovereign Spatial Gateway');
      setWsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'TICK_UPDATE') {
          // data.updates format: [[client_id, x, y, state]]
          data.updates.forEach((update: any[]) => {
            const [id, x, y, state] = update;
            updatePlayerPosition(id, x, y, state);
          });
        }
      } catch (err) {
        console.error('Failed to parse WS message', err);
      }
    };

    ws.onclose = () => {
      console.log('Disconnected from Sovereign Spatial Gateway');
      setWsConnected(false);
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, [officeId, setWsConnected, updatePlayerPosition]);

  const sendIntent = (x: number, y: number) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'MOVE_INTENT', x, y }));
    }
  };

  return { sendIntent };
};
