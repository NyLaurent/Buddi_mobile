import { io, Socket } from 'socket.io-client';

// Socket server URL from your configuration
const SOCKET_SERVER_URL = 'https://backend-service-hw1rh.kinsta.app';

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private pendingRoomJoins: { chatRoomId: string; userId: string; userType: 'Parent' | 'Buddi' }[] = [];

  // Initialize socket connection
  connect(userId: string, userType: 'Parent' | 'Buddi') {
    try {
      this.socket = io(SOCKET_SERVER_URL, {
        transports: ['websocket'],
        query: {
          userId,
          userType,
        },
      });

      this.socket.on('connect', () => {
        console.log('[SocketService] Socket connected:', this.socket?.id);
        console.log('[SocketService] Socket URL:', SOCKET_SERVER_URL);
        this.isConnected = true;
        // Process any pending room joins
        this.pendingRoomJoins.forEach(({ chatRoomId, userId, userType }) => {
          console.log('[SocketService] Processing pending room join:', { chatRoomId, userId, userType });
          this.joinChatRoom(chatRoomId, userId, userType);
        });
        this.pendingRoomJoins = [];
      });

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
        this.isConnected = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        this.isConnected = false;
      });

    } catch (error) {
      console.error('Error initializing socket:', error);
    }
  }

  // Join a chat room
  joinChatRoom(chatRoomId: string, userId: string, userType: 'Parent' | 'Buddi') {
    if (!this.socket || !this.isConnected) {
      console.warn('[SocketService] Socket not connected, queuing room join:', { chatRoomId, userId, userType });
      this.pendingRoomJoins.push({ chatRoomId, userId, userType });
      return;
    }
    console.log('[SocketService] Joining chat room:', { chatRoomId, userId, userType });
    console.log('[SocketService] Socket connected:', this.socket.connected);
    console.log('[SocketService] Socket ID:', this.socket.id);
    this.socket.emit('join-chat-room', {
      chatRoomId,
      userId,
      userType,
    });
    console.log('[SocketService] join-chat-room event emitted');
  }

  // Send a message
  sendMessage(chatRoomId: string, message: string, senderId: string, senderType: 'Parent' | 'Buddi') {
    if (!this.socket || !this.isConnected) {
      console.error('[SocketService] Socket not connected');
      return;
    }

    console.log('[SocketService] Sending message:', { chatRoomId, message, senderId, senderType });
    console.log('[SocketService] Socket connected:', this.socket.connected);
    console.log('[SocketService] Socket ID:', this.socket.id);
    
    this.socket.emit('send-message', {
      chatRoomId,
      message,
      senderId,
      senderType,
    });
    console.log('[SocketService] send-message event emitted');
  }

  // Listen for incoming messages
  onReceiveMessage(callback: (data: any) => void) {
    if (!this.socket) {
      console.error('Socket not initialized');
      return;
    }

    this.socket.on('receive-message', (data) => {
      console.log('Message received:', data);
      callback(data);
    });
  }

  // Listen for room join confirmation
  onRoomJoined(callback: (data: any) => void) {
    if (!this.socket) {
      console.error('Socket not initialized');
      return;
    }

    this.socket.on('room-joined', (data) => {
      console.log('Room joined:', data);
      callback(data);
    });
  }

  // Leave a chat room
  leaveChatRoom(chatRoomId: string) {
    if (!this.socket || !this.isConnected) {
      console.error('Socket not connected');
      return;
    }

    console.log('Leaving chat room:', chatRoomId);
    
    this.socket.emit('leave-chat-room', {
      chatRoomId,
    });
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log('Socket disconnected');
    }
  }

  // Check if socket is connected
  isSocketConnected(): boolean {
    return this.isConnected && this.socket !== null;
  }

  // Get socket instance (for advanced usage)
  getSocket(): Socket | null {
    return this.socket;
  }
}

// Export singleton instance
export default new SocketService(); 