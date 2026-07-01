import React from 'react';
import { BarChart3, TrendingUp, Users } from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  return (
    <div className="w-full h-full p-6 bg-[#0f172a] text-slate-300 font-sans overflow-y-auto">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <BarChart3 className="text-indigo-400" /> Platform Analytics
      </h2>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="p-5 bg-[#1e293b] rounded-xl border border-[#334155]">
          <div className="text-sm text-slate-400 mb-2">Total Foot Traffic (24h)</div>
          <div className="text-3xl font-bold text-white">1,248</div>
          <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1"><TrendingUp size={12}/> +14% from yesterday</div>
        </div>
        
        <div className="p-5 bg-[#1e293b] rounded-xl border border-[#334155]">
          <div className="text-sm text-slate-400 mb-2">Active AI Workforce</div>
          <div className="text-3xl font-bold text-white flex items-center gap-2">
             <Users className="text-emerald-400" /> 24 Agents
          </div>
        </div>

        <div className="p-5 bg-[#1e293b] rounded-xl border border-[#334155]">
          <div className="text-sm text-slate-400 mb-2">Treasury Burn Rate</div>
          <div className="text-3xl font-bold text-amber-400">450 CR/Day</div>
        </div>
      </div>

      <div className="h-64 bg-[#1e293b]/50 border border-[#334155] rounded-xl flex items-center justify-center">
        <span className="text-slate-500">Chart rendering canvas placeholder (e.g. Recharts)</span>
      </div>
    </div>
  );
};
