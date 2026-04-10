import { apiClient } from './config';

export const chatApi = {
  getInsights: async () => {
    const response = await apiClient.get('/chat/insights');
    return response;
  },

  ask: async (data: {
    message: string;
    history: { role: 'user' | 'assistant'; content: string }[];
  }) => {
    const response = await apiClient.post('/chat/ask', data);
    return response;
  },
};

