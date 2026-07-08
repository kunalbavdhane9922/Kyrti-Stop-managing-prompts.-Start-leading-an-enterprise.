import React, { useState, useEffect } from 'react';
import useSpatialStore from '../../store/spatialStore';
import { 
    LayoutGrid, Users, Wallet, Landmark, RefreshCcw, 
    TrendingUp, CheckCircle, User, Users as UsersIcon, 
    Building, MessageSquare, X, Send, ChevronRight 
} from 'lucide-react';

const TABS = [
  { id: 'Dashboard', icon: LayoutGrid },
  { id: 'Workforce', icon: Users },
  { id: 'Treasury', icon: Wallet },
  { id: 'Governance', icon: Landmark },
];

const METRIC_CARDS = [
  { label: 'Total price', value: '$30,233.36', icon: RefreshCcw, ramp: 'purple', btn: 'Primary action' },
  { label: 'Total accounts', value: '$2,392', icon: TrendingUp, ramp: 'blue', btn: 'Primary action' },
  { label: 'Success states', value: '$12,600', icon: CheckCircle, ramp: 'green', btn: 'Success state' },
];

const WORKFORCE_DATA = [
  { name: 'Danis Smith', time: '3 months ago', tag: '#0F1704', price: '$30,350.00', entrance: '+18.71%' },
  { name: 'John Amith', time: '2 months ago', tag: '#06B6D4', price: '$7,300.00', entrance: '+06.39%' },
  { name: 'Bariny Martan', time: '2 months ago', tag: '#0F1704', price: '$2,330.00', entrance: '+18.71%' },
  { name: 'Danid Woeh', time: '4 months ago', tag: '#06B6D4', price: '$13,100.00', entrance: '+69.96%' },
];

const TREASURY_LIST = [
  { title: 'Account', sub: '2 utilities', value: '199', icon: User },
  { title: 'Workforce', sub: '23.131', value: '$2.36%', icon: UsersIcon, highlight: true },
  { title: 'Treasury', sub: '273.31', value: '', icon: Landmark },
  { title: 'Governance', sub: '', value: '', icon: Building, dim: true },
];

const CARD_RAMP = {
  purple: { iconBg: 'var(--purple-900)', iconColor: 'var(--purple-200)', valueTxt: 'var(--color-text-primary)', btnBg: 'var(--purple-800)', btnTxt: 'var(--purple-100)', btnBorder: 'var(--purple-600)' },
  blue:   { iconBg: 'var(--blue-900)',   iconColor: 'var(--blue-200)',   valueTxt: 'var(--color-text-primary)', btnBg: 'var(--blue-800)',   btnTxt: 'var(--blue-100)',   btnBorder: 'var(--blue-600)' },
  green:  { iconBg: 'var(--green-900)',  iconColor: 'var(--green-200)',  valueTxt: 'var(--green-200)',          btnBg: 'var(--green-800)',  btnTxt: 'var(--green-100)',  btnBorder: 'var(--green-600)' },
};

