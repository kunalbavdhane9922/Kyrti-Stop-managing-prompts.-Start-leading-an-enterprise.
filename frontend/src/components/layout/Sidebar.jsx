import { NavLink, useLocation } from 'react-router-dom';
import {
  Shield, Landmark, Users, BarChart3, Lock,
  Fingerprint, ChevronLeft, ChevronRight, Layers,
  Bot, Store, DollarSign, Box, GitPullRequestDraft, Search, Building2, PieChart, Calendar
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore.js';
import { Badge } from '../common/Badge.jsx';

/**
 * Sovereign Protocol — Sidebar Navigation
 */
function Sidebar({ collapsed, onToggle }) {
  const user = useAuthStore(s => s.user);
  const navItems = [
    { section: 'Identity' },
    { path: '/identity', label: 'Identity Matrix', icon: Fingerprint },
    { section: 'Operations' },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/company-management', label: 'Company Management', icon: Building2 },
    { path: '/treasury', label: 'Treasury', icon: Landmark },
    { path: '/governance', label: 'Governance', icon: Users },
    { section: 'Command Center' },
    { path: '/reports', label: 'Intelligence Reports', icon: PieChart },
    { path: '/agents', label: 'Agent OS', icon: Bot },
    { path: '/marketplace', label: 'Marketplace', icon: Store },
    { path: '/meetings', label: 'Meetings', icon: Calendar },
    { path: '/service-fees', label: 'Service Fees', icon: DollarSign },
    { path: '/virtual-office', label: 'Virtual Office', icon: Building2 },
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

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              title={item.label}
              style={{ justifyContent: collapsed ? 'center' : 'flex-start', position: 'relative' }}
            >
              <item.icon size={20} className="sidebar-link-icon" />
              {!collapsed && (
                <span className="sidebar-link-text" style={{ flex: 1 }}>{item.label}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer" style={{ padding: 'var(--space-4) 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)' }}>
        {/* Footer content removed since Trust Level is gone */}
      </div>
    </aside>
  );
}

export { Sidebar };
