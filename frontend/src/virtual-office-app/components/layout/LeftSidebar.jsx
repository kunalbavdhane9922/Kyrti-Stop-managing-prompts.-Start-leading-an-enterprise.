import React from 'react';
import { LayoutDashboard, Users, Video, BrainCircuit, Store, Building2, LineChart } from 'lucide-react';
import useSpatialStore from '../../store/spatialStore';

const navItems = [
  { section: 'Workspace', items: [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', action: 'toggleDashboard' },
    { id: 'team', icon: Users, label: 'Team roster' },
    { id: 'meetings', icon: Video, label: 'Meetings' },
  ]},
  { section: 'Operations', items: [
    { id: 'ai', icon: BrainCircuit, label: 'AI workforce' },
    { id: 'marketplace', icon: Store, label: 'Marketplace', action: 'toggleMarketplace' },
    { id: 'treasury', icon: Building2, label: 'Treasury' },
  ]},
];

const NavItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors duration-150"
    style={{
      borderRadius: 'var(--border-radius-md)',
      fontWeight: 500,
      color: active ? 'var(--purple-200)' : 'var(--color-text-tertiary)',
      background: active ? 'var(--purple-900)' : 'transparent',
    }}
  >
    <Icon size={16} />
    <span>{label}</span>
  </button>
);

export const LeftSidebar = () => {
  const activeNav = useSpatialStore((s) => s.activeNav);
  const setActiveNav = useSpatialStore((s) => s.setActiveNav);
  const toggleDashboard = useSpatialStore((s) => s.toggleDashboard);
  const toggleMarketplace = useSpatialStore((s) => s.toggleMarketplace);
  const budget = useSpatialStore((s) => s.budget);

  const handleClick = (item) => {
    setActiveNav(item.id);
    if (item.action === 'toggleDashboard') toggleDashboard();
    if (item.action === 'toggleMarketplace') toggleMarketplace();
  };

  return (
    <div
      className="pointer-events-auto w-60 h-full flex flex-col py-4 transition-colors duration-200"
      style={{
        background: 'var(--color-bg-secondary)',
        border: '0.5px solid var(--color-border-tertiary)',
        borderRadius: 'var(--border-radius-lg)',
      }}
    >
      {navItems.map((section) => (
        <div key={section.section} className="px-4 mb-6">
          <div
            className="text-[10px] tracking-widest uppercase mb-2"
            style={{ fontWeight: 500, color: 'var(--color-text-tertiary)' }}
          >
            {section.section}
          </div>
          <div className="space-y-1">
            {section.items.map((item) => (
              <NavItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                active={activeNav === item.id}
                onClick={() => handleClick(item)}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Budget display */}
      <div className="mt-auto px-4 space-y-3">
        <div
          className="p-3"
          style={{
            background: 'var(--color-bg-tertiary)',
            border: '0.5px solid var(--color-border-tertiary)',
            borderRadius: 'var(--border-radius-md)',
          }}
        >
          <div
            className="text-[10px] tracking-widest uppercase mb-1"
            style={{ fontWeight: 500, color: 'var(--color-text-tertiary)' }}
          >
            Treasury
          </div>
          <div
            className="text-lg"
            style={{ fontWeight: 500, color: 'var(--teal-200)', fontFamily: 'var(--font-mono)' }}
          >
            ${budget.toLocaleString()}
          </div>
        </div>
        <NavItem icon={LineChart} label="Analytics" active={activeNav === 'analytics'} onClick={() => setActiveNav('analytics')} />
      </div>
    </div>
  );
};
