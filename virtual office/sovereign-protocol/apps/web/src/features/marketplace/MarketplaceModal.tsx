import React, { useEffect, useState } from 'react';
import { ShoppingCart, Cpu, Layout, X } from 'lucide-react';
import { useSpatialStore } from '../../shared/store/useSpatialStore';

export const MarketplaceModal: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Simulated fetch from /api/v1/treasury/items
    setItems([
        { id: "item_01", name: "Executive Desk", price: 500, category: "FURNITURE", icon: Layout },
        { id: "item_02", name: "AI Analyst Model", price: 2000, category: "AI_AGENT", icon: Cpu }
    ]);
    
    // Simple custom event bridge for MVP demo
    const toggle = () => setIsOpen(!isOpen);
    window.addEventListener('TOGGLE_MARKET', toggle);
    return () => window.removeEventListener('TOGGLE_MARKET', toggle);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-[#0f172a] border border-[#1e293b] rounded-xl shadow-2xl font-sans text-white">
        
        <div className="flex items-center justify-between px-6 py-4 bg-[#1e293b]/50 border-b border-[#334155]">
          <div className="flex items-center gap-3">
            <ShoppingCart size={24} className="text-indigo-400" />
            <h2 className="text-xl font-bold">Office Marketplace</h2>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 grid grid-cols-3 gap-6">
          {items.map(item => (
            <div key={item.id} className="p-4 bg-[#1e293b]/30 border border-[#334155] rounded-lg hover:border-indigo-500/50 transition-colors flex flex-col items-center">
              <div className="p-4 bg-indigo-500/10 rounded-full mb-3">
                 <item.icon size={32} className="text-indigo-400" />
              </div>
              <h3 className="font-semibold mb-1">{item.name}</h3>
              <p className="text-emerald-400 font-bold mb-4">{item.price} CREDITS</p>
              <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-sm font-bold transition-colors">
                PURCHASE
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
