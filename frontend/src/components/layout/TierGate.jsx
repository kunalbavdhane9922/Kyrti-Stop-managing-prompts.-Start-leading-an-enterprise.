import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';
import { useTierGate } from '../../hooks/useTierGate.js';
import { Lock, Shield } from 'lucide-react';

/**
 * Sovereign Protocol — TierGate
 * Route protection component that enforces progressive trust access.
 * Redirects unauthorized users or shows a locked state.
 */
function TierGate({ children, requiredTier = 0, requiredFeature = null, requireAuth = true, isInitializing = false }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const user = useAuthStore(s => s.user);
  const { currentTierId, isFeatureUnlocked } = useTierGate();
  const location = useLocation();

  if (isInitializing) {
    return (
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'#000000',color:'#E4E2DD'}}>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'16px'}}>
          <div style={{width:'32px',height:'32px',border:'3px solid #E4E2DD',borderTopColor:'#F13223',borderRadius:'50%',animation:'spin 1s linear infinite'}} />
          <div style={{fontWeight:'500'}}>Restoring session...</div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  // Auth check
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2FA check for all protected routes
  if (requireAuth && user && !user.twoFactorEnabled && location.pathname !== '/setup-2fa') {
    return <Navigate to="/setup-2fa" replace />;
  }

  // Tier check
  if (currentTierId < requiredTier) {
    return (
      <div className="empty-state" style={{ minHeight: '60vh' }}>
        <div style={{
          width: 80, height: 80, borderRadius: 'var(--radius-xl)',
          background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 'var(--space-6)',
        }}>
          <Lock size={32} style={{ color: 'var(--color-accent-amber)' }} />
        </div>
        <h2 className="empty-state-title">Tier {requiredTier} Required</h2>
        <p className="empty-state-text" style={{ marginTop: 'var(--space-2)' }}>
          This feature requires Trust Level {requiredTier} or higher.
          Complete your identity verification to unlock access.
        </p>
      </div>
    );
  }

  // Feature check
  if (requiredFeature && !isFeatureUnlocked(requiredFeature)) {
    return (
      <div className="empty-state" style={{ minHeight: '60vh' }}>
        <div style={{
          width: 80, height: 80, borderRadius: 'var(--radius-xl)',
          background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 'var(--space-6)',
        }}>
          <Shield size={32} style={{ color: 'var(--color-accent-violet)' }} />
        </div>
        <h2 className="empty-state-title">Feature Locked</h2>
        <p className="empty-state-text" style={{ marginTop: 'var(--space-2)' }}>
          The {requiredFeature} feature requires additional verification.
          Please complete the required identity layers.
        </p>
      </div>
    );
  }

  return children;
}

export { TierGate };
