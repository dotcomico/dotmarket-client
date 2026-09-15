import axios from 'axios';

// Deliberately not axiosInstance: that instance injects the storefront JWT
// and hard-redirects to /login on 401, neither of which applies to this
// unauthenticated ai-server endpoint.
const aiClient = axios.create({
  baseURL: '/ai',
  timeout: 30000
});

interface ChatResponse {
  reply: string;
}

export const chatApi = {
  sendMessage: (message: string) =>
    aiClient.post<ChatResponse>('/chat', { message })
};
