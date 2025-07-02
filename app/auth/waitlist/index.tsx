import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../context/AuthContext";

const PRIMARY_COLOR = "#FF932E";

const WaitlistScreen = () => {
  const router = useRouter();
  const { user, buddiDetails, parentDetails, refreshUserData, logout } =
    useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check if user should be on waitlist
  useEffect(() => {
    if (!user) {
      router.replace("/auth/login");
      return;
    }

    // If buddi is approved, redirect to interview guidelines
    if (user.role === "buddi" && buddiDetails?.status === "Registered") {
      router.replace("/auth/interview-guidelines");
      return;
    }

    // If parent is approved, redirect to login for final authentication
    if (user.role === "parent" && parentDetails?.approvalStage === "approved") {
      router.replace("/auth/login");
      return;
    }
  }, [user, buddiDetails, parentDetails]);

  const getUserDisplayInfo = () => {
    if (!user)
      return { name: "", email: "", statusText: "", progressWidth: "0%" };

    const name = `${user.firstName} ${user.lastName}`;
    const email = user.email;

    if (user.role === "buddi" && buddiDetails) {
      return {
        name,
        email,
        statusText:
          buddiDetails.status === "RegisterApprovalPending"
            ? "Under Review - Application Pending"
            : "Application In Review",
        progressWidth: "65%",
        roleDisplayName: "Buddi",
      };
    }

    if (user.role === "parent" && parentDetails) {
      return {
        name,
        email,
        statusText:
          parentDetails.approvalStage === "pending"
            ? "Under Review - Parent Verification Pending"
            : "Parent Application In Review",
        progressWidth: "50%",
        roleDisplayName: "Parent",
      };
    }

    return {
      name,
      email,
      statusText: "Application In Review",
      progressWidth: "30%",
      roleDisplayName: user.role === "buddi" ? "Buddi" : "Parent",
    };
  };

  const handleRefreshStatus = async () => {
    try {
      setIsRefreshing(true);
      await refreshUserData();
      Alert.alert(
        "Status Updated",
        "Your application status has been refreshed."
      );
    } catch (error) {
      console.error("Error refreshing status:", error);
      Alert.alert("Error", "Failed to refresh status. Please try again.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleContactUs = () => {
    Alert.alert(
      "Contact Support",
      "For any questions about your application, please email us at support@pickupbuddi.com or call (555) 123-4567",
      [{ text: "OK" }]
    );
  };

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/auth/login");
        },
      },
    ]);
  };

  const userInfo = getUserDisplayInfo();

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar
        style="dark"
        backgroundColor={PRIMARY_COLOR}
        translucent={false}
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}>
        {/* Header with profile */}
        <View
          style={{
            backgroundColor: PRIMARY_COLOR,
            paddingVertical: 32,
            paddingHorizontal: 16,
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
            alignItems: "center",
          }}
        >
          <View className="items-center mb-2">
            <View className="w-24 h-24 rounded-full overflow-hidden border-2 border-white mb-2">
              <Image
                source={
                  buddiDetails?.profilePicture || parentDetails?.children?.[0]
                    ? {
                        uri:
                          buddiDetails?.profilePicture ||
                          "https://via.placeholder.com/150",
                      }
                    : require("../../../assets/images/avatar-placeholder.png")
                }
                className="w-full h-full"
                resizeMode="cover"
                defaultSource={require("../../../assets/images/avatar-placeholder.png")}
              />
            </View>
            <Text className="text-xl font-comfortaa-bold text-white mb-1">
              {userInfo.name}
            </Text>
            <Text className="font-comfortaa text-white opacity-80">
              {userInfo.email}
            </Text>
            <View className="mt-2 px-3 py-1 bg-white/20 rounded-full">
              <Text className="font-comfortaa text-white text-sm">
                {userInfo.roleDisplayName} Application
              </Text>
            </View>
          </View>
        </View>

        {/* Registration Status Card */}
        <View className="mx-4 -mt-6">
          <View
            className="rounded-3xl p-4 overflow-hidden"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 1,
            }}
          >
            <View
              className="bg-white rounded-3xl overflow-hidden mb-4"
              style={{
                borderWidth: 1.5,
                borderColor: "#007AFF",
              }}
            >
              <View className="p-6">
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-lg font-comfortaa-bold text-gray-800">
                    Application Status
                  </Text>
                  <View
                    style={{
                      backgroundColor: "#e6f7ff",
                      borderRadius: 16,
                      width: 32,
                      height: 32,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="time-outline" size={20} color="#0099ff" />
                  </View>
                </View>

                <Text className="font-comfortaa text-base text-gray-600 mb-4">
                  {userInfo.statusText}
                </Text>

                {/* Progress Bar */}
                <View className="items-center mb-4">
                  <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <View
                      className="h-full"
                      style={{
                        width: userInfo.progressWidth as any,
                        backgroundColor: PRIMARY_COLOR,
                      }}
                    />
                  </View>
                  <Text className="mt-2 font-comfortaa text-sm text-gray-500 text-center">
                    {user.role === "buddi"
                      ? "We're reviewing your application and references. You'll be notified once approved to proceed with the interview process."
                      : "We're verifying your information and background check. You'll be notified once approved to access the platform."}
                  </Text>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="flex-row items-center justify-between px-2 mt-1">
              <TouchableOpacity
                className="flex-row items-center justify-center py-3 px-5 rounded-full mr-3"
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: "#EAEBF0",
                  backgroundColor: "#fff",
                }}
                onPress={handleRefreshStatus}
                disabled={isRefreshing}
              >
                <Ionicons
                  name={isRefreshing ? "refresh" : "refresh-outline"}
                  size={18}
                  color="#666"
                  style={{ marginRight: 8 }}
                />
                <Text className="font-comfortaa-bold text-gray-700 text-base">
                  {isRefreshing ? "Refreshing..." : "Refresh Status"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center justify-center py-3 px-5 rounded-full"
                style={{ backgroundColor: PRIMARY_COLOR, flex: 1 }}
                onPress={handleContactUs}
              >
                <Text className="font-comfortaa-bold text-white text-base">
                  Contact us
                </Text>
                <Ionicons
                  name="chatbubble-outline"
                  size={18}
                  color="white"
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Information Section */}
        <View className="mt-8 mx-4 mb-12">
          <View
            className="bg-white rounded-3xl p-4 overflow-hidden relative"
            style={{
              borderWidth: 1,
              borderColor: "#EAEBF0",
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 5,
              elevation: 1,
            }}
          >
            {/* What's Next */}
            <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-100">
              <View
                style={{
                  backgroundColor: "#e6f7ff",
                  borderRadius: 12,
                  width: 36,
                  height: 36,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Ionicons
                  name="information-outline"
                  size={20}
                  color="#0099ff"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text className="font-comfortaa-bold text-gray-800 text-base mb-0.5">
                  What&apos;s Next?
                </Text>
                <Text className="font-comfortaa text-xs text-gray-500 leading-4">
                  {user.role === "buddi"
                    ? "Once approved, you'll complete video interviews and background checks before accessing the platform."
                    : "Once approved, you'll gain full access to request pickup services and manage your children's schedules."}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#A0A0A0" />
            </TouchableOpacity>

            {/* Terms & Conditions */}
            <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-100">
              <View
                style={{
                  backgroundColor: "#e6f7ff",
                  borderRadius: 12,
                  width: 36,
                  height: 36,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color="#0099ff"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text className="font-comfortaa-bold text-gray-800 text-base mb-0.5">
                  Terms & Conditions
                </Text>
                <Text className="font-comfortaa text-xs text-gray-500 leading-4">
                  Review our terms and conditions to understand your rights and
                  responsibilities.
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#A0A0A0" />
            </TouchableOpacity>

            {/* Sign Out */}
            <TouchableOpacity
              className="flex-row items-center py-3"
              onPress={handleSignOut}
            >
              <View
                style={{
                  backgroundColor: "#ffe6e6",
                  borderRadius: 12,
                  width: 36,
                  height: 36,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Ionicons name="log-out-outline" size={20} color="#ff4444" />
              </View>
              <View style={{ flex: 1 }}>
                <Text className="font-comfortaa-bold text-gray-800 text-base mb-0.5">
                  Sign Out
                </Text>
                <Text className="font-comfortaa text-xs text-gray-500 leading-4">
                  Sign out of your account
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#A0A0A0" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WaitlistScreen;
