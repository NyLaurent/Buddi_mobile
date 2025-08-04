import { authorizedApi } from './config';

export interface ChatMessage {
  id: number;
  chatRoomId: string;
  message: string;
  senderId: string;
  senderType: 'Parent' | 'Buddi';
  timestamp: string;
}

const ChatService = {
  async getChatHistory(chatRoomId: string): Promise<ChatMessage[]> {
    try {
      console.log('[ChatService] 📚 Fetching chat history for room:', chatRoomId);
      const response = await authorizedApi.get(`/chat/history`, {
        params: { chatRoomId },
        timeout: 10000, // 10 second timeout for chat history
      });
      console.log('[ChatService] ✅ Chat history fetched successfully');
      return response.data;
    } catch (error: any) {
      console.error('[ChatService] ❌ Error fetching chat history:', error);
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please check your connection and try again.');
      }
      throw new Error(
        error?.response?.data?.message || 'Failed to fetch chat history.'
      );
    }
  },
};

export default ChatService; 