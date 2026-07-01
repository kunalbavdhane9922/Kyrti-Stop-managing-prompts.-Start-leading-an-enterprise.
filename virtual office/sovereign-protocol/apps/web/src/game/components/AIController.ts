import { defineComponent, Types } from 'bitecs';

// Component marking an entity as an AI, carrying state and target path
export const AIController = defineComponent({
  state: Types.ui8,     // 0: Idle, 1: Moving, 2: Working, 3: Chatting
  targetX: Types.f32,
  targetY: Types.f32,
  pathIndex: Types.i16  // Index of the current A* path node
});
