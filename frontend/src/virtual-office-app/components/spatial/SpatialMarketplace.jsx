import React, { useState, useEffect } from 'react';
import useSpatialStore from '../../store/spatialStore';
import { useWebSocket } from '../../network/WebSocketProvider';
import { Cpu, Maximize, X, ArrowRight } from 'lucide-react';

const DEPLOY_ITEMS = [
  {
    id: 'office_cabin',
    icon: Maximize,
    title: 'Executive expansion',
    description: 'Dynamically calculate grid bounds and inject a premium 10x10 acoustic cabin.',
    cost: 2500,
    config: { width: 10, height: 10, chairs: 2 },
    ramp: 'green',
    btnLabel: 'Deploy asset',
  },
  {
    id: 'desk_cluster',
    icon: Maximize,
    title: 'Operations cluster',
    description: 'Append a collaborative 4-person desk cluster.',
    cost: 800,
    config: { width: 6, height: 5 },
    ramp: 'teal',
    btnLabel: 'Deploy asset',
  },
  {
    id: 'ai_agent',
    icon: Cpu,
    title: 'Autonomous agent',
    description: 'Instantiate an intelligent entity. Automatically finds and locks to the nearest unoccupied operations desk.',
    cost: 1200,
    config: {},
    ramp: 'blue',
    btnLabel: 'Spawn entity',
  },
];

const RAMP_MAP = {
  green:  { icon: 'var(--green-400)',  price: 'var(--green-200)',  btnBg: 'var(--green-800)',  btnText: 'var(--green-100)',  btnBorder: 'var(--green-600)' },
  teal:   { icon: 'var(--teal-400)',   price: 'var(--teal-200)',   btnBg: 'var(--teal-800)',   btnText: 'var(--teal-100)',   btnBorder: 'var(--teal-600)' },
  blue:   { icon: 'var(--blue-400)',   price: 'var(--blue-200)',   btnBg: 'var(--blue-800)',   btnText: 'var(--blue-100)',   btnBorder: 'var(--blue-600)' },
};

export default function SpatialMarketplace() {
  const ws = useWebSocket();
  const marketplaceOpen = useSpatialStore(s => s.marketplaceOpen);
  const closeMarketplace = useSpatialStore(s => s.closeMarketplace);
  const budget = useSpatialStore(s => s.budget);
  const deductBudget = useSpatialStore(s => s.deductBudget);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (marketplaceOpen) requestAnimationFrame(() => setIsRendered(true));
    else setIsRendered(false);
  }, [marketplaceOpen]);

  const deployInfrastructure = (type, cost, config) => {
    if (budget < cost) return alert("Insufficient Corporate Capital.");
    
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'purchase:request',
        itemType: type,
        itemConfig: config
      }));
    }
    
    deductBudget(cost);
    closeMarketplace();
  };

  if (!marketplaceOpen && !isRendered) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex justify-end overflow-hidden">
      {/* Backdrop — solid dim, no blur */}
      <div
        className="absolute inset-0 pointer-events-auto transition-opacity duration-400"
        style={{
          background: 'rgba(11, 15, 25, 0.6)',
          opacity: isRendered ? 1 : 0,
        }}
        onClick={closeMarketplace}
      />

      {/* Drawer — solid, no blur, no gradient, no glow */}
      <div
        className="relative w-[420px] h-full pointer-events-auto flex flex-col transition-transform duration-400"
        style={{
          background: 'var(--color-bg-secondary)',
          borderLeft: '0.5px solid var(--color-border-tertiary)',
          transform: isRendered ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        {/* Header */}
        <div
          className="px-6 py-5 flex justify-between items-center"
          style={{ borderBottom: '0.5px solid var(--color-border-tertiary)' }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 500, color: 'var(--color-text-primary)' }}>
            Infrastructure deploy
          </h2>
          <button
            onClick={closeMarketplace}
            className="cursor-pointer transition-opacity duration-150 hover:opacity-70"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Cards */}
        <div className="px-6 py-6 flex-1 overflow-y-auto space-y-4">
          {DEPLOY_ITEMS.map((item) => {
            const ramp = RAMP_MAP[item.ramp];
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="p-5 flex flex-col"
                style={{
                  background: 'var(--color-bg-primary)',
                  border: '0.5px solid var(--color-border-tertiary)',
                  borderRadius: 'var(--border-radius-lg)',
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div
                    className="p-2.5"
                    style={{
                      background: 'var(--color-bg-tertiary)',
                      border: '0.5px solid var(--color-border-tertiary)',
                      borderRadius: 'var(--border-radius-md)',
                    }}
                  >
                    <Icon size={18} style={{ color: ramp.icon }} />
                  </div>
                  <span
                    style={{ fontWeight: 500, color: ramp.price, fontFamily: 'var(--font-mono)', fontSize: 14 }}
                  >
                    ${item.cost.toLocaleString()}
                  </span>
                </div>
                <h3
                  className="mb-1"
                  style={{ fontSize: 16, fontWeight: 500, color: 'var(--color-text-primary)' }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm mb-5"
                  style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}
                >
                  {item.description}
                </p>
                <button
                  onClick={() => deployInfrastructure(item.id, item.cost, item.config)}
                  className="w-full py-2.5 text-sm flex justify-center items-center gap-2 cursor-pointer transition-opacity duration-150 hover:opacity-80"
                  style={{
                    fontWeight: 500,
                    background: ramp.btnBg,
                    color: ramp.btnText,
                    border: `0.5px solid ${ramp.btnBorder}`,
                    borderRadius: 'var(--border-radius-md)',
                  }}
                >
                  {item.btnLabel} <ArrowRight size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

