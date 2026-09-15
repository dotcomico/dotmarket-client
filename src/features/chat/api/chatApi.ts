import axios from 'axios';

// Deliberately not axiosInstance: that instance injects the storefront JWT
// and hard-redirects to /login on 401, neither of which applies to this
// unauthenticated ai-server endpoint.
// Matches nginx's proxy_read_timeout for /ai (see frontend/nginx.conf) so the
// browser doesn't give up before a slow CPU-inference response finishes.
const aiClient = axios.create({
  baseURL: '/ai',
  timeout: 180000
});

interface ChatHistoryTurn {
  role: 'user' | 'bot';
  text: string;
}

interface ChatRequest {
  message: string;
  history: ChatHistoryTurn[];
}

interface ChatResponse {
  reply: string;
}

export const chatApi = {
  sendMessage: (message: string, history: ChatHistoryTurn[]) =>
    aiClient.post<ChatResponse>('/chat', { message, history } satisfies ChatRequest)
};
