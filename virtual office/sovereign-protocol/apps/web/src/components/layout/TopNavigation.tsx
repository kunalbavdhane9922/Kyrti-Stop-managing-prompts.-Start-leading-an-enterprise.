import React from 'react';
import { Search, Bell, Settings, UserCircle } from 'lucide-react';

export const TopNavigation: React.FC = () => {
  return (
    <div className="pointer-events-auto mt-4 mx-4 h-14 bg-[#111111]/60 backdrop-blur-[20px] border border-white/5 rounded-2xl flex items-center justify-between px-6 shadow-glass">
      
      {/* Left: Branding */}
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-[#5E6AD2] shadow-neon-indigo" />
        <span className="font-semibold tracking-tight text-sm text-white">Sovereign Headquarters</span>
      </div>

      {/* Center: Command Palette Trigger (Linear Style) */}
      <div className="w-96 h-8 bg-[#0A0A0A]/50 border border-white/10 rounded-lg flex items-center px-3 gap-2 text-[#888888] hover:border-white/20 hover:text-white transition-all cursor-pointer">
        <Search size={14} />
        <span className="text-xs">Search employees, rooms, or actions...</span>
        <span className="ml-auto text-[10px] font-mono border border-white/10 px-1.5 py-0.5 rounded bg-white/5">Cmd K</span>
      </div>

      {/* Right: User Menu */}
      <div className="flex items-center gap-4 text-[#888888]">
        <button className="hover:text-white transition-colors"><Bell size={18} /></button>
        <button className="hover:text-white transition-colors"><Settings size={18} /></button>
        <div className="w-[1px] h-4 bg-white/10" />
        <button className="flex items-center gap-2 hover:text-white transition-colors">
          <UserCircle size={20} className="text-[#5E6AD2]" />
          <span className="text-xs font-medium">CEO Profile</span>
        </button>
      </div>

    </div>
  );
};
