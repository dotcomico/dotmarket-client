import { useCallback, useEffect, useRef } from 'react';
import type { ChatMessage } from '../../types/chat.types';
import { useElapsedTimer } from '../../hooks/useElapsedTimer';
import { formatElapsedTime } from '../../utils/formatElapsedTime';
import './ChatMessageList.css';

interface ChatMessageListProps {
  messages: ChatMessage[];
  isBotTyping: boolean;
}

// Below this, nothing shows but the bouncing dots — a caption would just
// flash for instant replies.
const CAPTION_REVEAL_THRESHOLD_MS = 5000;

const formatTime = (timestamp: number) =>
  new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

type CaptionPhase = { visible: false } | { visible: true; text: string };

const getCaptionPhase = (elapsedMs: number): CaptionPhase => {
  if (elapsedMs < CAPTION_REVEAL_THRESHOLD_MS) return { visible: false };

  return { visible: true, text: formatElapsedTime(elapsedMs) };
};

interface TypingIndicatorProps {
  // Called once the elapsed caption first becomes visible, so the parent can
  // re-run its scroll-to-bottom — the caption pops in below the bubble after
  // the parent's own scroll effect already fired at typing-start.
  onCaptionReveal: () => void;
}

// Mounts fresh each time the bot starts typing (the parent only renders it
// while isBotTyping is true), so useElapsedTimer's mount-time start is
// always correct without any manual reset.
const TypingIndicator = ({ onCaptionReveal }: TypingIndicatorProps) => {
  const elapsedMs = useElapsedTimer();
  const phase = getCaptionPhase(elapsedMs);

  useEffect(() => {
    if (phase.visible) onCaptionReveal();
  }, [phase.visible, onCaptionReveal]);

  const ariaLabel = phase.visible ? `AI is typing, ${phase.text} elapsed` : 'AI is typing';

  return (
    <div className="chat-message-list__message chat-message-list__message--bot">
      <div className="chat-message-list__bubble chat-message-list__bubble--typing" aria-label={ariaLabel}>
        <span className="chat-message-list__typing-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </div>
      <span
        className={`chat-message-list__time chat-message-list__time--typing${phase.visible ? ' chat-message-list__time--visible' : ''}`}
        aria-hidden="true"
      >
        {phase.visible && <span className="chat-message-list__time-text">{phase.text}</span>}
      </span>
    </div>
  );
};

export const ChatMessageList = ({ messages, isBotTyping }: ChatMessageListProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, []);

  // Keep the newest message in view whenever the conversation grows.
  useEffect(() => {
    scrollToBottom();
  }, [messages.length, isBotTyping, scrollToBottom]);

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

      {isBotTyping && <TypingIndicator onCaptionReveal={scrollToBottom} />}

      <div ref={bottomRef} />
    </div>
  );
};
