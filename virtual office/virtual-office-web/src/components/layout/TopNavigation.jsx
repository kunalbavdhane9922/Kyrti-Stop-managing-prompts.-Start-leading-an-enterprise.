import React from 'react';
import { Search, Bell, Settings, UserCircle, MapPin } from 'lucide-react';
import useSpatialStore from '../../store/spatialStore';

export const TopNavigation = () => {
  const currentZone = useSpatialStore((s) => s.currentZone);
  const connectedUsers = useSpatialStore((s) => s.connectedUsers);

  return (
    <div
      className="pointer-events-auto mt-4 mx-4 h-14 flex items-center justify-between px-6 transition-colors duration-200"
      style={{
        background: 'var(--color-bg-secondary)',
        border: '0.5px solid var(--color-border-tertiary)',
        borderRadius: 'var(--border-radius-lg)',
      }}
    >
      {/* Left: Branding + Zone indicator */}
      <div className="flex items-center gap-3">
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{ background: 'var(--purple-400)' }}
        />
        <span
          className="tracking-tight text-sm"
          style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}
        >
          Sovereign Headquarters
        </span>
        <div
          className="hidden sm:flex items-center gap-1.5 ml-3 text-[11px] px-2.5 py-1 rounded-full"
          style={{
            color: 'var(--color-text-tertiary)',
            background: 'var(--color-bg-tertiary)',
            border: '0.5px solid var(--color-border-tertiary)',
          }}
        >
          <MapPin size={10} style={{ color: 'var(--purple-400)' }} />
          {currentZone}
        </div>
      </div>

      {/* Center: Command palette trigger */}
      <div
        className="w-96 h-8 flex items-center px-3 gap-2 cursor-pointer transition-colors duration-200"
        style={{
          background: 'var(--color-bg-primary)',
          border: '0.5px solid var(--color-border-tertiary)',
          borderRadius: 'var(--border-radius-md)',
          color: 'var(--color-text-tertiary)',
        }}
      >
        <Search size={14} />
        <span className="text-xs">Search employees, rooms, or actions...</span>
        <span
          className="ml-auto text-[10px] px-1.5 py-0.5 rounded"
          style={{
            fontFamily: 'var(--font-mono)',
            border: '0.5px solid var(--color-border-tertiary)',
            background: 'var(--color-bg-tertiary)',
            color: 'var(--color-text-tertiary)',
          }}
        >
          Cmd K
        </span>
      </div>

      {/* Right: User menu */}
      <div className="flex items-center gap-4" style={{ color: 'var(--color-text-tertiary)' }}>
        <div
          className="text-[11px] px-2.5 py-1 rounded-full"
          style={{
            background: 'var(--teal-800)',
            color: 'var(--teal-200)',
            border: '0.5px solid var(--teal-600)',
          }}
        >
          {connectedUsers} online
        </div>
        <button className="transition-colors duration-200 hover:opacity-80" style={{ color: 'var(--color-text-secondary)' }}>
          <Bell size={18} />
        </button>
        <button className="transition-colors duration-200 hover:opacity-80" style={{ color: 'var(--color-text-secondary)' }}>
          <Settings size={18} />
        </button>
        <div className="w-[1px] h-4" style={{ background: 'var(--color-border-tertiary)' }} />
        <button className="flex items-center gap-2 transition-colors duration-200 hover:opacity-80">
          <UserCircle size={20} style={{ color: 'var(--purple-400)' }} />
          <span className="text-xs" style={{ fontWeight: 500, color: 'var(--color-text-secondary)' }}>
            CEO Profile
          </span>
        </button>
      </div>
    </div>
  );
};
