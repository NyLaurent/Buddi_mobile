import { io, Socket } from 'socket.io-client';

// Socket server URL from your configuration
const SOCKET_SERVER_URL = process.env.API_BASE_URL?.replace('/api/v1', '') || 'https://backend-service-hw1rh.kinsta.app';
// Silence all console output within this module
const console = {
  log: (..._args: any[]) => {},
  warn: (..._args: any[]) => {},
  error: (..._args: any[]) => {},
} as const;

interface PickupData {
  id: number;
  buddiId: number;
  parentId: number;
  childId: number;
  status: 'pending' | 'enRoute' | 'pickedUp' | 'completed' | 'cancelled';
  tripStartTime?: string;
  pickupTime?: string;
  dropoffTime?: string;
  fare?: number;
  fromLocation?: string;
  toLocation?: string;
  scheduledTime?: string;
}

interface ChatMessage {
  message: string;
  senderId: string;
  senderType: 'Parent' | 'Buddi';
  timestamp: string;
  messageId?: string; // For tracking message delivery
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
}

interface ChatRoomData {
  chatRoomId: string;
  userId: string;
  userType: 'Parent' | 'Buddi';
}

interface MessageData {
  chatRoomId: string;
  message: string;
  senderId: string;
  senderType: 'Parent' | 'Buddi';
  messageId?: string;
}

