/**
 * Sovereign Protocol — ProgressBar Component
 * Animated progress bar with variant colors.
 */
function ProgressBar({ value = 0, max = 100, variant = '', label, showPercent = false }) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  const fillClass = variant ? `progress-bar-fill progress-bar-fill-${variant}` : 'progress-bar-fill';

  return (
    <div>
      {(label || showPercent) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
          {label && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{label}</span>}
          {showPercent && <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>{percent.toFixed(1)}%</span>}
        </div>
      )}
      <div className="progress-bar">
        <div className={fillClass} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export { ProgressBar };
