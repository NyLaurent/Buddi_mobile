import PageHeader from "@/components/commons/PageHeader";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock data for Parents
const parentsList = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 234 567 8901",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    children: [
      { name: "Emma Johnson", age: 8, school: "Lincoln Elementary" },
      { name: "Jake Johnson", age: 10, school: "Lincoln Elementary" },
    ],
    status: "Active",
    joinDate: "Jan 15, 2024",
    totalPickups: 45,
    currentBuddi: "John Smith",
  },
  {
    id: "2",
    name: "Michael Brown",
    email: "michael.brown@email.com",
    phone: "+1 234 567 8902",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    children: [{ name: "Olivia Brown", age: 7, school: "Oak Elementary" }],
    status: "Active",
    joinDate: "Feb 20, 2024",
    totalPickups: 28,
    currentBuddi: "Emma Davis",
  },
  {
    id: "3",
    name: "Jennifer Davis",
    email: "jennifer.davis@email.com",
    phone: "+1 234 567 8903",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    children: [
      { name: "Liam Davis", age: 9, school: "St. Mary's School" },
      { name: "Sofia Davis", age: 6, school: "St. Mary's School" },
    ],
    status: "Pending",
    joinDate: "Mar 10, 2024",
    totalPickups: 12,
    currentBuddi: null,
  },
];

interface AnalyticsCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  borderColor: string;
  iconBgColor: string;
  iconColor: string;
  showMenu?: boolean;
}

const AnalyticsCard = ({
  title,
  value,
  subtitle,
  icon,
  borderColor,
  iconBgColor,
  iconColor,
  showMenu = true,
}: AnalyticsCardProps) => {
  return (
    <View style={[styles.analyticsCard, { borderColor: borderColor }]}>
      {showMenu && (
        <TouchableOpacity style={styles.cardMenu}>
          <Ionicons name="ellipsis-vertical" size={16} color="#8A8A8A" />
        </TouchableOpacity>
      )}

      <Text style={styles.cardTitle}>{title}</Text>

      <View style={styles.cardContent}>
        <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
          <Ionicons name={icon} size={24} color={iconColor} />
        </View>
        <View style={styles.cardStats}>
          <Text style={styles.cardValue}>{value}</Text>
          <Text style={styles.cardSubtitle}>{subtitle}</Text>
        </View>
      </View>
    </View>
  );
};

