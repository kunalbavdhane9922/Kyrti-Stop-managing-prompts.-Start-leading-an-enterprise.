import React, { useState, useEffect } from 'react';
import useSpatialStore from '../../store/spatialStore';
import { X, Activity, Maximize } from 'lucide-react';

export default function SpatialExpansionModal() {
  const expansionModalOpen = useSpatialStore(s => s.expansionModalOpen);
  const closeExpansionModal = useSpatialStore(s => s.closeExpansionModal);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (expansionModalOpen) requestAnimationFrame(() => setIsRendered(true));
    else setIsRendered(false);
  }, [expansionModalOpen]);

  if (!expansionModalOpen && !isRendered) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden">
      {/* Backdrop — solid dim */}
      <div
        className="absolute inset-0 pointer-events-auto transition-opacity duration-400"
        style={{ background: 'rgba(11, 15, 25, 0.7)', opacity: isRendered ? 1 : 0 }}
        onClick={closeExpansionModal}
      />
      
      {/* Main Container */}
      <div
        className="relative w-[1000px] max-w-[95vw] pointer-events-auto flex flex-col overflow-hidden transition-all duration-400"
        style={{
          background: 'var(--color-bg-secondary)',
          border: '0.5px solid var(--color-border-tertiary)',
          borderRadius: 'var(--border-radius-xl)',
          transform: isRendered ? 'scale(1)' : 'scale(0.97)',
          opacity: isRendered ? 1 : 0,
        }}
      >
        {/* Header */}
        <div
          className="p-5 flex justify-between items-center"
          style={{ borderBottom: '0.5px solid var(--color-border-tertiary)' }}
        >
          <div className="flex items-center gap-4">
            <div
              className="p-2.5 rounded-lg"
              style={{ background: 'var(--blue-900)', border: '0.5px solid var(--blue-600)', color: 'var(--blue-400)' }}
            >
              <Activity size={18} />
            </div>
            <div className="flex flex-col gap-0.5">
              <h2
                className="text-lg tracking-wide uppercase"
                style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}
              >
                Spatial expansion protocol
              </h2>
              <span
                className="text-[10px] tracking-widest uppercase"
                style={{ color: 'var(--blue-200)', fontFamily: 'var(--font-mono)' }}
              >
                Protocol version 1.1
              </span>
            </div>
          </div>
          <button
            onClick={closeExpansionModal}
            className="p-2.5 rounded-lg cursor-pointer transition-opacity duration-150 hover:opacity-80"
            style={{
              background: 'var(--color-bg-tertiary)',
              border: '0.5px solid var(--color-border-tertiary)',
              color: 'var(--color-text-secondary)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 flex justify-center items-center" style={{ background: 'var(--color-bg-primary)' }}>
          <div
            className="relative w-full rounded-lg overflow-hidden flex justify-center"
            style={{ border: '0.5px solid var(--color-border-tertiary)', background: 'var(--color-bg-tertiary)' }}
          >
            <img 
              src="/upgrade.png" 
              alt="Spatial expansion protocol phases" 
              className="w-full h-auto object-contain max-h-[65vh]"
              onError={(e) => {
                e.target.style.display = 'none';
                if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div
              className="hidden flex-col items-center justify-center p-12 gap-4 min-h-[400px]"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <Maximize size={48} style={{ color: 'var(--blue-400)', opacity: 0.5 }} />
              <p style={{ fontWeight: 500 }}>Expansion protocol infographic loaded.</p>
              <p className="text-xs" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>
                Asset: upgrade.png
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

