/**
 * Sovereign Protocol — Spatial Workspace Store (Module 3)
 * Manages 3D scene state: agent positions, camera, heatmap.
 *
 * SECURITY: This store receives ONLY rendering metadata.
 * No treasury data, no documents, no private keys.
 * Only agentId, state, and x/y/z coordinates enter the scene graph.
 */

import { create } from 'zustand';

const useSpatialStore = create((set, get) => ({
  // --- Agent 3D Positions (Minimal Metadata Only) ---
  agentPositions: [],

  // --- Camera State ---
  cameraTarget: { x: 0, y: 3, z: 8 },
  cameraLookAt: { x: 0, y: 0, z: 0 },

  // --- Focused Agent (Zoom-In Target) ---
  focusedAgentId: null,

  // --- Heatmap Grid Data ---
  heatmapData: [],

  // --- Audio State ---
  audioEnabled: false,

  // --- Scene State ---
  sceneLoaded: false,
  hudVisible: true,

  // --- Actions ---

  /**
   * Sets agent positions for 3D rendering.
   * SECURITY: Only minimal rendering metadata is accepted.
   */
  setAgentPositions: (positions) => set({
    agentPositions: positions.map(p => Object.freeze({
      agentId: p.agentId,
      name: p.name,
      state: p.state,
      x: p.x,
      y: p.y,
      z: p.z,
      burnIntensity: p.burnIntensity || 0,
    })),
  }),

  /**
   * Focuses camera on a specific agent.
   */
  focusAgent: (agentId) => {
    const pos = get().agentPositions.find(a => a.agentId === agentId);
    if (!pos) return;
    set({
      focusedAgentId: agentId,
      cameraTarget: { x: pos.x + 2, y: 2.5, z: pos.z + 3 },
      cameraLookAt: { x: pos.x, y: 0.5, z: pos.z },
    });
  },

  /**
   * Resets camera to default overview position.
   */
  resetCamera: () => set({
    focusedAgentId: null,
    cameraTarget: { x: 0, y: 3, z: 8 },
    cameraLookAt: { x: 0, y: 0, z: 0 },
  }),

  /**
   * Sets heatmap intensity grid for floor rendering.
   */
  setHeatmap: (data) => set({
    heatmapData: data.map(d => Object.freeze({
      gridX: d.gridX,
      gridZ: d.gridZ,
      intensity: Math.min(1, Math.max(0, d.intensity)),
    })),
  }),

  /**
   * Toggles spatial audio on/off.
   */
  toggleAudio: () => set(s => ({ audioEnabled: !s.audioEnabled })),

  /**
   * Toggles HUD visibility.
   */
  toggleHud: () => set(s => ({ hudVisible: !s.hudVisible })),

  /**
   * Marks scene as loaded.
   */
  setSceneLoaded: (loaded) => set({ sceneLoaded: loaded }),

  /**
   * Resets all spatial state. Called on session wipe.
   */
  reset: () => set({
    agentPositions: [],
    cameraTarget: { x: 0, y: 3, z: 8 },
    cameraLookAt: { x: 0, y: 0, z: 0 },
    focusedAgentId: null,
    heatmapData: [],
    audioEnabled: false,
    sceneLoaded: false,
    hudVisible: true,
  }),
}));

export { useSpatialStore };
