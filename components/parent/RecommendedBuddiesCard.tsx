import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface Buddy {
  name: string;
  email: string;
  avatar?: string;
  available?: boolean;
  rank?: string;
}

interface RecommendedBuddiesCardProps {
  buddies: Buddy[];
  horizontal?: boolean;
}

const RecommendedBuddiesCard: React.FC<RecommendedBuddiesCardProps> = ({
  buddies,
  horizontal = false,
}) => {
  if (!buddies || buddies.length === 0) {
    return (
      <View className="bg-white rounded-2xl border border-gray px-4 py-5 my-3 w-full max-w-[420px] self-center">
        {/* Top section */}
        <View className="mb-2">
          <Text className="text-xs text-grayText font-comfortaa mb-2">
            Buddi
          </Text>
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
  }

  // Buddies exist: show recommended list
  return (
    <View className="bg-white rounded-2xl border border-gray px-4 py-5 my-3 w-full">
      <Text className="text-xs text-grayText font-comfortaa mb-2">Buddi</Text>
      <Text className="text-base font-comfortaa-bold mb-4">
        Here is list of {buddies.length} recommended Buddis
      </Text>
      <ScrollView
        horizontal={horizontal}
        showsHorizontalScrollIndicator={false}
        className={horizontal ? "-mx-2" : ""}
        contentContainerStyle={horizontal ? { paddingHorizontal: 8 } : {}}
      >
        {buddies.map((buddy, idx) => (
          <View
            key={buddy.email}
            className=" rounded-xl px-3 py-4 mx-2"
            style={{ width: 240, minWidth: 200 }}
          >
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center">
                {buddy.avatar ? (
                  <Image
                    source={{ uri: buddy.avatar }}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                ) : (
                  <View className="w-10 h-10 rounded-full bg-gray items-center justify-center mr-3">
                    <Ionicons name="person" size={24} color="#D1D5DB" />
                  </View>
                )}
                <View>
                  <Text className="font-comfortaa-bold text-base text-black">
                    {buddy.name}
                  </Text>
                  <Text className="font-comfortaa text-xs text-grayText">
                    {buddy.email}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center">
                {buddy.available && (
                  <View className="flex-row items-center bg-green px-2 py-1 rounded-full mr-2">
                    <Text className="text-xs text-white font-comfortaa">
                      Available
                    </Text>
                  </View>
                )}
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={20}
                  color="#FF932E"
                />
              </View>
            </View>
            <View className="flex-row justify-between mt-2">
              <TouchableOpacity className="flex-row items-center border border-grayText rounded-full px-4 py-2 mr-2">
                <Ionicons
                  name="person"
                  size={16}
                  color="#858C95"
                  className="mr-2"
                />
                <Text className="font-comfortaa text-grayText text-sm">
                  Full Profile
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center bg-primary rounded-full px-6 py-2">
                <Ionicons
                  name="bar-chart-outline"
                  size={16}
                  color="#fff"
                  className="mr-2"
                />
                <Text className="font-comfortaa-bold text-white text-sm">
                  Rank No{idx + 1}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default RecommendedBuddiesCard;
