import AsyncStorage from '@react-native-async-storage/async-storage';
import { io, Socket } from 'socket.io-client';

// Socket server URL from your configuration
const SOCKET_SERVER_URL = 'https://backend-service-hw1rh.kinsta.app';

// Storage keys for pickup data persistence
const PICKUP_STORAGE_KEYS = {
  AVAILABLE_CALLS: 'pickup_available_calls',
  MATCHED_CALL: 'pickup_matched_call',
  COMPLETED_TRIPS: 'pickup_completed_trips',
  PARENT_PICKUPS: 'parent_pickups',
};

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private pendingRoomJoins: { chatRoomId: string; userId: string; userType: 'Parent' | 'Buddi' }[] = [];

  // Initialize socket connection
  connect(userId: string, userType: 'Parent' | 'Buddi') {
    try {
      console.log('🚀 [SocketService] Connecting to socket server...', { userId, userType });
      
      this.socket = io(SOCKET_SERVER_URL, {
        transports: ['websocket'],
        query: {
          userId,
          userType,
        },
      });

      this.socket.on('connect', () => {
        console.log('🚀 [SocketService] Socket connected:', this.socket?.id);
        this.isConnected = true;
        // Process any pending room joins
        this.pendingRoomJoins.forEach(({ chatRoomId, userId, userType }) => {
          this.joinChatRoom(chatRoomId, userId, userType);
        });
        this.pendingRoomJoins = [];
      });

      this.socket.on('disconnect', () => {
        console.log('🚀 [SocketService] Socket disconnected');
        this.isConnected = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('🚀 [SocketService] Socket connection error:', error);
        this.isConnected = false;
      });

    } catch (error) {
      console.error('🚀 [SocketService] Error initializing socket:', error);
    }
  }

  // Join a chat room
  joinChatRoom(chatRoomId: string, userId: string, userType: 'Parent' | 'Buddi') {
    if (!this.socket || !this.isConnected) {
      console.warn('🚀 [SocketService] Socket not connected, queuing room join:', { chatRoomId, userId, userType });
      this.pendingRoomJoins.push({ chatRoomId, userId, userType });
      return;
    }
    console.log('🚀 [SocketService] Joining chat room:', { chatRoomId, userId, userType });
    this.socket.emit('join-chat-room', {
      chatRoomId,
      userId,
      userType,
    });
  }

  // Send a message
  sendMessage(chatRoomId: string, message: string, senderId: string, senderType: 'Parent' | 'Buddi') {
    if (!this.socket || !this.isConnected) {
      console.error('🚀 [SocketService] Socket not connected');
      return;
    }

    console.log('🚀 [SocketService] Sending message:', { chatRoomId, message, senderId, senderType });
    
    this.socket.emit('send-message', {
      chatRoomId,
      message,
      senderId,
      senderType,
    });
  }

  // Listen for incoming messages
  onReceiveMessage(callback: (data: any) => void) {
    if (!this.socket) {
      console.error('🚀 [SocketService] Socket not initialized');
      return;
    }

    this.socket.on('receive-message', (data) => {
      console.log('🚀 [SocketService] Message received:', data);
      callback(data);
    });
  }

  // Listen for room join confirmation
  onRoomJoined(callback: (data: any) => void) {
    if (!this.socket) {
      console.error('🚀 [SocketService] Socket not initialized');
      return;
    }

    this.socket.on('room-joined', (data) => {
      console.log('🚀 [SocketService] Room joined:', data);
      callback(data);
    });
  }

  // Leave a chat room
  leaveChatRoom(chatRoomId: string) {
    if (!this.socket || !this.isConnected) {
      console.error('🚀 [SocketService] Socket not connected');
      return;
    }

    console.log('🚀 [SocketService] Leaving chat room:', chatRoomId);
    
    this.socket.emit('leave-chat-room', {
      chatRoomId,
    });
  }

  // Pickup-specific event handlers
  onPickupRequested(callback: (data: any) => void) {
    if (!this.socket) {
      console.error('🚀 [SocketService] Socket not initialized');
      return;
    }

    this.socket.on('pickup-requested', (data) => {
      console.log('🚀 [SocketService] Pickup requested event received:', data);
      callback(data);
    });
  }

  onPickupStarted(callback: (data: any) => void) {
    if (!this.socket) {
      console.error('🚀 [SocketService] Socket not initialized');
      return;
    }

    this.socket.on('pickup-started', (data) => {
      console.log('🚀 [SocketService] Pickup started event received:', data);
      callback(data);
    });
  }

  onChildPickedUp(callback: (data: any) => void) {
    if (!this.socket) {
      console.error('🚀 [SocketService] Socket not initialized');
      return;
    }

    this.socket.on('child-picked-up', (data) => {
      console.log('🚀 [SocketService] Child picked up event received:', data);
      callback(data);
    });
  }

  onTripCompleted(callback: (data: any) => void) {
    if (!this.socket) {
      console.error('🚀 [SocketService] Socket not initialized');
      return;
    }

    this.socket.on('trip-completed', (data) => {
      console.log('🚀 [SocketService] Trip completed event received:', data);
      callback(data);
    });
  }

  // Emit pickup events
  emitPickupRequested(pickupData: any) {
    if (!this.socket || !this.isConnected) {
      console.error('🚀 [SocketService] Socket not connected');
      return;
    }

    console.log('🚀 [SocketService] Emitting pickup-requested:', pickupData);
    this.socket.emit('pickup-requested', pickupData);
  }

  emitPickupStarted(pickupData: any) {
    if (!this.socket || !this.isConnected) {
      console.error('🚀 [SocketService] Socket not connected');
      return;
    }

    console.log('🚀 [SocketService] Emitting pickup-started:', pickupData);
    this.socket.emit('pickup-started', pickupData);
  }

  emitChildPickedUp(pickupData: any) {
    if (!this.socket || !this.isConnected) {
      console.error('🚀 [SocketService] Socket not connected');
      return;
    }

    console.log('🚀 [SocketService] Emitting child-picked-up:', pickupData);
    this.socket.emit('child-picked-up', pickupData);
  }

  emitTripCompleted(pickupData: any) {
    if (!this.socket || !this.isConnected) {
      console.error('🚀 [SocketService] Socket not connected');
      return;
    }

    console.log('🚀 [SocketService] Emitting trip-completed:', pickupData);
    this.socket.emit('trip-completed', pickupData);
  }

  // Local storage persistence methods
  async saveAvailableCalls(calls: any[]) {
    try {
      await AsyncStorage.setItem(PICKUP_STORAGE_KEYS.AVAILABLE_CALLS, JSON.stringify(calls));
      console.log('🚀 [SocketService] Saved available calls to storage:', calls.length);
    } catch (error) {
      console.error('🚀 [SocketService] Error saving available calls:', error);
    }
  }

  async getAvailableCalls(): Promise<any[]> {
    try {
      const data = await AsyncStorage.getItem(PICKUP_STORAGE_KEYS.AVAILABLE_CALLS);
      const calls = data ? JSON.parse(data) : [];
      console.log('🚀 [SocketService] Retrieved available calls from storage:', calls.length);
      return calls;
    } catch (error) {
      console.error('🚀 [SocketService] Error getting available calls:', error);
      return [];
    }
  }

  async saveMatchedCall(call: any) {
    try {
      await AsyncStorage.setItem(PICKUP_STORAGE_KEYS.MATCHED_CALL, JSON.stringify(call));
      console.log('🚀 [SocketService] Saved matched call to storage:', call?.id);
    } catch (error) {
      console.error('🚀 [SocketService] Error saving matched call:', error);
    }
  }

  async getMatchedCall(): Promise<any | null> {
    try {
      const data = await AsyncStorage.getItem(PICKUP_STORAGE_KEYS.MATCHED_CALL);
      const call = data ? JSON.parse(data) : null;
      console.log('🚀 [SocketService] Retrieved matched call from storage:', call?.id);
      return call;
    } catch (error) {
      console.error('🚀 [SocketService] Error getting matched call:', error);
      return null;
    }
  }

  async saveCompletedTrips(trips: any[]) {
    try {
      await AsyncStorage.setItem(PICKUP_STORAGE_KEYS.COMPLETED_TRIPS, JSON.stringify(trips));
      console.log('🚀 [SocketService] Saved completed trips to storage:', trips.length);
    } catch (error) {
      console.error('🚀 [SocketService] Error saving completed trips:', error);
    }
  }

  async getCompletedTrips(): Promise<any[]> {
    try {
      const data = await AsyncStorage.getItem(PICKUP_STORAGE_KEYS.COMPLETED_TRIPS);
      const trips = data ? JSON.parse(data) : [];
      console.log('🚀 [SocketService] Retrieved completed trips from storage:', trips.length);
      return trips;
    } catch (error) {
      console.error('🚀 [SocketService] Error getting completed trips:', error);
      return [];
    }
  }

  async saveParentPickups(pickups: any[]) {
    try {
      await AsyncStorage.setItem(PICKUP_STORAGE_KEYS.PARENT_PICKUPS, JSON.stringify(pickups));
      console.log('🚀 [SocketService] Saved parent pickups to storage:', pickups.length);
    } catch (error) {
      console.error('🚀 [SocketService] Error saving parent pickups:', error);
    }
  }

  async getParentPickups(): Promise<any[]> {
    try {
      const data = await AsyncStorage.getItem(PICKUP_STORAGE_KEYS.PARENT_PICKUPS);
      const pickups = data ? JSON.parse(data) : [];
      console.log('🚀 [SocketService] Retrieved parent pickups from storage:', pickups.length);
      return pickups;
    } catch (error) {
      console.error('🚀 [SocketService] Error getting parent pickups:', error);
      return [];
    }
  }

  // Clear all pickup data (called on logout)
  async clearPickupData() {
    try {
      await AsyncStorage.multiRemove([
        PICKUP_STORAGE_KEYS.AVAILABLE_CALLS,
        PICKUP_STORAGE_KEYS.MATCHED_CALL,
        PICKUP_STORAGE_KEYS.COMPLETED_TRIPS,
        PICKUP_STORAGE_KEYS.PARENT_PICKUPS,
      ]);
      console.log('🚀 [SocketService] Cleared all pickup data from storage');
    } catch (error) {
      console.error('🚀 [SocketService] Error clearing pickup data:', error);
    }
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log('🚀 [SocketService] Socket disconnected');
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