import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

// Helper function to generate initials from name
const getInitials = (name?: string): string => {
  if (!name) return "P";

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
  size = 40,
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
        },
        style,
      ]}
    >
      <Text
        style={{
          color: "#FFFFFF",
          fontFamily: "Comfortaa-Bold",
          fontSize: size * 0.4,
        }}
      >
        {initials}
      </Text>
    </View>
  );
};

interface CoverageRequestCardProps {
  studentName: string;
  time: string;
  hourlyRate: string;
  school: string;
  home: string;
  requesterName: string;
  requesterEmail: string;
  requesterAvatar?: string;
  onViewDetails: () => void;
  onAccept: () => void;
}

const CoverageRequestCard = ({
  studentName,
  time,
  hourlyRate,
  school,
  home,
  requesterName,
  requesterEmail,
  requesterAvatar,
  onViewDetails,
  onAccept,
}: CoverageRequestCardProps) => (
  <View
    className="bg-white rounded-2xl border border-[#E8E8E8] p-5  w-[325px]"
    style={{
      shadowColor: "#000",
      shadowOpacity: 0.03,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
    }}
  >
    {/* Top Row: Student Name */}
    <View className="flex-row items-center mb-3">
      <Ionicons
        name="person"
        size={18}
        color="#222"
        style={{ marginRight: 8 }}
      />
      <Text className="text-base font-comfortaa-bold text-[#222]">
        {studentName}
      </Text>
    </View>

    {/* Time and Rate Row */}
    <View className="flex-row items-center justify-between mb-3">
      <View className="flex-row items-center">
        <View className="flex-row items-center bg-primary px-3 py-1 rounded-xl mr-2">
          <Ionicons
            name="time"
            size={16}
            color="white"
            style={{ marginRight: 4 }}
          />
          <Text className="text-white font-comfortaa-bold text-sm">{time}</Text>
        </View>
      </View>
      <View className="bg-[#F5F5F5] px-3 py-1 rounded-xl">
        <Text className="text-[#71727A] font-comfortaa text-sm">
          {hourlyRate}
        </Text>
      </View>
    </View>

    {/* Route Row */}
    <View className="flex-row items-center justify-between mb-4">
      <View className="flex-row items-center">
        <Ionicons name="location" size={16} color="#34C759" />
        <View className="ml-2">
          <Text className="text-[#71727A] font-comfortaa text-xs">School</Text>
          <Text className="font-comfortaa text-black text-sm">{school}</Text>
        </View>
      </View>
      <Ionicons name="play" size={24} color="#3CB4FF" />
      <View className="flex-row items-center">
        <Ionicons name="home" size={16} color="#FF932E" />
        <View className="ml-2">
          <Text className="text-[#71727A] font-comfortaa text-xs">Home</Text>
          <Text className="font-comfortaa-bold text-black text-sm ">
            {home}
          </Text>
        </View>
      </View>
    </View>

    {/* Requester Info */}
    <View className="flex-row items-center mb-5">
      <AvatarWithInitials
        name={requesterName}
        size={40}
        style={{ marginRight: 12 }}
      />
      <View className="flex-1">
        <Text className="font-comfortaa-bold text-black">{requesterName}</Text>
        <Text className="text-[#71727A] font-comfortaa text-sm">
          {requesterEmail}
        </Text>
      </View>
      <TouchableOpacity className="p-2">
        <Ionicons name="ellipsis-horizontal" size={20} color="#ccc" />
      </TouchableOpacity>
    </View>

    {/* Action Buttons */}
    <View className="flex-row items-center justify-between mt-2">
      <TouchableOpacity
        className="flex-row items-center border border-[#E8E8E8] bg-white py-2 px-3 rounded-2xl justify-center w-[140px]"
        onPress={onViewDetails}
      >
        <Text className="text-[#71727A] font-comfortaa-bold mr-2 text-sm">
          View Details
        </Text>
        <Ionicons name="arrow-forward" size={16} color="#666" />
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-primary py-2 px-4 rounded-2xl flex-row items-center justify-center w-[140px] ml-2"
        onPress={onAccept}
      >
        <Ionicons
          name="person-add"
          size={18}
          color="white"
          style={{ marginRight: 4 }}
        />
        <Text className="text-white font-comfortaa-bold text-sm">Accept</Text>
        <Ionicons
          name="git-network"
          size={18}
          color="white"
          style={{ marginLeft: 4 }}
        />
      </TouchableOpacity>
    </View>
  </View>
);

export default CoverageRequestCard;
