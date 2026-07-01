import React, { useState } from 'react';
import { Calendar, Video, X } from 'lucide-react';

export const MeetingScheduler: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Hook into custom event for UI toggle
  React.useEffect(() => {
    const toggle = () => setIsOpen(!isOpen);
    window.addEventListener('TOGGLE_MEETINGS', toggle);
    return () => window.removeEventListener('TOGGLE_MEETINGS', toggle);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="w-full max-w-lg bg-[#0f172a] border border-[#1e293b] rounded-xl font-sans text-white">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#334155]">
          <div className="flex items-center gap-3">
            <Calendar className="text-emerald-400" />
            <h2 className="text-lg font-bold">Schedule Meeting</h2>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-slate-400"><X size={20}/></button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">Topic</label>
            <input type="text" className="w-full bg-[#1e293b] border border-[#334155] rounded px-3 py-2 text-sm" placeholder="Sprint Planning..." />
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <Video size={32} className="text-emerald-400" />
            <div>
              <p className="text-sm font-bold text-emerald-400">Jitsi Integration Ready</p>
              <p className="text-xs text-slate-400">A secure spatial room will be generated automatically.</p>
            </div>
          </div>

          <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded font-bold text-sm tracking-wide transition-colors">
            CREATE CALENDAR INVITE
          </button>
        </div>
      </div>
    </div>
  );
};
