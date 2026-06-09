/**
 * Sovereign Protocol — Badge Component
 * Color-coded status badges for tiers, roles, and statuses.
 */
function Badge({ children, color = 'blue', icon: Icon, className = '' }) {
  return (
    <span className={`badge badge-${color} ${className}`}>
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
}

export { Badge };
