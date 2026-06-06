import React from 'react';
import styles from './GlassCard.module.css';

interface GlassCardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, title, className = '' }) => {
  return (
    <div className={`glass-panel ${styles.card} ${className}`}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default GlassCard;
