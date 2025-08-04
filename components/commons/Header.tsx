import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Helper function to generate initials from name
const getInitials = (name?: string): string => {
  if (!name) return "U";

  const nameParts = name.trim().split(" ");
  if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase();
  }

  return (
    nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)
  ).toUpperCase();
};

// Helper function to generate a consistent color based on name
const getAvatarColor = (name?: string): string => {
  if (!name) return "#3B82F6";

  const colors = [
    "#3B82F6",
    "#8B5CF6",
    "#EF4444",
    "#F59E0B",
    "#10B981",
    "#F97316",
    "#EC4899",
    "#06B6D4",
    "#84CC16",
    "#6366F1",
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};

// Avatar component that displays initials
const AvatarWithInitials = ({
  name,
  size = 80,
  style = {},
}: {
  name?: string;
  size?: number;
  style?: any;
}) => {
  const initials = getInitials(name);
  const backgroundColor = getAvatarColor(name);

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 4,
          borderColor: "#FFFFFF",
        },
        style,
      ]}
    >
      <Text
        style={{
          color: "#FFFFFF",
          fontFamily: "Comfortaa-Bold",
          fontSize: size * 0.35,
        }}
      >
        {initials}
      </Text>
    </View>
  );
};

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
  profileImage,
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
            {/* <TouchableOpacity
              className="bg-white rounded-full p-2"
              onPress={handleSettingsPress}
            >
              <Ionicons
                name="settings-outline"
                size={22}
                color={backgroundColor}
              />
            </TouchableOpacity> */}
          </View>
        )}
        <View className="items-center mt-1 mb-2">
          <AvatarWithInitials
            name={name}
            size={80}
            style={{ marginBottom: 4 }}
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
