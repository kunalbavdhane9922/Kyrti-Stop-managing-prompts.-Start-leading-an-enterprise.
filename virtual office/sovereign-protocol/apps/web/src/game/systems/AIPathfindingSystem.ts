import { defineQuery } from 'bitecs';
import { Position } from '../components/Position';
import { AIController } from '../components/AIController';

export const createAIPathfindingSystem = (scene: Phaser.Scene) => {
  // Query only entities that have BOTH Position and AIController components
  const aiQuery = defineQuery([Position, AIController]);

  return (world: any) => {
    const ents = aiQuery(world);
    for (let i = 0; i < ents.length; i++) {
      const eid = ents[i];
      const state = AIController.state[eid];
      
      // If moving, interpolate locally between server ticks to make the AI look smooth
      if (state === 1) {
        const tX = AIController.targetX[eid];
        const tY = AIController.targetY[eid];
        
        // Push the entity's physical Position closer to the target
        Position.x[eid] += (tX - Position.x[eid]) * 0.05;
        Position.y[eid] += (tY - Position.y[eid]) * 0.05;
      }
    }
    return world;
  };
};
