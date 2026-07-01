import { defineQuery } from 'bitecs';
import { Position } from '../components/Position';

export const createZoneSystem = (scene: Phaser.Scene) => {
  const playerQuery = defineQuery([Position]);
  
  // Define geometric zones for permissions (e.g., Executive Office boundary)
  const restrictedZones = [
    { id: 'exec_01', minX: 100, maxX: 400, minY: 100, maxY: 300, requiredRole: 'OWNER' }
  ];

  return (world: any) => {
    const ents = playerQuery(world);
    const localPlayer = ents[0];
    if (localPlayer === undefined) return world;

    const x = Position.x[localPlayer];
    const y = Position.y[localPlayer];

    for (const zone of restrictedZones) {
      if (x >= zone.minX && x <= zone.maxX && y >= zone.minY && y <= zone.maxY) {
        // Dispatch UI warning if they enter without permission
        window.dispatchEvent(new CustomEvent('ZONE_ENTER', { detail: { zoneId: zone.id } }));
      }
    }
    
    return world;
  };
};
