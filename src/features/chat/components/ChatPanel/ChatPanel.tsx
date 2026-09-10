import { ChatMessageList } from '../ChatMessageList/ChatMessageList';
import { ChatInput } from '../ChatInput/ChatInput';
import type { ChatMessage } from '../../types/chat.types';
import './ChatPanel.css';

interface ChatPanelProps {
  messages: ChatMessage[];
  isBotTyping: boolean;
  onSend: (text: string) => void;
  onClose: () => void;
}

export const ChatPanel = ({ messages, isBotTyping, onSend, onClose }: ChatPanelProps) => {
  return (
    <div className="chat-panel" role="dialog" aria-label="AI chat">
      <div className="chat-panel__header">
        <h2 className="chat-panel__title">AI Chat</h2>
        <button
          type="button"
          className="chat-panel__close"
          onClick={onClose}
          aria-label="Close chat"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <ChatMessageList messages={messages} isBotTyping={isBotTyping} />
      <ChatInput onSend={onSend} />
    </div>
  );
};
