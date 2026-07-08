import { useMemo } from 'react';
import * as THREE from 'three';

/**
 * Sovereign Protocol — Heatmap Floor (Module 3)
 * Burn-rate heatmap rendered on the office floor.
 * Green = low compute, Amber = medium, Red = high burn.
 */
function HeatmapFloor({ heatmapData, gridSize = 8 }) {
  const cells = useMemo(() => {
    if (!heatmapData || heatmapData.length === 0) {
      // Generate default grid with zero intensity
      const defaultCells = [];
      for (let x = -gridSize / 2; x < gridSize / 2; x++) {
        for (let z = -gridSize / 2; z < gridSize / 2; z++) {
          defaultCells.push({ gridX: x, gridZ: z, intensity: 0 });
        }
      }
      return defaultCells;
    }
    return heatmapData;
  }, [heatmapData, gridSize]);

  const getHeatColor = (intensity) => {
    // 0 = dark green, 0.5 = amber, 1.0 = red
    const clamped = Math.max(0, Math.min(1, intensity));
    if (clamped < 0.33) {
      return new THREE.Color('#0f172a').lerp(new THREE.Color('#8B5E3C'), clamped * 3);
    } else if (clamped < 0.66) {
      return new THREE.Color('#8B5E3C').lerp(new THREE.Color('#D4842E'), (clamped - 0.33) * 3);
    } else {
      return new THREE.Color('#D4842E').lerp(new THREE.Color('#FF5C00'), (clamped - 0.66) * 3);
    }
  };

  return (
    <group>
      {/* Base floor */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[gridSize + 1, gridSize + 1]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>

      {/* Grid lines */}
      <gridHelper args={[gridSize, gridSize, '#1e293b', '#1e293b']} position={[0, 0.005, 0]} />

      {/* Heatmap cells */}
      {cells.map((cell, i) => {
        const color = getHeatColor(cell.intensity);
        return (
          <mesh
            key={`${cell.gridX}_${cell.gridZ}`}
            position={[cell.gridX + 0.5, 0.008, cell.gridZ + 0.5]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[0.92, 0.92]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.15 + cell.intensity * 0.5}
            />
          </mesh>
        );
      })}
    </group>
  );
}

export { HeatmapFloor };