export default function DashboardOverlay() {
  const dashboardOpen = useSpatialStore(s => s.dashboardOpen);
  const closeDashboard = useSpatialStore(s => s.closeDashboard);
  const [isRendered, setIsRendered] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');

  useEffect(() => {
    if (dashboardOpen) requestAnimationFrame(() => setIsRendered(true));
    else setIsRendered(false);
  }, [dashboardOpen]);

  if (!dashboardOpen && !isRendered) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden">
      {/* Backdrop — solid dim */}
      <div
        className="absolute inset-0 pointer-events-auto transition-opacity duration-400"
        style={{ background: 'rgba(11, 15, 25, 0.7)', opacity: isRendered ? 1 : 0 }}
        onClick={closeDashboard}
      />

      {/* Dashboard container */}
      <div
        className="relative w-[1100px] max-w-[95vw] h-[750px] max-h-[90vh] pointer-events-auto flex transition-all duration-400"
        style={{
          background: 'var(--color-bg-secondary)',
          border: '0.5px solid var(--color-border-tertiary)',
          borderRadius: 'var(--border-radius-xl)',
          transform: isRendered ? 'scale(1)' : 'scale(0.97)',
          opacity: isRendered ? 1 : 0,
        }}
      >
        {/* Left sidebar */}
        <div
          className="w-[220px] flex flex-col py-6"
          style={{ borderRight: '0.5px solid var(--color-border-tertiary)' }}
        >
          <div className="px-6 mb-8 flex items-center gap-3">
            <img src="/main_logo.png" alt="Kyrti" style={{ width: '100px', height: 'auto', objectFit: 'contain' }} />
          </div>

          <nav className="flex-1 flex flex-col gap-1 px-3">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="relative flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150"
                  style={{
                    borderRadius: 'var(--border-radius-md)',
                    fontWeight: 500,
                    color: isActive ? 'var(--purple-200)' : 'var(--color-text-tertiary)',
                    background: isActive ? 'var(--purple-900)' : 'transparent',
                  }}
                >
                  {isActive && (
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                      style={{ background: 'var(--purple-400)' }}
                    />
                  )}
                  <Icon size={16} />
                  {tab.id}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col relative">
          {/* Wallet badge */}
          <div className="absolute top-6 right-6">
            <div
              className="flex items-center gap-2 px-3 py-1.5 text-xs"
              style={{
                background: 'var(--color-bg-tertiary)',
                border: '0.5px solid var(--color-border-tertiary)',
                borderRadius: '9999px',
                color: 'var(--color-text-secondary)',
              }}
            >
              <Wallet size={12} />
              <span style={{ fontFamily: 'var(--font-mono)' }}>0x...1234 | Connected</span>
            </div>
          </div>

          <div className="p-8 pb-4">
            <h2
              className="text-xl mb-6"
              style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}
            >
              {activeTab}
            </h2>

            {/* Metric cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {METRIC_CARDS.map((card) => {
                const ramp = CARD_RAMP[card.ramp];
                const Icon = card.icon;
                return (
                  <div
                    key={card.label}
                    className="p-5 flex flex-col gap-4"
                    style={{
                      background: 'var(--color-bg-primary)',
                      border: '0.5px solid var(--color-border-tertiary)',
                      borderRadius: 'var(--border-radius-lg)',
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>{card.label}</span>
                      <div
                        className="p-1.5"
                        style={{ background: ramp.iconBg, borderRadius: 'var(--border-radius-md)', color: ramp.iconColor }}
                      >
                        <Icon size={14} />
                      </div>
                    </div>
                    <div
                      className="text-2xl tracking-tight"
                      style={{ fontWeight: 500, color: ramp.valueTxt }}
                    >
                      {card.value}
                    </div>
                    <button
                      className="w-full py-2 text-sm cursor-pointer transition-opacity duration-150 hover:opacity-80"
                      style={{
                        fontWeight: 500,
                        background: ramp.btnBg,
                        color: ramp.btnTxt,
                        border: `0.5px solid ${ramp.btnBorder}`,
                        borderRadius: 'var(--border-radius-md)',
                      }}
                    >
                      {card.btn}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Bottom row */}
            <div className="grid grid-cols-3 gap-4 h-[300px]">
              {/* Workforce table */}
              <div
                className="col-span-2 p-5 flex flex-col"
                style={{
                  background: 'var(--color-bg-primary)',
                  border: '0.5px solid var(--color-border-tertiary)',
                  borderRadius: 'var(--border-radius-lg)',
                }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 style={{ fontSize: 16, fontWeight: 500, color: 'var(--color-text-primary)' }}>Workforce</h3>
                  <button
                    className="text-sm cursor-pointer transition-opacity duration-150 hover:opacity-70"
                    style={{ fontWeight: 500, color: 'var(--purple-200)' }}
                  >
                    See all
                  </button>
                </div>

                <div
                  className="grid grid-cols-12 text-[11px] tracking-wider uppercase pb-3"
                  style={{
                    fontWeight: 500,
                    color: 'var(--color-text-tertiary)',
                    borderBottom: '0.5px solid var(--color-border-tertiary)',
                  }}
                >
                  <div className="col-span-5">Name</div>
                  <div className="col-span-3">Price</div>
                  <div className="col-span-3">Entrance</div>
                  <div className="col-span-1 text-right">Action</div>
                </div>

                <div className="flex-1 overflow-y-auto mt-1 space-y-0.5 pr-1">
                  {WORKFORCE_DATA.map((user, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 items-center py-2.5 px-2 -mx-2 transition-colors duration-100"
                      style={{
                        borderBottom: idx < WORKFORCE_DATA.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none',
                        borderRadius: 'var(--border-radius-md)',
                      }}
                    >
                      <div className="col-span-5 flex items-center gap-3">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center"
                          style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-text-tertiary)' }}
                        >
                          <User size={14} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm" style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{user.name}</span>
                          <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{user.time}</span>
                        </div>
                      </div>
                      <div className="col-span-3 text-sm" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>{user.tag}</div>
                      <div className="col-span-3 text-sm" style={{ color: 'var(--color-text-primary)' }}>{user.price}</div>
                      <div className="col-span-1 text-right text-sm" style={{ fontWeight: 500, color: 'var(--green-200)' }}>{user.entrance}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Treasury list */}
              <div
                className="col-span-1 p-5 flex flex-col"
                style={{
                  background: 'var(--color-bg-primary)',
                  border: '0.5px solid var(--color-border-tertiary)',
                  borderRadius: 'var(--border-radius-lg)',
                }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 style={{ fontSize: 16, fontWeight: 500, color: 'var(--color-text-primary)' }}>Treasury</h3>
                  <button
                    className="text-sm cursor-pointer transition-opacity duration-150 hover:opacity-70"
                    style={{ fontWeight: 500, color: 'var(--purple-200)' }}
                  >
                    See all
                  </button>
                </div>

                <div className="flex flex-col gap-4 mt-1">
                  {TREASURY_LIST.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between"
                        style={{ opacity: item.dim ? 0.4 : 1 }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center"
                            style={{
                              background: 'var(--color-bg-tertiary)',
                              border: '0.5px solid var(--color-border-tertiary)',
                              color: 'var(--color-text-tertiary)',
                            }}
                          >
                            <Icon size={16} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>{item.title}</span>
                            {item.sub && <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{item.sub}</span>}
                          </div>
                        </div>
                        <div
                          className="text-sm"
                          style={{ fontWeight: item.highlight ? 500 : 400, color: 'var(--green-200)' }}
                        >
                          {item.value}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-auto pt-4">
                  <button
                    className="w-full py-2 text-sm cursor-pointer transition-opacity duration-150 hover:opacity-80"
                    style={{
                      fontWeight: 500,
                      background: 'var(--green-800)',
                      color: 'var(--green-100)',
                      border: '0.5px solid var(--green-600)',
                      borderRadius: 'var(--border-radius-md)',
                    }}
                  >
                    Apply now
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mini chat popup */}
          <div
            className="absolute bottom-6 right-6 w-[300px] flex flex-col overflow-hidden"
            style={{
              background: 'var(--color-bg-tertiary)',
              border: '0.5px solid var(--color-border-tertiary)',
              borderRadius: 'var(--border-radius-lg)',
            }}
          >
            <div
              className="px-3 py-2.5 flex justify-between items-center"
              style={{ borderBottom: '0.5px solid var(--color-border-tertiary)' }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-tertiary)' }}
                >
                  <User size={12} />
                </div>
                <div className="flex flex-col leading-none gap-0.5">
                  <span className="text-xs" style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>John Amith</span>
                  <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>Chat</span>
                </div>
              </div>
              <div className="flex gap-2" style={{ color: 'var(--color-text-tertiary)' }}>
                <button className="transition-opacity duration-100 hover:opacity-70">
                  <div className="w-2 h-0.5 rounded-full" style={{ background: 'currentColor' }} />
                </button>
                <button className="transition-opacity duration-100 hover:opacity-70"><X size={14} /></button>
              </div>
            </div>
            <div
              className="p-4 min-h-[70px] flex items-end"
              style={{ background: 'var(--color-bg-primary)' }}
            >
              <div
                className="p-3 text-xs rounded-lg rounded-tl-none"
                style={{
                  background: 'var(--color-bg-tertiary)',
                  border: '0.5px solid var(--color-border-tertiary)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.6,
                }}
              >
                Hello that's the artifact along to your past new notification now. 🙃
              </div>
            </div>
            <div
              className="px-3 py-2.5 flex items-center gap-2"
              style={{ borderTop: '0.5px solid var(--color-border-tertiary)' }}
            >
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 bg-transparent border-none text-xs focus:outline-none"
                style={{ color: 'var(--color-text-primary)' }}
              />
              <button
                className="p-1 cursor-pointer transition-opacity duration-100 hover:opacity-70"
                style={{ color: 'var(--purple-400)' }}
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

