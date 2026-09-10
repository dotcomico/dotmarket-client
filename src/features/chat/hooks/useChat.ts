import { useState } from 'react';
import type { ChatMessage } from '../types/chat.types';

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'bot',
  text: 'Hi! Ask me anything about your order or our products.',
  timestamp: Date.now(),
};

// TODO(backend): replace this local stub with a real API call once the chat
// backend exists (e.g. POST /api/chat) — swap out getBotReply for a request
// through features/chat/api and keep the rest of this hook unchanged.
const getBotReply = (): string => "Thanks for your message! We'll get back to you soon.";

const BOT_REPLY_DELAY_MS = 600;

const createMessage = (role: ChatMessage['role'], text: string): ChatMessage => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  role,
  text,
  timestamp: Date.now(),
});

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isBotTyping, setIsBotTyping] = useState(false);

  const sendMessage = (rawText: string) => {
    const text = rawText.trim();
    if (!text) return;

    setMessages((prev) => [...prev, createMessage('user', text)]);
    setIsBotTyping(true);

    // TODO(backend): this setTimeout stands in for the network round-trip;
    // remove it once getBotReply becomes a real async API call.
    setTimeout(() => {
      setMessages((prev) => [...prev, createMessage('bot', getBotReply())]);
      setIsBotTyping(false);
    }, BOT_REPLY_DELAY_MS);
  };

  return { messages, isBotTyping, sendMessage };
};
