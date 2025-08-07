import {
  Feather,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/AuthContext";

// Helper function to generate initials from name
const getInitials = (name?: string): string => {
  if (!name) return "B";

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

// Helper function to get ordinal suffix (1st, 2nd, 3rd, etc.)
const getOrdinalSuffix = (num: number): string => {
  if (num >= 11 && num <= 13) return "th";

  switch (num % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

// Avatar component that displays initials
const AvatarWithInitials = ({
  name,
  size = 96,
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
          borderWidth: 2,
          borderColor: "#E5E7EB",
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

const AvailableBuddie = ({
  buddi,
  matched,
  ranking,
}: {
  buddi: any;
  matched?: boolean;
  ranking?: number;
}) => {
  const data = buddi;
  const router = useRouter();
  const { parentDetails } = useAuth();

  const handleChatPress = () => {
    if (!parentDetails?.id || !data.id) return;
    const roomId = `${parentDetails.id}-${data.id}`;
    router.push({
      pathname: "/parent/chat/[roomId]",
      params: {
        roomId,
        buddiName: data.User?.firstName || data.name,
        buddiAvatar: data.profilePicture || data.profileImage,
      },
    });
  };

  const handleViewProfile = () => {
    if (!data.id) return;
    const encodedData = encodeURIComponent(JSON.stringify(data));
    router.push({
      pathname: "/parent/buddi-profile/[buddiId]",
      params: { buddiId: data.id.toString(), data: encodedData },
    });
  };

  const buddiName = data.User?.firstName || data.name;
  const buddiFullName = `${data.User?.firstName || data.name} ${
    data.User?.lastName || ""
  }`;

  return (
    <View
      className="rounded-2xl px-4 py-5 my-3 w-full max-w-[420px] self-center"
      style={{
        backgroundColor: matched ? "#FFF7ED" : "#fff",
        borderWidth: 2,
        borderColor: matched ? "#FF932E" : "#E5E7EB",
        shadowColor: matched ? "#FF932E" : "#000",
        shadowOffset: { width: 0, height: matched ? 4 : 2 },
        shadowOpacity: matched ? 0.15 : 0.1,
        shadowRadius: matched ? 8 : 4,
        elevation: matched ? 6 : 2,
      }}
    >
      {/* Top: Profile and Status/Message */}
      <View className="flex-row w-full mb-2">
        {/* Profile */}
        <View className="w-1/3 items-center justify-start">
          <AvatarWithInitials
            name={buddiFullName}
            size={96}
            style={{ marginBottom: 8 }}
          />
          <Text className="text-lg font-comfortaa-bold mt-2">
            {buddiFullName}
          </Text>
          <View>
            <Text
              className="text-xs text-[#71727A] font-comfortaa mt-1 w-full"
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ maxWidth: 120, flexShrink: 1 }}
            >
              {data.User?.email || data.email}
            </Text>
          </View>

          <View className="flex-row items-center justify-center space-x-2 mt-2">
            <Feather name="phone" size={16} color="#6B7280" />
            <Text className="text-xs text-[#71727A] font-comfortaa">
              {data.User?.phoneNumber || data.phone || "N/A"}
            </Text>
          </View>
        </View>
        {/* Status and Message */}
        <View className="w-2/3 pl-4">
          <View className="flex-row justify-end items-center space-x-3 mb-2">
            <View className="bg-green px-4 py-1 rounded-full flex-row items-center">
              <Text className="text-white text-xs font-comfortaa-bold">
                {data.status}
              </Text>
            </View>
            {/* Show chat icon only if matched */}
            {matched && (
              <TouchableOpacity className="ml-2" onPress={handleChatPress}>
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={26}
                  color="#FF9100"
                />
              </TouchableOpacity>
            )}
          </View>
          {matched && (
            <View
              style={{
                alignSelf: "flex-end",
                backgroundColor: "#FF932E",
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 4,
                marginTop: 4,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontFamily: "Comfortaa-Bold",
                  fontSize: 12,
                }}
              >
                Matched
              </Text>
            </View>
          )}
        </View>
      </View>
      {/* School Name (full width) */}
      <View className="flex-row items-center w-full mb-2">
        <Ionicons name="location" size={20} color="#22C55E" />
        <Text className="text-[13px] text-[#71727A] font-comfortaa ml-2">
          School
        </Text>
        <Text className="text-base font-comfortaa-bold text-black ml-2">
          {data.currentSchool || data.school?.name || "N/A"}
        </Text>
      </View>
      {/* Home Section (full width) */}
      <View className="flex-row items-center w-full mb-2">
        <MaterialIcons name="home" size={20} color="#FF9100" />
        <Text className="text-[13px] text-[#71727A] font-comfortaa ml-2">
          Home
        </Text>
        <Text className="text-base font-comfortaa-bold text-black ml-2">
          {data.User?.homeAddress || data.home?.name || "N/A"}
        </Text>
      </View>
      {/* School, Name Row (full width) */}
      <View className="flex-row items-center w-full mb-2">
        <MaterialIcons name="school" size={18} color="#232B3A" />
        <Text className="text-xs text-[#71727A] font-comfortaa ml-2">
          {data.AreaOfStudy || data.schoolName || "N/A"}
        </Text>
      </View>
      {/* Rating Row */}
      <View className="flex-row items-center justify-start w-full mt-2 mb-2">
        <View className="bg-[#FF932E] px-4 py-2 rounded-full flex-row items-center">
          <Ionicons name="trophy" size={18} color="#FFFFFF" />
          <Text className="text-white text-sm font-comfortaa-bold ml-2">
            {ranking
              ? `Ranked ${ranking}${getOrdinalSuffix(ranking)}`
              : "Ranked"}
          </Text>
        </View>
      </View>
      <View className="border-b border-gray my-3" />
      {/* Assigned Kids */}
      <Text className="text-base font-comfortaa-bold text-[#71727A] mb-2 text-left">
        Assigned Kids:
      </Text>
      <View className="flex-row items-center justify-start gap-4 mb-6 w-full">
        {(data.assignedKids || []).map((kid: any, idx: number) => (
          <View key={idx} className="flex-row items-center space-x-2">
            <FontAwesome name="child" size={28} color="#232B3A" />
            <Text className="text-base font-comfortaa">{kid.name}</Text>
          </View>
        ))}
      </View>
      {/* View Full Profile Button */}
      <TouchableOpacity
        className="bg-primary rounded-full py-4 mt-2 items-center flex-row justify-center w-full"
        onPress={handleViewProfile}
      >
        <Text className="text-white font-comfortaa-bold text-lg">
          View Full Profile
        </Text>
        <Feather
          name="arrow-right"
          size={22}
          color="white"
          style={{ marginLeft: 10 }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default AvailableBuddie;
