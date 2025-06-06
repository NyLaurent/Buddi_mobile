import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const NoBuddiesReceivedCard: React.FC = () => (
  <View className="bg-white rounded-2xl border border-gray px-4 py-5 my-3 w-full max-w-[420px] self-center">
    {/* Top section */}
    <View className="mb-2">
      <Text className="text-xs text-grayText font-comfortaa mb-2">Buddi</Text>
      <View className="flex-row items-center justify-between bg-[#F8F9FE] rounded-xl px-3 py-2">
        <View className="flex-row items-center">
          <View className="w-8 h-8 rounded-full bg-gray items-center justify-center mr-2">
            <Ionicons name="person" size={20} color="#D1D5DB" />
          </View>
          <View className="w-20 h-3 rounded-full bg-gray" />
        </View>
        <View className="flex-row items-center">
          <View className="w-6 h-6 rounded-full bg-gray items-center justify-center">
            <Text className="text-xs text-grayText font-comfortaa">1</Text>
          </View>
        </View>
      </View>
    </View>
    {/* No Buddis Received message */}
    <View className="mt-4 bg-[#F8F9FE] rounded-full py-4 items-center flex-row justify-center">
      <Text className="text-grayText font-comfortaa-bold text-lg mr-2">
        No Buddis Received Yet!
      </Text>
      <Ionicons name="help-circle-outline" size={20} color="#858C95" />
    </View>
  </View>
);

export default NoBuddiesReceivedCard; 