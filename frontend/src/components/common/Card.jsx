import { motion } from 'framer-motion';

/**
 * Sovereign Protocol — Card Component
 * Glassmorphic card with optional accent, hover, and animation.
 */
function Card({
  children,
  variant = '',
  hover = false,
  className = '',
  id,
  animate = true,
  onClick,
  style,
}) {
  const variantClass = variant ? `card-${variant}` : '';
  const hoverClass = hover ? 'card-hover' : '';

  if (animate) {
    return (
      <motion.div
        id={id}
        className={`card ${variantClass} ${hoverClass} ${className}`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        onClick={onClick}
        style={style}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      id={id}
      className={`card ${variantClass} ${hoverClass} ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
}

export { Card };
