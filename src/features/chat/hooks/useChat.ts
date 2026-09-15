import { useState } from 'react';
import type { ChatMessage } from '../types/chat.types';
import { chatApi } from '../api/chatApi';

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'bot',
  text: 'Hi! Ask me anything about your order or our products.',
  timestamp: Date.now(),
};

const ERROR_REPLY_TEXT = "Sorry, I couldn't reach the assistant. Please try again.";

const createMessage = (role: ChatMessage['role'], text: string): ChatMessage => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  role,
  text,
  timestamp: Date.now(),
});

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isBotTyping, setIsBotTyping] = useState(false);

  const sendMessage = async (rawText: string) => {
    const text = rawText.trim();
    if (!text) return;

    const history = messages.map(({ role, text: turnText }) => ({ role, text: turnText }));

    setMessages((prev) => [...prev, createMessage('user', text)]);
    setIsBotTyping(true);

    try {
      const { data } = await chatApi.sendMessage(text, history);
      setMessages((prev) => [...prev, createMessage('bot', data.reply)]);
    } catch {
      setMessages((prev) => [...prev, createMessage('bot', ERROR_REPLY_TEXT)]);
    } finally {
      setIsBotTyping(false);
    }
  };

  return { messages, isBotTyping, sendMessage };
};
