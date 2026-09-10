import { useEffect, useRef } from 'react';
import type { ChatMessage } from '../../types/chat.types';
import './ChatMessageList.css';

interface ChatMessageListProps {
  messages: ChatMessage[];
  isBotTyping: boolean;
}

const formatTime = (timestamp: number) =>
  new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export const ChatMessageList = ({ messages, isBotTyping }: ChatMessageListProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Keep the newest message in view whenever the conversation grows.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [messages.length, isBotTyping]);

  return (
    <div className="chat-message-list" role="log" aria-live="polite" aria-label="Chat messages">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`chat-message-list__message chat-message-list__message--${message.role}`}
        >
          <div className="chat-message-list__bubble">{message.text}</div>
          <span className="chat-message-list__time">{formatTime(message.timestamp)}</span>
        </div>
      ))}

      {isBotTyping && (
        <div className="chat-message-list__message chat-message-list__message--bot">
          <div className="chat-message-list__bubble chat-message-list__bubble--typing" aria-label="AI is typing">
            <span />
            <span />
            <span />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};
