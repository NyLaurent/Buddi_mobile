# Enhanced Chat Functionality Guide

## Overview

The enhanced chat system provides real-time communication between parents and buddis with advanced features like typing indicators, message delivery status tracking, and automatic event handling. This system is built on top of WebSocket connections for optimal performance and user experience.

## Features

### 🚀 Real-Time Messaging
- Instant message delivery via WebSocket
- Automatic reconnection on connection loss
- Message queuing when offline

### ⌨️ Typing Indicators
- Shows when the other user is typing
- Debounced typing detection (1 second)
- Automatic timeout after 3 seconds

### 📊 Message Status Tracking
- **Sending**: Message is being sent
- **Sent**: Message sent to server
- **Delivered**: Message delivered to recipient
- **Read**: Message read by recipient
- **Failed**: Message failed to send

### 🔄 Automatic Event Handling
- Automatic room joining
- Message read confirmation
- Connection status monitoring
- Error handling and recovery

## Socket Events

### Core Chat Events

#### 1. Join Chat Room
```typescript
// Join a specific chat room
SocketService.joinChatRoom(chatRoomId, userId, userType);

// Example
SocketService.joinChatRoom("parent123-buddi456", "buddi456", "Buddi");
```

**Event**: `join-chat-room`
**Data Structure**:
```json
{
  "chatRoomId": "parent123-buddi456",
  "userId": "buddi456",
  "userType": "Buddi"
}
```

#### 2. Send Message
```typescript
// Send a message to the chat room
const messageId = SocketService.sendMessage(chatRoomId, message, senderId, senderType, messageId?);

// Example
const messageId = SocketService.sendMessage(
  "parent123-buddi456",
  "Hello! How are you?",
  "buddi456",
  "Buddi"
);
```

**Event**: `send-message`
**Data Structure**:
```json
{
  "chatRoomId": "parent123-buddi456",
  "message": "Hello! How are you?",
  "senderId": "buddi456",
  "senderType": "Buddi",
  "messageId": "msg_1703123456789_abc123def"
}
```

#### 3. Receive Message
```typescript
// Listen for incoming messages
SocketService.on("receive-message", (data) => {
  console.log("New message:", data.message);
  // Handle the message
});
```

**Event**: `receive-message`
**Data Structure**:
```json
{
  "message": "Hello! How are you?",
  "senderId": "buddi456",
  "senderType": "Buddi",
  "timestamp": "2023-12-21T10:30:00Z",
  "messageId": "msg_1703123456789_abc123def"
}
```

### Advanced Features

#### 4. Typing Indicators
```typescript
// Send typing indicator
SocketService.sendTypingIndicator(chatRoomId, userId, userType, true);

// Stop typing indicator
SocketService.sendTypingIndicator(chatRoomId, userId, userType, false);
```

**Events**: `user-typing`, `user-stopped-typing`
**Data Structure**:
```json
{
  "chatRoomId": "parent123-buddi456",
  "userId": "buddi456",
  "userType": "Buddi",
  "isTyping": true
}
```

#### 5. Message Status Tracking
```typescript
// Mark message as read
SocketService.markMessageAsRead(chatRoomId, messageId, userId, userType);

// Listen for delivery confirmation
SocketService.on("message-delivered", (data) => {
  console.log("Message delivered:", data.messageId);
});

// Listen for read confirmation
SocketService.on("message-read", (data) => {
  console.log("Message read:", data.messageId);
});
```

**Events**: `message-delivered`, `message-read`
**Data Structure**:
```json
{
  "chatRoomId": "parent123-buddi456",
  "messageId": "msg_1703123456789_abc123def",
  "userId": "parent123",
  "userType": "Parent"
}
```

#### 6. Room Management
```typescript
// Leave chat room
SocketService.leaveChatRoom(chatRoomId);

// Listen for room events
SocketService.on("room-joined", (data) => {
  console.log("Joined room:", data);
});

SocketService.on("room-left", (data) => {
  console.log("Left room:", data);
});
```

## Implementation Examples

### Basic Chat Setup

```typescript
import React, { useEffect, useState } from 'react';
import SocketService from '../services/socket';

const ChatComponent = ({ chatRoomId, userId, userType }) => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect to socket
    SocketService.connect(userId, userType);

    // Listen for connection
    SocketService.on('connection-established', () => {
      setIsConnected(true);
      // Join chat room
      SocketService.joinChatRoom(chatRoomId, userId, userType);
    });

    // Listen for messages
    SocketService.on('receive-message', (data) => {
      setMessages(prev => [...prev, data]);
    });

    // Cleanup
    return () => {
      SocketService.leaveChatRoom(chatRoomId);
      SocketService.off('connection-established');
      SocketService.off('receive-message');
    };
  }, [chatRoomId, userId, userType]);

  const sendMessage = (text) => {
    if (!isConnected) return;
    
    const messageId = SocketService.sendMessage(chatRoomId, text, userId, userType);
    console.log('Message sent with ID:', messageId);
  };

  return (
    <div>
      {/* Chat UI */}
    </div>
  );
};
```

