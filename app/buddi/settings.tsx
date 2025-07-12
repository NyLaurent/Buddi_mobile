import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileEditModal from "../../components/commons/ProfileEditModal";
import { useAuth } from "../../context/AuthContext";

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
  const { user, buddiDetails, logout } = useAuth();
  const [showProfileEdit, setShowProfileEdit] = useState(false);

  // Get user data with fallbacks
  const fullName = user
    ? `${user.firstName} ${user.lastName}`
    : "John Doe Smith";
  const email = user?.email || "johndoe@gmail.com";
  const profileImage =
    buddiDetails?.profilePicture ||
    "https://randomuser.me/api/portraits/men/32.jpg";
  const rating = buddiDetails?.rating || 5;

  const handleLogout = () => {
    // Add logout confirmation if needed
    logout();
  };

  const handleAccountPress = () => {
    setShowProfileEdit(true);
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff" }}
      edges={["top", "left", "right"]}
    >
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
        <Image
          source={{ uri: profileImage }}
          className="w-8 h-8 rounded-full"
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View className="items-center mt-2 mb-6">
          <View className="relative">
            <Image
              source={{ uri: profileImage }}
              className="w-20 h-20 rounded-full"
            />
            <TouchableOpacity
              className="absolute bottom-1 right-1 bg-[#FF932E] w-7 h-7 rounded-full items-center justify-center border-2 border-white"
              onPress={() => setShowProfileEdit(true)}
            >
              <Ionicons name="pencil" size={16} color="white" />
            </TouchableOpacity>
          </View>
          <Text className="font-comfortaa-bold text-lg mt-2">{fullName}</Text>
          <Text className="text-gray-400 font-comfortaa text-sm mt-1">
            {email}
          </Text>
          <View className="flex-row items-center justify-center mt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Ionicons
                key={i}
                name={i <= rating ? "star" : "star-outline"}
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
              onPress={option === "Account" ? handleAccountPress : () => {}}
            >
              <Text className="text-base text-[#222] font-comfortaa">
                {option}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#BDBDBD" />
            </TouchableOpacity>
          ))}

          {/* Logout Option */}
          <TouchableOpacity
            className="flex-row items-center justify-between py-4 border-b border-[#F0F0F0] mt-4"
            onPress={handleLogout}
          >
            <Text className="text-base text-[#FF3B30] font-comfortaa">
              Logout
            </Text>
            <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Profile Edit Modal */}
      <ProfileEditModal
        visible={showProfileEdit}
        onClose={() => setShowProfileEdit(false)}
      />
    </SafeAreaView>
  );
};

export default Settings;
