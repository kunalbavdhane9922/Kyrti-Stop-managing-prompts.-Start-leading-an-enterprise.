import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import useSpatialStore from '../../store/spatialStore';
import { useWebSocket } from '../../network/WebSocketProvider';

export default function ProximityChatPanel() {
  const ws = useWebSocket();
  const activeChatTarget = useSpatialStore(s => s.activeChatTarget);
  const closeChat = useSpatialStore(s => s.closeChat);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  React.useEffect(() => {
    const handleReceiveChat = (e) => {
      setMessages(prev => [...prev, e.detail.message]);
    };
    window.addEventListener('receive_ai_chat', handleReceiveChat);
    return () => window.removeEventListener('receive_ai_chat', handleReceiveChat);
  }, []);

  if (!activeChatTarget) return null;

  const handleSend = () => {
    if (!input.trim() || !ws || ws.readyState !== WebSocket.OPEN) return;
    
    ws.send(JSON.stringify({ 
      type: 'chat', 
      message: input,
      targetId: activeChatTarget.id 
    }));
    
    setMessages(prev => [...prev, `[CEO]: ${input}`]);
    setInput('');
  };

  return (
    <div
      className="absolute right-0 top-0 h-full w-[380px] flex flex-col z-50 pointer-events-auto transition-transform duration-300 translate-x-0"
      style={{
        background: 'var(--color-bg-secondary)',
        borderLeft: '0.5px solid var(--color-border-tertiary)',
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 flex justify-between items-center"
        style={{ borderBottom: '0.5px solid var(--color-border-tertiary)' }}
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: 'var(--blue-400)' }}
            />
            <span
              className="text-sm tracking-wide uppercase"
              style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}
            >
              {activeChatTarget.name}
            </span>
          </div>
          <span
            className="text-[10px] uppercase tracking-widest ml-[22px]"
            style={{ color: 'var(--blue-200)' }}
          >
            Status: idle
          </span>
        </div>
        <button
          onClick={closeChat}
          className="transition-opacity duration-150 hover:opacity-70 cursor-pointer"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          <X size={18} />
        </button>
      </div>
      
      {/* Messages */}
      <div className="flex-1 px-5 py-4 overflow-y-auto flex flex-col gap-3">
        <div
          className="p-3 text-xs"
          style={{
            background: 'var(--color-bg-tertiary)',
            border: '0.5px solid var(--color-border-tertiary)',
            borderRadius: 'var(--border-radius-md)',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.7,
          }}
        >
          <span style={{ color: 'var(--blue-200)', fontWeight: 500 }}>[SYS] </span>Proximity engaged.<br/>
          <span style={{ color: 'var(--blue-200)', fontWeight: 500 }}>[AI] </span>I am ready for your instructions.
        </div>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className="p-3 text-xs"
            style={{
              background: 'var(--color-bg-tertiary)',
              border: '0.5px solid var(--color-border-tertiary)',
              borderRadius: 'var(--border-radius-md)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.7,
            }}
          >
            {msg}
          </div>
        ))}
      </div>
      
      {/* Input */}
      <div
        className="px-5 py-4 flex gap-3 items-center"
        style={{ borderTop: '0.5px solid var(--color-border-tertiary)' }}
      >
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Enter command..." 
          className="flex-1 px-4 py-2.5 text-sm focus:outline-none transition-colors duration-150"
          style={{
            background: 'var(--color-bg-tertiary)',
            border: '0.5px solid var(--color-border-tertiary)',
            borderRadius: 'var(--border-radius-md)',
            color: 'var(--color-text-primary)',
          }}
        />
        <button 
          onClick={handleSend}
          className="p-2.5 cursor-pointer transition-opacity duration-150 hover:opacity-80"
          style={{
            background: 'var(--blue-800)',
            color: 'var(--blue-100)',
            border: '0.5px solid var(--blue-600)',
            borderRadius: 'var(--border-radius-md)',
          }}
        >
          <MessageSquare size={16} />
        </button>
      </div>
    </div>
  );
}

