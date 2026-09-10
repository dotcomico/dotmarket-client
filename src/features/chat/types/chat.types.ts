export type ChatRole = 'user' | 'bot';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  timestamp: number;
}
