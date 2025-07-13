import CongratulationsCard from "@/components/commons/CongratulationsCard";
import Header from "@/components/commons/Header";
import { Ionicons } from "@expo/vector-icons";
import { useEvent } from "expo";
import { useRouter } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ProfileEditModal from "../../components/commons/ProfileEditModal";
import { useAuth } from "../../context/AuthContext";
import AuthService from "../../services/api/auth.service";

const BuddiProfile = () => {
  const [activeTab, setActiveTab] = useState("General");
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const insets = useSafeAreaInsets();
  const { width } = Dimensions.get("window");
  const router = useRouter();
  const { user, buddiDetails } = useAuth();

  const videoSource = require("../../assets/videos/intro.mp4");
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  const cardWidth = Math.min(width * 0.85, 320);

  // Fetch fresh profile data from API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await AuthService.getProfile();
        console.log("Profile API response:", response);
        setProfileData(response);
      } catch (error) {
        console.error("Error fetching profile:", error);
        // Fallback to context data if API fails
        setProfileData({ user, buddiDetails });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  // Get profile image or use placeholder
  const profileImage =
    profileData?.user?.Buddi?.profilePicture ||
    buddiDetails?.profilePicture ||
    "https://randomuser.me/api/portraits/men/32.jpg";

  // Get full name from user data
  const fullName = profileData?.user
    ? `${profileData.user.firstName} ${profileData.user.lastName}`
    : user
    ? `${user.firstName} ${user.lastName}`
    : "John Doe Smith";

  // Get email from user data
  const email = profileData?.user?.email || user?.email || "johndoe@gmail.com";

  // Get phone from user data
  const phone =
    profileData?.user?.phoneNumber || user?.phoneNumber || "+250-786-564-922";

  // Get school info from buddi details
  const schoolInfo = profileData?.user?.Buddi
    ? `${profileData.user.Buddi.currentSchool} – ${profileData.user.Buddi.AreaOfStudy}`
    : buddiDetails
    ? `${buddiDetails.currentSchool} – ${buddiDetails.AreaOfStudy}`
    : "NYU – Year 2, Child Psychology";

  // Get rating from buddi details
  const rating = profileData?.user?.Buddi?.rating || buddiDetails?.rating || 5;

  // Get resume status
  const hasResume = profileData?.user?.Buddi?.resume || buddiDetails?.resume;

  if (isLoading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#FF932E" />
        <Text className="mt-4 text-gray font-comfortaa">
          Loading profile...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar backgroundColor="#FF932E" barStyle="light-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.select({
            ios: 90 + insets.bottom,
            android: 80 + insets.bottom,
          }),
        }}
      >
        <Header
          name={fullName}
          email={email}
          profileImage={profileImage}
          rating={rating}
        />

        {/* Toggler Tabs */}
        <View
          className="flex-row bg-[#F8F9FE] rounded-2xl mx-4 mt-4 z-10"
          style={{ position: "relative" }}
        >
          <TouchableOpacity
            className={`flex-1 items-center py-2 rounded-2xl ${
              activeTab === "General" ? "bg-white" : ""
            }`}
            onPress={() => setActiveTab("General")}
          >
            <Text
              className={`font-comfortaa-bold ${
                activeTab === "General" ? "text-[#FF932E]" : "text-gray"
              }`}
            >
              General
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 items-center py-2 rounded-2xl ${
              activeTab === "Documents" ? "bg-white" : ""
            }`}
            onPress={() => setActiveTab("Documents")}
          >
            <Text
              className={`font-comfortaa-bold ${
                activeTab === "Documents" ? "text-[#FF932E]" : "text-gray"
              }`}
            >
              Documents
            </Text>
          </TouchableOpacity>
        </View>
        {activeTab === "General" && (
          <View>
            <CongratulationsCard />
            <View className="px-4 pt-4">
              {/* Personal Details */}
              <View className="flex-row justify-between items-center mb-2">
                <Text className="font-comfortaa-bold text-base">
                  Personal Details
                </Text>
                <TouchableOpacity
                  className="bg-[#FF932E] px-4 py-2 rounded-xl flex-row items-center gap-2"
                  onPress={() => setShowProfileEdit(true)}
                >
                  <Text className="text-white font-comfortaa-bold">
                    Edit Profile
                  </Text>
                  <Ionicons name="pencil" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
              <View className="bg-white rounded-2xl border border-[#E6E6E6] p-4">
                <View className="mb-4">
                  <Text className="text-xs text-[#BDBDBD] font-comfortaa">
                    Full Names
                  </Text>
                  <Text className="font-comfortaa-bold text-base text-[#222] mt-1">
                    {fullName}
                  </Text>
                </View>
                <View className="mb-4">
                  <Text className="text-xs text-[#BDBDBD] font-comfortaa">
                    Tel
                  </Text>
                  <Text className="font-comfortaa-bold text-base text-[#222] mt-1">
                    {phone}
                  </Text>
                </View>
                <View className="mb-4">
                  <Text className="text-xs text-[#BDBDBD] font-comfortaa">
                    Email
                  </Text>
                  <Text className="font-comfortaa-bold text-base text-[#222] mt-1">
                    {email}
                  </Text>
                </View>
                <View>
                  <Text className="text-xs text-[#BDBDBD] font-comfortaa">
                    School
                  </Text>
                  <Text className="font-comfortaa-bold text-base text-[#222] mt-1">
                    {schoolInfo}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
        {activeTab === "Documents" && (
          <View className="px-4 pt-4">
            {/* Profile Video Card */}
            <Text className="font-comfortaa-bold text-base mb-2">
              Your Profile Video
            </Text>
            <View
              style={{
                width: cardWidth,
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              {/* Video Card */}
              <View
                style={{
                  flex: 1,
                  backgroundColor: "white",
                  borderRadius: 18,
                  shadowColor: "#000",
                  shadowOpacity: 0.08,
                  shadowRadius: 6,

                  overflow: "hidden",
                  marginRight: 12,
                }}
              >
                {/* Video Thumbnail Area */}
                <View
                  style={{
                    position: "relative",
                    width: "100%",
                    height: cardWidth * 0.56,
                    backgroundColor: "#000",
                  }}
                >
                  <VideoView
                    style={{ width: "100%", height: "100%" }}
                    player={player}
                    allowsFullscreen
                    allowsPictureInPicture
                  />
                  {/* Play button overlay */}

                  {/* Reviewed badge */}
                  <View
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      zIndex: 3,
                      backgroundColor: "#34C759",
                      borderRadius: 12,
                      paddingHorizontal: 10,
                      paddingVertical: 2,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: 12,
                      }}
                    >
                      REVIEWED
                    </Text>
                  </View>
                </View>
                {/* Title and Date on light background */}
                <View
                  style={{
                    backgroundColor: "#F8F9FE",
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderBottomLeftRadius: 18,
                    borderBottomRightRadius: 18,
                  }}
                >
                  <Text className="font-comfortaa-bold text-base">
                    {fullName}
                  </Text>
                  <Text className="text-gray text-xs mt-1">
                    {profileData?.user?.createdAt
                      ? new Date(profileData.user.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "23 May 2025"}
                  </Text>
                </View>
              </View>
              {/* Action Buttons (outside the card) */}
              <View className="justify-center items-center space-y-4 ml-4 gap-5">
                <TouchableOpacity className="bg-[#F8F9FE] rounded-full w-12 h-12 items-center justify-center">
                  <Ionicons name="create-outline" size={24} color="#BDBDBD" />
                </TouchableOpacity>
                <TouchableOpacity className="bg-primary rounded-full w-12 h-12 items-center justify-center">
                  <Ionicons name="download-outline" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity className="bg-[#FF3B30] rounded-full w-12 h-12 items-center justify-center">
                  <Ionicons name="trash-outline" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Resume Card */}
            <Text className="font-comfortaa-bold text-base mb-2">Resume</Text>
            <View
              className="flex-row items-center mb-6"
              style={{ width: cardWidth }}
            >
              {/* Document Card */}
              <View className="bg-white rounded-2xl flex-1 px-4 py-5 justify-center items-center border border-[#E6E6E6]">
                <Image
                  source={require("../../assets/images/buddi/pdf-icon.png")}
                  className="w-full h-28 rounded-xl"
                  resizeMode="contain"
                />
                <Text className="font-comfortaa-bold text-base mt-4">
                  Resume
                </Text>
                <Text className="text-gray text-xs mt-1">
                  {hasResume ? "PDF • Available" : "PDF • Not uploaded"}
                </Text>
              </View>
              {/* Action Buttons */}
              <View className="justify-center items-center space-y-4 ml-4 gap-5">
                <TouchableOpacity className="bg-[#F8FAFC] rounded-full w-12 h-12 border-1 border-[#EAEBF0] items-center justify-center">
                  <Ionicons name="create-outline" size={24} color="#BDBDBD" />
                </TouchableOpacity>
                <TouchableOpacity className="bg-primary rounded-full w-12 h-12 items-center justify-center">
                  <Ionicons name="download-outline" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity className="bg-[#FF3B30] rounded-full w-12 h-12 items-center justify-center">
                  <Ionicons name="trash-outline" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Profile Edit Modal */}
      <ProfileEditModal
        visible={showProfileEdit}
        onClose={() => setShowProfileEdit(false)}
      />
    </View>
  );
};

export default BuddiProfile;
