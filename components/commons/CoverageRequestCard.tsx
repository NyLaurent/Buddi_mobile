import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";

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
      {requesterAvatar ? (
        <Image
          source={{ uri: requesterAvatar }}
          className="w-10 h-10 rounded-full mr-3"
        />
      ) : (
        <Image
          source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
          className="w-10 h-10 rounded-full mr-3"
        />
      )}
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
