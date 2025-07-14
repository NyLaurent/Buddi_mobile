import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface HeaderProps {
  profileImage?: string;
  name: string;
  email: string;
  rating?: number;
  showSettings?: boolean;
  onSettingsPress?: () => void;
  backgroundColor?: string;
  textColor?: string;
  starColor?: string;
}

const Header: React.FC<HeaderProps> = ({
  profileImage = "https://randomuser.me/api/portraits/men/32.jpg",
  name,
  email,
  rating = 5,
  showSettings = true,
  onSettingsPress,
  backgroundColor = "#FF932E",
  textColor = "white",
  starColor = "#FF932E",
}) => {
  const router = useRouter();

  const handleSettingsPress = () => {
    if (onSettingsPress) {
      onSettingsPress();
    } else {
      router.push("/buddi/settings");
    }
  };

  // Ensure rating is a valid number and within reasonable bounds
  const validRating =
    typeof rating === "number" &&
    !isNaN(rating) &&
    isFinite(rating) &&
    rating >= 0 &&
    rating <= 5
      ? Math.floor(rating)
      : 5;

  return (
    <View className="rounded-b-3xl" style={{ minHeight: 120, backgroundColor }}>
      <SafeAreaView edges={["top", "left", "right"]}>
        {showSettings && (
          <View className="flex-row justify-end items-center px-4 pt-2">
            <TouchableOpacity
              className="bg-white rounded-full p-2"
              onPress={handleSettingsPress}
            >
              <Ionicons
                name="settings-outline"
                size={22}
                color={backgroundColor}
              />
            </TouchableOpacity>
          </View>
        )}
        <View className="items-center mt-1 mb-2">
          <Image
            source={{ uri: profileImage }}
            className="w-20 h-20 rounded-full border-4 border-white"
            resizeMode="cover"
          />
          <Text
            className="text-lg font-comfortaa-bold mt-1"
            style={{ color: textColor }}
          >
            {name}
          </Text>
          <Text className="font-comfortaa mt-0.5" style={{ color: textColor }}>
            {email}
          </Text>
          {validRating > 0 && (
            <View className="flex-row items-center bg-white rounded-xl px-3 py-0.5 mt-2">
              {[...Array(validRating)].map((_, i) => (
                <Ionicons key={i} name="star" size={16} color={starColor} />
              ))}
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Header;
