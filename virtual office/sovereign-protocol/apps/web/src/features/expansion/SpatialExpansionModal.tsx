import React from 'react';
import { Activity, ShieldAlert, Cpu, Network, X } from 'lucide-react';
import { useSpatialStore } from '../../shared/store/useSpatialStore';

export const SpatialExpansionModal: React.FC = () => {
  const { expansionModalOpen, toggleExpansionModal } = useSpatialStore();

  if (!expansionModalOpen) return null;

  const phases = [
    { title: 'PHASE 1', desc: 'Secure Perimeter', icon: ShieldAlert, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { title: 'PHASE 2', desc: 'Activate Cores', icon: Cpu, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'PHASE 3', desc: 'Expand Network', icon: Network, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-[#0a0a0a] border border-green-500/30 rounded-xl shadow-[0_0_50px_rgba(34,197,94,0.1)] overflow-hidden font-mono">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#111] border-b border-green-900/50">
          <div className="flex items-center gap-2 text-green-500">
            <Activity size={16} className="animate-pulse" />
            <span className="text-sm font-bold tracking-widest">SPATIAL_EXPANSION_PROTOCOL_V1.2</span>
          </div>
          <button onClick={toggleExpansionModal} className="text-slate-500 hover:text-red-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">INITIATE EXPANSION</h2>
            <p className="text-slate-400">Deploy additional spatial zones to accommodate growing workforce parameters.</p>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-10">
            {phases.map((phase, i) => (
              <div key={i} className={`p-5 rounded-lg border border-slate-800 bg-slate-900/50 flex flex-col items-center text-center hover:border-slate-600 transition-all`}>
                <div className={`p-4 rounded-full ${phase.bg} mb-4`}>
                  <phase.icon size={28} className={phase.color} />
                </div>
                <div className="text-xs text-slate-500 mb-1">{phase.title}</div>
                <div className="text-sm font-bold text-slate-200">{phase.desc}</div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <button className="px-8 py-4 bg-green-600 hover:bg-green-500 text-black font-bold tracking-widest rounded shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all transform hover:scale-105 active:scale-95">
              AUTHORIZE 5,000 CREDITS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
