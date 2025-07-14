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
      const response = await authorizedApi.get(`/chat/history`, {
        params: { chatRoomId },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching chat history:', error);
      throw new Error(
        error?.response?.data?.message || 'Failed to fetch chat history.'
      );
    }
  },
};

export default ChatService; 