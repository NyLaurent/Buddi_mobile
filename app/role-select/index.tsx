import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY_COLOR = "#FF932E";
const LIGHT_ORANGE = "#FFF5E6";
const CARD_BG = "#F8FAFC";
const BUTTON_BG = PRIMARY_COLOR;
const BUTTON_TEXT = "#fff";
const BUTTON_BG_SECONDARY = "#fff";
const BUTTON_TEXT_SECONDARY = PRIMARY_COLOR;
const BORDER_RADIUS = 20;

const ROLES = [
  {
    key: "parent",
    label: "Parent",
    description: "Find a trusted Buddi for your child.",
    icon: <Ionicons name="person" size={36} color="#fff" />,
  },
  {
    key: "buddi",
    label: "Buddi",
    description: "Pick up and assist younger students.",
    icon: <FontAwesome5 name="users" size={32} color="#fff" />,
  },
  {
    key: "teacher",
    label: "Head Teacher",
    description: "View references and provide info about Buddis.",
    icon: <FontAwesome5 name="user-tie" size={28} color="#fff" />,
  },
];

const RoleSelect = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View className="items-center mt-6 mb-6">
          <Image
            source={require("../../assets/images/logo.png")}
            className="w-40 h-12"
            resizeMode="contain"
          />
        </View>
        {/* Title & Subtitle */}
        <View className="items-center mb-6 px-6">
          <Text className="text-2xl font-comfortaa-bold text-center text-gray-800 mb-1">
            Choose Your Role
          </Text>
          <Text className="text-base font-comfortaa text-center text-gray-500">
            Select how you&apos;ll use Pickup Buddi to continue.
          </Text>
        </View>
        {/* Role Cards */}
        <View className="flex-1 w-full px-2 mt-2">
          {ROLES.map((role) => (
            <View
              key={role.key}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 22,
              }}
            >
              {/* Orange Icon Section */}
              <View
                style={{
                  backgroundColor: PRIMARY_COLOR,
                  borderTopLeftRadius: BORDER_RADIUS,
                  borderBottomLeftRadius: BORDER_RADIUS,
                  width: 80,
                  height: 100,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {role.icon}
              </View>
              {/* Card Content */}
              <View
                style={{
                  backgroundColor: CARD_BG,
                  borderTopRightRadius: BORDER_RADIUS,
                  borderBottomRightRadius: BORDER_RADIUS,
                  flex: 1,
                  height: 100,
                  flexDirection: "row",
                  alignItems: "center",
                  paddingLeft: 18,
                  paddingRight: 10,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    className="font-comfortaa-bold text-lg text-gray-900 mb-1"
                    numberOfLines={1}
                  >
                    {role.label}
                  </Text>
                  <Text className="font-comfortaa text-gray-500 text-sm">
                    {role.description}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setSelected(role.key)}
                  style={{
                    backgroundColor:
                      selected === role.key ? PRIMARY_COLOR : "#fff",
                    borderRadius: 9999,
                    paddingHorizontal: 22,
                    borderWidth: 1,
                    borderColor:
                      selected === role.key ? PRIMARY_COLOR : "#E5E7EB",
                    paddingVertical: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    marginLeft: 8,
                  }}
                  activeOpacity={0.85}
                >
                  <Text
                    className="font-comfortaa-bold text-base mr-2"
                    style={{
                      color: selected === role.key ? "#fff" : "gray",
                    }}
                  >
                    Select
                  </Text>

                  <Ionicons
                    name="arrow-forward"
                    size={18}
                    color={selected === role.key ? "#fff" : "#4B5563"}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
        {/* Info Text */}
        <View className="px-8 mt-2 mb-4">
          <Text className="text-lg font-comfortaa text-center text-gray-400">
            Your experience will be tailored based on the role you choose.
          </Text>
        </View>
        {/* Bottom Buttons */}
        <View className="flex-row justify-between items-center px-6 mb-6">
          <TouchableOpacity
            className="flex-row items-center px-6 py-3 rounded-full border border-gray bg-white"
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={18}
              color="#A0A0A0"
              style={{ marginRight: 6 }}
            />
            <Text className="font-comfortaa-bold text-[#4B5563] text-base">
              Back
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center px-8 py-3 rounded-full bg-primary"
            style={{
              backgroundColor: PRIMARY_COLOR,
              opacity: selected ? 1 : 0.5,
            }}
            disabled={!selected}
            onPress={() => {
              if (selected === "buddi") {
                router.push("/auth/signup/buddi" as any);
              }
              // Add logic for other roles here later
            }}
          >
            <Text className="font-comfortaa-bold text-white mr-2 text-base">
              Next
            </Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* Decorative Orange Element */}
      <View
        style={{ position: "absolute", right: -60, bottom: -60, zIndex: -1 }}
      >
        <Image
          source={require("../../assets/images/onboarding/bottom_right.png")}
          style={{ width: 100, height: 50 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default RoleSelect;
