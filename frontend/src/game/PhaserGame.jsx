/**
 * Sovereign Virtual Office — PhaserGame React Wrapper
 * 
 * Mounts a Phaser game instance inside a React ref.
 * Includes error boundary for graceful crash handling.
 */
import { useEffect, useRef, forwardRef, useImperativeHandle, Component } from 'react';
import Phaser from 'phaser';
import { createGameConfig } from './config.js';
import { EventBus } from './EventBus.js';

/** Error Boundary for Phaser */
class PhaserErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('[PhaserGame] Crash:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', height: '100%', background: '#faf9f6',
          fontFamily: 'monospace', color: '#374151', gap: '12px',
        }}>
          <div style={{ fontSize: '14px', fontWeight: 600 }}>Spatial Engine Error</div>
          <div style={{ fontSize: '11px', color: '#9ca3af', maxWidth: '400px', textAlign: 'center' }}>
            {this.state.error?.message || 'Unknown error'}
          </div>
          <button
            onClick={() => { this.setState({ hasError: false, error: null }); }}
            style={{
              padding: '8px 16px', border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: '8px', background: 'white', cursor: 'pointer',
              fontSize: '11px', color: '#374151',
            }}
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const PhaserGameInner = forwardRef(function PhaserGameInner({ onSceneReady }, ref) {
  const containerRef = useRef(null);
  const gameRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getGame: () => gameRef.current,
    getScene: (key) => gameRef.current?.scene?.getScene(key),
  }));

  useEffect(() => {
    if (gameRef.current || !containerRef.current) return;

    try {
      const config = createGameConfig(containerRef.current);
      const game = new Phaser.Game(config);
      gameRef.current = game;

      EventBus.on('scene-ready', (scene) => {
        if (onSceneReady) onSceneReady(scene);
      });
    } catch (err) {
      console.error('[PhaserGame] Init failed:', err);
    }

    return () => {
      EventBus.removeAll();
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="phaser-game-container"
      style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
    />
  );
});

const PhaserGame = forwardRef(function PhaserGame(props, ref) {
  return (
    <PhaserErrorBoundary>
      <PhaserGameInner {...props} ref={ref} />
    </PhaserErrorBoundary>
  );
});

export { PhaserGame };
