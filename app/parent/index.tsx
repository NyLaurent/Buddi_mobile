import { Feather, FontAwesome5, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
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
import BuyTokensCTA from "../../components/parent/BuyTokensCTA";
import KidPickupCard from "../../components/parent/KidPickupCard";
import { useAuth } from "../../context/AuthContext";
import BuddiService from "../../services/api/buddi.service";
import ChildrenService from "../../services/api/children.service";
import ParentService, {
  ParentPickupRequest,
  Pickup,
} from "../../services/api/parent.service";
import SocketService from "../../services/socket";

export default function ParentDashboard() {
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const { user, logout, parentDetails, refreshUserData } = useAuth();
  const router = useRouter();

  // New state for pickup requests
  const [pickupRequests, setPickupRequests] = React.useState<
    ParentPickupRequest[]
  >([]);
  const [loadingRequests, setLoadingRequests] = React.useState(true);
  const [errorRequests, setErrorRequests] = React.useState<string | null>(null);

  // New state for actual pickups tracking
  const [pickups, setPickups] = React.useState<Pickup[]>([]);
  const [loadingPickups, setLoadingPickups] = React.useState(true);
  const [errorPickups, setErrorPickups] = React.useState<string | null>(null);

  // New state for child and buddi details per pickup request
  const [childDetailsMap, setChildDetailsMap] = React.useState<
    Record<string, any>
  >({});
  const [buddiDetailsMap, setBuddiDetailsMap] = React.useState<
    Record<string, any>
  >({});
  const [startingTripId, setStartingTripId] = React.useState<number | null>(
    null
  );

  // Helper to emit pickup events to buddi's room
  const emitPickupEvent = (
    eventName: string,
    pickupData: any,
    buddiId: number
  ) => {
    const socket = SocketService.getSocket();
    if (socket) {
      const buddiRoomId = `buddi-${buddiId}`;
      console.log(`[PARENT] Emitting ${eventName} to buddi room:`, buddiRoomId);
      console.log(`[PARENT] Pickup data:`, pickupData);
      console.log(`[PARENT] Socket connected:`, socket.connected);
      socket.emit(eventName, {
        roomId: buddiRoomId,
        pickupData: pickupData,
      });
      console.log(`[PARENT] ${eventName} event emitted successfully`);
    } else {
      console.log(`[PARENT] Cannot emit ${eventName}: socket not available`);
    }
  };

  // Profile polling state
  const [profilePollingInterval, setProfilePollingInterval] =
    React.useState<ReturnType<typeof setInterval> | null>(null);

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

  React.useEffect(() => {
    const fetchDetailsForRequests = async () => {
      if (!parentDetails?.id) return;
      setLoadingRequests(true);
      setErrorRequests(null);
      try {
        const res = await ParentService.getMyPickupRequests(
          parentDetails.id.toString()
        );
        const requests = res.data || [];
        setPickupRequests(requests);
        // Fetch all children for this parent once
        const childrenRes = await ChildrenService.getChildrenByParent(
          parentDetails.id.toString()
        );
        const childrenArr = Array.isArray(childrenRes) ? childrenRes : [];
        // Map childId to child details
        const childMap: Record<string, any> = {};
        childrenArr.forEach((child: any) => {
          childMap[child.id] = child;
        });
        setChildDetailsMap(childMap);
        // Fetch buddi details for each matchedBuddiId
        const buddiIds = Array.from(
          new Set(requests.map((r: any) => r.matchedBuddiId).filter(Boolean))
        );
        const buddiMap: Record<string, any> = {};
        for (const buddiId of buddiIds) {
          try {
            const buddiRes = await BuddiService.getBuddiInfo(
              buddiId.toString()
            );
            buddiMap[buddiId] = buddiRes.data;
          } catch (e) {
            // fallback: just store id
            buddiMap[buddiId] = { id: buddiId };
          }
        }
        setBuddiDetailsMap(buddiMap);
      } catch (err: any) {
        setErrorRequests(err.message || "Failed to fetch pickup requests.");
      } finally {
        setLoadingRequests(false);
      }
    };

    const fetchPickups = async () => {
      if (!parentDetails?.id) return;
      setLoadingPickups(true);
      setErrorPickups(null);
      try {
        const res = await ParentService.getAllPickups(
          parentDetails.id.toString()
        );
        setPickups(res.pickups || []);
      } catch (err: any) {
        setErrorPickups(err.message || "Failed to fetch pickups.");
      } finally {
        setLoadingPickups(false);
      }
    };

    fetchDetailsForRequests();
    fetchPickups();

    // Real-time trip event listeners and local persistence
    const getSocket = () =>
      SocketService.getSocket ? SocketService.getSocket() : null;

    // Helper to update or add a pickup in state
    const upsertPickup = (pickup: any) => {
      setPickupRequests((prev) => {
        const idx = prev.findIndex((p) => p.id === pickup.id);
        let updated;
        if (idx !== -1) {
          updated = [...prev];
          updated[idx] = { ...updated[idx], ...pickup };
        } else {
          updated = [...prev, pickup];
        }
        // Persist to AsyncStorage
        AsyncStorage.setItem("parentPickups", JSON.stringify(updated));
        return updated;
      });
    };

    // pickup-requested
    const handlePickupRequested = (data: any) => {
      let pickup;
      try {
        pickup = typeof data === "string" ? JSON.parse(data) : data;
      } catch (err) {
        console.error("[PARENT] Parse error (pickup-requested):", err);
        return;
      }
      console.log("[PARENT] Pickup requested event received:", pickup);
      console.log(
        "[PARENT] Current pickup requests count:",
        pickupRequests.length
      );
      upsertPickup(pickup);
      // Refresh pickups to get updated status
      refreshPickups();
    };
    // pickup-started
    const handlePickupStarted = (data: any) => {
      let pickup;
      try {
        pickup = typeof data === "string" ? JSON.parse(data) : data;
      } catch (err) {
        console.error("[PARENT] Parse error (pickup-started):", err);
        return;
      }
      console.log("[PARENT] Pickup started event received:", pickup);
      console.log(
        "[PARENT] Current pickup requests count:",
        pickupRequests.length
      );
      upsertPickup(pickup);
      // Refresh pickups to get updated status
      refreshPickups();
    };
    // child-picked-up
    const handleChildPickedUp = (data: any) => {
      let pickup;
      try {
        pickup = typeof data === "string" ? JSON.parse(data) : data;
      } catch (err) {
        console.error("[PARENT] Parse error (child-picked-up):", err);
        return;
      }
      console.log("[PARENT] Child picked up event received:", pickup);
      console.log(
        "[PARENT] Current pickup requests count:",
        pickupRequests.length
      );
      upsertPickup(pickup);
      // Refresh pickups to get updated status
      refreshPickups();
    };
    // trip-completed
    const handleTripCompleted = (data: any) => {
      let pickup;
      try {
        pickup = typeof data === "string" ? JSON.parse(data) : data;
      } catch (err) {
        console.error("[PARENT] Parse error (trip-completed):", err);
        return;
      }
      console.log("[PARENT] Trip completed event received:", pickup);
      console.log(
        "[PARENT] Current pickup requests count:",
        pickupRequests.length
      );
      upsertPickup(pickup);
      // Refresh pickups to get updated status
      refreshPickups();
    };

    // Enhanced socket event listeners for real-time updates
    SocketService.on("pickup-started", (pickupData: any) => {
      console.log("[PARENT] Received pickup-started event:", pickupData);
      // Update pickup status in real-time
      setPickupRequests((prev) =>
        prev.map((pickup) => {
          if (pickup.id === pickupData.id) {
            return { ...pickup, status: "enRoute" };
          }
          return pickup;
        })
      );
    });

    SocketService.on("child-picked-up", (pickupData: any) => {
      console.log("[PARENT] Received child-picked-up event:", pickupData);
      // Update pickup status in real-time
      setPickupRequests((prev) =>
        prev.map((pickup) => {
          if (pickup.id === pickupData.id) {
            return { ...pickup, status: "pickedUp" };
          }
          return pickup;
        })
      );
    });

    SocketService.on("trip-completed", (pickupData: any) => {
      console.log("[PARENT] Received trip-completed event:", pickupData);
      // Update pickup status in real-time
      setPickupRequests((prev) =>
        prev.map((pickup) => {
          if (pickup.id === pickupData.id) {
            return { ...pickup, status: "completed" };
          }
          return pickup;
        })
      );
    });

    SocketService.on("trip-cancelled", (pickupData: any) => {
      console.log("[PARENT] Received trip-cancelled event:", pickupData);
      // Update pickup status in real-time
      setPickupRequests((prev) =>
        prev.map((pickup) => {
          if (pickup.id === pickupData.id) {
            return { ...pickup, status: "cancelled" };
          }
          return pickup;
        })
      );
    });

    // On mount, load pickups from AsyncStorage
    AsyncStorage.getItem("parentPickups").then((stored) => {
      if (stored) {
        setPickupRequests(JSON.parse(stored));
      }
    });

    // Cleanup listeners on unmount
    return () => {
      SocketService.off("pickup-started");
      SocketService.off("child-picked-up");
      SocketService.off("trip-completed");
      SocketService.off("trip-cancelled");
    };
  }, [parentDetails?.id]);

  React.useEffect(() => {
    if (!parentDetails?.id) return;

    // Ensure socket connection and join parent room
    if (user?.userId && user?.role === "parent") {
      console.log("[PARENT] 🔌 Connecting to socket as parent:", user.userId);
      SocketService.connect(user.userId.toString(), "Parent");
    }

    // Handler for real-time pickup events
    const handlePickupStarted = (pickupData: any) => {
      console.log("[PARENT] 🚀 Received pickup-started event:", pickupData);
      console.log("[PARENT] 📊 Current pickups before update:", pickups);
      setPickups((prev) => {
        const updated = prev.map((pickup) =>
          pickup.id === pickupData.id
            ? { ...pickup, status: "enRoute" as const }
            : pickup
        ) as Pickup[];
        console.log(
          "[PARENT] 📊 Updated pickups after pickup-started:",
          updated
        );
        return updated;
      });
    };
    const handleChildPickedUp = (pickupData: any) => {
      console.log("[PARENT] 👶 Received child-picked-up event:", pickupData);
      console.log("[PARENT] 📊 Current pickups before update:", pickups);
      setPickups((prev) => {
        const updated = prev.map((pickup) =>
          pickup.id === pickupData.id
            ? { ...pickup, status: "pickedUp" as const }
            : pickup
        ) as Pickup[];
        console.log(
          "[PARENT] 📊 Updated pickups after child-picked-up:",
          updated
        );
        return updated;
      });
    };
    const handleTripCompleted = (pickupData: any) => {
      console.log("[PARENT] ✅ Received trip-completed event:", pickupData);
      console.log("[PARENT] 📊 Current pickups before update:", pickups);
      setPickups((prev) => {
        const updated = prev.map((pickup) =>
          pickup.id === pickupData.id
            ? { ...pickup, status: "completed" as const }
            : pickup
        ) as Pickup[];
        console.log(
          "[PARENT] 📊 Updated pickups after trip-completed:",
          updated
        );
        return updated;
      });
    };

    // Register listeners
    console.log("[PARENT] 👂 Registering real-time event listeners...");
    SocketService.on("pickup-started", handlePickupStarted);
    SocketService.on("child-picked-up", handleChildPickedUp);
    SocketService.on("trip-completed", handleTripCompleted);

    // Cleanup listeners on unmount or id change
    return () => {
      console.log("[PARENT] 🧹 Cleaning up real-time event listeners...");
      SocketService.off("pickup-started", handlePickupStarted);
      SocketService.off("child-picked-up", handleChildPickedUp);
      SocketService.off("trip-completed", handleTripCompleted);
    };
  }, [parentDetails?.id, user?.userId]);

  // Check socket connection status periodically
  React.useEffect(() => {
    const checkConnection = () => {
      const status = SocketService.getConnectionStatus();
      console.log("[PARENT] Socket connection status:", status);
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

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

  // Enhanced refresh function that also refreshes profile
  const enhancedRefreshPickups = async () => {
    if (!parentDetails?.id) return;
    try {
      console.log(
        "[PARENT] Enhanced refresh - updating pickups and profile..."
      );

      // Refresh pickups
      const res = await ParentService.getAllPickups(
        parentDetails.id.toString()
      );
      setPickups(res.pickups || []);

      // Also refresh profile data
      await refreshProfileData();

      console.log("[PARENT] Enhanced refresh completed");
    } catch (err: any) {
      console.error("Failed to refresh pickups and profile:", err);
    }
  };

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

  const refreshPickups = async () => {
    if (!parentDetails?.id) return;
    try {
      const res = await ParentService.getAllPickups(
        parentDetails.id.toString()
      );
      setPickups(res.pickups || []);
    } catch (err: any) {
      console.error("Failed to refresh pickups:", err);
    }
  };

  // Helper function to get pickup status for a specific request
  const getPickupStatus = (buddiRequestId: number) => {
    const pickup = pickups.find((p) => p.buddiRequestId === buddiRequestId);
    return pickup?.status || null;
  };

  // Helper function to get pickup data for a specific request
  const getPickupData = (buddiRequestId: number) => {
    return pickups.find((p) => p.buddiRequestId === buddiRequestId);
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
              {/* <View
                style={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  backgroundColor: "#EF4444",
                  borderRadius: 9999,
                  width: 24,
                  height: 24,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 2,
                  borderColor: "white",
                  zIndex: 999,
                }}
              >
                <Text className="text-xs text-white font-bold">9</Text>
              </View> */}
            </View>
            {/* Search Icon */}
            {/* <TouchableOpacity className="p-2 bg-orange-400 rounded-xl shadow-sm">
              <Ionicons name="search-outline" size={22} color="white" />
            </TouchableOpacity> */}
            {/* Notification Icon */}
            {/* <TouchableOpacity className="p-2 bg-orange-400 rounded-xl shadow-sm">
              <Ionicons name="notifications-outline" size={22} color="white" />
            </TouchableOpacity> */}
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
        {/* Call to Action Rectangle or Pickup Request Card */}
        {loadingRequests ? (
          <View
            style={{
              marginTop: 28,
              marginBottom: 18,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 16,
              paddingVertical: 10,
            }}
          >
            <ActivityIndicator size="large" color="#FF932E" />
          </View>
        ) : errorRequests ? (
          <View style={{ marginTop: 18, marginBottom: 10 }}>
            <Text style={{ color: "red" }}>{errorRequests}</Text>
          </View>
        ) : pickupRequests.length === 0 ? (
          // Show CTA if no calls
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
                Start your journey by creating a call and discover amazing
                Buddis to help your family!
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
                          onPress: () =>
                            router.push("/parent/background-check"),
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
        ) : // Show first call card and See More if needed
        pickupRequests[0].status === "matched" ? (
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 14,
              marginTop: 18,
              marginBottom: 10,
              flexDirection: "row",
              alignItems: "center",
              shadowColor: "#FF932E",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 4,
              elevation: 1,
              borderWidth: 1,
              borderColor: "#FFE0B2",
            }}
          >
            <FontAwesome5
              name="user-friends"
              size={22}
              color="#FF932E"
              style={{ marginRight: 12 }}
            />
            <Text
              style={{
                color: "#232B3A",
                fontFamily: "Comfortaa-Bold",
                fontSize: 15,
                flex: 1,
              }}
            >
              Matched Buddi!
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "#FF932E",
                borderRadius: 999,
                paddingVertical: 6,
                paddingHorizontal: 16,
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() =>
                router.push({
                  pathname: "/parent/buddi-profile/[buddiId]",
                  params: {
                    buddiId: String(pickupRequests[0].matchedBuddiId ?? ""),
                  },
                })
              }
              activeOpacity={0.85}
            >
              <Text
                style={{
                  color: "#fff",
                  fontFamily: "Comfortaa-Bold",
                  fontSize: 13,
                  marginRight: 6,
                }}
              >
                View
              </Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          // Show first call card and See More if needed (original block for non-matched)
          <>
            <LinearGradient
              colors={["#FF932E", "#FFB86C"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
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
                padding: 20,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {/* Icon with colored circle */}
              <View
                style={{
                  marginRight: 18,
                  alignItems: "center",
                  justifyContent: "flex-start",
                  marginTop: 2,
                }}
              >
                <View
                  style={{
                    backgroundColor: "rgba(255,255,255,0.18)",
                    borderRadius: 999,
                    padding: 14,
                    marginBottom: 4,
                    borderWidth: 2,
                    borderColor: "#fff",
                    shadowColor: "#fff",
                    shadowOpacity: 0.18,
                    shadowRadius: 8,
                    elevation: 2,
                  }}
                >
                  {(() => {
                    const status = pickupRequests[0].status;
                    switch (status) {
                      case "pending":
                        return (
                          <FontAwesome5
                            name="hourglass-half"
                            size={28}
                            color="#fff"
                          />
                        );
                      case "matched":
                        return (
                          <FontAwesome5
                            name="user-friends"
                            size={28}
                            color="#fff"
                          />
                        );
                      case "completed":
                        return (
                          <FontAwesome5
                            name="check-circle"
                            size={28}
                            color="#fff"
                          />
                        );
                      default:
                        return (
                          <FontAwesome5
                            name="info-circle"
                            size={28}
                            color="#fff"
                          />
                        );
                    }
                  })()}
                </View>
              </View>
              <View style={{ flex: 1 }}>
                {/* Status-specific message */}
                {pickupRequests[0].status === "matched" ? (
                  <View
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: 12,
                      padding: 14,
                      marginBottom: 8,
                      flexDirection: "row",
                      alignItems: "center",
                      shadowColor: "#FF932E",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.08,
                      shadowRadius: 4,
                      elevation: 1,
                      borderWidth: 1,
                      borderColor: "#FFE0B2",
                    }}
                  >
                    <FontAwesome5
                      name="user-friends"
                      size={22}
                      color="#FF932E"
                      style={{ marginRight: 12 }}
                    />
                    <Text
                      style={{
                        color: "#232B3A",
                        fontFamily: "Comfortaa-Bold",
                        fontSize: 15,
                        flex: 1,
                      }}
                    >
                      Matched Buddi!
                    </Text>
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#FF932E",
                        borderRadius: 999,
                        paddingVertical: 6,
                        paddingHorizontal: 16,
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                      onPress={() =>
                        router.push({
                          pathname: "/parent/buddi-recommendations/[callId]",
                          params: { callId: pickupRequests[0].id.toString() },
                        })
                      }
                      activeOpacity={0.85}
                    >
                      <Text
                        style={{
                          color: "#fff",
                          fontFamily: "Comfortaa-Bold",
                          fontSize: 13,
                          marginRight: 6,
                        }}
                      >
                        View
                      </Text>
                      <Ionicons name="arrow-forward" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <>
                    {/* Other Statuses - Original Layout */}
                    <Text
                      style={{
                        color: "#fff",
                        fontFamily: "Comfortaa-Regular",
                        fontSize: 15,
                        marginBottom: 10,
                      }}
                    >
                      {pickupRequests[0].status === "pending"
                        ? "Your call is being processed. We will notify you once a Buddi is matched!"
                        : "Your call is being processed."}
                    </Text>
                  </>
                )}

                {/* Description and Status - Only show for non-matched statuses */}
                {pickupRequests[0].status !== "matched" && (
                  <>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      <FontAwesome5
                        name="align-left"
                        size={16}
                        color="#fff"
                        style={{ marginRight: 6 }}
                      />
                      <Text
                        style={{
                          color: "#fff",
                          fontFamily: "Comfortaa-Bold",
                          fontSize: 15,
                          marginRight: 6,
                        }}
                      >
                        Description:
                      </Text>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{
                          color: "#fff",
                          fontFamily: "Comfortaa-Regular",
                          fontSize: 15,
                          flexShrink: 1,
                        }}
                      >
                        {pickupRequests[0].description}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 2,
                      }}
                    >
                      <FontAwesome5
                        name="info-circle"
                        size={16}
                        color="#fff"
                        style={{ marginRight: 6 }}
                      />
                      <Text
                        style={{
                          color: "#fff",
                          fontFamily: "Comfortaa-Bold",
                          fontSize: 15,
                          marginRight: 6,
                        }}
                      >
                        Status:
                      </Text>
                      <Text
                        style={{
                          color: "#fff",
                          fontFamily: "Comfortaa-Regular",
                          fontSize: 15,
                        }}
                      >
                        {pickupRequests[0].status === "pending"
                          ? "Under Review"
                          : pickupRequests[0].status.charAt(0).toUpperCase() +
                            pickupRequests[0].status.slice(1)}
                      </Text>
                    </View>
                  </>
                )}
                {/* Action Buttons - Different for matched status */}
                {pickupRequests[0].status === "matched" ? (
                  <>
                    {/* View Recommendations Button for Matched Status */}
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#fff",
                        borderRadius: 999,
                        paddingVertical: 10,
                        paddingHorizontal: 24,
                        alignSelf: "flex-start",
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 14,
                        shadowColor: "#FF932E",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.15,
                        shadowRadius: 6,
                        elevation: 3,
                      }}
                      onPress={() =>
                        router.push({
                          pathname: "/parent/buddi-recommendations/[callId]",
                          params: { callId: pickupRequests[0].id.toString() },
                        })
                      }
                      activeOpacity={0.85}
                    >
                      <FontAwesome5
                        name="users"
                        size={16}
                        color="#FF932E"
                        style={{ marginRight: 8 }}
                      />
                      <Text
                        style={{
                          color: "#FF932E",
                          fontFamily: "Comfortaa-Bold",
                          fontSize: 15,
                        }}
                      >
                        View Matched Buddi
                      </Text>
                    </TouchableOpacity>
                    {/* See More Button */}
                    <TouchableOpacity
                      style={{
                        backgroundColor: "rgba(255,255,255,0.2)",
                        borderRadius: 999,
                        paddingVertical: 8,
                        paddingHorizontal: 20,
                        alignSelf: "flex-start",
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 10,
                        borderWidth: 1,
                        borderColor: "rgba(255,255,255,0.3)",
                      }}
                      onPress={() => router.push("/parent/my-calls")}
                      activeOpacity={0.85}
                    >
                      <Text
                        style={{
                          color: "#fff",
                          fontFamily: "Comfortaa-Bold",
                          fontSize: 14,
                          marginRight: 6,
                        }}
                      >
                        See All Calls
                      </Text>
                      <Ionicons name="arrow-forward" size={16} color="#fff" />
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    {/* Original buttons for other statuses */}
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#fff",
                        borderRadius: 999,
                        paddingVertical: 8,
                        paddingHorizontal: 22,
                        alignSelf: "flex-start",
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 14,
                        shadowColor: "#FF932E",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 2,
                      }}
                      onPress={() => router.push("/parent/my-calls")}
                      activeOpacity={0.85}
                    >
                      <Text
                        style={{
                          color: "#FF932E",
                          fontFamily: "Comfortaa-Bold",
                          fontSize: 15,
                          marginRight: 8,
                        }}
                      >
                        See More
                      </Text>
                      <Ionicons
                        name="arrow-forward"
                        size={18}
                        color="#FF932E"
                      />
                    </TouchableOpacity>
                    {/* Create Another Call Button */}
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#fff",
                        borderRadius: 999,
                        paddingVertical: 8,
                        paddingHorizontal: 22,
                        alignSelf: "flex-start",
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 10,
                        shadowColor: "#FF932E",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 2,
                      }}
                      onPress={() => router.push("/parent/call-page")}
                      activeOpacity={0.85}
                    >
                      <Text
                        style={{
                          color: "#FF932E",
                          fontFamily: "Comfortaa-Bold",
                          fontSize: 15,
                          marginRight: 8,
                        }}
                      >
                        Request another
                      </Text>
                      <Ionicons
                        name="add-circle-outline"
                        size={18}
                        color="#FF932E"
                      />
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </LinearGradient>
          </>
        )}

        {/* Stats Cards */}
        <View className="flex-row flex-wrap justify-between mb-4">
          <View className="w-[48%] mb-3">
            <AnalyticsCard
              icon={<Feather name="users" size={28} color="#22C55E" />}
              title="Buddis"
              value={pickupRequests
                .filter((p) => p.matchedBuddiId)
                .length.toString()}
              subtitle="Matched"
            />
          </View>
          <View className="w-[48%] mb-3">
            <AnalyticsCard
              icon={<FontAwesome5 name="child" size={28} color="#FF9100" />}
              title="Registered Kids"
              value={Object.keys(childDetailsMap).length.toString()}
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

        {/* Pickup Schedule */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-2 px-2">
            <Text className="text-sm font-comfortaa-bold text-[#232B3A]">
              Your Kids Pickup Schedule
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/parent/schedule" as any)}
              className="flex-row items-center"
            >
              <Text className="text-sm text-primary font-comfortaa mr-1">
                Full Schedule
              </Text>
              <Ionicons name="arrow-forward" size={20} color="#FF9100" />
            </TouchableOpacity>
          </View>

          {/* Refresh Button Inside Box */}
          {/* <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#E5E7EB",
              padding: 16,
              marginBottom: 12,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons
                  name="time-outline"
                  size={20}
                  color="#FF932E"
                  style={{ marginRight: 8 }}
                />
                <Text className="text-sm font-comfortaa-bold text-[#232B3A]">
                  Trip Status Updates
                </Text>
              </View>
              <TouchableOpacity
                onPress={enhancedRefreshPickups}
                className="flex-row items-center"
                style={{
                  opacity: loadingPickups ? 0.5 : 1,
                  backgroundColor: "#FF932E",
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 12,
                  shadowColor: "#FF932E",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.2,
                  shadowRadius: 2,
                  elevation: 2,
                }}
                disabled={loadingPickups}
              >
                <Ionicons
                  name="refresh"
                  size={14}
                  color="#fff"
                  style={{ marginRight: 4 }}
                />
                <Text className="text-xs text-white font-comfortaa-bold">
                  {loadingPickups ? "Refreshing..." : "Refresh Status"}
                </Text>
              </TouchableOpacity>
            </View>
            <Text className="text-xs text-gray-500 mt-2 font-comfortaa">
              Tap refresh to get the latest status of your pickup trips
            </Text>
          </View> */}
          {/* Render KidPickupCard for each pickup request and only for the next relevant day */}
          {pickupRequests.length > 0 ? (
            pickupRequests.map((pickup) => {
              console.log("Processing pickup request:", pickup.id);
              console.log("Pickup request data:", pickup);

              const child = childDetailsMap[pickup.childId];
              console.log("Child details:", child);

              const pickupData = getPickupData(pickup.id);
              console.log("Pickup data:", pickupData);

              const currentPickupStatus = pickupData?.status || null;
              console.log("Current pickup status:", currentPickupStatus);

              // If not matched with a Buddi, show waiting card
              console.log("Matched buddi ID:", pickup.matchedBuddiId);
              if (!pickup.matchedBuddiId) {
                console.log("No matched buddi, showing waiting card");
                return (
                  <View
                    key={`waiting-${pickup.id}`}
                    style={{
                      backgroundColor: "#FFF7ED",
                      borderRadius: 16,
                      borderWidth: 1.2,
                      borderColor: "#FFD9B3",
                      padding: 18,
                      marginVertical: 6,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Comfortaa-Bold",
                        fontSize: 16,
                        color: "#FF932E",
                        marginBottom: 6,
                      }}
                    >
                      Waiting for a matched Buddi
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Comfortaa-Regular",
                        fontSize: 13,
                        color: "#A3A3A3",
                        textAlign: "center",
                      }}
                    >
                      Once a Buddi is matched to your request, you will see your
                      pickups here.
                    </Text>
                  </View>
                );
              }
              let buddiName = undefined;
              let buddiEmail = undefined;
              let buddiAvatar = undefined;
              if (
                pickup.matchedBuddiId &&
                buddiDetailsMap[pickup.matchedBuddiId]
              ) {
                const buddi = buddiDetailsMap[pickup.matchedBuddiId];
                buddiName = `Buddi ${pickup.matchedBuddiId}`;
                buddiEmail =
                  buddi.User?.email || buddi.email || "buddi@email.com";
                buddiAvatar =
                  buddi.profilePicture ||
                  "https://randomuser.me/api/portraits/men/2.jpg";
              } else {
                buddiName = pickup.matchedBuddiId
                  ? `Buddi ${pickup.matchedBuddiId}`
                  : "Buddi";
                buddiEmail = "buddi@email.com";
                buddiAvatar = "https://randomuser.me/api/portraits/men/2.jpg";
              }

              // Determine status based on actual pickup data
              let buddiStatus = "Available";
              if (currentPickupStatus === "pending") {
                buddiStatus = "Trip Started";
              } else if (currentPickupStatus === "enRoute") {
                buddiStatus = "En Route";
              } else if (currentPickupStatus === "pickedUp") {
                buddiStatus = "Child Picked Up";
              } else if (currentPickupStatus === "completed") {
                buddiStatus = "Trip Completed";
              }

              // Find the next relevant day (today if included, otherwise next closest)
              const daysOfWeek = [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ];
              const todayIdx = new Date().getDay();
              let nextDay = null;
              if (pickup.availableDays && pickup.availableDays.length > 0) {
                // Parse the comma-separated available days string
                const availableDaysString = pickup.availableDays[0];
                const availableDays = availableDaysString
                  .split(",")
                  .map((day) => day.trim());

                console.log("🔍 [PICKUP DEBUG] Pickup ID:", pickup.id);
                console.log(
                  "🔍 [PICKUP DEBUG] Today's day:",
                  daysOfWeek[todayIdx]
                );
                console.log("🔍 [PICKUP DEBUG] Today's index:", todayIdx);
                console.log(
                  "🔍 [PICKUP DEBUG] Available days string:",
                  availableDaysString
                );
                console.log(
                  "🔍 [PICKUP DEBUG] Parsed available days:",
                  availableDays
                );
                console.log(
                  "🔍 [PICKUP DEBUG] Raw availableDays array:",
                  pickup.availableDays
                );

                // Try to find today
                const todayName = daysOfWeek[todayIdx];
                console.log(
                  "🔍 [PICKUP DEBUG] Checking if today ('" +
                    todayName +
                    "') is in available days"
                );
                if (availableDays.includes(todayName)) {
                  nextDay = todayName;
                  console.log(
                    "🔍 [PICKUP DEBUG] Found today in available days:",
                    todayName
                  );
                } else {
                  console.log(
                    "🔍 [PICKUP DEBUG] Today NOT found in available days, looking for next closest day"
                  );
                  // Find the next closest day
                  const sortedDays = availableDays
                    .map((day) => ({
                      day,
                      idx: daysOfWeek.indexOf(day),
                    }))
                    .filter((d) => d.idx !== -1)
                    .sort((a, b) => a.idx - b.idx);

                  console.log("🔍 [PICKUP DEBUG] Sorted days:", sortedDays);

                  // Find the first day after today
                  const nextDayAfterToday = sortedDays.find(
                    (d) => d.idx > todayIdx
                  )?.day;
                  const firstAvailableDay = sortedDays[0]?.day;
                  nextDay = nextDayAfterToday || firstAvailableDay;

                  console.log(
                    "🔍 [PICKUP DEBUG] Next day after today:",
                    nextDayAfterToday
                  );
                  console.log(
                    "🔍 [PICKUP DEBUG] First available day:",
                    firstAvailableDay
                  );
                  console.log(
                    "🔍 [PICKUP DEBUG] Final nextDay selected:",
                    nextDay
                  );
                }
              }
              if (!nextDay) {
                console.log(
                  "🔍 [PICKUP DEBUG] No next day found, skipping card"
                );
                return null;
              }
              console.log(
                "🔍 [PICKUP DEBUG] Rendering KidPickupCard for day:",
                nextDay
              );
              return (
                <KidPickupCard
                  key={`${pickup.id}-${nextDay}`}
                  childName={child?.name || "Child"}
                  remaining={pickup.pickupTime || "-"}
                  schedule={nextDay}
                  buddiName={buddiName}
                  buddiEmail={buddiEmail}
                  buddiAvatar={buddiAvatar}
                  buddiStatus={buddiStatus}
                  schoolName={child?.school || pickup.fromZone || "School"}
                  destination={pickup.toZone || "Home"}
                  mainAction={
                    startingTripId === pickup.id
                      ? "Starting Trip..."
                      : currentPickupStatus === "pending"
                      ? "Trip Started"
                      : currentPickupStatus === "enRoute"
                      ? "En Route"
                      : currentPickupStatus === "pickedUp"
                      ? "Child Picked Up"
                      : currentPickupStatus === "completed"
                      ? "Trip Completed"
                      : pickup.status === "matched"
                      ? parentDetails?.approvalStage === "pending"
                        ? "Background Check Required"
                        : "Trip Not Yet Started"
                      : "Pending"
                  }
                  mainActionColor={
                    currentPickupStatus === "pending"
                      ? "#FF932E"
                      : currentPickupStatus === "enRoute"
                      ? "#3B82F6"
                      : currentPickupStatus === "pickedUp"
                      ? "#7C3AED"
                      : currentPickupStatus === "completed"
                      ? "#16A34A"
                      : pickup.status === "matched" &&
                        parentDetails?.approvalStage === "pending"
                      ? "#EF4444"
                      : undefined
                  }
                  disabled={
                    currentPickupStatus === "pending" ||
                    currentPickupStatus === "enRoute" ||
                    currentPickupStatus === "pickedUp" ||
                    currentPickupStatus === "completed" ||
                    startingTripId === pickup.id ||
                    (pickup.status === "matched" &&
                      parentDetails?.approvalStage === "pending")
                  }
                  onMainAction={
                    pickup.status === "matched" && !currentPickupStatus
                      ? async () => {
                          // Check if parent has pending approval status
                          if (parentDetails?.approvalStage === "pending") {
                            Alert.alert(
                              "Background Check Required",
                              "To ensure the safety of all children, we require a background check before you can create pickup requests. Please complete your background check first.",
                              [
                                { text: "Cancel", style: "cancel" },
                                {
                                  text: "Perform Background Check",
                                  style: "default",
                                  onPress: () => {
                                    router.push("/parent/background-check");
                                  },
                                },
                              ]
                            );
                            return;
                          }

                          Alert.alert(
                            "Start Pickup Trip",
                            "Are you ready to start a pickup trip?",
                            [
                              { text: "Cancel", style: "cancel" },
                              {
                                text: "Yes, Start Trip",
                                style: "default",
                                onPress: async () => {
                                  try {
                                    setStartingTripId(pickup.id);
                                    // Debug: log payload and types
                                    console.log("Pickup request payload:", {
                                      parentId: parentDetails!.id,
                                      parentIdType: typeof parentDetails!.id,
                                      buddiId: pickup.matchedBuddiId,
                                      buddiIdType: typeof pickup.matchedBuddiId,
                                      childId: pickup.childId,
                                      childIdType: typeof pickup.childId,
                                      fromLocation: pickup.fromZone,
                                      toLocation: pickup.toZone,
                                    });
                                    const res =
                                      await ParentService.createPickupRequest({
                                        parentId: parentDetails!.id,
                                        buddiId: Number(pickup.matchedBuddiId!),
                                        childId: pickup.childId,
                                        fromLocation: pickup.fromZone,
                                        toLocation: pickup.toZone,
                                        buddiRequestId: pickup.id,
                                        callId: pickup.id,
                                      });
                                    // Refresh pickups to get updated status
                                    await refreshPickups();
                                    Alert.alert(
                                      "Trip Started",
                                      "Your pickup trip has been started successfully! The Buddi is now on their way.",
                                      [{ text: "OK", style: "default" }]
                                    );
                                  } catch (err: any) {
                                    let errorMessage = "Failed to start trip.";

                                    // Handle specific 400 error for duplicate pickup
                                    if (err?.response?.status === 400) {
                                      if (
                                        typeof err?.response?.data?.error ===
                                          "string" &&
                                        err.response.data.error.includes(
                                          "already requested"
                                        )
                                      ) {
                                        errorMessage =
                                          "This pickup trip has already been started today. You can only start one trip per day.";
                                      } else if (
                                        typeof err?.response?.data?.error ===
                                          "string" &&
                                        err.response.data.error.includes(
                                          "already started"
                                        )
                                      ) {
                                        errorMessage =
                                          "This pickup trip has already been started. Please check your trip status.";
                                      } else if (err?.response?.data?.error) {
                                        errorMessage = err.response.data.error;
                                      }
                                    } else if (err?.response?.data?.message) {
                                      errorMessage = err.response.data.message;
                                    } else if (err?.message) {
                                      if (err.message.includes("Network")) {
                                        errorMessage =
                                          "Network error. Please check your connection and try again.";
                                      } else if (
                                        err.message.includes("timeout")
                                      ) {
                                        errorMessage =
                                          "Request timed out. Please try again.";
                                      } else {
                                        errorMessage = err.message;
                                      }
                                    }

                                    Alert.alert(
                                      "Cannot Start Trip",
                                      errorMessage,
                                      [{ text: "OK", style: "default" }]
                                    );
                                  } finally {
                                    setStartingTripId(null);
                                  }
                                },
                              },
                            ]
                          );
                        }
                      : currentPickupStatus === "completed"
                      ? () => {
                          Alert.alert(
                            "Trip Completed",
                            `Your trip has been completed successfully!\n\nFare: $${
                              pickupData?.fare?.toFixed(2) || "0.00"
                            }\nDuration: ${pickupData?.duration || "N/A"}`,
                            [{ text: "OK", style: "default" }]
                          );
                        }
                      : undefined
                  }
                />
              );
            })
          ) : (
            <Text
              style={{
                color: "#888",
                fontFamily: "Comfortaa-Regular",
                marginTop: 10,
              }}
            >
              No pickups scheduled yet.
            </Text>
          )}
        </View>

        {/* Extra Activities Calendar */}
        {/* <View className="mb-6">
          <View className="flex-row justify-between items-center mx-4 mb-2">
            <Text className="font-comfortaa-bold text-xl">Schedule</Text>
            <TouchableOpacity>
              <Text className="text-primary font-comfortaa">View All</Text>
            </TouchableOpacity>
          </View>
          <Calendar
            selectedDate={selectedDate}
            onDaySelect={(date) => setSelectedDate(date)}
            primaryColor="#FF932E"
          />
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
}
