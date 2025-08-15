import { Feather, FontAwesome5, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AnalyticsCard from "../../components/commons/AnalyticsCard";
import SuccessModal from "../../components/modals/SuccessModal";
import BuddiRequestCard from "../../components/parent/BuddiRequestCard";
import BuyTokensCTA from "../../components/parent/BuyTokensCTA";
import { useAuth } from "../../context/AuthContext";
import { BuddiRequestsService } from "../../services/api";
import type { BuddiRequest } from "../../services/api/buddi-requests.service";

export default function ParentDashboard() {
  const { user, logout, parentDetails, refreshUserData } = useAuth();
  const router = useRouter();

  // State for buddi requests
  const [buddiRequests, setBuddiRequests] = React.useState<BuddiRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = React.useState(false);

  // Success modal states
  const [successModal, setSuccessModal] = React.useState({
    visible: false,
    title: "",
    message: "",
    iconName: "checkmark-circle" as keyof typeof Ionicons.glyphMap,
    iconColor: "#22C55E",
  });

  // Helper to show success modal
  const showSuccessModal = (
    title: string,
    message: string,
    iconName: keyof typeof Ionicons.glyphMap = "checkmark-circle",
    iconColor: string = "#22C55E"
  ) => {
    setSuccessModal({
      visible: true,
      title,
      message,
      iconName,
      iconColor,
    });
  };

  // Profile polling state
  const [profilePollingInterval, setProfilePollingInterval] =
    React.useState<ReturnType<typeof setInterval> | null>(null);

  // Function to fetch buddi requests
  const fetchBuddiRequests = async () => {
    if (!parentDetails?.id && !user?.userId) return;

    setLoadingRequests(true);
    try {
      // Try using parentDetails.id first, fallback to user.userId
      const parentId = parentDetails?.id || user?.userId;
      if (!parentId) {
        console.log("[PARENT] No parent ID available");
        return;
      }

      console.log("[PARENT] Fetching buddi requests for parent ID:", parentId);
      console.log("[PARENT] Using parentDetails.id:", parentDetails?.id);
      console.log("[PARENT] Using user.userId:", user?.userId);

      const data = await BuddiRequestsService.getMyRequests(parentId);
      console.log("[PARENT] Buddi requests fetched successfully:", data);
      setBuddiRequests(data.data);
    } catch (error: any) {
      console.error("Error fetching buddi requests:", error.message);
      // You could show an error toast here if needed
    } finally {
      setLoadingRequests(false);
    }
  };

  // Function to refresh profile data
  const refreshProfileData = async () => {
    try {
      console.log("[PARENT] Refreshing profile data...");
      // Use the AuthContext refresh method to update user and parent details
      await refreshUserData();
      console.log("[PARENT] Profile data refreshed successfully");
    } catch (error) {
      console.error("[PARENT] Error refreshing profile:", error);
    }
  };

  // Profile polling effect - poll every 30 seconds to track status changes
  React.useEffect(() => {
    if (!parentDetails?.id) return;

    console.log("[PARENT] Starting profile polling...");
    console.log(
      "[PARENT] Current approval stage:",
      parentDetails.approvalStage
    );
    console.log(
      "[PARENT] Current bg check paid status:",
      parentDetails.isBgCheckPaid
    );

    // Initial profile refresh
    refreshProfileData();

    // Set up polling interval (30 seconds)
    const interval = setInterval(() => {
      console.log("[PARENT] Polling profile for status updates...");
      refreshProfileData();
    }, 30000); // 30 seconds

    setProfilePollingInterval(interval);

    // Cleanup on unmount or when parentDetails changes
    return () => {
      if (interval) {
        console.log("[PARENT] Clearing profile polling interval");
        clearInterval(interval);
        setProfilePollingInterval(null);
      }
    };
  }, [parentDetails?.id]);

  // Fetch buddi requests when parent details are available
  React.useEffect(() => {
    console.log("[PARENT] parentDetails changed:", parentDetails);
    if (parentDetails?.id) {
      console.log(
        "[PARENT] Parent ID found:",
        parentDetails.id,
        "Type:",
        typeof parentDetails.id
      );
      fetchBuddiRequests();
    } else {
      console.log("[PARENT] No parent ID found in parentDetails");
    }
  }, [parentDetails?.id]);

  // Debug effect to log status changes
  React.useEffect(() => {
    if (parentDetails) {
      console.log("[PARENT] Profile status update detected:");
      console.log("  - Approval Stage:", parentDetails.approvalStage);
      console.log("  - Background Check Paid:", parentDetails.isBgCheckPaid);
      console.log("  - Background Check Status:", parentDetails.bgcStatus);
    }
  }, [
    parentDetails?.approvalStage,
    parentDetails?.isBgCheckPaid,
    parentDetails?.bgcStatus,
  ]);

  const handleLogout = () => {
    console.log("Logout button clicked!"); // Debug log
    // Show confirmation modal before logout
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: handleLogoutConfirmed },
    ]);
  };

  // On logout, clear stored pickups
  const handleLogoutConfirmed = async () => {
    console.log("User confirmed logout");
    try {
      console.log("Calling logout function...");
      await logout();
      await AsyncStorage.removeItem("parentPickups");
      console.log("Logout successful, navigating to login...");
      router.replace("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
      if (typeof window !== "undefined") {
        window.alert("Failed to logout. Please try again.");
      }
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff" }}
      edges={["top", "left", "right"]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 bg-white px-3"
        contentContainerStyle={{
          paddingBottom: 20,
        }}
      >
        {/* Header */}
        <View className="flex-row justify-between items-start px-1 pt-12">
          {/* Logo */}
          <Image
            source={require("../../assets/images/logo.png")}
            className="w-[75px] h-[40px] mt-1"
            resizeMode="contain"
          />
          {/* Icons */}
          <View className="flex-row items-center gap-3 pr-1">
            {/* Message Icon with badge */}
            <View className="relative">
              <TouchableOpacity
                className="p-2 bg-orange-400 rounded-xl shadow-sm"
                onPress={() => router.push("/parent/messages")}
              >
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={22}
                  color="white"
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              className="p-2 bg-red-500 rounded-xl shadow-sm"
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <Ionicons name="log-out-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Greeting Row with Avatar */}
        <View className="flex-row items-center mt-6 mb-2 px-1">
          <View className="flex-1 mr-3">
            <Text
              className="text-2xl text-black font-comfortaa-bold"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              Good morning, {user?.firstName || "Parent"}
            </Text>
            <Text
              className="text-[#71727A] font-comfortaa mt-1"
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              Glad to see you again,{" "}
              {user?.role === "parent" ? "Parent" : user?.role}!{" "}
              <Text className="text-lg">😊</Text>
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/parent/profile")}
            activeOpacity={0.7}
          >
            {parentDetails?.profilePicture ? (
              <Image
                source={{ uri: parentDetails.profilePicture }}
                className="w-14 h-14 rounded-full bg-gray-100"
                resizeMode="cover"
              />
            ) : user?.firstName && user?.lastName ? (
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: "#FFD9B3",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 22,
                    color: "#FF932E",
                    fontWeight: "bold",
                    fontFamily: "Comfortaa-Bold",
                  }}
                >
                  {user.firstName[0]?.toUpperCase()}
                  {user.lastName[0]?.toUpperCase()}
                </Text>
              </View>
            ) : (
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: "#FFD9B3",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 22,
                    color: "#FF932E",
                    fontWeight: "bold",
                    fontFamily: "Comfortaa-Bold",
                  }}
                >
                  P
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Approval Status Indicator */}
        {parentDetails?.approvalStage === "pending" && (
          <View className="mt-4 mx-1 bg-orange-50 px-4 py-3 rounded-xl border border-orange-200">
            <View className="flex-row items-center">
              <Ionicons
                name={
                  parentDetails?.isBgCheckPaid ? "checkmark-circle" : "warning"
                }
                size={20}
                color={parentDetails?.isBgCheckPaid ? "#16A34A" : "#F97316"}
              />
              <Text
                className={`font-comfortaa text-sm ml-2 flex-1 ${
                  parentDetails?.isBgCheckPaid
                    ? "text-green-700"
                    : "text-orange-700"
                }`}
              >
                {parentDetails?.isBgCheckPaid
                  ? "You have already completed your background check. Waiting for approval."
                  : "Background check required to create pickup requests"}
              </Text>
            </View>
          </View>
        )}

        {/* Token Buy CTA Card */}
        <BuyTokensCTA
          showButtonBelow={true}
          onPress={() => router.push("/parent/payments")}
        />

        {/* Call to Action Rectangle */}
        <View
          style={{
            borderRadius: 18,
            marginTop: 18,
            marginBottom: 10,
            overflow: "hidden",
            shadowColor: "#FF932E",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 4,
          }}
        >
          <LinearGradient
            colors={["#FF932E", "#FFB86C"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ padding: 20, borderRadius: 18 }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <FontAwesome5
                name="user-friends"
                size={28}
                color="#fff"
                style={{ marginRight: 12 }}
              />
              <Text
                style={{
                  color: "#fff",
                  fontFamily: "Comfortaa-Bold",
                  fontSize: 18,
                  flex: 1,
                }}
              >
                Ready to connect?
              </Text>
            </View>
            <Text
              style={{
                color: "#fff",
                fontFamily: "Comfortaa-Regular",
                fontSize: 15,
                marginBottom: 18,
              }}
            >
              Start your journey by creating a call and discover amazing Buddis
              to help your family!
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "#fff",
                borderRadius: 999,
                paddingVertical: 12,
                paddingHorizontal: 28,
                alignSelf: "flex-start",
                flexDirection: "row",
                alignItems: "center",
                shadowColor: "#FF932E",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.12,
                shadowRadius: 6,
                elevation: 2,
              }}
              onPress={() => {
                if (parentDetails?.approvalStage === "pending") {
                  Alert.alert(
                    "Background Check Required",
                    "To ensure the safety of all children, we require a background check before you can create pickup requests. Please complete your background check first.",
                    [
                      {
                        text: "Perform Background Check",
                        onPress: () => router.push("/parent/background-check"),
                      },
                      {
                        text: "Cancel",
                        style: "cancel",
                      },
                    ]
                  );
                } else {
                  router.push("/parent/call-page");
                }
              }}
              activeOpacity={0.85}
            >
              <FontAwesome5
                name="search"
                size={18}
                color="#FF932E"
                style={{ marginRight: 10 }}
              />
              <Text
                style={{
                  color: "#FF932E",
                  fontFamily: "Comfortaa-Bold",
                  fontSize: 16,
                }}
              >
                Find Your Buddi Now
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Stats Cards */}
        <View className="flex-row flex-wrap justify-between mb-4">
          <View className="w-[48%] mb-3">
            <AnalyticsCard
              icon={<Feather name="users" size={28} color="#22C55E" />}
              title="Buddis"
              value="0"
              subtitle="Matched"
            />
          </View>
          <View className="w-[48%] mb-3">
            <AnalyticsCard
              icon={<FontAwesome5 name="child" size={28} color="#FF9100" />}
              title="Registered Kids"
              value="0"
              subtitle="Total"
            />
          </View>
        </View>

        <View className="px-4 mb-6">
          <TouchableOpacity
            className="bg-primary rounded-full py-4 items-center"
            onPress={() => router.push("/parent/timesheets")}
          >
            <View className="flex-row items-center gap-2">
              <Text className="text-white font-comfortaa-bold text-lg">
                View Buddis&apos;s Timesheets
              </Text>
              <Ionicons name="arrow-forward" size={18} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        {/* My Buddi Requests Section */}
        <View className=" px-1 mb-6">
          <View className="mb-4">
            <Text className="text-xl font-comfortaa-bold text-gray-800 mb-2">
              My Buddi Requests
            </Text>
            <Text className="text-gray-600 font-comfortaa text-sm">
              Track your pickup requests and their status
            </Text>
          </View>

          {loadingRequests ? (
            <View className="bg-gray-50 rounded-xl p-6 items-center">
              <Text className="text-gray-500 font-comfortaa">
                Loading requests...
              </Text>
            </View>
          ) : buddiRequests.length === 0 ? (
            <View className="bg-gray-50 rounded-xl p-6 items-center">
              <FontAwesome5 name="clipboard-list" size={32} color="#9CA3AF" />
              <Text className="text-gray-500 font-comfortaa mt-2 text-center">
                No buddi requests yet
              </Text>
              <Text className="text-gray-400 font-comfortaa text-sm text-center mt-1">
                Create your first pickup request to get started
              </Text>
            </View>
          ) : (
            <View style={{ gap: 16 }}>
              {/* Show only first 2 requests */}
              {buddiRequests.slice(0, 2).map((request) => (
                <BuddiRequestCard key={request.id} request={request} />
              ))}
              
              {/* View All Button */}
              {buddiRequests.length > 2 && (
                <TouchableOpacity
                  style={{
                    backgroundColor: "#FF932E",
                    borderRadius: 16,
                    paddingVertical: 16,
                    paddingHorizontal: 24,
                    alignItems: "center",
                    marginTop: 8,
                  }}
                  onPress={() => router.push("/parent/buddi-requests")}
                  activeOpacity={0.8}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={{
                        color: "#fff",
                        fontFamily: "Comfortaa-Bold",
                        fontSize: 16,
                        marginRight: 8,
                      }}
                    >
                      View All {buddiRequests.length} Requests
                    </Text>
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                  </View>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Success Modal */}
      <SuccessModal
        visible={successModal.visible}
        title={successModal.title}
        message={successModal.message}
        iconName={successModal.iconName}
        iconColor={successModal.iconColor}
        onClose={() => setSuccessModal((prev) => ({ ...prev, visible: false }))}
        autoCloseDelay={4000}
        showCloseButton={true}
      />
    </SafeAreaView>
  );
}
