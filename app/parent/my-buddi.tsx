import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface BuddiCardProps {
  name: string;
  email: string;
  avatar: string;
  status: "Available" | "Busy" | "Offline";
  rating: number;
  totalTrips: number;
}

const BuddiCard = ({
  name,
  email,
  avatar,
  status,
  rating,
  totalTrips,
}: BuddiCardProps) => {
  const statusColor = {
    Available: "#22C55E",
    Busy: "#F59E0B",
    Offline: "#6B7280",
  };

  return (
    <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
      <View className="flex-row items-center">
        <Image source={{ uri: avatar }} className="w-16 h-16 rounded-full" />
        <View className="ml-4 flex-1">
          <Text className="text-lg font-comfortaa-bold">{name}</Text>
          <Text className="text-gray-500 font-comfortaa">{email}</Text>
          <View className="flex-row items-center mt-1">
            <View
              className="w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: statusColor[status] }}
            />
            <Text className="text-sm text-gray-600">{status}</Text>
          </View>
        </View>
        <TouchableOpacity className="p-2">
          <Ionicons name="ellipsis-vertical" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-between mt-4 pt-4 border-t border-gray-100">
        <View className="items-center">
          <Text className="text-2xl font-comfortaa-bold text-primary">
            {rating}
          </Text>
          <Text className="text-sm text-gray-500">Rating</Text>
        </View>
        <View className="items-center">
          <Text className="text-2xl font-comfortaa-bold text-primary">
            {totalTrips}
          </Text>
          <Text className="text-sm text-gray-500">Total Trips</Text>
        </View>
        <TouchableOpacity className="bg-primary px-4 py-2 rounded-xl">
          <Text className="text-white font-comfortaa">Message</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function MyBuddiScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-2xl font-comfortaa-bold">My Buddis</Text>
          <TouchableOpacity className="flex-row items-center">
            <Text className="text-primary font-comfortaa mr-1">Add New</Text>
            <Ionicons name="add-circle-outline" size={24} color="#FF9100" />
          </TouchableOpacity>
        </View>

        {/* Buddis List */}
        <BuddiCard
          name="Brian Ford"
          email="brianford@kdk.com"
          avatar="https://randomuser.me/api/portraits/men/2.jpg"
          status="Available"
          rating={4.8}
          totalTrips={156}
        />

        <BuddiCard
          name="Sarah Johnson"
          email="sarahj@kdk.com"
          avatar="https://randomuser.me/api/portraits/women/2.jpg"
          status="Busy"
          rating={4.9}
          totalTrips={203}
        />

        <BuddiCard
          name="Michael Brown"
          email="michaelb@kdk.com"
          avatar="https://randomuser.me/api/portraits/men/3.jpg"
          status="Offline"
          rating={4.7}
          totalTrips={89}
        />
      </View>
    </ScrollView>
  );
}
