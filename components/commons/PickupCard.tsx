// app/components/PickupCard.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface PickupCardProps {
  name: string;
  time: string;
  days: string;
  school: string;
  home: string;
  onViewDetails: () => void;
  onButtonPress: () => void;
}

const PickupCard = ({
  name,
  time,
  days,
  school,
  home,
  onViewDetails,
  onButtonPress,
}: PickupCardProps) => (
  <View className="bg-white rounded-2xl p-4 mr-3 border border-[#E8E8E8] w-[300px]">
    <View className="flex-row justify-between items-center mb-3">
      <Text className="text-base font-comfortaa-bold text-[#222]">{name}</Text>
      <TouchableOpacity className="flex-row items-center">
        <Text className="text-primary font-comfortaa-medium text-sm mr-1">
          Request Coverage
        </Text>
        <Ionicons name="chevron-forward" size={16} color="#FF932E" />
      </TouchableOpacity>
    </View>

    <View className="flex-row items-center mb-3">
      <Text className="text-primary font-comfortaa-bold text-base mr-3">
        {time}
      </Text>
      <View className="bg-[#F5F5F5] px-3 py-1 rounded-xl">
        <Text className="text-gray-500 font-comfortaa text-sm">{days}</Text>
      </View>
    </View>

    <View className="mb-4">
      <View className="flex-row items-center mb-2">
        <Ionicons name="school" size={16} color="#666" />
        <Text className="ml-2 text-gray-500 font-comfortaa text-sm">
          {school}
        </Text>
      </View>
      <View className="flex-row items-center">
        <Ionicons name="home" size={16} color="#666" />
        <Text className="ml-2 text-gray-500 font-comfortaa text-sm">
          {home}
        </Text>
      </View>
    </View>

    <View className="flex-row justify-between items-center">
      <TouchableOpacity
        className="flex-row items-center bg-[#F5F5F5] py-2 px-3 rounded-xl"
        onPress={onViewDetails}
      >
        <Text className="text-gray-500 font-comfortaa text-sm mr-1">
          View Details
        </Text>
        <Ionicons name="chevron-forward" size={16} color="#666" />
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-primary py-2.5 px-6 rounded-xl flex-row items-center gap-2"
        onPress={onButtonPress}
      >
        <Ionicons name="time-outline" size={18} color="white" />
        <Text className="text-white font-comfortaa-medium text-sm">
          Clock in
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default PickupCard;
