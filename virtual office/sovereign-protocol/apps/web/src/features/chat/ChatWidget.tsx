import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';

export const ChatWidget: React.FC = () => {
  const [messages, setMessages] = useState<{user: str, text: str}[]>([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { user: "Me", text: input }]);
    setInput("");
    // Dispatch to WS manager
  };

  return (
    <div className="fixed bottom-6 right-6 w-80 h-96 bg-[#0f172a]/95 border border-[#1e293b] rounded-xl flex flex-col font-sans">
      <div className="p-3 bg-indigo-500/10 border-b border-[#1e293b] flex items-center gap-2">
        <MessageSquare size={18} className="text-indigo-400" />
        <span className="font-semibold text-slate-200">Global Chat</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className="bg-[#1e293b]/50 p-2 rounded-lg text-sm text-slate-300">
            <span className="font-bold text-indigo-400">{m.user}: </span>{m.text}
          </div>
        ))}
      </div>
      
      <div className="p-3 border-t border-[#1e293b] flex gap-2">
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 bg-[#1e293b] border border-[#334155] rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:border-indigo-500" 
          placeholder="Type a message..." 
        />
        <button onClick={handleSend} className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white">
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};
