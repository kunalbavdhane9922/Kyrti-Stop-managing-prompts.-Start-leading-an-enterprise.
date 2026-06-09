/**
 * Sovereign Protocol — StatusIndicator Component
 * Animated dot indicator for active, pending, error, and inactive states.
 */
function StatusIndicator({ status = 'inactive', label, size = 8 }) {
  const statusClass = `status-dot status-dot-${status}`;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
      <span className={statusClass} style={{ width: size, height: size }} />
      {label && (
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
          {label}
        </span>
      )}
    </div>
  );
}

export { StatusIndicator };
