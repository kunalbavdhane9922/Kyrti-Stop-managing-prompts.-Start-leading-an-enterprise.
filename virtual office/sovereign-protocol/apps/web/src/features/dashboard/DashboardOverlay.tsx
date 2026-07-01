import React from 'react';
import { Users, X } from 'lucide-react';
import { useSpatialStore } from '../../shared/store/useSpatialStore';

export const DashboardOverlay: React.FC = () => {
  const { dashboardOpen, toggleDashboard } = useSpatialStore();

  if (!dashboardOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-6xl h-[80vh] bg-[#0f172a]/95 border border-[#1e293b] rounded-2xl shadow-2xl overflow-hidden flex flex-col font-sans text-slate-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e293b] bg-[#0f172a]/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/50">
              <span className="text-indigo-400 font-bold">SP</span>
            </div>
            <h2 className="text-xl font-semibold text-white tracking-wide">Sovereign Protocol Dashboard</h2>
          </div>
          <button onClick={toggleDashboard} className="p-2 hover:bg-[#1e293b] rounded-lg transition-colors text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 grid grid-cols-12 gap-6 overflow-y-auto">
          {/* Left Navigation Placeholder */}
          <div className="col-span-3 space-y-2">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20 font-medium">Overview</div>
            <div className="p-3 hover:bg-[#1e293b] rounded-lg cursor-pointer transition-colors">Workforce</div>
            <div className="p-3 hover:bg-[#1e293b] rounded-lg cursor-pointer transition-colors">Treasury</div>
            <div className="p-3 hover:bg-[#1e293b] rounded-lg cursor-pointer transition-colors">Governance</div>
          </div>

          {/* Main Dashboard Area */}
          <div className="col-span-9 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-5 bg-[#1e293b]/50 rounded-xl border border-[#334155] backdrop-blur-md">
                <div className="text-sm text-slate-400 mb-1">Total Assets</div>
                <div className="text-2xl font-bold text-white">$45,231.00</div>
              </div>
              <div className="p-5 bg-[#1e293b]/50 rounded-xl border border-[#334155] backdrop-blur-md">
                <div className="text-sm text-slate-400 mb-1">Active Workforce</div>
                <div className="text-2xl font-bold text-white flex items-center gap-2"><Users size={20} className="text-emerald-400" /> 14 Agents</div>
              </div>
              <div className="p-5 bg-[#1e293b]/50 rounded-xl border border-[#334155] backdrop-blur-md">
                <div className="text-sm text-slate-400 mb-1">Office Tier</div>
                <div className="text-2xl font-bold text-indigo-400">Level 3</div>
              </div>
            </div>
            
            {/* Table Placeholder */}
            <div className="p-6 bg-[#1e293b]/30 rounded-xl border border-[#334155]">
              <h3 className="text-lg font-medium text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex justify-between p-3 bg-[#0f172a]/50 rounded-lg border border-[#1e293b]">
                    <span>Agent Alpha deployed to Marketing Zone</span>
                    <span className="text-slate-500">2 mins ago</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