const ParentCard = ({ parent, onViewDetails, onMessage }) => {
  const statusColor = parent.status === "Active" ? "#10B981" : "#F59E0B";
  const statusBg = parent.status === "Active" ? "#D1FAE5" : "#FEF3C7";

  return (
    <View className="bg-white rounded-xl p-4 mx-4 mb-4 border border-gray-100">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center flex-1">
          <Image
            source={{ uri: parent.image }}
            className="w-12 h-12 rounded-full mr-3"
          />
          <View className="flex-1">
            <Text className="font-comfortaa-bold text-lg text-gray-800">
              {parent.name}
            </Text>
            <Text className="font-comfortaa text-gray-500 text-sm">
              {parent.email}
            </Text>
          </View>
        </View>
        <View
          className="px-3 py-1 rounded-full"
          style={{ backgroundColor: statusBg }}
        >
          <Text
            className="font-comfortaa-bold text-xs"
            style={{ color: statusColor }}
          >
            {parent.status}
          </Text>
        </View>
      </View>

      {/* Phone */}
      <View className="flex-row items-center mb-3">
        <Ionicons name="call" size={16} color="#6B7280" />
        <Text className="font-comfortaa text-gray-600 ml-2">
          {parent.phone}
        </Text>
      </View>

      {/* Children */}
      <View className="mb-3">
        <Text className="font-comfortaa-bold text-sm text-gray-700 mb-2">
          Children ({parent.children.length})
        </Text>
        {parent.children.map((child, index) => (
          <View key={index} className="flex-row items-center mb-1">
            <View className="w-2 h-2 bg-primary rounded-full mr-2" />
            <Text className="font-comfortaa text-gray-600 text-sm flex-1">
              {child.name}, {child.age} years • {child.school}
            </Text>
          </View>
        ))}
      </View>

      {/* Stats */}
      <View className="flex-row items-center justify-between mb-3 bg-gray-50 rounded-lg p-3">
        <View className="flex-1">
          <Text className="font-comfortaa text-xs text-gray-500">Joined</Text>
          <Text className="font-comfortaa-bold text-sm text-gray-700">
            {parent.joinDate}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="font-comfortaa text-xs text-gray-500">
            Total Pickups
          </Text>
          <Text className="font-comfortaa-bold text-sm text-gray-700">
            {parent.totalPickups}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="font-comfortaa text-xs text-gray-500">
            Current Buddi
          </Text>
          <Text className="font-comfortaa-bold text-sm text-gray-700">
            {parent.currentBuddi || "Not Assigned"}
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View className="flex-row items-center gap-2">
        <TouchableOpacity
          onPress={onViewDetails}
          className="flex-1 bg-gray-100 rounded-lg py-2 px-3 flex-row items-center justify-center"
        >
          <Ionicons name="eye-outline" size={16} color="#4B5563" />
          <Text className="font-comfortaa text-gray-700 ml-2 text-sm">
            View Details
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onMessage}
          className="flex-1 bg-primary rounded-lg py-2 px-3 flex-row items-center justify-center"
        >
          <Ionicons name="chatbubble-outline" size={16} color="white" />
          <Text className="font-comfortaa text-white ml-2 text-sm">
            Message
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function AdminParentsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredParents = parentsList.filter((parent) => {
    const matchesSearch =
      parent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parent.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent={false}
        hidden={false}
        animated={true}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 20,
        }}
      >
        {/* Header */}
        <View className="pt-6">
          <PageHeader
            title="Parents Overview"
            showBackButton={true}
            showMenuButton={true}
            onMenuPress={() => console.log("Menu pressed")}
          />
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "all" && styles.activeTab]}
            onPress={() => setActiveTab("all")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "all" && styles.activeTabText,
              ]}
            >
              All Parents
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "background" && styles.activeTab]}
            onPress={() => setActiveTab("background")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "background" && styles.activeTabText,
              ]}
            >
              Background Checks
            </Text>
          </TouchableOpacity>
        </View>

        {/* Analytics Cards - 2x2 Grid */}
        <View style={styles.analyticsGrid}>
          <View style={styles.analyticsRow}>
            <AnalyticsCard
              title="Total Parents"
              value="12"
              subtitle="2 Schools"
              icon="flash"
              borderColor="#3B82F6"
              iconBgColor="#3B82F6"
              iconColor="#ffffff"
            />
            <AnalyticsCard
              title="Pending Approval"
              value="3"
              subtitle="All time"
              icon="shield-checkmark"
              borderColor="#8B5CF6"
              iconBgColor="#8B5CF6"
              iconColor="#ffffff"
            />
          </View>
          <View style={styles.analyticsRow}>
            <AnalyticsCard
              title="Feedbacks by Parents"
              value="3"
              subtitle="Connected"
              icon="people"
              borderColor="#EF4444"
              iconBgColor="#EF4444"
              iconColor="#ffffff"
            />
            <AnalyticsCard
              title="Pending Approval"
              value="2"
              subtitle="2 Schools"
              icon="person"
              borderColor="#A855F7"
              iconBgColor="#A855F7"
              iconColor="#ffffff"
            />
          </View>
        </View>

        {/* Search Bar */}
        <View className="mx-4 mb-4">
          <View className="bg-gray-50 rounded-xl px-4 py-3 flex-row items-center">
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
              placeholder="Search parents by name or email..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 ml-3 font-comfortaa text-gray-700"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Parents List */}
        {activeTab === "all" && (
          <>
            {filteredParents.length > 0 ? (
              filteredParents.map((parent) => (
                <ParentCard
                  key={parent.id}
                  parent={parent}
                  onViewDetails={() =>
                    console.log("View details for:", parent.name)
                  }
                  onMessage={() => console.log("Message:", parent.name)}
                />
              ))
            ) : (
              <View className="bg-white rounded-xl p-8 mx-4 items-center">
                <MaterialIcons name="search-off" size={48} color="#9CA3AF" />
                <Text className="font-comfortaa-bold text-lg text-gray-600 mt-4">
                  No Parents Found
                </Text>
                <Text className="font-comfortaa text-gray-500 text-center mt-2">
                  Try adjusting your search criteria
                </Text>
              </View>
            )}
          </>
        )}

        {/* Background Checks Tab Content */}
        {activeTab === "background" && (
          <View className="bg-white rounded-xl p-8 mx-4 items-center">
            <Ionicons name="document-text-outline" size={48} color="#9CA3AF" />
            <Text className="font-comfortaa-bold text-lg text-gray-600 mt-4">
              Background Checks
            </Text>
            <Text className="font-comfortaa text-gray-500 text-center mt-2">
              Background check management coming soon
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 4,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8A8A8A",
    fontFamily: "Comfortaa-Regular",
  },
  activeTabText: {
    color: "#23272F",
    fontWeight: "600",
  },
  analyticsGrid: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  analyticsRow: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 12,
  },
  analyticsCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    position: "relative",
  },
  cardMenu: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 4,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#23272F",
    fontFamily: "Comfortaa-Regular",
    marginBottom: 16,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardStats: {
    flex: 1,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#23272F",
    fontFamily: "Comfortaa-Bold",
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#8A8A8A",
    fontFamily: "Comfortaa-Regular",
  },
});
