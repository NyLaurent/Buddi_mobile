import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import BuddiService, { AvailableCall } from "../../services/api/buddi.service";

interface ChatItem {
  id: string;
  roomId: string;
  otherUserName: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

export default function BuddiMessagesScreen() {
  const [chatItems, setChatItems] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, buddiDetails } = useAuth();
  const [unreadMap, setUnreadMap] = useState<{ [roomId: string]: boolean }>({});

  useEffect(() => {
    fetchMatchedCalls();
  }, [buddiDetails?.id]);

  const fetchMatchedCalls = async () => {
    if (!buddiDetails?.id) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);

      // Fetch 
      //  using the new API
      const response = await BuddiService.getMatchedRequests(buddiDetails.id);
      const matchedCalls = response.data || [];

      const chatItemsData: ChatItem[] = matchedCalls.map(
        (call: AvailableCall) => ({
          id: call.id.toString(),
          roomId: `${call.parentId}-${call.matchedBuddiId}`,
          otherUserName: "Parent", // Placeholder, can fetch real name if needed
          lastMessage: "Tap to start chatting about pickup details",
          timestamp: new Date(call.updatedAt).toLocaleDateString(),
          unreadCount: 0,
        })
      );

      setChatItems(chatItemsData);
    } catch (err: any) {
      setError(err.message || "Failed to fetch messages");
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to get last seen timestamp for a chat room
  const getLastSeen = async (roomId: string, buddiId: number) => {
    return AsyncStorage.getItem(`lastSeen_${roomId}_${buddiId}`);
  };

  // Helper to set last seen timestamp for a chat room
  const setLastSeen = async (
    roomId: string,
    buddiId: number,
    timestamp: string
  ) => {
    await AsyncStorage.setItem(`lastSeen_${roomId}_${buddiId}`, timestamp);
  };

  // Update unread status for all chats
  const updateUnreadStatus = async (chatItems: ChatItem[]) => {
    if (!buddiDetails?.id) return;
    const map: { [roomId: string]: boolean } = {};
    for (const chat of chatItems) {
      const lastSeen = await getLastSeen(chat.roomId, buddiDetails.id);
      map[chat.roomId] =
        !lastSeen || new Date(chat.timestamp) > new Date(lastSeen);
    }
    setUnreadMap(map);
  };

  // Update unread status whenever chatItems change
  useEffect(() => {
    updateUnreadStatus(chatItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatItems, buddiDetails?.id]);

  // Store latest message timestamp for each chat room for unread bubble in nav
  useEffect(() => {
    if (!buddiDetails?.id) return;
    chatItems.forEach((chat) => {
      AsyncStorage.setItem(`latestMsg_${chat.roomId}`, chat.timestamp);
    });
  }, [chatItems, buddiDetails?.id]);

  // When user opens a chat, mark as read
  const handleChatPress = async (chatItem: ChatItem) => {
    if (buddiDetails?.id) {
      await setLastSeen(chatItem.roomId, buddiDetails.id, chatItem.timestamp);
      setUnreadMap((prev) => ({ ...prev, [chatItem.roomId]: false }));
    }
    router.push({
      pathname: "/buddi/chat/[roomId]",
      params: {
        roomId: chatItem.roomId,
        parentName: chatItem.otherUserName,
      },
    });
  };

  const handleBackPress = () => {
    router.back();
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
  const renderAvatar = (name: string) => {
    const initials = getUserInitials(name);
    return (
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
    );
  };

  const renderChatItem = ({ item }: { item: ChatItem }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => handleChatPress(item)}
      activeOpacity={0.7}
    >
      {renderAvatar(item.otherUserName)}
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{item.otherUserName}</Text>
          <Text style={styles.chatTime}>{item.timestamp}</Text>
        </View>
        <Text style={styles.lastMessage} numberOfLines={2}>
          {item.lastMessage}
        </Text>
      </View>
      {unreadMap[item.roomId] && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>●</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <FontAwesome5 name="comments" size={64} color="#E5E7EB" />
      <Text style={styles.emptyTitle}>No Messages Yet</Text>
      <Text style={styles.emptyText}>
        You&apos;ll see your chat conversations here once you have matched
        calls.
      </Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.emptyContainer}>
      <FontAwesome5 name="exclamation-triangle" size={64} color="#F59E0B" />
      <Text style={styles.emptyTitle}>Something went wrong</Text>
      <Text style={styles.emptyText}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={fetchMatchedCalls}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF932E" />
          <Text style={styles.loadingText}>Loading messages...</Text>
        </View>
      ) : error ? (
        renderErrorState()
      ) : chatItems.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={chatItems}
          keyExtractor={(item) => item.id}
          renderItem={renderChatItem}
          contentContainerStyle={styles.chatList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 20,
    color: "#333",
    flex: 1,
  },
  headerSpacer: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  loadingText: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 16,
    color: "#666",
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 20,
    color: "#333",
    marginTop: 16,
    textAlign: "center" as const,
  },
  emptyText: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    textAlign: "center" as const,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: "#FF932E",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  retryButtonText: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 14,
    color: "#fff",
  },
  chatList: {
    paddingTop: 8,
  },
  chatItem: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: "#E0E0E0",
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  avatarText: {
    color: "#666666",
    fontSize: 16,
    fontWeight: "bold" as const,
    fontFamily: "Comfortaa-Bold",
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: 4,
  },
  chatName: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 16,
    color: "#333",
  },
  chatTime: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 12,
    color: "#666",
  },
  lastMessage: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 14,
    color: "#666",
    lineHeight: 18,
  },
  unreadBadge: {
    backgroundColor: "#FF932E",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginLeft: 8,
    paddingHorizontal: 6,
  },
  unreadText: {
    color: "#fff",
    fontWeight: "bold" as const,
    fontSize: 12,
    fontFamily: "Comfortaa-Bold",
  },
};
