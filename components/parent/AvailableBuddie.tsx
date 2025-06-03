import {
  Feather,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { buddieCardData } from "../../data/data";

const AvailableBuddie = () => {
  const data = buddieCardData;
  return (
    <View className="bg-white rounded-2xl border border-gray px-4 py-5 my-3  w-full max-w-[420px] self-center">
      {/* Top: Profile and Status/Message */}
      <View className="flex-row w-full mb-2">
        {/* Profile */}
        <View className="w-1/3 items-center justify-start">
          <Image
            source={{ uri: data.profileImage }}
            className="w-24 h-24 rounded-full border-2 border-gray"
          />
          <Text className="text-lg font-comfortaa-bold  mt-2">{data.name}</Text>
          <View>
            <Text className="text-xs text-gray-400 font-comfortaa mt-1 w-full">
              {data.email}
            </Text>
          </View>

          <View className="flex-row items-center justify-center space-x-2 mt-2">
            <Feather name="phone" size={16} color="#6B7280" />
            <Text className="text-xs text-gray-500 font-comfortaa">
              {data.phone}
            </Text>
          </View>
        </View>
        {/* Status and Message */}
        <View className="w-2/3 pl-4">
          <View className="flex-row justify-end items-center space-x-3 mb-2">
            <View className="bg-green px-4 py-1 rounded-full flex-row items-center">
              <Text className="text-white text-xs font-comfortaa-bold">
                {data.status}
              </Text>
            </View>
            <TouchableOpacity className="ml-2">
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={26}
                color="#FF9100"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* School Name (full width) */}
      <View className="flex-row items-center w-full mb-2">
        <Ionicons name="location" size={20} color="#22C55E" />
        <Text className="text-[13px] text-gray-400 font-comfortaa ml-2">
          School
        </Text>
        <Text className="text-base font-comfortaa-bold text-gray-900 ml-2">
          {data.school.name}
        </Text>
      </View>
      {/* Home Section (full width) */}
      <View className="flex-row items-center w-full mb-2">
        <MaterialIcons name="home" size={20} color="#FF9100" />
        <Text className="text-[13px] text-gray-400 font-comfortaa ml-2">
          Home
        </Text>
        <Text className="text-base font-comfortaa-bold text-gray-900 ml-2">
          {data.home.name}
        </Text>
      </View>
      {/* School, Name Row (full width) */}
      <View className="flex-row items-center w-full mb-2">
        <MaterialIcons name="school" size={18} color="#232B3A" />
        <Text className="text-xs text-gray-500 font-comfortaa ml-2">
          {data.schoolName}
        </Text>
      </View>
      {/* Rating and Fee Row */}
      <View className="flex-row items-center justify-between w-full mt-2 mb-2">
        <View className="flex-row items-center space-x-1">
          {[...Array(5)].map((_, i) =>
            i < data.rating ? (
              <FontAwesome key={i} name="star" size={22} color="#FF932E" />
            ) : (
              <FontAwesome key={i} name="star-o" size={22} color="#FF932E" />
            )
          )}
        </View>
        <View className="bg-green-100 px-4 py-1 rounded-full flex-row items-center ml-2">
          <Feather name="check-square" size={18} color="#22C55E" />
          <Text className="text-green text-base font-comfortaa-bold ml-1">
            Fee Per Hour: ${data.fee}
          </Text>
        </View>
      </View>
      <View className="border-b border-gray my-3" />
      {/* Assigned Kids */}
      <Text className="text-base font-comfortaa-bold text-gray-700 mb-2 text-left">
        Assigned Kids:
      </Text>
      <View className="flex-row items-center justify-start gap-4 mb-6 w-full">
        {data.assignedKids.map((kid, idx) => (
          <View key={idx} className="flex-row items-center space-x-2">
            <FontAwesome name="child" size={28} color="#232B3A" />
            <Text className="text-base  font-comfortaa">{kid.name}</Text>
          </View>
        ))}
      </View>
      {/* View Full Profile Button */}
      <TouchableOpacity className="bg-primary rounded-full py-4 mt-2 items-center flex-row justify-center w-full">
        <Text className="text-white font-comfortaa-bold text-lg">
          View Full Profile
        </Text>
        <Feather
          name="arrow-right"
          size={22}
          color="white"
          style={{ marginLeft: 10 }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default AvailableBuddie;
