import React from 'react';
import { Activity, Radio } from 'lucide-react';

const ActivityItem = ({ title, time, isAi = false }: { title: string, time: string, isAi?: boolean }) => (
  <div className="flex items-start gap-3 py-2 group cursor-pointer">
    <div className={`mt-1 w-2 h-2 rounded-full ${isAi ? 'bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-[#5E6AD2]'}`} />
    <div>
      <div className="text-xs text-[#EEEEEE] group-hover:text-white transition-colors">{title}</div>
      <div className="text-[10px] text-[#888888]">{time}</div>
    </div>
  </div>
);

export const RightSidebar: React.FC = () => {
  return (
    <div className="pointer-events-auto w-72 h-full bg-[#111111]/60 backdrop-blur-[20px] border border-white/5 rounded-2xl flex flex-col shadow-glass">
      
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <Radio size={16} className="text-[#10B981] animate-pulse" /> Live Activity
        </div>
        <div className="text-xs text-[#888888] bg-white/5 px-2 py-0.5 rounded-full border border-white/10">12 Online</div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <ActivityItem title="AI Agent 04 started processing 'Q3 Report'" time="Just now" isAi />
        <ActivityItem title="Sarah joined the Executive Suite" time="2 mins ago" />
        <ActivityItem title="Engineering Standup concluded" time="15 mins ago" />
        <ActivityItem title="Office Tier 2 Expansion complete" time="1 hour ago" isAi />
      </div>
      
    </div>
  );
};
