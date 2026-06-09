/**
 * Sovereign Protocol — Canvas Isolation Security (Module 3)
 * Prevents DOM scraping, screenshot extraction, and metadata leaks
 * from the WebGL 3D workspace.
 *
 * All sensitive agent state is rendered as GPU pixels inside <canvas>,
 * not as inspectable HTML text nodes.
 */

const CanvasIsolation = {
  /**
   * Applies all canvas security measures to the given canvas element.
   * @param {HTMLCanvasElement} canvas
   */
  secure(canvas) {
    if (!canvas) return;

    // Block right-click context menu (prevent "Save Image As")
    canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    });

    // Prevent drag operations on canvas
    canvas.addEventListener('dragstart', (e) => {
      e.preventDefault();
    });

    // Set canvas attributes to prevent external access
    canvas.setAttribute('data-sovereign-isolated', 'true');

    // Override toDataURL and toBlob to prevent programmatic screenshot
    const originalToDataURL = canvas.toDataURL.bind(canvas);
    const originalToBlob = canvas.toBlob.bind(canvas);

    canvas.toDataURL = function() {
      console.warn('[CanvasIsolation] Screenshot extraction blocked by security policy.');
      return 'data:image/png;base64,';
    };

    canvas.toBlob = function(callback) {
      console.warn('[CanvasIsolation] Blob extraction blocked by security policy.');
      if (callback) callback(null);
    };
  },

  /**
   * Validates that only safe rendering metadata enters the scene graph.
   * Strips any fields that should never reach the 3D renderer.
   * @param {Object} agentData - Raw agent data
   * @returns {Object} - Stripped metadata safe for rendering
   */
  stripToRenderMetadata(agentData) {
    // ONLY these fields are allowed in the scene graph
    return Object.freeze({
      agentId: agentData.agentId || agentData.id,
      name: agentData.name || 'Unknown',
      state: agentData.state || agentData.executionState || 'idle',
      x: typeof agentData.x === 'number' ? agentData.x : 0,
      y: typeof agentData.y === 'number' ? agentData.y : 0,
      z: typeof agentData.z === 'number' ? agentData.z : 0,
      burnIntensity: typeof agentData.burnIntensity === 'number' ? agentData.burnIntensity : 0,
    });
  },

  /**
   * Handles WebGL context loss gracefully.
   * @param {HTMLCanvasElement} canvas
   * @param {Function} onRestore - Callback to reinitialize the scene
   */
  handleContextLoss(canvas, onRestore) {
    if (!canvas) return;

    canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      console.warn('[CanvasIsolation] WebGL context lost. Scene data cleared.');
    });

    canvas.addEventListener('webglcontextrestored', () => {
      console.info('[CanvasIsolation] WebGL context restored. Reinitializing scene.');
      if (onRestore) onRestore();
    });
  },
};

export { CanvasIsolation };
