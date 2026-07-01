import { defineComponent, Types } from 'bitecs';

// Component defining spatial position in the 2D grid
export const Position = defineComponent({
  x: Types.f32,
  y: Types.f32,
  z: Types.f32,     // For isometric layering depth
  facing: Types.ui8 // 0: Down, 1: Left, 2: Up, 3: Right
});
