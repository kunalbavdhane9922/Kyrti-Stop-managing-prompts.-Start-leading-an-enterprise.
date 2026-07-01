import { defineQuery } from 'bitecs';
import { Position } from '../components/Position';

export const createMovementSystem = (scene: Phaser.Scene) => {
  // Query all entities that have a Position component
  const movementQuery = defineQuery([Position]);

  return (world: any) => {
    const ents = movementQuery(world);
    for (let i = 0; i < ents.length; i++) {
      const eid = ents[i];
      const targetX = Position.x[eid];
      const targetY = Position.y[eid];
      
      // In a full implementation, we fetch the corresponding Phaser Sprite for this eid
      // and interpolate its physical x/y towards targetX/targetY.
      
      // const sprite = scene.entityMap.get(eid);
      // sprite.x += (targetX - sprite.x) * 0.1;
      // sprite.y += (targetY - sprite.y) * 0.1;
    }
    return world;
  };
};
