import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

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

const Messages = () => {
  const [activeTab, setActiveTab] = useState("Parents");
  const [search, setSearch] = useState("");

  const renderMessage = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.messageRow}>
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
});

export default Messages;
