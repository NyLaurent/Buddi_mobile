import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface CongratulationsCardProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onViewPress?: () => void;
  viewText?: string;
  className?: string;
}

const CongratulationsCard: React.FC<CongratulationsCardProps> = ({
  title = "Congratulations! 🎉",
  subtitle = "23XP • 23 Reviews",
  icon = (
    <View className="bg-[#FFE7D3] p-2 rounded-xl">
      <Ionicons name="trophy" size={24} color="#FF932E" />
    </View>
  ),
  onViewPress,
  viewText = "View",
  className,
}) => {
  return (
    <View
      className={`mx-4 mt-6 bg-[#FAFBFC] rounded-2xl p-4 flex-row justify-between items-center border border-[#C1C3C7] ${
        className || ""
      }`}
    >
      <View className="flex-row items-center gap-3">
        {icon}
        <View>
          <Text className="font-comfortaa-bold text-lg">{title}</Text>
          <Text className="text-gray font-comfortaa">{subtitle}</Text>
        </View>
      </View>
      <TouchableOpacity
        className="py-2 px-3 rounded-xl flex-row items-center gap-2"
        onPress={onViewPress}
      >
        <Text className="text-gray font-comfortaa">{viewText}</Text>
        <Ionicons name="arrow-forward" size={16} color="#666" />
      </TouchableOpacity>
    </View>
  );
};

export default CongratulationsCard;
