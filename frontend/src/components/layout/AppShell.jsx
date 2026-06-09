import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar.jsx';
import { TopBar } from './TopBar.jsx';
import { useSessionGuard } from '../../hooks/useSessionGuard.js';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Sovereign Protocol — AppShell
 * Main application layout wrapping sidebar, topbar, and content area.
 * The SessionGuard hook is activated here to monitor idle state.
 */
/* Grain texture is now CSS-only via the clearance-portal pseudo-element.
   The full-viewport SVG noise filter was removed for performance. */
function NoiseFilter() {
  return null;
}

function AppShell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  useSessionGuard();

  return (
    <div className="app-shell">
      <NoiseFilter />
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className={`app-shell-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <TopBar />
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export { AppShell };