### Advanced Chat with Typing Indicators

```typescript
const AdvancedChat = ({ chatRoomId, userId, userType }) => {
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  useEffect(() => {
    // Listen for typing indicators
    SocketService.on('user-typing', (data) => {
      if (data.senderId !== userId) {
        setIsTyping(true);
        
        // Auto-hide after 3 seconds
        if (typingTimeout) clearTimeout(typingTimeout);
        const timeout = setTimeout(() => setIsTyping(false), 3000);
        setTypingTimeout(timeout);
      }
    });

    SocketService.on('user-stopped-typing', (data) => {
      if (data.senderId !== userId) {
        setIsTyping(false);
        if (typingTimeout) {
          clearTimeout(typingTimeout);
          setTypingTimeout(null);
        }
      }
    });

    return () => {
      if (typingTimeout) clearTimeout(typingTimeout);
      SocketService.off('user-typing');
      SocketService.off('user-stopped-typing');
    };
  }, [userId]);

  const handleTyping = (text) => {
    // Send typing indicator with debouncing
    if (!isTyping) {
      SocketService.sendTypingIndicator(chatRoomId, userId, userType, true);
    }
    
    // Debounce typing indicator
    setTimeout(() => {
      SocketService.sendTypingIndicator(chatRoomId, userId, userType, false);
    }, 1000);
  };

  return (
    <div>
      {isTyping && <div>Other user is typing...</div>}
      <input onChange={(e) => handleTyping(e.target.value)} />
    </div>
  );
};
```

### Message Status Tracking

```typescript
const MessageWithStatus = ({ message }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'sending': return '⏳';
      case 'sent': return '✓';
      case 'delivered': return '✓✓';
      case 'read': return '✓✓';
      case 'failed': return '❌';
      default: return '';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'sending': return '#FFA500';
      case 'sent': return '#999';
      case 'delivered': return '#4CAF50';
      case 'read': return '#2196F3';
      case 'failed': return '#F44336';
      default: return '#999';
    }
  };

  return (
    <div className="message">
      <div className="message-text">{message.text}</div>
      {message.isMe && (
        <div 
          className="message-status"
          style={{ color: getStatusColor(message.status) }}
        >
          {getStatusIcon(message.status)}
        </div>
      )}
    </div>
  );
};
```

## Best Practices

### 1. Connection Management
- Always check connection status before sending messages
- Implement automatic reconnection logic
- Handle connection errors gracefully

### 2. Event Cleanup
- Remove event listeners when component unmounts
- Clear timeouts and intervals
- Leave chat rooms properly

### 3. Message Handling
- Use unique message IDs for tracking
- Implement message queuing for offline scenarios
- Handle message delivery failures

### 4. Performance Optimization
- Debounce typing indicators
- Limit message history loading
- Use efficient data structures

### 5. Error Handling
- Implement retry mechanisms
- Show user-friendly error messages
- Log errors for debugging

## Troubleshooting

### Common Issues

#### 1. Messages Not Sending
- Check socket connection status
- Verify chat room ID format
- Ensure user authentication

#### 2. Typing Indicators Not Working
- Check event listener setup
- Verify debouncing logic
- Ensure proper cleanup

#### 3. Connection Drops
- Implement reconnection logic
- Check network status
- Verify server availability

#### 4. Message Status Not Updating
- Check event listener registration
- Verify message ID matching
- Ensure proper cleanup

### Debug Tips

```typescript
// Enable debug logging
SocketService.on('connection-established', () => {
  console.log('✅ Connected to chat server');
});

SocketService.on('receive-message', (data) => {
  console.log('💬 Message received:', data);
});

// Check connection status
console.log('Connection status:', SocketService.getConnectionStatus());
console.log('Socket instance:', SocketService.getSocket());
```

## Server-Side Implementation

The server should handle these events:

```javascript
// Socket.IO server example
io.on('connection', (socket) => {
  // Join chat room
  socket.on('join-chat-room', (data) => {
    socket.join(data.chatRoomId);
    socket.to(data.chatRoomId).emit('room-joined', data);
  });

  // Handle messages
  socket.on('send-message', (data) => {
    // Broadcast to room
    socket.to(data.chatRoomId).emit('receive-message', data);
    
    // Send delivery confirmation
    socket.emit('message-delivered', {
      messageId: data.messageId,
      chatRoomId: data.chatRoomId
    });
  });

  // Handle typing indicators
  socket.on('user-typing', (data) => {
    socket.to(data.chatRoomId).emit('user-typing', data);
  });

  // Handle message read
  socket.on('mark-message-read', (data) => {
    socket.to(data.chatRoomId).emit('message-read', data);
  });
});
```

## Conclusion

The enhanced chat system provides a robust, real-time communication experience with advanced features that improve user engagement and provide clear feedback about message status. By following the patterns and best practices outlined in this guide, you can implement a professional-grade chat system that rivals popular messaging applications.

For additional support or questions, refer to the codebase examples or create an issue in the project repository.
