/**
 * Sovereign Virtual Office — MiniMap Component
 * 
 * Renders a scaled-down canvas of the office with player dots.
 * Defensive: handles missing map data gracefully.
 */
import { useRef, useEffect, useState } from 'react';
import { useVirtualOfficeStore } from '../../store/virtualOfficeStore.js';
import { EventBus } from '../../game/EventBus.js';

const MINIMAP_SIZE = 180;

export function MiniMap() {
  const canvasRef = useRef(null);
  const { remotePlayers, miniMapVisible, localPlayer } = useVirtualOfficeStore();
  const [mapData, setMapData] = useState(null);

  // Listen for scene-ready to grab map data
  useEffect(() => {
    const handler = (scene) => {
      try {
        const data = scene?.registry?.get('mapData');
        if (data) setMapData(data);
      } catch (e) {
        console.warn('[MiniMap] Could not read map data:', e);
      }
    };
    const unsub = EventBus.on('scene-ready', handler);
    return () => { if (typeof unsub === 'function') unsub(); };
  }, []);

  // Render minimap at 5Hz
  useEffect(() => {
    if (!miniMapVisible || !mapData) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { ground, collision, width, height } = mapData;
    const scaleX = MINIMAP_SIZE / width;
    const scaleY = MINIMAP_SIZE / height;

    // Background
    ctx.fillStyle = '#faf9f6';
    ctx.fillRect(0, 0, MINIMAP_SIZE, MINIMAP_SIZE);

    // Draw tiles
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const gTile = ground[y][x];
        const cTile = collision[y][x];
        if (gTile === 1 || gTile === 3) {
          ctx.fillStyle = '#d1d5db'; // walls
        } else if (gTile === 2) {
          ctx.fillStyle = '#f0ebe3'; // carpet
        } else if (cTile >= 10) {
          ctx.fillStyle = '#e5e7eb'; // furniture
        } else {
          ctx.fillStyle = '#f5f5f4'; // floor
        }
        ctx.fillRect(
          Math.floor(x * scaleX),
          Math.floor(y * scaleY),
          Math.ceil(scaleX),
          Math.ceil(scaleY)
        );
      }
    }

    // Remote player dots
    const players = Object.values(remotePlayers || {});
    players.forEach(p => {
      if (p.tileX != null && p.tileY != null) {
        ctx.fillStyle = '#9ca3af';
        ctx.beginPath();
        ctx.arc(p.tileX * scaleX, p.tileY * scaleY, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Local player (CEO) — gold dot
    if (localPlayer.tileX != null && localPlayer.tileY != null) {
      ctx.fillStyle = '#c5a059';
      ctx.beginPath();
      ctx.arc(localPlayer.tileX * scaleX, localPlayer.tileY * scaleY, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Border
    ctx.strokeStyle = 'rgba(0,0,0,0.06)';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, MINIMAP_SIZE, MINIMAP_SIZE);

  }, [remotePlayers, localPlayer.tileX, localPlayer.tileY, miniMapVisible, mapData]);

  if (!miniMapVisible) return null;

  return (
    <div className="vo-minimap">
      <canvas ref={canvasRef} width={MINIMAP_SIZE} height={MINIMAP_SIZE} />
    </div>
  );
}
