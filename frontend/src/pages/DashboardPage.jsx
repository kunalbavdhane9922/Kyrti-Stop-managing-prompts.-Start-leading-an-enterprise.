import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore.js';

import { CompanyDashboard } from '../components/dashboard/CompanyDashboard.jsx';
import { ManagerDashboard } from '../components/dashboard/ManagerDashboard.jsx';
import { PersonalDashboard } from '../components/dashboard/PersonalDashboard.jsx';
import { GovernanceDashboard } from '../components/dashboard/GovernanceDashboard.jsx';
import { MarketplaceDashboard } from '../components/dashboard/MarketplaceDashboard.jsx';

/**
 * Sovereign Protocol — Unified Dashboard Router
 * Switches between Role-Based dashboards.
 */

const anim = {
  container: { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } },
  item: { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.25 } } },
};

/* ═══════════════ MAIN COMPONENT ═══════════════ */
function DashboardPage() {
  const user = useAuthStore(s => s.user);
  const [activeView, setActiveView] = useState('company');

  const greeting = new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening';

  const VIEWS = [
    { id: 'company', label: 'Company' },
    { id: 'manager', label: 'Manager' },
    { id: 'personal', label: 'Personal' },
    { id: 'marketplace', label: 'Marketplace' },
    { id: 'governance', label: 'Governance' }
  ];

  return (
    <motion.div variants={anim.container} initial="hidden" animate="show" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)',
      height: '100%',
      overflow: 'hidden',
      padding: 'var(--space-2) 0',
    }}>

      {/* ═══ HEADER & ROLE SWITCHER ═══ */}
      <motion.div variants={anim.item} style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: 2 }}>Good {greeting}, {user?.name?.split(' ')[0] || 'Operator'}</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-sans)' }}>
            Your AI workforce is operational
          </p>
        </div>
        
        {/* Universal Switcher for CEO */}
        <div style={{ display: 'flex', background: 'var(--color-bg-tertiary)', padding: 4, borderRadius: 'var(--radius-md)' }}>
          {VIEWS.map(v => (
            <button
              key={v.id}
              onClick={() => setActiveView(v.id)}
              style={{
                padding: '6px 12px',
                fontSize: 12,
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: activeView === v.id ? 'var(--color-bg-primary)' : 'transparent',
                color: activeView === v.id ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                boxShadow: activeView === v.id ? 'var(--shadow-sm)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {v.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ═══ ACTIVE DASHBOARD VIEW ═══ */}
      <div style={{ flex: 1, minHeight: 0, marginTop: 'var(--space-2)' }}>
        {activeView === 'company' && <CompanyDashboard />}
        {activeView === 'manager' && <ManagerDashboard />}
        {activeView === 'personal' && <PersonalDashboard />}
        {activeView === 'marketplace' && <MarketplaceDashboard />}
        {activeView === 'governance' && <GovernanceDashboard />}
      </div>

    </motion.div>
  );
}

export { DashboardPage };
