

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import ChatService from "../../services/api/chat.service";
import SocketService from "../../services/socket";

interface Message {
  id: string;
  text: string;
  senderId: string;
  senderType: "Parent" | "Buddi";
  timestamp: string;
  isMe: boolean;
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  messageId?: string; // For tracking delivery status
}

interface ChatScreenProps {
  chatRoomId: string;
  otherUserName: string;
}

const ChatScreen: React.FC<ChatScreenProps> = ({
  chatRoomId,
  otherUserName,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [lastConnectionTime, setLastConnectionTime] = useState<number | null>(
    null
  );
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const connectionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const messageQueueRef = useRef<Message[]>([]);
  const isTypingRef = useRef(false);
  const typingDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();

  const BOTTOM_NAV_HEIGHT = 70; // Height of the bottom nav bar
  const MAX_CONNECTION_ATTEMPTS = 3;
  const CONNECTION_TIMEOUT = 8000; // Reduced from 10s to 8s
  const RECONNECT_DELAY = 2000; // 2 seconds
  const TYPING_DEBOUNCE = 1000; // 1 second typing debounce

  // Initialize socket connection with optimized settings
  useEffect(() => {
    if (!user) {
      Alert.alert("Error", "User not found");
      router.back();
      return;
    }

    console.log(
      "[ChatScreen] 🔌 Initializing chat connection for room:",
      chatRoomId
    );

    const userType = user.role === "parent" ? "Parent" : "Buddi";
    const userId = user.userId || "";

    // Clear any existing timeouts
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    const initializeConnection = () => {
      try {
        // Check if socket is already connected
        if (SocketService.isSocketConnected()) {
          console.log(
            "[ChatScreen] ✅ Socket already connected, joining room directly"
          );
          setIsConnected(true);
          setIsLoading(false);
          setConnectionError(null);
          joinChatRoom();
          return;
        }

        // Connect to socket with optimized settings
        SocketService.connect(userId, userType);

        // Set connection timeout
        connectionTimeoutRef.current = setTimeout(() => {
          if (!isConnected) {
            console.warn("[ChatScreen] ⏰ Connection timeout");
            handleConnectionTimeout();
          }
        }, CONNECTION_TIMEOUT);
      } catch (error) {
        console.error("[ChatScreen] ❌ Failed to connect to socket:", error);
        handleConnectionError(
          "Failed to connect to chat server. Please try again."
        );
      }
    };

    const joinChatRoom = () => {
      console.log("[ChatScreen] 🏠 Joining chat room:", {
        chatRoomId,
        userId,
        userType,
      });
      SocketService.joinChatRoom(chatRoomId, userId, userType);
    };

    const handleConnectionTimeout = () => {
      console.warn("[ChatScreen] ⏰ Connection timeout reached");
      if (connectionAttempts < MAX_CONNECTION_ATTEMPTS) {
        setConnectionAttempts((prev) => prev + 1);
        setConnectionError(
          "Connection is taking longer than expected. Retrying..."
        );

        // Attempt reconnection after delay
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log("[ChatScreen] 🔄 Attempting reconnection...");
          initializeConnection();
        }, RECONNECT_DELAY);
      } else {
        setConnectionError(
          "Unable to establish connection. Please check your internet and try again."
        );
        setIsLoading(false);
      }
    };

    const handleConnectionError = (errorMessage: string) => {
      setConnectionError(errorMessage);
      setIsLoading(false);
      setIsConnected(false);
    };

    // Listen for connection events with optimized handling
    const handleConnect = () => {
      console.log("[ChatScreen] ✅ Socket connected successfully");
      setIsConnected(true);
      setIsLoading(false);
      setConnectionError(null);
      setConnectionAttempts(0);
      setLastConnectionTime(Date.now());

      // Clear connection timeout
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
        connectionTimeoutRef.current = null;
      }

      // Join chat room immediately after connection
      joinChatRoom();
    };

    const handleDisconnect = () => {
      console.log("[ChatScreen] ❌ Socket disconnected");
      setIsConnected(false);
      setConnectionError("Connection lost. Attempting to reconnect...");

      // Attempt reconnection if not at max attempts
      if (connectionAttempts < MAX_CONNECTION_ATTEMPTS) {
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log(
            "[ChatScreen] 🔄 Attempting reconnection after disconnect"
          );
          initializeConnection();
        }, RECONNECT_DELAY);
      }
    };

    const handleConnectError = (error: any) => {
      console.error("[ChatScreen] ❌ Socket connection error:", error);
      setIsConnected(false);
      setIsLoading(false);
      setConnectionError(
        "Connection failed. Please check your internet connection."
      );
    };

    // Set up socket event listeners
    if (SocketService.getSocket()) {
      SocketService.getSocket()?.on("connect", handleConnect);
      SocketService.getSocket()?.on("disconnect", handleDisconnect);
      SocketService.getSocket()?.on("connect_error", handleConnectError);
    }

    // Enhanced chat event listeners
    SocketService.on("room-joined", (data: any) => {
      console.log("[ChatScreen] 🏠 Room joined successfully:", data);
      setIsConnected(true);
      setIsLoading(false);
      setConnectionError(null);

      // Process any queued messages
      if (messageQueueRef.current.length > 0) {
        setMessages((prev) => [...prev, ...messageQueueRef.current]);
        messageQueueRef.current = [];
      }
    });

    // Listen for incoming messages with enhanced handling
    SocketService.on("receive-message", (data: any) => {
      console.log("[ChatScreen] 💬 Message received:", data);
      // Only add if message is valid and not sent by the current user
      if (data.message && data.senderId !== userId) {
        const newMessage: Message = {
          id: data.messageId || Date.now().toString(),
          text: data.message,
          senderId: data.senderId,
          senderType: data.senderType,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isMe: false,
          status: 'delivered',
          messageId: data.messageId,
        };
        
        // Add message immediately if connected, otherwise queue it
        if (isConnected) {
          setMessages((prev) => [...prev, newMessage]);
          
          // Mark message as read automatically
          if (data.messageId) {
            SocketService.markMessageAsRead(chatRoomId, data.messageId, userId, userType);
          }
        } else {
          messageQueueRef.current.push(newMessage);
        }
      }
    });

    // Message delivery confirmation
    SocketService.on("message-delivered", (data: any) => {
      console.log("[ChatScreen] ✅ Message delivered:", data);
      if (data.messageId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.messageId === data.messageId
              ? { ...msg, status: 'delivered' as const }
              : msg
          )
        );
      }
    });

    // Message read confirmation
    SocketService.on("message-read", (data: any) => {
      console.log("[ChatScreen] 👁️ Message read:", data);
      if (data.messageId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.messageId === data.messageId
              ? { ...msg, status: 'read' as const }
              : msg
          )
        );
      }
    });

    // Typing indicators
    SocketService.on("user-typing", (data: any) => {
      if (data.senderId !== userId && data.chatRoomId === chatRoomId) {
        console.log("[ChatScreen] ⌨️ Other user is typing");
        setIsOtherUserTyping(true);
        
        // Clear existing typing timeout
        if (typingTimeout) {
          clearTimeout(typingTimeout);
        }
        
        // Set timeout to stop typing indicator
        const timeout = setTimeout(() => {
          setIsOtherUserTyping(false);
        }, 3000); // Stop typing indicator after 3 seconds
        
        setTypingTimeout(timeout);
      }
    });

    SocketService.on("user-stopped-typing", (data: any) => {
      if (data.senderId !== userId && data.chatRoomId === chatRoomId) {
        console.log("[ChatScreen] 🛑 Other user stopped typing");
        setIsOtherUserTyping(false);
        
        if (typingTimeout) {
          clearTimeout(typingTimeout);
          setTypingTimeout(null);
        }
      }
    });

    // Listen for chat room errors
    SocketService.on("chat-room-error", (data: any) => {
      console.error("[ChatScreen] ❌ Chat room error:", data);
      setConnectionError("Failed to join chat room. Please try again.");
      setIsLoading(false);
    });

    // Initialize connection
    initializeConnection();

    // Cleanup on unmount
    return () => {
      console.log("[ChatScreen] 🧹 Cleaning up chat connection");

      // Clear timeouts
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      if (typingDebounceRef.current) {
        clearTimeout(typingDebounceRef.current);
      }

      // Leave chat room
      SocketService.leaveChatRoom(chatRoomId);

      // Remove socket event listeners
      if (SocketService.getSocket()) {
        SocketService.getSocket()?.off("connect", handleConnect);
        SocketService.getSocket()?.off("disconnect", handleDisconnect);
        SocketService.getSocket()?.off("connect_error", handleConnectError);
      }

      // Remove custom event listeners
      SocketService.off("room-joined");
      SocketService.off("receive-message");
      SocketService.off("chat-room-error");
      SocketService.off("message-delivered");
      SocketService.off("message-read");
      SocketService.off("user-typing");
      SocketService.off("user-stopped-typing");
    };
  }, [chatRoomId, user?.userId]);

  // Fetch chat history with optimized loading
  useEffect(() => {
    let isMounted = true;
    setHistoryLoading(true);
    setHistoryError(null);

    const fetchHistory = async () => {
      try {
        console.log(
          "[ChatScreen] 📚 Fetching chat history for room:",
          chatRoomId
        );
        const history = await ChatService.getChatHistory(chatRoomId);

        if (!isMounted) return;

        // Convert API messages to Message type
        const historyMessages: Message[] = history.map((msg) => ({
          id: msg.id.toString(),
          text: msg.message,
          senderId: msg.senderId,
          senderType: msg.senderType,
          timestamp: new Date(msg.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isMe: !!user && msg.senderId === user.userId ? true : false,
        }));

        setMessages(historyMessages);
        setHistoryLoading(false);
        console.log(
          "[ChatScreen] ✅ Chat history loaded:",
          historyMessages.length,
          "messages"
        );
      } catch (err: any) {
        if (!isMounted) return;

        if (err.response?.status === 404) {
          // No chat history yet, treat as empty chat
          console.log("[ChatScreen] ℹ️ No chat history found (404)");
          setMessages([]);
          setHistoryLoading(false);
        } else {
          console.error("[ChatScreen] ❌ Error fetching chat history:", err);
          setHistoryError(err.message || "Failed to load chat history.");
          setHistoryLoading(false);
        }
      }
    };

    // Add a small delay to prioritize socket connection
    const historyTimeout = setTimeout(() => {
      fetchHistory();
    }, 500);

    return () => {
      isMounted = false;
      clearTimeout(historyTimeout);
    };
  }, [chatRoomId, user?.userId]);

  // Auto-scroll to latest message when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Handle typing indicator
  const handleTyping = (text: string) => {
    setInputMessage(text);
    
    if (!isConnected || !user) return;
    
    const userType = user.role === "parent" ? "Parent" : "Buddi";
    const userId = user.userId || "";
    
    // Clear existing typing debounce
    if (typingDebounceRef.current) {
      clearTimeout(typingDebounceRef.current);
    }
    
    // Send typing indicator
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      SocketService.sendTypingIndicator(chatRoomId, userId, userType, true);
    }
    
    // Set debounce to stop typing indicator
    typingDebounceRef.current = setTimeout(() => {
      isTypingRef.current = false;
      SocketService.sendTypingIndicator(chatRoomId, userId, userType, false);
    }, TYPING_DEBOUNCE);
  };

  // Handle sending message with enhanced features
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !user) {
      Alert.alert("Error", "Please enter a message.");
      return;
    }

    if (!isConnected) {
      Alert.alert(
        "Connection Error",
        "Please wait for connection to be established."
      );
      return;
    }

    const userType = user.role === "parent" ? "Parent" : "Buddi";
    const userId = user.userId || "";
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Stop typing indicator
    if (isTypingRef.current) {
      isTypingRef.current = false;
      SocketService.sendTypingIndicator(chatRoomId, userId, userType, false);
    }

    // Add message to local state immediately for better UX
    const newMessage: Message = {
      id: messageId,
      text: inputMessage.trim(),
      senderId: userId,
      senderType: userType,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isMe: true,
      status: 'sending',
      messageId,
    };

    setMessages((prev) => [...prev, newMessage]);

    try {
      // Send message via socket with enhanced tracking
      const sentMessageId = SocketService.sendMessage(
        chatRoomId,
        inputMessage.trim(),
        userId,
        userType,
        messageId
      );

      // Update message status to sent
      setMessages((prev) =>
        prev.map((msg) =>
          msg.messageId === messageId ? { ...msg, status: 'sent' as const } : msg
        )
      );

      // Clear input only on success
      setInputMessage("");
    } catch (error) {
      console.error("[ChatScreen] Error sending message:", error);
      Alert.alert("Error", "Failed to send message. Please try again.");

      // Update message status to failed
      setMessages((prev) =>
        prev.map((msg) =>
          msg.messageId === messageId ? { ...msg, status: 'failed' as const } : msg
        )
      );
    }
  };

  // Handle back navigation
  const handleBackPress = () => {
    router.back();
  };

  // Handle retry connection
  const handleRetryConnection = () => {
    console.log("[ChatScreen] 🔄 Manual retry connection");
    setConnectionAttempts(0);
    setConnectionError(null);
    setIsLoading(true);
    setIsConnected(false);

    // Force reconnection
    const userType = user?.role === "parent" ? "Parent" : "Buddi";
    const userId = user?.userId || "";
    SocketService.connect(userId, userType);
  };

  // Get user initials
  const getUserInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Render user avatar with initials
  const renderAvatar = (name: string, isMe: boolean) => {
    const initials = getUserInitials(name);
    return (
      <View
        style={[
          styles.avatarContainer,
          isMe ? styles.myAvatar : styles.otherAvatar,
        ]}
      >
        <Text
          style={[
            styles.avatarText,
            isMe ? styles.myAvatarText : styles.otherAvatarText,
          ]}
        >
          {initials}
        </Text>
      </View>
    );
  };

  // Render typing indicator
  const renderTypingIndicator = () => {
    if (!isOtherUserTyping) return null;
    
    return (
      <View style={styles.typingIndicator}>
        <View style={styles.typingBubble}>
          <Text style={styles.typingText}>{otherUserName} is typing...</Text>
          <View style={styles.typingDots}>
            <View style={[styles.typingDot, styles.typingDot1]} />
            <View style={[styles.typingDot, styles.typingDot2]} />
            <View style={[styles.typingDot, styles.typingDot3]} />
          </View>
        </View>
      </View>
    );
  };

  // Render message status indicator
  const renderMessageStatus = (message: Message) => {
    if (!message.isMe || !message.status) return null;
    
    let statusIcon = null;
    let statusColor = '#999';
    
    switch (message.status) {
      case 'sending':
        statusIcon = '⏳';
        statusColor = '#FFA500';
        break;
      case 'sent':
        statusIcon = '✓';
        statusColor = '#999';
        break;
      case 'delivered':
        statusIcon = '✓✓';
        statusColor = '#4CAF50';
        break;
      case 'read':
        statusIcon = '✓✓';
        statusColor = '#2196F3';
        break;
      case 'failed':
        statusIcon = '❌';
        statusColor = '#F44336';
        break;
    }
    
    return (
      <Text style={[styles.messageStatus, { color: statusColor }]}>
        {statusIcon}
      </Text>
    );
  };

  // Render individual message with enhanced features
  const renderMessage = ({ item }: { item: Message }) => (
    <View style={item.isMe ? styles.myMsgWrap : styles.otherMsgWrap}>
      {!item.isMe && renderAvatar(otherUserName, false)}
      <View style={item.isMe ? styles.myMsgBubble : styles.otherMsgBubble}>
        <Text style={item.isMe ? styles.myMsgSender : styles.otherMsgSender}>
          {item.isMe ? user?.firstName || "You" : otherUserName}
        </Text>
        <Text style={item.isMe ? styles.myMsgText : styles.otherMsgText}>
          {item.text}
        </Text>
        {renderMessageStatus(item)}
      </View>
      {item.isMe && renderAvatar(user?.firstName || "You", true)}
      {item.timestamp && <Text style={styles.msgTime}>{item.timestamp}</Text>}
    </View>
  );

  // Connection status indicator
  const renderConnectionStatus = () => {
    if (isConnected) {
      return (
        <View style={styles.connectionStatus}>
          <View style={styles.connectionStatusRow}>
            <View
              style={[styles.connectionDot, { backgroundColor: "#4CAF50" }]}
            />
            <Text style={styles.connectionText}>Connected</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.connectionStatus}>
        <View style={styles.connectionStatusRow}>
          <View
            style={[
              styles.connectionDot,
              {
                backgroundColor: connectionAttempts > 0 ? "#FFA500" : "#FF932E",
              },
            ]}
          />
          <Text style={styles.connectionText}>
            {connectionAttempts > 0
              ? `Reconnecting... (${connectionAttempts}/${MAX_CONNECTION_ATTEMPTS})`
              : "Connecting..."}
          </Text>
          {connectionError && (
            <TouchableOpacity
              onPress={handleRetryConnection}
              style={styles.connectionRetryButton}
            >
              <Text style={styles.connectionRetryText}>Retry</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  // Loading or error state
  if (isLoading || historyLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            {isLoading ? "Connecting to chat..." : "Loading messages..."}
          </Text>
          {connectionAttempts > 0 && (
            <Text style={styles.attemptText}>
              Attempt {connectionAttempts}/{MAX_CONNECTION_ATTEMPTS}
            </Text>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // Only show error page for real errors (not 404/no history)
  if (connectionError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: "#FF3B30" }]}>
            {connectionError}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={handleRetryConnection}
          >
            <Text style={styles.retryButtonText}>Retry Connection</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.bgChatArea}>
            {/* Chat Header */}
            <View style={styles.chatHeaderRow}>
              <TouchableOpacity
                style={styles.headerIcon}
                onPress={handleBackPress}
              >
                <Ionicons name="arrow-back" size={22} color="#FF932E" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>{otherUserName}</Text>
              <View style={[styles.chatAvatar, styles.headerAvatar]}>
                <Text style={styles.headerAvatarText}>
                  {getUserInitials(otherUserName)}
                </Text>
              </View>
            </View>

            {/* Connection Status */}
            {renderConnectionStatus()}

            {/* Chat Messages */}
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={renderMessage}
              contentContainerStyle={[
                styles.messagesContainer,
                { paddingBottom: 16 + insets.bottom },
              ]}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              removeClippedSubviews={true}
              maxToRenderPerBatch={10}
              windowSize={10}
            />

            {/* Typing Indicator */}
            {renderTypingIndicator()}

            {/* Input Bar - always at the bottom */}
            <View
              style={[
                styles.inputBarWrap,
                {
                  paddingBottom: Math.max(insets.bottom, 8) + BOTTOM_NAV_HEIGHT,
                },
              ]}
            >
              <View style={styles.inputBarRow}>
                <TouchableOpacity
                  style={styles.inputAddBtn}
                  disabled={!isConnected}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="add"
                    size={24}
                    color={!isConnected ? "#ccc" : "#fff"}
                  />
                </TouchableOpacity>
                <TextInput
                  style={styles.input}
                  placeholder="Type a message..."
                  placeholderTextColor="#BDBDBD"
                  value={inputMessage}
                  onChangeText={handleTyping}
                  multiline
                  maxLength={500}
                  editable={isConnected}
                  onFocus={() =>
                    setTimeout(
                      () =>
                        flatListRef.current?.scrollToEnd({ animated: true }),
                      100
                    )
                  }
                />
                <TouchableOpacity
                  style={[
                    styles.inputSendBtn,
                    (!inputMessage.trim() || !isConnected) &&
                      styles.inputSendBtnDisabled,
                  ]}
                  onPress={handleSendMessage}
                  disabled={!inputMessage.trim() || !isConnected}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="send"
                    size={20}
                    color={inputMessage.trim() && isConnected ? "#fff" : "#ccc"}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  bgChatArea: {
    flex: 1,
    backgroundColor: "#F8F9FE",
    justifyContent: "flex-end",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    fontFamily: "Comfortaa-Regular",
    textAlign: "center",
  },
  attemptText: {
    fontSize: 14,
    color: "#999",
    fontFamily: "Comfortaa-Regular",
    marginTop: 8,
  },
  retryButton: {
    marginTop: 24,
    backgroundColor: "#FF932E",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: "#fff",
    fontFamily: "Comfortaa-Bold",
    fontSize: 16,
  },
  connectionStatus: {
    backgroundColor: "#FFF3CD",
    padding: 8,
    alignItems: "center",
  },
  connectionText: {
    fontSize: 12,
    color: "#856404",
    fontFamily: "Comfortaa-Regular",
  },
  chatHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 60 : 30,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#FFE7D3",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
    fontFamily: "Comfortaa-Bold",
    flex: 1,
    textAlign: "center",
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEE",
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  myMsgWrap: {
    alignItems: "flex-end",
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  myMsgBubble: {
    backgroundColor: "#FF932E",
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 18,
    maxWidth: "70%",
    marginBottom: 2,
  },
  myMsgSender: {
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "Comfortaa-Bold",
    fontSize: 13,
    marginBottom: 2,
  },
  myMsgText: {
    color: "#fff",
    fontFamily: "Comfortaa-Regular",
    fontSize: 15,
  },
  otherMsgWrap: {
    alignItems: "flex-start",
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  otherMsgBubble: {
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 18,
    maxWidth: "70%",
    marginBottom: 2,
  },
  otherMsgSender: {
    color: "#222",
    fontWeight: "bold",
    fontFamily: "Comfortaa-Bold",
    fontSize: 13,
    marginBottom: 2,
  },
  otherMsgText: {
    color: "#222",
    fontFamily: "Comfortaa-Regular",
    fontSize: 15,
  },
  msgTime: {
    color: "#888",
    fontSize: 12,
    marginTop: 2,
    fontFamily: "Comfortaa-Regular",
  },
  inputBarWrap: {
    backgroundColor: "#fff",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  inputBarRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FE",
    borderRadius: 32,
    paddingHorizontal: 8,
    minHeight: 56,
    maxHeight: 120,
  },
  inputAddBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FF932E",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  inputSendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FF932E",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  inputSendBtnDisabled: {
    backgroundColor: "#E0E0E0",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#222",
    fontFamily: "Comfortaa-Regular",
    backgroundColor: "transparent",
    paddingHorizontal: 8,
    paddingVertical: 8,
    maxHeight: 80,
  },
  connectionStatusRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  connectionRetryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  connectionRetryText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
  },
  myAvatar: {
    backgroundColor: "#FF932E",
  },
  otherAvatar: {
    backgroundColor: "#E0E0E0",
  },
  avatarText: {
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "Comfortaa-Bold",
  },
  myAvatarText: {
    color: "#FFFFFF",
  },
  otherAvatarText: {
    color: "#666666",
  },
  headerAvatar: {
    backgroundColor: "#FF932E",
    alignItems: "center",
    justifyContent: "center",
  },
  headerAvatarText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Comfortaa-Bold",
  },
  typingIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  typingBubble: {
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    maxWidth: '70%',
  },
  typingText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Comfortaa-Regular',
    marginBottom: 4,
  },
  typingDots: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  typingDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 1,
    backgroundColor: '#999',
  },
  typingDot1: {
    opacity: 0.4,
  },
  typingDot2: {
    opacity: 0.7,
  },
  typingDot3: {
    opacity: 1,
  },
  messageStatus: {
    fontSize: 10,
    marginTop: 2,
    fontFamily: 'Comfortaa-Regular',
    textAlign: 'right',
  },
});

export default ChatScreen;
