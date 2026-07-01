import React from 'react';
import { LayoutDashboard, Users, Video, BrainCircuit, Store, Building2, LineChart } from 'lucide-react';

const NavItem = ({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
  <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
    active ? 'bg-[#5E6AD2]/10 text-[#5E6AD2]' : 'text-[#888888] hover:bg-white/5 hover:text-white'
  }`}>
    <Icon size={16} />
    <span className="font-medium">{label}</span>
  </button>
);

export const LeftSidebar: React.FC = () => {
  return (
    <div className="pointer-events-auto w-60 h-full bg-[#111111]/60 backdrop-blur-[20px] border border-white/5 rounded-2xl flex flex-col py-4 shadow-glass">
      
      <div className="px-4 mb-6">
        <div className="text-[10px] font-bold tracking-widest text-[#888888] uppercase mb-2">Workspace</div>
        <div className="space-y-1">
          <NavItem icon={LayoutDashboard} label="Dashboard" active />
          <NavItem icon={Users} label="Team Roster" />
          <NavItem icon={Video} label="Meetings" />
        </div>
      </div>

      <div className="px-4 mb-6">
        <div className="text-[10px] font-bold tracking-widest text-[#888888] uppercase mb-2">Operations</div>
        <div className="space-y-1">
          <NavItem icon={BrainCircuit} label="AI Workforce" />
          <NavItem icon={Store} label="Marketplace" />
          <NavItem icon={Building2} label="Treasury" />
        </div>
      </div>

      <div className="mt-auto px-4">
        <NavItem icon={LineChart} label="Analytics" />
      </div>
      
    </div>
  );
};