interface TypingData {
  chatRoomId: string;
  userId: string;
  userType: 'Parent' | 'Buddi';
  isTyping: boolean;
}

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second
  private userId: string | null = null;
  private userType: 'Parent' | 'Buddi' | null = null;
  private eventListeners: Map<string, Function[]> = new Map();

  // Initialize socket connection with enhanced error handling
  connect(userId: string, userType: 'Parent' | 'Buddi') {
    try {
      this.userId = userId;
      this.userType = userType;

      console.log('[SocketService] 🔌 Connecting to socket server:', SOCKET_SERVER_URL);
      console.log('[SocketService] 👤 User:', { userId, userType });

      this.socket = io(SOCKET_SERVER_URL, {
        transports: ['websocket', 'polling'], // Fallback to polling if websocket fails
        timeout: 10000, // Reduced to 10s for faster timeout
        forceNew: true, // Force new connection
        reconnection: true,
        reconnectionAttempts: 5, // Increased attempts
        reconnectionDelay: 500, // Faster initial reconnection
        reconnectionDelayMax: 3000, // Reduced max delay
        upgrade: true, // Allow transport upgrade
        rememberUpgrade: true, // Remember successful upgrades
        query: {
          userId,
          userType,
        },
      });

      this.setupEventListeners();
      this.setupReconnectionLogic();

    } catch (error) {
      console.error('[SocketService] ❌ Error initializing socket:', error);
      this.handleConnectionError(error);
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('[SocketService] ✅ Socket connected successfully:', this.socket?.id);
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.reconnectDelay = 1000; // Reset delay
      
      // Join personal room based on user type
      this.joinPersonalRoom();
      
      // Emit custom event for connection success
      this.emit('connection-established', { userId: this.userId, userType: this.userType });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[SocketService] ❌ Socket disconnected:', reason);
      this.isConnected = false;
      
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, don't reconnect
        console.log('[SocketService] 🛑 Server initiated disconnect');
      } else {
        // Client initiated disconnect or network issue
        this.attemptReconnection();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('[SocketService] ❌ Socket connection error:', error);
      this.isConnected = false;
      this.handleConnectionError(error);
    });

    // Pickup status events (from your backend)
    this.socket.on('pickup-assigned', (data: string) => {
      console.log('[SocketService] 📋 Pickup assigned:', data);
      try {
        const pickupData: PickupData = JSON.parse(data);
        this.triggerEvent('pickup-assigned', pickupData);
      } catch (error) {
        console.error('[SocketService] ❌ Error parsing pickup-assigned data:', error);
      }
    });

    this.socket.on('pickup-requested', (data: string) => {
      console.log('[SocketService] 📋 Pickup requested event received from server!');
      console.log('[SocketService] 📋 Raw data:', data);
      try {
        const pickupData: PickupData = JSON.parse(data);
        console.log('[SocketService] 📋 Parsed pickup data:', pickupData);
        console.log('[SocketService] 🔄 Triggering local event for pickup-requested');
        this.triggerEvent('pickup-requested', pickupData);
        console.log('[SocketService] ✅ Local event triggered successfully');
      } catch (error) {
        console.error('[SocketService] ❌ Error parsing pickup-requested data:', error);
      }
    });

    this.socket.on('pickup-started', (data: string) => {
      console.log('[SocketService] 🚀 Pickup started:', data);
      try {
        const pickupData: PickupData = JSON.parse(data);
        this.triggerEvent('pickup-started', pickupData);
      } catch (error) {
        console.error('[SocketService] ❌ Error parsing pickup-started data:', error);
      }
    });

    this.socket.on('child-picked-up', (data: string) => {
      console.log('[SocketService] 👶 Child picked up:', data);
      try {
        const pickupData: PickupData = JSON.parse(data);
        this.triggerEvent('child-picked-up', pickupData);
      } catch (error) {
        console.error('[SocketService] ❌ Error parsing child-picked-up data:', error);
      }
    });

    this.socket.on('trip-completed', (data: string) => {
      console.log('[SocketService] ✅ Trip completed:', data);
      try {
        const pickupData: PickupData = JSON.parse(data);
        this.triggerEvent('trip-completed', pickupData);
      } catch (error) {
        console.error('[SocketService] ❌ Error parsing trip-completed data:', error);
      }
    });

    this.socket.on('trip-cancelled', (data: string) => {
      console.log('[SocketService] ❌ Trip cancelled:', data);
      try {
        const pickupData: PickupData = JSON.parse(data);
        this.triggerEvent('trip-cancelled', pickupData);
      } catch (error) {
        console.error('[SocketService] ❌ Error parsing trip-cancelled data:', error);
      }
    });

    // Earnings and timesheet events
    this.socket.on('earnings-updated', (data: any) => {
      console.log('[SocketService] 💰 Earnings updated:', data);
      this.triggerEvent('earnings-updated', data);
    });

    this.socket.on('timesheet-updated', (data: string) => {
      console.log('[SocketService] 📊 Timesheet updated:', data);
      try {
        const timesheetData = JSON.parse(data);
        this.triggerEvent('timesheet-updated', timesheetData);
      } catch (error) {
        console.error('[SocketService] ❌ Error parsing timesheet-updated data:', error);
      }
    });

    // Availability events
    this.socket.on('availability-status-changed', (data: any) => {
      console.log('[SocketService] 🔄 Availability status changed:', data);
      this.triggerEvent('availability-status-changed', data);
    });

    // Enhanced Chat Events with real-time features
    this.socket.on('receive-message', (data: string) => {
      console.log('[SocketService] 💬 Message received:', data);
      try {
        const messageData: ChatMessage = JSON.parse(data);
        this.triggerEvent('receive-message', messageData);
      } catch (error) {
        console.error('[SocketService] ❌ Error parsing receive-message data:', error);
      }
    });

    // Message delivery confirmation
    this.socket.on('message-delivered', (data: any) => {
      console.log('[SocketService] ✅ Message delivered:', data);
      this.triggerEvent('message-delivered', data);
    });

    // Message read confirmation
    this.socket.on('message-read', (data: any) => {
      console.log('[SocketService] 👁️ Message read:', data);
      this.triggerEvent('message-read', data);
    });

    // Typing indicators
    this.socket.on('user-typing', (data: string) => {
      console.log('[SocketService] ⌨️ User typing:', data);
      try {
        const typingData: TypingData = JSON.parse(data);
        this.triggerEvent('user-typing', typingData);
      } catch (error) {
        console.error('[SocketService] ❌ Error parsing user-typing data:', error);
      }
    });

    this.socket.on('user-stopped-typing', (data: string) => {
      console.log('[SocketService] 🛑 User stopped typing:', data);
      try {
        const typingData: TypingData = JSON.parse(data);
        this.triggerEvent('user-stopped-typing', typingData);
      } catch (error) {
        console.error('[SocketService] ❌ Error parsing user-stopped-typing data:', error);
      }
    });

    // Room joined confirmation with enhanced data
    this.socket.on('room-joined', (data: any) => {
      console.log('[SocketService] 🏠 Room joined confirmation:', data);
      this.triggerEvent('room-joined', data);
    });

    // Room left confirmation
    this.socket.on('room-left', (data: any) => {
      console.log('[SocketService] 🚪 Room left confirmation:', data);
      this.triggerEvent('room-left', data);
    });

    // Chat room error with detailed information
    this.socket.on('chat-room-error', (data: any) => {
      console.error('[SocketService] ❌ Chat room error:', data);
      this.triggerEvent('chat-room-error', data);
    });

    // Chat room status updates
    this.socket.on('chat-room-status', (data: any) => {
      console.log('[SocketService] 📊 Chat room status update:', data);
      this.triggerEvent('chat-room-status', data);
    });

    // Pickup updates
    this.socket.on('active-pickups', (data: any) => {
      console.log('[SocketService] 📋 Active pickups updated:', data);
      this.triggerEvent('active-pickups', data);
    });

    this.socket.on('pickup-history', (data: any) => {
      console.log('[SocketService] 📚 Pickup history updated:', data);
      this.triggerEvent('pickup-history', data);
    });

    this.socket.on('all-pickups-updated', (data: string) => {
      console.log('[SocketService] 📋 All pickups updated:', data);
      try {
        const pickupsData = JSON.parse(data);
        this.triggerEvent('all-pickups-updated', pickupsData);
      } catch (error) {
        console.error('[SocketService] ❌ Error parsing all-pickups-updated data:', error);
      }
    });

    // Rating events
    this.socket.on('buddi-rated', (data: any) => {
      console.log('[SocketService] ⭐ Buddi rated:', data);
      this.triggerEvent('buddi-rated', data);
    });
  }

  private setupReconnectionLogic() {
    if (!this.socket) return;

    // Exponential backoff for reconnection
    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`[SocketService] 🔄 Reconnection attempt ${attemptNumber}/${this.maxReconnectAttempts}`);
      this.reconnectAttempts = attemptNumber;
      
      if (attemptNumber > this.maxReconnectAttempts) {
        console.log('[SocketService] 🛑 Max reconnection attempts reached');
        this.emit('max-reconnect-attempts-reached');
        return;
      }
      
      // Exponential backoff: 1s, 2s, 4s, 8s, 16s
      const delay = Math.min(1000 * Math.pow(2, attemptNumber - 1), 30000);
      console.log(`[SocketService] ⏱️ Waiting ${delay}ms before next attempt`);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`[SocketService] ✅ Reconnected after ${attemptNumber} attempts`);
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.reconnectDelay = 1000;
      
      // Rejoin personal room after reconnection
      this.joinPersonalRoom();
      
      this.emit('reconnected', { attemptNumber });
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('[SocketService] ❌ Reconnection error:', error);
      this.emit('reconnection-error', error);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('[SocketService] ❌ Reconnection failed');
      this.emit('reconnection-failed');
    });
  }

  private joinPersonalRoom() {
    if (!this.socket || !this.isConnected || !this.userId || !this.userType) {
      console.warn('[SocketService] ⚠️ Cannot join personal room - missing connection or user data');
      return;
    }

    const roomId = this.userType === 'Buddi' ? `buddi-${this.userId}` : `parent-${this.userId}`;
    const eventName = this.userType === 'Buddi' ? 'join-buddi-room' : 'join-parent-room';
    
    console.log(`[SocketService] 🏠 Joining personal room: ${roomId}`);
    this.socket.emit(eventName, this.userId);
  }

  // Enhanced Join Chat Room with better error handling
  joinChatRoom(chatRoomId: string, userId: string, userType: 'Parent' | 'Buddi') {
    if (!this.socket || !this.isConnected) {
      console.warn('[SocketService] ⚠️ Socket not connected, cannot join chat room');
      return;
    }

    const roomData: ChatRoomData = {
      chatRoomId,
      userId,
      userType,
    };

    console.log(`[SocketService] 💬 Joining chat room:`, roomData);
    this.socket.emit('join-chat-room', roomData);
  }

  // Enhanced Send Message with message ID and delivery tracking
  sendMessage(chatRoomId: string, message: string, senderId: string, senderType: 'Parent' | 'Buddi', messageId?: string) {
    if (!this.socket || !this.isConnected) {
      console.error('[SocketService] ❌ Socket not connected, cannot send message');
      return;
    }

    const messageData: MessageData = {
      chatRoomId,
      message,
      senderId,
      senderType,
      messageId: messageId || `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    console.log(`[SocketService] 💬 Sending message to room ${chatRoomId}:`, messageData);
    this.socket.emit('send-message', messageData);
    
    // Return message ID for tracking
    return messageData.messageId;
  }

  // Send typing indicator
  sendTypingIndicator(chatRoomId: string, userId: string, userType: 'Parent' | 'Buddi', isTyping: boolean) {
    if (!this.socket || !this.isConnected) {
      return;
    }

    const typingData: TypingData = {
      chatRoomId,
      userId,
      userType,
      isTyping,
    };

    console.log(`[SocketService] ⌨️ Sending typing indicator:`, typingData);
    this.socket.emit(isTyping ? 'user-typing' : 'user-stopped-typing', typingData);
  }

  // Mark message as read
  markMessageAsRead(chatRoomId: string, messageId: string, userId: string, userType: 'Parent' | 'Buddi') {
    if (!this.socket || !this.isConnected) {
      return;
    }

    console.log(`[SocketService] 👁️ Marking message as read:`, { chatRoomId, messageId, userId, userType });
    this.socket.emit('mark-message-read', {
      chatRoomId,
      messageId,
      userId,
      userType,
    });
  }

  // Enhanced Leave Chat Room
  leaveChatRoom(chatRoomId: string) {
    if (!this.socket || !this.isConnected) {
      console.warn('[SocketService] ⚠️ Socket not connected, cannot leave chat room');
      return;
    }

    console.log(`[SocketService] 🚪 Leaving chat room: ${chatRoomId}`);
    this.socket.emit('leave-chat-room', { chatRoomId });
  }

  // Listen for room joined confirmation
  onRoomJoined(callback: (data: any) => void) {
    this.on('room-joined', callback);
  }

  // Listen for incoming messages
  onReceiveMessage(callback: (data: any) => void) {
    this.on('receive-message', callback);
  }

  // Enhanced event listeners for chat
  onMessageDelivered(callback: (data: any) => void) {
    this.on('message-delivered', callback);
  }

  onMessageRead(callback: (data: any) => void) {
    this.on('message-read', callback);
  }

  onUserTyping(callback: (data: TypingData) => void) {
    this.on('user-typing', callback);
  }

  onUserStoppedTyping(callback: (data: TypingData) => void) {
    this.on('user-stopped-typing', callback);
  }

  onChatRoomStatus(callback: (data: any) => void) {
    this.on('chat-room-status', callback);
  }

  // Emit custom events
  emit(eventName: string, data?: any) {
    if (!this.socket || !this.isConnected) {
      console.warn(`[SocketService] ⚠️ Socket not connected, cannot emit ${eventName}`);
      return;
    }

    console.log(`[SocketService] 📤 Emitting event: ${eventName}`, data);
    this.socket.emit(eventName, data);
  }

  // Add event listener
  on(eventName: string, callback: Function) {
    if (!this.eventListeners.has(eventName)) {
      this.eventListeners.set(eventName, []);
    }
    this.eventListeners.get(eventName)!.push(callback);
    console.log(`[SocketService] 👂 Added listener for event: ${eventName}`);
    console.log(`[SocketService] 📊 Total listeners for ${eventName}: ${this.eventListeners.get(eventName)!.length}`);
    console.log(`[SocketService] 📋 All registered events:`, Array.from(this.eventListeners.keys()));
  }

  // Remove event listener
  off(eventName: string, callback?: Function) {
    if (!callback) {
      this.eventListeners.delete(eventName);
      console.log(`[SocketService] 🗑️ Removed all listeners for event: ${eventName}`);
    } else {
      const listeners = this.eventListeners.get(eventName);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
          console.log(`[SocketService] 🗑️ Removed specific listener for event: ${eventName}`);
        }
      }
    }
  }

  // Trigger event for all listeners
  private triggerEvent(eventName: string, data?: any) {
    console.log(`[SocketService] 🔄 triggerEvent called for: ${eventName}`);
    console.log(`[SocketService] 🔍 Looking for listeners for: ${eventName}`);
    console.log(`[SocketService] 📊 Total registered events:`, Array.from(this.eventListeners.keys()));
    
    const listeners = this.eventListeners.get(eventName);
    if (listeners) {
      console.log(`[SocketService] ✅ Found ${listeners.length} listener(s) for ${eventName}`);
      listeners.forEach((callback, index) => {
        try {
          console.log(`[SocketService] 🔄 Calling listener ${index + 1} for ${eventName}`);
          callback(data);
          console.log(`[SocketService] ✅ Listener ${index + 1} executed successfully`);
        } catch (error) {
          console.error(`[SocketService] ❌ Error in event listener for ${eventName}:`, error);
        }
      });
    } else {
      console.log(`[SocketService] ❌ No listeners found for event: ${eventName}`);
      console.log(`[SocketService] 📋 Available events:`, Array.from(this.eventListeners.keys()));
    }
  }

  private attemptReconnection() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('[SocketService] 🛑 Max reconnection attempts reached');
      return;
    }

    console.log(`[SocketService] 🔄 Attempting reconnection (${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      if (this.socket && !this.isConnected) {
        this.socket.connect();
      }
    }, this.reconnectDelay);

    this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000); // Max 30 seconds
  }

  private handleConnectionError(error: any) {
    console.error('[SocketService] ❌ Connection error:', error);
    this.emit('connection-error', error);
    
    // Attempt reconnection for network errors
    if (error.type === 'TransportError' || error.message?.includes('network')) {
      this.attemptReconnection();
    }
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      console.log('[SocketService] 🔌 Disconnecting socket');
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.userId = null;
      this.userType = null;
      this.eventListeners.clear();
    }
  }

  // Check if socket is connected
  isSocketConnected(): boolean {
    return this.isConnected && this.socket !== null && this.socket.connected;
  }

  // Get socket instance (for advanced usage)
  getSocket(): Socket | null {
    return this.socket;
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      socketId: this.socket?.id,
      userId: this.userId,
      userType: this.userType,
      reconnectAttempts: this.reconnectAttempts,
    };
  }
}

// Export singleton instance
export default new SocketService(); 