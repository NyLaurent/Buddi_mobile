import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
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

    const userType = user.role === "parent" ? "Parent" : "Buddi";
    
    // Connect to socket
    SocketService.connect(user.userId, userType);

    // Listen for connection events
    const handleConnect = () => {
      setIsConnected(true);
      setIsLoading(false);
      setConnectionError(null);
    };
    const handleDisconnect = () => {
      setIsConnected(false);
      setConnectionError('Lost connection to chat server. Please check your internet and try again.');
    };
    const handleConnectError = (error: any) => {
      setIsConnected(false);
      setIsLoading(false);
      setConnectionError('Unable to connect to chat server. Please try again later.');
    };
    if (SocketService.getSocket()) {
      SocketService.getSocket()?.on('connect', handleConnect);
      SocketService.getSocket()?.on('disconnect', handleDisconnect);
      SocketService.getSocket()?.on('connect_error', handleConnectError);
    }
    // Join chat room
    SocketService.joinChatRoom(chatRoomId, user.userId, userType);
    // Listen for room joined confirmation
    SocketService.onRoomJoined((data) => {
      setIsConnected(true);
      setIsLoading(false);
      setConnectionError(null);
    });
    // Listen for incoming messages
    SocketService.onReceiveMessage((data) => {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: data.message,
        senderId: data.senderId,
        senderType: data.senderType,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: data.senderId === user.userId,
      };
      setMessages(prev => [...prev, newMessage]);
    });
    // Cleanup on unmount
    return () => {
      SocketService.leaveChatRoom(chatRoomId);
      if (SocketService.getSocket()) {
        SocketService.getSocket()?.off('connect', handleConnect);
        SocketService.getSocket()?.off('disconnect', handleDisconnect);
        SocketService.getSocket()?.off('connect_error', handleConnectError);
      }
    };
  }, [chatRoomId, user]);

  // Handle sending message
  const handleSendMessage = () => {
    if (!inputMessage.trim() || !user || !isConnected) return;

    const userType = user.role === "parent" ? "Parent" : "Buddi";

    // Add message to local state immediately for better UX
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage.trim(),
      senderId: user.userId,
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
      user.userId,
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
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Connecting to chat...</Text>
        </View>
      </SafeAreaView>
    );
  }
  if (connectionError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: '#FF3B30' }]}>{connectionError}</Text>
          <TouchableOpacity
            style={{ marginTop: 24, backgroundColor: '#FF932E', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 }}
            onPress={() => {
              setIsLoading(true);
              setConnectionError(null);
              setIsConnected(false);
              // Try to reconnect
              const userType = user?.role === 'parent' ? 'Parent' : 'Buddi';
              SocketService.connect(user?.userId, userType);
            }}
          >
            <Text style={{ color: '#fff', fontFamily: 'Comfortaa-Bold', fontSize: 16 }}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      {/* Chat Header */}
      <View style={styles.chatHeaderRow}>
        <TouchableOpacity style={styles.headerIcon} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={22} color="#FF932E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{otherUserName}</Text>
        <Image source={{ uri: otherUserAvatar }} style={styles.chatAvatar} />
      </View>

      {/* Connection Status */}
      {!isConnected && (
        <View style={styles.connectionStatus}>
          <Text style={styles.connectionText}>Connecting...</Text>
        </View>
      )}

      {/* Chat Messages */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.chatContainer}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={[
            styles.messagesContainer,
            { paddingBottom: 80 + insets.bottom },
          ]}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        {/* Input Bar */}
        <View
          style={[
            styles.inputBarWrap,
            { paddingBottom: Math.max(insets.bottom, 8) },
          ]}
        >
          <View style={styles.inputBarRow}>
            <TouchableOpacity style={styles.inputAddBtn} disabled={!isConnected}>
              <Ionicons name="add" size={24} color={!isConnected ? "#ccc" : "#fff"} />
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
            />
            <TouchableOpacity 
              style={[
                styles.inputSendBtn,
                (!inputMessage.trim() || !isConnected) && styles.inputSendBtnDisabled
              ]}
              onPress={handleSendMessage}
              disabled={!inputMessage.trim() || !isConnected}
            >
              <Ionicons 
                name="send" 
                size={20} 
                color={inputMessage.trim() && isConnected ? "#fff" : "#ccc"} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  },
  myMsgWrap: {
    alignItems: "flex-end",
    marginBottom: 12,
  },
  myMsgBubble: {
    backgroundColor: "#FF932E",
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 16,
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
    marginBottom: 12,
  },
  otherMsgBubble: {
    backgroundColor: "#F8F9FE",
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 16,
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
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
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
