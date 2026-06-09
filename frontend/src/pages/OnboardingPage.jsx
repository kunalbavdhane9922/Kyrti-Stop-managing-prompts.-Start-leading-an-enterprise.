import { motion } from 'framer-motion';
import { Shield, Lock, Check, ChevronRight, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { Button } from '../components/common/Button.jsx';
import { ProgressBar } from '../components/common/ProgressBar.jsx';
import { useTierGate } from '../hooks/useTierGate.js';
import { TIERS } from '../config/tiers.js';

/**
 * Sovereign Protocol — Onboarding Page
 * Progressive Trust state machine visualization (Tier 0-3).
 */
function OnboardingPage() {
  const navigate = useNavigate();
  const { currentTierId, currentTier, completedLayers } = useTierGate();

  const tiers = Object.values(TIERS);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }
  };

  return (
    <motion.div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }} variants={containerVariants} initial="hidden" animate="show">
      <motion.div className="page-header" style={{ textAlign: 'center' }} variants={itemVariants}>
        <h1 className="page-title" style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-4xl)' }}>Progressive Trust Level</h1>
        <p className="page-subtitle" style={{ fontSize: 'var(--text-lg)' }}>Complete verification steps to unlock platform capabilities</p>
      </motion.div>

      {/* Current Tier Display */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card variant="accent" style={{ textAlign: 'center', marginBottom: 'var(--space-8)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: currentTier.color }} />
          <div style={{
            width: 72, height: 72, borderRadius: 'var(--radius-xl)', margin: '0 auto var(--space-4)',
            background: 'var(--color-bg-tertiary)',
            border: `2px solid ${currentTier.color}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Layers size={32} style={{ color: currentTier.color }} />
          </div>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>
            Tier {currentTierId}: {currentTier.name}
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)', maxWidth: 500, margin: 'var(--space-2) auto 0' }}>
            {currentTier.description}
          </p>
          <div style={{ marginTop: 'var(--space-6)', maxWidth: 400, margin: 'var(--space-6) auto 0' }}>
            <ProgressBar value={currentTierId} max={3} label="Trust Progression" showPercent />
          </div>
        </Card>
      </motion.div>

      {/* Tier Cards */}
      <motion.div className="tier-cards-grid" variants={itemVariants}>
        {tiers.map((tier, i) => {
          const isCurrent = tier.id === currentTierId;
          const isUnlocked = tier.id <= currentTierId;
          const isLocked = tier.id > currentTierId;

          return (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.35 }}
            >
              <div className={`tier-card ${isCurrent ? 'current' : ''} ${isLocked ? 'locked' : ''}`}>
                {isCurrent && (
                  <div style={{ position: 'absolute', top: 'var(--space-3)', right: 'var(--space-3)' }}>
                    <Badge color="blue">Current</Badge>
                  </div>
                )}
                <div className="tier-card-number">{tier.id}</div>
                <h3 className="tier-card-name">{tier.label}</h3>
                <p className="tier-card-description">{tier.description}</p>

                <div style={{ marginTop: 'var(--space-4)', textAlign: 'left' }}>
                  <p style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Capabilities
                  </p>
                  {tier.capabilities.slice(0, 3).map((cap, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                      {isUnlocked ? (
                        <Check size={12} style={{ color: 'var(--color-accent-emerald)', flexShrink: 0 }} />
                      ) : (
                        <Lock size={12} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
                      )}
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{cap}</span>
                    </div>
                  ))}
                  {tier.capabilities.length > 3 && (
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>+{tier.capabilities.length - 3} more</span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Action */}
      <motion.div style={{ textAlign: 'center' }} variants={itemVariants}>
        <Button variant="primary" size="lg" icon={Shield} iconRight={ChevronRight} onClick={() => navigate('/identity')} id="continue-verification-btn">
          Continue Verification
        </Button>
      </motion.div>
    </motion.div>
  );
}

export { OnboardingPage };
