import { Ionicons } from "@expo/vector-icons";
import * as SystemUI from "expo-system-ui";
import React, { useEffect, useState } from "react";
import {
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

const mockMessages = [
  {
    id: "1",
    name: "Haley James",
    message: "Stand up for what you believe in",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    unread: 9,
  },
  {
    id: "2",
    name: "Haley James",
    message: "Stand up for what you believe in",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    unread: 0,
  },
  {
    id: "3",
    name: "Haley James",
    message: "Stand up for what you believe in",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    unread: 9,
  },
  {
    id: "4",
    name: "Haley James",
    message: "Stand up for what you believe in",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    unread: 0,
  },
  {
    id: "5",
    name: "Haley James",
    message: "Stand up for what you believe in",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    unread: 9,
  },
];

const mockChat = [
  {
    id: "1",
    sender: "Brooke",
    text: "Hey Lucas!",
    time: "2 mins ago",
    isMe: false,
  },
  {
    id: "2",
    sender: "Brooke",
    text: "How's your project going?",
    time: "2 mins ago",
    isMe: false,
  },
  {
    id: "3",
    sender: "Lucas",
    text: "Hi Brooke!",
    time: "",
    isMe: true,
  },
  {
    id: "4",
    sender: "Lucas",
    text: "It's going well. Thanks for asking!",
    time: "2 mins ago",
    isMe: true,
  },
  {
    id: "5",
    sender: "Brooke",
    text: "No worries. Let me know if you need any help 😌",
    time: "2 mins ago",
    isMe: false,
  },
  {
    id: "6",
    sender: "Lucas",
    text: "You're the best!",
    time: "2 mins ago",
    isMe: true,
  },
];

interface MessagesProps {
  onChatOpen?: () => void;
  onChatClose?: () => void;
}

const Messages: React.FC<MessagesProps> = ({ onChatOpen, onChatClose }) => {
  const [activeTab, setActiveTab] = useState("Parents");
  const [search, setSearch] = useState("");
  const [selectedChat, setSelectedChat] = useState<null | {
    name: string;
    avatar: string;
  }>(null);
  const insets = useSafeAreaInsets();

  const handleSelectChat = (chat: { name: string; avatar: string }) => {
    setSelectedChat(chat);
    if (onChatOpen) onChatOpen();
  };

  const handleCloseChat = () => {
    setSelectedChat(null);
    if (onChatClose) onChatClose();
  };

  const renderMessage = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.messageRow}
      onPress={() => handleSelectChat({ name: item.name, avatar: item.avatar })}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <View style={styles.rowBetween}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.nameRight}>{item.name}</Text>
        </View>
        <Text style={styles.messageText}>{item.message}</Text>
      </View>
      {item.unread > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{item.unread}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  useEffect(() => {
    if (Platform.OS === "android") {
      if (selectedChat) {
        SystemUI.setBackgroundColorAsync("#FF932E");
      } else {
        SystemUI.setBackgroundColorAsync("#fff");
      }
    }
  }, [selectedChat]);

  if (selectedChat) {
    const inputBarHeight = 56; // matches styles.inputBarRow height
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
        {/* Chat Header */}
        <View style={styles.chatHeaderRow}>
          <TouchableOpacity style={styles.headerIcon} onPress={handleCloseChat}>
            <Ionicons name="arrow-back" size={22} color="#FF932E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{selectedChat.name}</Text>
          <Image
            source={{ uri: selectedChat.avatar }}
            style={styles.chatAvatar}
          />
        </View>
        {/* Chat Messages */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          <FlatList
            data={mockChat}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) =>
              item.isMe ? (
                <View style={styles.myMsgWrap}>
                  <View style={styles.myMsgBubble}>
                    <Text style={styles.myMsgSender}>Lucas</Text>
                    <Text style={styles.myMsgText}>{item.text}</Text>
                  </View>
                  {item.time ? (
                    <Text style={styles.msgTime}>{item.time}</Text>
                  ) : null}
                  <Text style={styles.msgMenu}>...</Text>
                </View>
              ) : (
                <View style={styles.otherMsgWrap}>
                  <View style={styles.otherMsgBubble}>
                    <Text style={styles.otherMsgSender}>{item.sender}</Text>
                    <Text style={styles.otherMsgText}>{item.text}</Text>
                  </View>
                  {item.time ? (
                    <Text style={styles.msgTime}>{item.time}</Text>
                  ) : null}
                  <Text style={styles.msgMenu}>...</Text>
                </View>
              )
            }
            contentContainerStyle={{
              padding: 16,
              paddingBottom: inputBarHeight + insets.bottom,
            }}
            showsVerticalScrollIndicator={false}
          />
          {/* Input Bar */}
          <View
            style={[
              styles.inputBarWrap,
              { paddingBottom: Math.max(insets.bottom, 8) },
            ]}
          >
            <View style={styles.inputBarRow}>
              <TouchableOpacity style={styles.inputAddBtn}>
                <Ionicons name="add" size={24} color="#fff" />
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder="Type a message..."
                placeholderTextColor="#BDBDBD"
              />
              <TouchableOpacity style={styles.inputSendBtn}>
                <Ionicons name="send" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="arrow-back" size={22} color="#FF932E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="ellipsis-horizontal" size={22} color="#FF932E" />
        </TouchableOpacity>
      </View>
      {/* Search */}
      <View style={styles.searchBar}>
        <Ionicons
          name="search"
          size={18}
          color="#BDBDBD"
          style={{ marginLeft: 10 }}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#BDBDBD"
          value={search}
          onChangeText={setSearch}
        />
      </View>
      {/* Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Parents" && styles.activeTab]}
          onPress={() => setActiveTab("Parents")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Parents" && styles.activeTabText,
            ]}
          >
            Parents
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Team" && styles.activeTab]}
          onPress={() => setActiveTab("Team")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Team" && styles.activeTabText,
            ]}
          >
            Team
          </Text>
        </TouchableOpacity>
      </View>
      {/* Message List */}
      <FlatList
        data={mockMessages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 60 : 30,
    paddingBottom: 16,
    backgroundColor: "#fff",
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
    fontSize: 20,
    fontWeight: "600",
    color: "#222",
    fontFamily: "Comfortaa-Bold",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FE",
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    marginLeft: 8,
    color: "#222",
    fontFamily: "Comfortaa-Regular",
  },
  tabsRow: {
    flexDirection: "row",
    backgroundColor: "#F8F9FE",
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 16,
    color: "#BDBDBD",
    fontFamily: "Comfortaa-Bold",
  },
  activeTabText: {
    color: "#222",
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    backgroundColor: "#fff",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    backgroundColor: "#EEE",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
    fontFamily: "Comfortaa-Bold",
  },
  nameRight: {
    fontSize: 13,
    color: "#BDBDBD",
    fontFamily: "Comfortaa-Regular",
  },
  messageText: {
    fontSize: 13,
    color: "#888",
    fontFamily: "Comfortaa-Regular",
    marginTop: 2,
  },
  unreadBadge: {
    backgroundColor: "#2ECC40",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
    paddingHorizontal: 6,
  },
  unreadText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
    fontFamily: "Comfortaa-Bold",
  },
  chatHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 60 : 30,
    paddingBottom: 16,
    backgroundColor: "#fff",
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEE",
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
    marginBottom: 2,
    fontFamily: "Comfortaa-Regular",
  },
  msgMenu: {
    color: "#222",
    fontSize: 18,
    marginLeft: 8,
    marginTop: -18,
    fontFamily: "Comfortaa-Bold",
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
    height: 56,
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
  input: {
    flex: 1,
    fontSize: 16,
    color: "#222",
    fontFamily: "Comfortaa-Regular",
    backgroundColor: "transparent",
    paddingHorizontal: 8,
  },
});

export default Messages;
