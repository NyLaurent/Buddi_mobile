import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const user = {
  name: "John Doe Smith",
  email: "johndoe@gmail.com",
  avatar: { uri: "https://randomuser.me/api/portraits/men/32.jpg" },
};

const settingsOptions = [
  "Account",
  "Recent Activity",
  "Devices",
  "Notifications",
  "Appearance",
  "Language",
  "Privacy & Security",
  "Storage",
];

const Settings = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={['top', 'left', 'right']}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="transparent" 
        translucent={true}
      />
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-6 pb-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-[#FF932E] w-8 h-8 rounded-full items-center justify-center"
        >
          <Ionicons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
        <Text className="text-lg font-comfortaa-bold">Settings</Text>
        <Image source={user.avatar} className="w-8 h-8 rounded-full" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View className="items-center mt-2 mb-6">
          <View className="relative">
            <Image source={user.avatar} className="w-20 h-20 rounded-full" />
            <TouchableOpacity className="absolute bottom-1 right-1 bg-[#FF932E] w-7 h-7 rounded-full items-center justify-center border-2 border-white">
              <Ionicons name="pencil" size={16} color="white" />
            </TouchableOpacity>
          </View>
          <Text className="font-comfortaa-bold text-lg mt-2">{user.name}</Text>
          <Text className="text-gray-400 font-comfortaa text-sm mt-1">
            {user.email}
          </Text>
          <View className="flex-row items-center justify-center mt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Ionicons
                key={i}
                name={i === 5 ? "star-outline" : "star"}
                size={22}
                color="#FF932E"
                style={{ marginHorizontal: 1 }}
              />
            ))}
          </View>
        </View>

        {/* Settings Options */}
        <View className="px-4 pb-20">
          {settingsOptions.map((option, idx) => (
            <TouchableOpacity
              key={option}
              className="flex-row items-center justify-between py-4 border-b border-[#F0F0F0]"
              onPress={() => {}}
            >
              <Text className="text-base text-[#222] font-comfortaa">
                {option}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#BDBDBD" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
