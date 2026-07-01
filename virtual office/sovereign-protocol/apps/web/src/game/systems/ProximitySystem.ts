import { defineQuery } from 'bitecs';
import { Position } from '../components/Position';

export const createProximitySystem = (scene: Phaser.Scene) => {
  const positionQuery = defineQuery([Position]);
  
  // Local radius check to show UI prompts (e.g. "Press E to chat") before server confirmation
  const INTERACTION_RADIUS = 150; 

  return (world: any) => {
    const ents = positionQuery(world);
    
    // In a real scenario, we find the 'local player' eid and compare to others
    // For MVP, we assume eid 0 is local player (stub)
    const localPlayer = ents[0]; 
    if (localPlayer === undefined) return world;

    const lx = Position.x[localPlayer];
    const ly = Position.y[localPlayer];

    for (let i = 1; i < ents.length; i++) {
      const eid = ents[i];
      const dx = lx - Position.x[eid];
      const dy = ly - Position.y[eid];
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      if (dist < INTERACTION_RADIUS) {
        // Dispatch UI hint event to React
        window.dispatchEvent(new CustomEvent('SHOW_INTERACT_HINT', { 
            detail: { targetId: eid } 
        }));
      }
    }
    
    return world;
  };
};
