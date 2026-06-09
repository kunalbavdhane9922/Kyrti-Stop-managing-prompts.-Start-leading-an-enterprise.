import { useEffect, useRef, useCallback, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OfficeScene } from '../components/spatial/OfficeScene.jsx';
import { SpatialHUD } from '../components/spatial/SpatialHUD.jsx';
import { useSpatialStore } from '../store/spatialStore.js';
import { useAgentOSStore } from '../store/agentOSStore.js';
import { useAuthStore } from '../store/authStore.js';
import { CanvasIsolation } from '../security/CanvasIsolation.js';
import { SpatialAudioEngine } from '../services/SpatialAudioEngine.js';
import { AuditLogger } from '../security/AuditLogger.js';
import { AUDIT_ACTIONS } from '../config/constants.js';
import { platformApi } from '../services/platformApi.js';

/**
 * Sovereign Protocol — Module 3: Spatial Workspace Page
 * The 3D command center. Agents rendered as spatial entities.
 * All state rendered as WebGL pixels — no DOM-inspectable text.
 */
function SpatialWorkspacePage() {
  const user = useAuthStore(s => s.user);
  const canvasRef = useRef(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  const {
    agentPositions, cameraTarget, cameraLookAt, focusedAgentId,
    heatmapData, audioEnabled, hudVisible, sceneLoaded,
    setAgentPositions, focusAgent, resetCamera, setHeatmap,
    toggleAudio, toggleHud, setSceneLoaded,
  } = useSpatialStore();

  const selectAgent = useAgentOSStore(s => s.selectAgent);

  // Load spatial data
  useEffect(() => {
    if (dataLoaded) return;
    const load = async () => {
      try {
        const [posData, heatData] = await Promise.all([
          platformApi.getSpatialAgentPositions(),
          platformApi.getSpatialHeatmap(),
        ]);
        // SECURITY: Strip to render-only metadata via CanvasIsolation
        const safePositions = posData.map(p => CanvasIsolation.stripToRenderMetadata(p));
        setAgentPositions(safePositions);
        setHeatmap(heatData);
        setDataLoaded(true);

        AuditLogger.log({
          action: AUDIT_ACTIONS.SPATIAL_SCENE_LOAD,
          userId: user?.id,
          context: 'spatial_workspace',
          details: `Loaded ${safePositions.length} agent positions`,
        });
      } catch (e) { /* mock */ }
    };
    load();
  }, [dataLoaded]);

  // Apply canvas security when mounted
  useEffect(() => {
    const timer = setTimeout(() => {
      const canvasEl = document.querySelector('.spatial-canvas canvas');
      if (canvasEl) {
        CanvasIsolation.secure(canvasEl);
        CanvasIsolation.handleContextLoss(canvasEl, () => {
          setDataLoaded(false); // Force reload on context restore
        });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [sceneLoaded]);

  // Audio lifecycle
  useEffect(() => {
    SpatialAudioEngine.init();
    return () => SpatialAudioEngine.destroy();
  }, []);

  useEffect(() => {
    SpatialAudioEngine.setEnabled(audioEnabled);
    if (audioEnabled) {
      SpatialAudioEngine.playAmbient();
    } else {
      SpatialAudioEngine.stopAmbient();
    }
  }, [audioEnabled]);

  const handleAgentClick = useCallback((agentId) => {
    focusAgent(agentId);

    const agent = agentPositions.find(a => a.agentId === agentId);
    if (agent && audioEnabled) {
      SpatialAudioEngine.playNotification(agent.state, { x: agent.x, y: agent.y, z: agent.z });
    }

    AuditLogger.log({
      action: AUDIT_ACTIONS.SPATIAL_AGENT_FOCUS,
      userId: user?.id,
      context: 'spatial_workspace',
      details: `Focused on agent ${agentId}`,
    });
  }, [agentPositions, audioEnabled, focusAgent, user]);

  const handleToggleAudio = useCallback(() => {
    toggleAudio();
    AuditLogger.log({
      action: AUDIT_ACTIONS.SPATIAL_AUDIO_TOGGLE,
      userId: user?.id,
      context: 'spatial_workspace',
    });
  }, [toggleAudio, user]);

  const handleResetCamera = useCallback(() => {
    resetCamera();
  }, [resetCamera]);

  const handleDiveToVault = useCallback((agentId) => {
    selectAgent(agentId);
  }, [selectAgent]);

  const focusedAgent = focusedAgentId
    ? agentPositions.find(a => a.agentId === focusedAgentId)
    : null;

  return (
    <div className="spatial-workspace-page">
      {/* WebGL Canvas — ALL agent state rendered as pixels here */}
      <div className="spatial-canvas" ref={canvasRef}>
        <Canvas
          camera={{ position: [0, 3, 8], fov: 50, near: 0.1, far: 100 }}
          shadows
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          onCreated={() => setSceneLoaded(true)}
        >
          <color attach="background" args={['#0a0f1a']} />
          <fog attach="fog" args={['#0a0f1a', 10, 20]} />
          <OfficeScene
            agentPositions={agentPositions}
            heatmapData={heatmapData}
            cameraTarget={cameraTarget}
            cameraLookAt={cameraLookAt}
            onAgentClick={handleAgentClick}
            onSceneReady={() => setSceneLoaded(true)}
          />
        </Canvas>
      </div>

      {/* HUD Overlay — Regular DOM, outside Canvas */}
      {hudVisible && (
        <SpatialHUD
          focusedAgent={focusedAgent}
          agentPositions={agentPositions}
          audioEnabled={audioEnabled}
          hudVisible={hudVisible}
          onToggleAudio={handleToggleAudio}
          onToggleHud={toggleHud}
          onResetCamera={handleResetCamera}
          onDiveToVault={handleDiveToVault}
        />
      )}

      {/* Minimal HUD toggle when hidden */}
      {!hudVisible && (
        <button className="spatial-hud-show-btn" onClick={toggleHud} title="Show HUD">
          ◉
        </button>
      )}
    </div>
  );
}

export { SpatialWorkspacePage };
