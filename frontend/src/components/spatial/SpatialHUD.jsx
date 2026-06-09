import {
  Volume2, VolumeX, RotateCcw, Eye, EyeOff,
  Activity, Cpu, Brain, Zap, ExternalLink
} from 'lucide-react';
import { Badge } from '../common/Badge.jsx';
import { useNavigate } from 'react-router-dom';

/**
 * Sovereign Protocol — Spatial HUD Overlay (Module 3)
 * HTML overlay rendered outside the WebGL canvas.
 * Shows focused agent info and scene controls.
 */
function SpatialHUD({ focusedAgent, agentPositions, audioEnabled, hudVisible, onToggleAudio, onToggleHud, onResetCamera, onDiveToVault }) {
  const navigate = useNavigate();

  const stateLabel = {
    executing: 'Executing',
    planning: 'Planning',
    idle: 'Idle',
    blocked: 'Blocked',
    terminated: 'Terminated',
  };

  const stateColor = {
    executing: 'blue',
    planning: 'blue',
    idle: 'amber',
    blocked: 'rose',
    terminated: 'rose',
  };

  const activeCount = agentPositions.filter(a => a.state === 'executing').length;
  const blockedCount = agentPositions.filter(a => a.state === 'blocked').length;

  return (
    <>
      {/* Top-Left: Scene Title */}
      <div className="spatial-hud-title">
        <div className="spatial-hud-title-text">Spatial Command Center</div>
        <div className="spatial-hud-title-sub">
          {agentPositions.length} agents deployed
        </div>
      </div>

      {/* Top-Right: Status Indicators */}
      <div className="spatial-hud-status">
        <div className="spatial-hud-indicator">
          <span className="spatial-hud-dot dot-executing" />
          <span>{activeCount} executing</span>
        </div>
        {blockedCount > 0 && (
          <div className="spatial-hud-indicator indicator-alert">
            <span className="spatial-hud-dot dot-blocked" />
            <span>{blockedCount} blocked</span>
          </div>
        )}
        <div className="spatial-hud-indicator">
          {audioEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
          <span>{audioEnabled ? 'Audio On' : 'Audio Off'}</span>
        </div>
      </div>

      {/* Bottom: Controls Bar */}
      <div className="spatial-hud-controls">
        <button className="spatial-hud-btn" onClick={onToggleAudio} title={audioEnabled ? 'Mute Audio' : 'Enable Audio'}>
          {audioEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
        </button>
        <button className="spatial-hud-btn" onClick={onResetCamera} title="Reset Camera">
          <RotateCcw size={14} />
        </button>
        <button className="spatial-hud-btn" onClick={onToggleHud} title={hudVisible ? 'Hide HUD' : 'Show HUD'}>
          {hudVisible ? <Eye size={14} /> : <EyeOff size={14} />}
        </button>
      </div>

      {/* Right Panel: Focused Agent */}
      {focusedAgent && (
        <div className="spatial-focus-panel">
          <div className="spatial-focus-header">
            <div>
              <div className="spatial-focus-name">{focusedAgent.name}</div>
              <Badge color={stateColor[focusedAgent.state] || 'blue'}>
                {stateLabel[focusedAgent.state] || focusedAgent.state}
              </Badge>
            </div>
          </div>

          <div className="spatial-focus-metrics">
            <div className="spatial-focus-metric">
              <Activity size={12} />
              <span>Burn Intensity</span>
              <strong>{(focusedAgent.burnIntensity * 100).toFixed(0)}%</strong>
            </div>
            <div className="spatial-focus-metric">
              <Cpu size={12} />
              <span>Position</span>
              <strong>{focusedAgent.x.toFixed(1)}, {focusedAgent.z.toFixed(1)}</strong>
            </div>
          </div>

          <button
            className="btn btn-primary btn-sm spatial-focus-dive"
            onClick={() => {
              if (onDiveToVault) onDiveToVault(focusedAgent.agentId);
              navigate('/agents');
            }}
          >
            <Brain size={13} /> View Memory Vault
            <ExternalLink size={11} />
          </button>

          <button className="spatial-focus-close" onClick={onResetCamera}>
            Dismiss
          </button>
        </div>
      )}

      {/* Bottom-Left: Heatmap Legend */}
      <div className="spatial-heatmap-legend">
        <span className="spatial-legend-label">Burn Rate</span>
        <div className="spatial-legend-bar">
          <span className="spatial-legend-low" />
          <span className="spatial-legend-mid" />
          <span className="spatial-legend-high" />
        </div>
        <div className="spatial-legend-labels">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>
    </>
  );
}

export { SpatialHUD };
