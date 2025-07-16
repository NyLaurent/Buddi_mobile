import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface PageHeaderProps {
  title: string;
  showBackButton?: boolean;
  showMenuButton?: boolean;
  onMenuPress?: () => void;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  showBackButton = true,
  showMenuButton = true,
  onMenuPress,
  className = "",
}) => {
  const router = useRouter();

  return (
    <View
      className={`flex-row items-center justify-between px-4 mb-6 ${className}`}
    >
      {showBackButton ? (
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 bg-primary rounded-xl items-center justify-center"
        >
          <Ionicons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
      ) : (
        <View className="w-10" />
      )}

      <Text className="text-xl font-comfortaa-bold text-black">{title}</Text>

      {showMenuButton ? (
        <TouchableOpacity
          className="w-10 h-10 bg-primary rounded-xl items-center justify-center"
          onPress={onMenuPress}
        >
          <Ionicons name="ellipsis-horizontal" size={20} color="white" />
        </TouchableOpacity>
      ) : (
        <View className="w-10" />
      )}
    </View>
  );
};

export default PageHeader;
