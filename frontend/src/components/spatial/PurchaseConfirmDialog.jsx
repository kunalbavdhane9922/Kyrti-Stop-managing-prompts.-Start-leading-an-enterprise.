import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';

export const PurchaseConfirmDialog = ({ item, targetFloor, onConfirm, onCancel }) => {
  const [name, setName] = useState('');
  
  const isAgent = item.type === 'agent';
  
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-md pointer-events-auto"
        onClick={onCancel}
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 10 }}
        className="relative w-full max-w-md bg-slate-900 border border-blue-900/40 rounded-xl shadow-[0_0_40px_rgba(15,23,42,1)] overflow-hidden pointer-events-auto"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/80">
          <h3 className="text-sm font-semibold text-slate-200">Confirm Order</h3>
          <button onClick={onCancel} className="text-slate-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-lg bg-slate-800 flex items-center justify-center text-3xl border border-slate-700">
              {isAgent ? '🤖' : '🏗️'}
            </div>
            <div>
              <div className="text-lg font-medium text-white">{item.label}</div>
              <div className="text-sm text-slate-400 font-mono mt-1">
                Target: Floor {targetFloor}
              </div>
            </div>
          </div>
          
          <div className="space-y-4 mb-6">
            {isAgent ? (
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">
                  Agent Display Name
                </label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alice (Research)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-blue-500 transition-colors"
                  autoFocus
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">
                  Room Label (Optional)
                </label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. HR Department"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-blue-500 transition-colors"
                  autoFocus
                />
              </div>
            )}
            
            <div className="bg-blue-900/20 border border-blue-900/50 rounded-lg p-3 flex gap-3 text-sm text-blue-200 items-start">
              <AlertCircle size={16} className="mt-0.5 shrink-0 text-blue-400" />
              <p>
                {isAgent 
                  ? "The agent will be spawned at an available desk on this floor immediately."
                  : "The backend MapEngine will automatically locate an optimal empty region on this floor and instantiate the infrastructure."}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <div>
              <div className="text-xs text-slate-500 font-mono uppercase">Total Cost</div>
              <div className="text-xl font-bold font-mono text-white">${item.cost.toLocaleString()}</div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => onConfirm({ name: name || item.label })}
                className="px-5 py-2 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all"
              >
                Confirm {isAgent ? 'Hire' : 'Purchase'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
