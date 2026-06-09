/**
 * Sovereign Virtual Office — Chat Panel Component
 * 
 * Slide-out chat sidebar with room chat and direct messages.
 */
import { useState, useRef, useEffect } from 'react';
import { useVirtualOfficeStore } from '../../store/virtualOfficeStore.js';
import { socketService } from '../../services/socketService.js';

export function ChatPanel() {
  const { messages, chatOpen, toggleChat, unreadCount } = useVirtualOfficeStore();
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    socketService.sendChat(trimmed);
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === 'Escape') toggleChat();
  };

  return (
    <>
      {/* Toggle button */}
      <button
        className="vo-chat-toggle"
        onClick={toggleChat}
        title="Toggle Chat"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        {unreadCount > 0 && <span className="vo-chat-badge">{unreadCount}</span>}
      </button>

      {/* Chat panel */}
      {chatOpen && (
        <div className="vo-chat-panel">
          <div className="vo-chat-header">
            <span>Room Chat</span>
            <button className="vo-chat-close" onClick={toggleChat}>✕</button>
          </div>

          <div className="vo-chat-messages">
            {messages.length === 0 && (
              <div className="vo-chat-empty">No messages yet. Say hello! 👋</div>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className={`vo-chat-msg ${msg.type === 'system' ? 'system' : ''}`}>
                <span className="vo-chat-name">{msg.displayName}</span>
                <span className="vo-chat-text">{msg.text}</span>
                <span className="vo-chat-time">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="vo-chat-input-row">
            <input
              className="vo-chat-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              maxLength={500}
              autoFocus
            />
            <button className="vo-chat-send" onClick={handleSend} disabled={!text.trim()}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
