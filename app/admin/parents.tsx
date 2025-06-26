import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageHeader from "@/components/commons/PageHeader";

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
    children: [
      { name: "Olivia Brown", age: 7, school: "Oak Elementary" },
    ],
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
        <Text className="font-comfortaa text-gray-600 ml-2">{parent.phone}</Text>
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
          <Text className="font-comfortaa text-xs text-gray-500">Total Pickups</Text>
          <Text className="font-comfortaa-bold text-sm text-gray-700">
            {parent.totalPickups}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="font-comfortaa text-xs text-gray-500">Current Buddi</Text>
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
          <Text className="font-comfortaa text-white ml-2 text-sm">Message</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function AdminParentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filterOptions = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Pending", value: "pending" },
  ];

  const filteredParents = parentsList.filter((parent) => {
    const matchesSearch = parent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         parent.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedFilter === "all") return matchesSearch;
    if (selectedFilter === "active") return matchesSearch && parent.status === "Active";
    if (selectedFilter === "pending") return matchesSearch && parent.status === "Pending";
    
    return matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="transparent" 
        translucent={true}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 20,
        }}
      >
        {/* Header */}
        <View className="pt-6">
          <PageHeader title="Parent Management" />
        </View>

        {/* Stats Cards */}
        <View className="flex-row justify-between px-4 mb-6">
          <View className="bg-white rounded-xl p-4 flex-1 mr-2 border border-gray-100">
            <View className="flex-row items-center mb-2">
              <MaterialIcons name="family-restroom" size={24} color="#8B5CF6" />
              <Text className="ml-2 font-comfortaa-bold text-lg">24</Text>
            </View>
            <Text className="font-comfortaa text-gray-500 text-sm">Total Parents</Text>
          </View>
          <View className="bg-white rounded-xl p-4 flex-1 mx-1 border border-gray-100">
            <View className="flex-row items-center mb-2">
              <MaterialIcons name="child-care" size={24} color="#F59E0B" />
              <Text className="ml-2 font-comfortaa-bold text-lg">38</Text>
            </View>
            <Text className="font-comfortaa text-gray-500 text-sm">Children</Text>
          </View>
          <View className="bg-white rounded-xl p-4 flex-1 ml-2 border border-gray-100">
            <View className="flex-row items-center mb-2">
              <MaterialIcons name="check-circle" size={24} color="#10B981" />
              <Text className="ml-2 font-comfortaa-bold text-lg">21</Text>
            </View>
            <Text className="font-comfortaa text-gray-500 text-sm">Active</Text>
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

        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, marginBottom: 20 }}
        >
          {filterOptions.map((filter) => (
            <TouchableOpacity
              key={filter.value}
              onPress={() => setSelectedFilter(filter.value)}
              className={`mr-3 px-4 py-2 rounded-full ${
                selectedFilter === filter.value ? "bg-primary" : "bg-gray-100"
              }`}
            >
              <Text
                className={`font-comfortaa ${
                  selectedFilter === filter.value ? "text-white" : "text-gray-600"
                }`}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Parents List */}
        {filteredParents.length > 0 ? (
          filteredParents.map((parent) => (
            <ParentCard
              key={parent.id}
              parent={parent}
              onViewDetails={() => console.log("View details for:", parent.name)}
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
              Try adjusting your search or filter criteria
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
}); 