import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Sovereign Protocol — Agent Avatar (Module 3)
 * State-driven 3D entity representing an AI agent.
 * Visual properties change based on execution state.
 */
function AgentAvatar({ agentId, name, state, position, burnIntensity, onClick }) {
  const meshRef = useRef();
  const glowRef = useRef();
  const labelRef = useRef();

  const stateConfig = useMemo(() => {
    const configs = {
      executing: { color: '#FF5C00', emissive: '#D4842E', intensity: 0.6, pulseSpeed: 2, yOffset: 0 },
      planning: { color: '#334155', emissive: '#1e293b', intensity: 0.2, pulseSpeed: 0.8, yOffset: 0 },
      idle: { color: '#94a3b8', emissive: '#475569', intensity: 0.05, pulseSpeed: 0, yOffset: 0 },
      blocked: { color: '#E8943A', emissive: '#8B5E3C', intensity: 0.8, pulseSpeed: 4, yOffset: 0.15 },
      terminated: { color: '#374151', emissive: '#1f2937', intensity: 0, pulseSpeed: 0, yOffset: -0.1 },
    };
    return configs[state] || configs.idle;
  }, [state]);

  const baseColor = useMemo(() => new THREE.Color(stateConfig.color), [stateConfig.color]);
  const emissiveColor = useMemo(() => new THREE.Color(stateConfig.emissive), [stateConfig.emissive]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Pulse animation for active states
    if (stateConfig.pulseSpeed > 0) {
      const pulse = Math.sin(Date.now() * 0.001 * stateConfig.pulseSpeed) * 0.5 + 0.5;
      meshRef.current.material.emissiveIntensity = stateConfig.intensity * (0.5 + pulse * 0.5);

      // Blocked agents bob up and down
      if (state === 'blocked') {
        meshRef.current.position.y = position[1] + stateConfig.yOffset + Math.sin(Date.now() * 0.003) * 0.05;
      }
    }

    // Slow rotation for executing agents
    if (state === 'executing') {
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group position={position} onClick={(e) => { e.stopPropagation(); onClick?.(agentId); }}>
      {/* Agent Body */}
      <mesh ref={meshRef} position={[0, stateConfig.yOffset, 0]} castShadow>
        <capsuleGeometry args={[0.2, 0.4, 8, 16]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={emissiveColor}
          emissiveIntensity={stateConfig.intensity}
          roughness={0.4}
          metalness={0.6}
          wireframe={state === 'terminated'}
        />
      </mesh>

      {/* Base Indicator Ring */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.28, 0.35, 32]} />
        <meshBasicMaterial
          color={baseColor}
          transparent
          opacity={state === 'terminated' ? 0.15 : 0.4}
        />
      </mesh>

      {/* Status Light (top) */}
      {state !== 'terminated' && (
        <mesh position={[0, 0.65 + stateConfig.yOffset, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial
            color={stateConfig.color}
            emissive={stateConfig.emissive}
            emissiveIntensity={1.2}
          />
        </mesh>
      )}
    </group>
  );
}

export { AgentAvatar };
