import Header from "@/components/commons/Header";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
  const router = useRouter();
  const { user, buddiDetails } = useAuth();

  // Fetch fresh profile data from API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        console.log("BuddiProfile: Starting profile fetch...");
        const response = await AuthService.getProfile();
        console.log("BuddiProfile: Profile API response:", response);
        setProfileData(response);
      } catch (error) {
        console.error("BuddiProfile: Error fetching profile:", error);
        // Fallback to context data if API fails
        console.log("BuddiProfile: Using fallback data:", {
          user,
          buddiDetails,
        });
        setProfileData({
          user: user || null,
          buddiDetails: buddiDetails || null,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    } else {
      // If no user, set loading to false and use fallback data
      console.log("BuddiProfile: No user found, using fallback data");
      setIsLoading(false);
      setProfileData({
        user: null,
        buddiDetails: buddiDetails || null,
      });
    }
  }, [user, buddiDetails]);

  // Get profile image or use placeholder
  const profileImage = (() => {
    const image =
      profileData?.user?.Buddi?.profilePicture ||
      buddiDetails?.profilePicture ||
      "https://randomuser.me/api/portraits/men/32.jpg";
    console.log("BuddiProfile: Profile image:", image);
    return image;
  })();

  // Get full name from user data
  const fullName = (() => {
    const firstName = profileData?.user?.firstName || user?.firstName || "";
    const lastName = profileData?.user?.lastName || user?.lastName || "";
    const name = `${firstName} ${lastName}`.trim();
    const result = name || "John Doe Smith";
    console.log("BuddiProfile: Full name:", result);
    return result;
  })();

  // Get email from user data
  const email = (() => {
    const result =
      profileData?.user?.email || user?.email || "johndoe@gmail.com";
    console.log("BuddiProfile: Email:", result);
    return result;
  })();

  // Get phone from user data
  const phone = (() => {
    const result =
      profileData?.user?.phoneNumber || user?.phoneNumber || "+250-786-564-922";
    console.log("BuddiProfile: Phone:", result);
    return result;
  })();

  // Get school info from buddi details
  const schoolInfo = (() => {
    const currentSchool =
      profileData?.user?.Buddi?.currentSchool ||
      buddiDetails?.currentSchool ||
      "";
    const areaOfStudy =
      profileData?.user?.Buddi?.AreaOfStudy || buddiDetails?.AreaOfStudy || "";

    let result;
    if (currentSchool && areaOfStudy) {
      result = `${currentSchool} – ${areaOfStudy}`;
    } else if (currentSchool) {
      result = currentSchool;
    } else if (areaOfStudy) {
      result = areaOfStudy;
    } else {
      result = "NYU – Year 2, Child Psychology";
    }
    console.log("BuddiProfile: School info:", result);
    return result;
  })();

  // Get rating from buddi details
  // const rating = (() => {
  //   const rawRating =
  //     profileData?.user?.Buddi?.rating || buddiDetails?.rating || 5;
  //   console.log("BuddiProfile: Raw rating:", rawRating, typeof rawRating);
  //   // Ensure rating is a valid number and within reasonable bounds
  //   if (
  //     typeof rawRating === "number" &&
  //     !isNaN(rawRating) &&
  //     isFinite(rawRating) &&
  //     rawRating >= 0 &&
  //     rawRating <= 5
  //   ) {
  //     const result = Math.floor(rawRating);
  //     console.log("BuddiProfile: Valid rating:", result);
  //     return result;
  //   }
  //   console.log("BuddiProfile: Using default rating: 5");
  //   return 5; // Default fallback
  // })();

  if (isLoading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#FF932E" />
        <Text className="mt-4 text-[#71727A] font-comfortaa">
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
                activeTab === "General" ? "text-[#FF932E]" : "text-[#71727A]"
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
                activeTab === "Documents" ? "text-[#FF932E]" : "text-[#71727A]"
              }`}
            >
              Documents
            </Text>
          </TouchableOpacity>
        </View>
        {activeTab === "General" && (
          <View>
            {/* <CongratulationsCard /> */}
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
            {/* Empty Documents State */}
            <View className="flex-1 justify-center items-center py-20">
              <View className="bg-[#F8F9FE] rounded-full w-20 h-20 items-center justify-center mb-4">
                <Ionicons name="document-outline" size={32} color="#BDBDBD" />
              </View>
              <Text className="font-comfortaa-bold text-lg text-[#222] mb-2">
                No Documents Yet
              </Text>
              <Text className="text-[#71727A] text-center font-comfortaa">
                Your documents will appear here once uploaded
              </Text>
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
