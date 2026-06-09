import { NavLink, useLocation } from 'react-router-dom';
import {
  Shield, Landmark, Users, BarChart3, Lock,
  Fingerprint, ChevronLeft, ChevronRight, Layers,
  Bot, Store, DollarSign, Box, GitPullRequestDraft, Search, Building2
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore.js';
import { useOnboardingStore } from '../../store/onboardingStore.js';
import { useTierGate } from '../../hooks/useTierGate.js';
import { getTierById } from '../../config/tiers.js';
import { Badge } from '../common/Badge.jsx';

/**
 * Sovereign Protocol — Sidebar Navigation
 */
function Sidebar({ collapsed, onToggle }) {
  const user = useAuthStore(s => s.user);
  const { currentTierId, currentTier, isFeatureUnlocked } = useTierGate();

  const navItems = [
    { section: 'Identity' },
    { path: '/identity', label: 'Identity Matrix', icon: Fingerprint, tier: 0 },
    { path: '/onboarding', label: 'Trust Level', icon: Layers, tier: 0 },
    { section: 'Operations' },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3, tier: 1 },
    { path: '/treasury', label: 'Treasury', icon: Landmark, tier: 2, feature: 'treasury' },
    { path: '/governance', label: 'Governance', icon: Users, tier: 2, feature: 'governance' },
    { section: 'Command Center' },
    { path: '/agents', label: 'Agent OS', icon: Bot, tier: 1 },
    { path: '/marketplace', label: 'Marketplace', icon: Store, tier: 1 },
    { path: '/service-fees', label: 'Service Fees', icon: DollarSign, tier: 2, feature: 'treasury' },
    { path: '/spatial', label: 'Spatial View', icon: Box, tier: 1 },
    { path: '/virtual-office', label: 'Virtual Office', icon: Building2, tier: 1 },
  ];

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header" style={{ padding: collapsed ? 'var(--space-4) 0' : '0', display: 'flex', justifyContent: collapsed ? 'center' : 'flex-start' }}>
        <div className="sidebar-logo" style={collapsed ? { padding: 0, justifyContent: 'center', borderBottom: 'none' } : {}}>
          <div className="sidebar-logo-icon">
            <Shield size={16} />
          </div>
          {!collapsed && <span className="sidebar-logo-text">Sovereign Protocol</span>}
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item, idx) => {
          if (item.section) {
            return (
              <div key={idx} className="sidebar-section-title" style={{ textAlign: 'center', opacity: collapsed ? 0 : 1, transition: 'opacity 0.2s' }}>
                {collapsed ? '•' : item.section}
              </div>
            );
          }

          const isLocked = item.feature && !isFeatureUnlocked(item.feature);
          const isTierLocked = currentTierId < item.tier;
          const locked = isLocked || isTierLocked;

          return (
            <NavLink
              key={item.path}
              to={locked ? '#' : item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive && !locked ? 'active' : ''} ${locked ? 'locked' : ''}`
              }
              onClick={(e) => { if (locked) e.preventDefault(); }}
              title={`${item.label} ${locked ? '(Locked)' : ''}`}
              style={locked 
                ? { cursor: 'not-allowed', justifyContent: collapsed ? 'center' : 'flex-start', position: 'relative', opacity: 0.4 } 
                : { justifyContent: collapsed ? 'center' : 'flex-start', position: 'relative' }
              }
            >
              <item.icon size={20} className="sidebar-link-icon" />
              {!collapsed && (
                <span className="sidebar-link-text" style={{ flex: 1 }}>{item.label}</span>
              )}
              {locked && (
                <Lock 
                  size={12} 
                  style={{ 
                    position: collapsed ? 'absolute' : 'relative', 
                    bottom: collapsed ? '4px' : 'auto', 
                    right: collapsed ? '16px' : 'auto', 
                    color: 'var(--color-text-primary)',
                    background: 'var(--color-bg-secondary)',
                    borderRadius: '50%',
                    padding: '1.5px',
                    boxShadow: '0 0 4px rgba(0,0,0,0.1)'
                  }} 
                />
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer" style={{ padding: 'var(--space-4) 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)' }}>
        {/* Dev Unlock Button */}
        {currentTierId < 3 && (
          <button
            onClick={() => useOnboardingStore.getState().setCurrentTier(3)}
            title="Unlock all pages (Dev Mode)"
            style={{
              width: 36, height: 36, borderRadius: 'var(--radius-md)',
              background: 'rgba(197, 160, 89, 0.1)', border: '1px solid rgba(197, 160, 89, 0.3)',
              color: 'var(--color-accent-gold)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px', transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(197, 160, 89, 0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(197, 160, 89, 0.1)'; }}
          >
            🔓
          </button>
        )}
        <div className="sidebar-tier-indicator" style={{ padding: 'var(--space-2)', background: 'transparent', border: 'none' }} title={`Tier ${currentTierId}: ${currentTier.name}`}>
          <div className="sidebar-tier-icon" style={{ background: currentTier.color ? `linear-gradient(135deg, ${currentTier.color}, ${currentTier.color}aa)` : undefined, width: 32, height: 32 }}>
            <Shield size={16} />
          </div>
        </div>
      </div>
    </aside>
  );
}

export { Sidebar };
