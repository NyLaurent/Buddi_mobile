import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useRef, useState } from "react";
import {
  Alert,
  AppState,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FullScreenLoader } from "../../../components/commons/FullScreenLoader";
import { useAuth } from "../../../context/AuthContext";

const PRIMARY_COLOR = "#FF932E";
const POLLING_INTERVAL = 30000; // Poll every 30 seconds

const WaitlistScreen = () => {
  const router = useRouter();
  const { user, buddiDetails, parentDetails, refreshUserData, logout } =
    useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);
  const intervalRef = useRef<number | null>(null);

  const navigateToParentPortal = useCallback(async () => {
    setIsNavigating(true);
    clearPollingInterval();
    // Small delay to show loader
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.replace("/parent");
  }, [router]);

  const clearPollingInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // COMMENTED OUT: Status polling functionality - users will be emailed when approved
  // and need to login again manually
  // const checkApprovalAndNavigate = useCallback(async () => {
  //   try {
  //     await refreshUserData();

  //     if (!user) {
  //       console.log("No user found, redirecting to login");
  //       router.replace("/auth/login");
  //       return;
  //     }

  //     if (
  //       user.role === "parent" &&
  //       parentDetails?.approvalStage === "approved"
  //     ) {
  //       console.log("Parent approved, navigating to parent portal");
  //       await navigateToParentPortal();
  //       return;
  //     }

  //     if (user.role === "buddi" && buddiDetails?.status === "Registered") {
  //       console.log("Buddi registered, navigating to interview guidelines");
  //       clearPollingInterval();
  //       router.replace("/auth/interview-guidelines");
  //       return;
  //     }
  //   } catch (error) {
  //     console.error("Error checking approval status:", error);
  //   }
  // }, [
  //   user,
  //   parentDetails,
  //   buddiDetails,
  //   router,
  //   refreshUserData,
  //   clearPollingInterval,
  //   navigateToParentPortal,
  // ]);

  // COMMENTED OUT: Polling setup - now users stay on page until manual login
  // useEffect(() => {
  //   // Initial check
  //   checkApprovalAndNavigate();

  //   // Set up interval for subsequent checks
  //   intervalRef.current = setInterval(
  //     checkApprovalAndNavigate,
  //     POLLING_INTERVAL
  //   );

  //   // Handle app state changes
  //   const subscription = AppState.addEventListener(
  //     "change",
  //     (nextAppState: AppStateStatus) => {
  //       if (
  //         appState.match(/inactive|background/) &&
  //         nextAppState === "active"
  //       ) {
  //         // App has come to foreground
  //         checkApprovalAndNavigate();
  //       }
  //       setAppState(nextAppState);
  //     }
  //   );

  //   // Cleanup
  //   return () => {
  //     clearPollingInterval();
  //     subscription.remove();
  //   };
  // }, [checkApprovalAndNavigate, appState, clearPollingInterval]);

  const getUserDisplayInfo = () => {
    if (!user) return { name: "", email: "", statusText: "", progressWidth: 0 };

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
        progressWidth: 65,
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
        progressWidth: 50,
        roleDisplayName: "Parent",
      };
    }

    return {
      name,
      email,
      statusText: "Application In Review",
      progressWidth: 30,
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
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out? You'll need to log in again once you receive approval via email.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/auth/login");
          },
        },
      ]
    );
  };

  const userInfo = getUserDisplayInfo();

  if (isNavigating) {
    return <FullScreenLoader />;
  }

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
            <View className="w-24 h-24 rounded-full bg-white/20 border-2 border-white mb-2 items-center justify-center">
              <Ionicons name="person" size={48} color="white" />
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
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text className="font-comfortaa-bold text-lg mb-2">
              Registration Status
            </Text>
            <Text className="font-comfortaa text-[#71727A] mb-4">
              {userInfo.statusText}
            </Text>
            <Text className="font-comfortaa text-sm text-[#71727A] mb-4 bg-blue-50 p-3 rounded-lg">
              📧 You will receive an email notification once your application is
              approved. Please log in again after receiving the approval email.
            </Text>

            {/* Progress Bar */}
            <View className="h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
              <View
                className="h-full bg-primary rounded-full"
                style={{ width: `${userInfo.progressWidth}%` }}
              />
            </View>

            {/* Action Buttons */}
            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={handleRefreshStatus}
                disabled={isRefreshing}
                className="flex-row items-center"
              >
                <Ionicons
                  name="refresh"
                  size={20}
                  color={PRIMARY_COLOR}
                  style={{ marginRight: 4 }}
                />
                <Text className="font-comfortaa text-primary">
                  {isRefreshing ? "Refreshing..." : "Refresh Status"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleContactUs}
                className="flex-row items-center"
              >
                <Ionicons
                  name="mail"
                  size={20}
                  color={PRIMARY_COLOR}
                  style={{ marginRight: 4 }}
                />
                <Text className="font-comfortaa text-primary">Contact Us</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          onPress={handleSignOut}
          className="mx-4 mt-4 p-4 bg-red-500 rounded-2xl"
        >
          <Text className="font-comfortaa-bold text-white text-center">
            Return to Login
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WaitlistScreen;
