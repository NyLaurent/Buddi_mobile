import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
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
}

interface ChatScreenProps {
  chatRoomId: string;
  otherUserName: string;
  otherUserAvatar?: string;
}

const ChatScreen: React.FC<ChatScreenProps> = ({
  chatRoomId,
  otherUserName,
  otherUserAvatar = "https://randomuser.me/api/portraits/men/32.jpg",
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();

  // Initialize socket connection and join room
  useEffect(() => {
    if (!user) {
      Alert.alert("Error", "User not found");
      router.back();
      return;
    }

    // Log the chatRoomId for debugging
    console.log('ChatScreen: chatRoomId =', chatRoomId);

    const userType = user.role === "parent" ? "Parent" : "Buddi";
    const userId = user.userId || "";

    // Connect to socket
    SocketService.connect(userId, userType);

    // Listen for connection events
    const handleConnect = () => {
      setIsConnected(true);
      setIsLoading(false);
      setConnectionError(null);
    };
    const handleDisconnect = () => {
      setIsConnected(false);
      setConnectionError(
        "Lost connection to chat server. Please check your internet and try again."
      );
    };
    const handleConnectError = (error: any) => {
      setIsConnected(false);
      setIsLoading(false);
      setConnectionError(
        "Unable to connect to chat server. Please try again later."
      );
    };
    if (SocketService.getSocket()) {
      SocketService.getSocket()?.on("connect", handleConnect);
      SocketService.getSocket()?.on("disconnect", handleDisconnect);
      SocketService.getSocket()?.on("connect_error", handleConnectError);
    }
    // Join chat room
    SocketService.joinChatRoom(chatRoomId, userId, userType);
    // Listen for room joined confirmation
    SocketService.onRoomJoined((data) => {
      setIsConnected(true);
      setIsLoading(false);
      setConnectionError(null);
    });
    // Listen for incoming messages
    SocketService.onReceiveMessage((data) => {
      // Only add if message is valid and not sent by the current user
      if (data.message && data.senderId !== userId) {
        const newMessage: Message = {
          id: Date.now().toString(),
          text: data.message,
          senderId: data.senderId,
          senderType: data.senderType,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isMe: false,
        };
        setMessages((prev) => [...prev, newMessage]);
      }
    });
    // Cleanup on unmount
    return () => {
      SocketService.leaveChatRoom(chatRoomId);
      if (SocketService.getSocket()) {
        SocketService.getSocket()?.off("connect", handleConnect);
        SocketService.getSocket()?.off("disconnect", handleDisconnect);
        SocketService.getSocket()?.off("connect_error", handleConnectError);
      }
    };
  }, [chatRoomId, user?.userId]);

  // Fetch chat history on mount
  useEffect(() => {
    let isMounted = true;
    setHistoryLoading(true);
    setHistoryError(null);
    ChatService.getChatHistory(chatRoomId)
      .then((history) => {
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
      })
      .catch((err) => {
        if (!isMounted) return;
        if (err.response?.status === 404) {
          // No chat history yet, treat as empty chat
          setMessages([]);
          setHistoryLoading(false);
        } else {
          setHistoryError(err.message || "Failed to load chat history.");
          setHistoryLoading(false);
        }
      });
    return () => {
      isMounted = false;
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

  // Handle sending message
  const handleSendMessage = () => {
    if (!inputMessage.trim() || !user || !isConnected) return;

    const userType = user.role === "parent" ? "Parent" : "Buddi";
    const userId = user.userId || "";

    // Add message to local state immediately for better UX
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage.trim(),
      senderId: userId,
      senderType: userType,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isMe: true,
    };

    setMessages((prev) => [...prev, newMessage]);

    // Send message via socket
    SocketService.sendMessage(
      chatRoomId,
      inputMessage.trim(),
      userId,
      userType
    );

    // Clear input
    setInputMessage("");
  };

  // Handle back navigation
  const handleBackPress = () => {
    router.back();
  };

  // Render individual message
  const renderMessage = ({ item }: { item: Message }) => (
    <View style={item.isMe ? styles.myMsgWrap : styles.otherMsgWrap}>
      <View style={item.isMe ? styles.myMsgBubble : styles.otherMsgBubble}>
        <Text style={item.isMe ? styles.myMsgSender : styles.otherMsgSender}>
          {item.isMe ? user?.firstName || "You" : otherUserName}
        </Text>
        <Text style={item.isMe ? styles.myMsgText : styles.otherMsgText}>
          {item.text}
        </Text>
      </View>
      {item.timestamp && <Text style={styles.msgTime}>{item.timestamp}</Text>}
    </View>
  );

  // Loading or error state
  if (isLoading || historyLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading chat...</Text>
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
            style={{
              marginTop: 24,
              backgroundColor: "#FF932E",
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 12,
            }}
            onPress={() => {
              setIsLoading(true);
              setConnectionError(null);
              setIsConnected(false);
              // Try to reconnect
              const userType = user?.role === "parent" ? "Parent" : "Buddi";
              const userId = user?.userId || "";
              SocketService.connect(userId, userType);
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontFamily: "Comfortaa-Bold",
                fontSize: 16,
              }}
            >
              Retry
            </Text>
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
              <Image
                source={{
                  uri:
                    otherUserAvatar ||
                    "https://randomuser.me/api/portraits/men/32.jpg",
                }}
                style={styles.chatAvatar}
              />
            </View>

            {/* Connection Status */}
            {!isConnected && (
              <View style={styles.connectionStatus}>
                <Text style={styles.connectionText}>Connecting...</Text>
              </View>
            )}

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
            />

            {/* Input Bar - always at the bottom */}
            <View
              style={[
                styles.inputBarWrap,
                { paddingBottom: Math.max(insets.bottom, 8) },
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
                  onChangeText={setInputMessage}
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
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    fontFamily: "Comfortaa-Regular",
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
  },
  myMsgBubble: {
    backgroundColor: "#FF932E",
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 18,
    maxWidth: "80%",
    alignSelf: "flex-end",
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
  },
  otherMsgBubble: {
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 18,
    maxWidth: "80%",
    alignSelf: "flex-start",
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
});

export default ChatScreen;
