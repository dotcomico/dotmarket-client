import { useEffect, useRef, useState } from 'react';
import { ChatPanel } from '../ChatPanel/ChatPanel';
import { useChat } from '../../hooks/useChat';
import './ChatWidget.css';

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { messages, isBotTyping, sendMessage } = useChat();

  const close = () => {
    setIsOpen(false);
    toggleButtonRef.current?.focus();
  };

  // Close on Escape and keep Tab focus cycling inside the panel while it's open.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button, input, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div className="chat-widget">
      {isOpen && (
        <div className="chat-widget__panel" ref={panelRef}>
          <ChatPanel
            messages={messages}
            isBotTyping={isBotTyping}
            onSend={sendMessage}
            onClose={close}
          />
        </div>
      )}

      <button
        ref={toggleButtonRef}
        type="button"
        className="chat-widget__toggle"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Close AI chat' : 'Open AI chat'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        )}
      </button>
    </div>
  );
};
