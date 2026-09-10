import { useState } from 'react';
import type { FormEvent } from 'react';
import './ChatInput.css';

interface ChatInputProps {
  onSend: (text: string) => void;
}

export const ChatInput = ({ onSend }: ChatInputProps) => {
  const [value, setValue] = useState('');
  const canSend = value.trim().length > 0;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!canSend) return;
    onSend(value);
    setValue('');
  };

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <input
        type="text"
        className="chat-input__field"
        placeholder="Type a message..."
        value={value}
        onChange={(event) => setValue(event.target.value)}
        aria-label="Chat message"
        autoFocus
      />
      <button
        type="submit"
        className="chat-input__send"
        disabled={!canSend}
        aria-label="Send message"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </form>
  );
};
