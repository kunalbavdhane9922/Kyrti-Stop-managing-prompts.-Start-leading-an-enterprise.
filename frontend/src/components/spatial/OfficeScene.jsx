import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { AgentAvatar } from './AgentAvatar.jsx';
import { HeatmapFloor } from './HeatmapFloor.jsx';

/**
 * Sovereign Protocol — Office Scene (Module 3)
 * Main Three.js scene with lighting, camera, agent avatars, and heatmap floor.
 */
function OfficeScene({ agentPositions, heatmapData, cameraTarget, cameraLookAt, onAgentClick, onSceneReady }) {
  const controlsRef = useRef();
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(cameraTarget.x, cameraTarget.y, cameraTarget.z));
  const targetLook = useRef(new THREE.Vector3(cameraLookAt.x, cameraLookAt.y, cameraLookAt.z));

  // Update camera targets when props change
  useEffect(() => {
    targetPos.current.set(cameraTarget.x, cameraTarget.y, cameraTarget.z);
    targetLook.current.set(cameraLookAt.x, cameraLookAt.y, cameraLookAt.z);
  }, [cameraTarget, cameraLookAt]);

  // Signal scene ready
  useEffect(() => {
    if (onSceneReady) onSceneReady();
  }, []);

  // Smooth camera interpolation
  useFrame(() => {
    camera.position.lerp(targetPos.current, 0.04);
    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLook.current, 0.04);
      controlsRef.current.update();
    }
  });

  return (
    <>
      {/* Camera Controls */}
      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={2}
        maxDistance={16}
        dampingFactor={0.08}
        enableDamping
      />

      {/* Lighting */}
      <ambientLight intensity={0.35} color="#e2e8f0" />
      <directionalLight position={[5, 8, 5]} intensity={0.7} color="#f8fafc" castShadow shadow-mapSize={1024} />
      <directionalLight position={[-3, 4, -3]} intensity={0.2} color="#94a3b8" />
      <pointLight position={[0, 3, 0]} intensity={0.15} color="#e2e8f0" distance={12} />

      {/* Heatmap Floor */}
      <HeatmapFloor heatmapData={heatmapData} gridSize={8} />

      {/* Agent Avatars */}
      {agentPositions.map(agent => (
        <AgentAvatar
          key={agent.agentId}
          agentId={agent.agentId}
          name={agent.name}
          state={agent.state}
          position={[agent.x, 0.35, agent.z]}
          burnIntensity={agent.burnIntensity}
          onClick={onAgentClick}
        />
      ))}

      {/* Room boundary indicators */}
      {[-4, 4].map(x => [-4, 4].map(z => (
        <mesh key={`post_${x}_${z}`} position={[x, 0.5, z]}>
          <boxGeometry args={[0.06, 1, 0.06]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
        </mesh>
      )))}
    </>
  );
}

export { OfficeScene };
