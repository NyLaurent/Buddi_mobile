import Header from "@/components/commons/Header";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

  // Get resume URL from buddi details
  const resumeUrl = (() => {
    const result =
      profileData?.user?.Buddi?.resume || buddiDetails?.resume || null;
    console.log("BuddiProfile: Resume URL:", result);
    return result;
  })();

  // Handle resume download using FileSystem and Sharing
  const handleResumeDownload = async () => {
    if (!resumeUrl) {
      Alert.alert("No Resume", "No resume available for download.");
      return;
    }

    try {
      Alert.alert("Download Resume", "Do you want to download the resume?", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Download",
          onPress: async () => {
            try {
              // Get the filename from the URL
              const fileName = resumeUrl.split("/").pop() || "resume.pdf";

              // Create a local file path
              const localUri = `${FileSystem.documentDirectory}${fileName}`;

              // Download the file
              const downloadResult = await FileSystem.downloadAsync(
                resumeUrl,
                localUri
              );

              if (downloadResult.status === 200) {
                // Share the downloaded file
                if (await Sharing.isAvailableAsync()) {
                  await Sharing.shareAsync(localUri, {
                    mimeType: "application/pdf",
                    dialogTitle: "Resume",
                  });
                } else {
                  Alert.alert(
                    "Download Complete",
                    `Resume downloaded to: ${localUri}`,
                    [{ text: "OK" }]
                  );
                }
              } else {
                Alert.alert("Error", "Failed to download resume", [
                  { text: "OK" },
                ]);
              }
            } catch (error) {
              console.error("Download error:", error);
              Alert.alert("Error", "Failed to download resume", [
                { text: "OK" },
              ]);
            }
          },
        },
      ]);
    } catch (error) {
      console.error("Download error:", error);
      Alert.alert("Error", "Failed to download resume", [{ text: "OK" }]);
    }
  };

  // Delete Account Section Component
  const DeleteAccountSection = () => {
    const { logout } = useAuth();
    const router = useRouter();

    const handleDeleteAccount = async () => {
      Alert.alert(
        "Delete Account",
        "Are you sure you want to delete your account? This action cannot be undone.",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Delete", 
            style: "destructive",
            onPress: async () => {
              try {
                await AuthService.deleteAccount();
                Alert.alert(
                  "Account Deleted", 
                  "Your account has been deleted successfully. You will be logged out.",
                  [
                    {
                      text: "OK",
                      onPress: async () => {
                        // Clear stored data and logout
                        await logout();
                        router.replace("/auth/login");
                      }
                    }
                  ]
                );
              } catch (error: any) {
                console.error("Error deleting account:", error);
                let errorMessage = "Failed to delete account. Please try again.";
                
                // Handle specific foreign key constraint error
                if (error?.response?.data?.error?.includes("foreign key constraint")) {
                  errorMessage = `Cannot delete account: ${fullName || 'You'} have active pickup requests. Please cancel all requests first, then try again.`;
                } else if (error?.response?.status === 500) {
                  // Handle internal server errors gracefully
                  errorMessage = "Unable to delete account at this time. Please try again later or contact support if the issue persists.";
                } else if (error?.response?.data?.message) {
                  errorMessage = error.response.data.message;
                } else if (error?.message) {
                  errorMessage = error.message;
                }
                
                Alert.alert("Error", errorMessage);
              }
            }
          },
        ]
      );
    };

    return (
      <View className="mb-6 px-4">
        <Text className="font-comfortaa-bold px-2 pt-2 text-base mb-3">
          Account Management
        </Text>
        <View className="bg-white rounded-2xl border border-[#E6E6E6] p-4">
          <Text className="text-[#71727A] font-comfortaa text-sm mb-4 text-center">
            Have you read well the policies of deleting account?
          </Text>
          <TouchableOpacity
            className="bg-[#FEF2F2] py-4 rounded-xl items-center"
            onPress={handleDeleteAccount}
          >
            <Text className="text-[#EF4444] text-base font-comfortaa-bold">
              Delete Account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
        <Header name={fullName} email={email} profileImage={profileImage} />

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

            {/* Delete Account Section */}
            <DeleteAccountSection />
          </View>
        )}

        {activeTab === "Documents" && (
          <View>
            <View className="px-4 pt-4">
              {/* Resume Section */}
              {resumeUrl ? (
                <View className="mb-6">
                  <Text className="font-comfortaa-bold text-base mb-3">
                    Resume
                  </Text>
                  <View className="bg-white rounded-2xl border border-[#E6E6E6] p-4">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center flex-1">
                        <View className="bg-[#FF932E] rounded-full w-12 h-12 items-center justify-center mr-3">
                          <Ionicons name="document" size={24} color="#fff" />
                        </View>
                        <View className="flex-1">
                          <Text className="font-comfortaa-bold text-base text-[#222]">
                            Resume
                          </Text>
                          <Text className="text-[#71727A] font-comfortaa text-sm">
                            Click to download your resume
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        onPress={handleResumeDownload}
                        className="bg-[#FF932E] px-4 py-2 rounded-xl flex-row items-center gap-2"
                      >
                        <Ionicons name="download" size={16} color="#fff" />
                        <Text className="text-white font-comfortaa-bold text-sm">
                          Download
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ) : (
                <View className="mb-6">
                  <Text className="font-comfortaa-bold text-base mb-3">
                    Resume
                  </Text>
                  <View className="bg-white rounded-2xl border border-[#E6E6E6] p-4">
                    <View className="flex-row items-center">
                      <View className="bg-[#F8F9FE] rounded-full w-12 h-12 items-center justify-center mr-3">
                        <Ionicons
                          name="document-outline"
                          size={24}
                          color="#BDBDBD"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="font-comfortaa-bold text-base text-[#222]">
                          No Resume Uploaded
                        </Text>
                        <Text className="text-[#71727A] font-comfortaa text-sm">
                          Upload your resume to complete your profile
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </View>

            {/* Delete Account Section */}
            <View className="pt-4 px-2">
            <DeleteAccountSection />
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