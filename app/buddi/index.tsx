// app/buddi/index.tsx
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import AnalyticsCard from "../../components/commons/AnalyticsCard";
import AvailableCallsCard from "../../components/commons/AvailableCallsCard";
import CongratulationsCard from "../../components/commons/CongratulationsCard";
import PickupCard from "../../components/commons/PickupCard";
import { useAuth } from "../../context/AuthContext";
import BuddiService from "../../services/api/buddi.service";
import SocketService from "../../services/socket";
// import ChildrenService from "../../services/api/children.service";

export default function BuddiHome() {
  const [activeCard, setActiveCard] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const scrollViewRef = useRef(null);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout, buddiDetails } = useAuth();
  const [availableCalls, setAvailableCalls] = useState<any[]>([]);
  const [matchedCall, setMatchedCall] = useState<any>(null);
  const [completedTrips, setCompletedTrips] = useState<any[]>([]);
  // const [childInfo, setChildInfo] = useState<any>(null);

  // Helper to get the socket instance (assume SocketService exposes getSocket())
  const getSocket = () =>
    SocketService.getSocket ? SocketService.getSocket() : null;

  // Helper to get today's day as a string (e.g., 'Monday')
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  // Helper to check if matchedCall is for today
  const isPickupToday =
    matchedCall && Array.isArray(matchedCall.availableDays)
      ? matchedCall.availableDays
          .map((d: string) => d.trim().toLowerCase())
          .includes(today.toLowerCase())
      : false;

  // Helper to get current day's pickup from matched call
  const getCurrentDayPickup = () => {
    console.log("🚀 [BUDDI] Getting current day pickup...");
    console.log("🚀 [BUDDI] Today:", today);
    console.log("🚀 [BUDDI] Matched call:", matchedCall);

    if (!matchedCall || !Array.isArray(matchedCall.availableDays)) {
      console.log("🚀 [BUDDI] No matched call or available days");
      return null;
    }

    console.log("🚀 [BUDDI] Available days:", matchedCall.availableDays);

    const isTodayAvailable = matchedCall.availableDays
      .map((d: string) => d.trim().toLowerCase())
      .includes(today.toLowerCase());

    console.log("🚀 [BUDDI] Is today available?", isTodayAvailable);

    if (isTodayAvailable) {
      const currentDayPickup = {
        ...matchedCall,
        currentDay: today,
        availableDays: [today], // Only show current day
      };
      console.log("🚀 [BUDDI] Current day pickup created:", currentDayPickup);
      return currentDayPickup;
    }

    console.log("🚀 [BUDDI] No pickup for today");
    return null;
  };

  const currentDayPickup = getCurrentDayPickup();

  // Real-time trip event listeners and local persistence
  useEffect(() => {
    console.log("🚀 [BUDDI] Setting up socket event listeners...");

    // Load persisted data on component mount
    const loadPersistedData = async () => {
      try {
        console.log("🚀 [BUDDI] Loading persisted data...");
        const [savedCalls, savedMatchedCall, savedTrips] = await Promise.all([
          SocketService.getAvailableCalls(),
          SocketService.getMatchedCall(),
          SocketService.getCompletedTrips(),
        ]);

        console.log("🚀 [BUDDI] Loaded from storage:", {
          calls: savedCalls.length,
          matchedCall: savedMatchedCall?.id,
          trips: savedTrips.length,
        });

        setAvailableCalls(savedCalls);
        setMatchedCall(savedMatchedCall);
        setCompletedTrips(savedTrips);
      } catch (error) {
        console.error("🚀 [BUDDI] Error loading persisted data:", error);
      }
    };

    loadPersistedData();

    // Handler for pickup-requested event (when parent creates a pickup)
    const handlePickupRequested = (pickupData: any) => {
      console.log("🚀 [BUDDI] Pickup requested event received:", pickupData);

      let pickup;
      try {
        pickup =
          typeof pickupData === "string" ? JSON.parse(pickupData) : pickupData;
        console.log("🚀 [BUDDI] Parsed pickup requested data:", pickup);
      } catch (err) {
        console.error("❌ [BUDDI] Parse error (pickup-requested):", err);
        return;
      }

      // Add to available calls if not already present
      setAvailableCalls((prev) => {
        const exists = prev.some((call) => call.id === pickup.pickupId);
        if (!exists) {
          console.log("🚀 [BUDDI] Adding new pickup to available calls");
          const newCalls = [...prev, pickup];
          // Persist to storage
          SocketService.saveAvailableCalls(newCalls);
          return newCalls;
        }
        console.log("🚀 [BUDDI] Pickup already exists in available calls");
        return prev;
      });

      // If this pickup is for the current buddi, set as matched call
      if (buddiDetails?.id && pickup.matchedBuddiId === buddiDetails.id) {
        console.log("🚀 [BUDDI] Setting as matched call for current buddi");
        setMatchedCall(pickup);
        SocketService.saveMatchedCall(pickup);
      }
    };

    // Handler for pickup-started event
    const handlePickupStarted = (pickupData: any) => {
      console.log("🚀 [BUDDI] Pickup started event received:", pickupData);

      let pickup;
      try {
        pickup =
          typeof pickupData === "string" ? JSON.parse(pickupData) : pickupData;
        console.log("🚀 [BUDDI] Parsed pickup started data:", pickup);
      } catch (err) {
        console.error("❌ [BUDDI] Parse error (pickup-started):", err);
        return;
      }

      // Update available calls
      setAvailableCalls((prev) => {
        const updated = prev.map((call) =>
          call.id === pickup.pickupId ? { ...call, status: "enRoute" } : call
        );
        SocketService.saveAvailableCalls(updated);
        return updated;
      });

      // Update matched call if it's the current one
      if (matchedCall && pickup.pickupId === matchedCall.id) {
        console.log("🚀 [BUDDI] Updating matched call status to enRoute");
        const updatedCall = { ...matchedCall, status: "enRoute" };
        setMatchedCall(updatedCall);
        SocketService.saveMatchedCall(updatedCall);
      }
    };

    // Handler for child-picked-up event
    const handleChildPickedUp = (pickupData: any) => {
      console.log("🚀 [BUDDI] Child picked up event received:", pickupData);

      let pickup;
      try {
        pickup =
          typeof pickupData === "string" ? JSON.parse(pickupData) : pickupData;
        console.log("🚀 [BUDDI] Parsed child picked up data:", pickup);
      } catch (err) {
        console.error("❌ [BUDDI] Parse error (child-picked-up):", err);
        return;
      }

      // Update available calls
      setAvailableCalls((prev) => {
        const updated = prev.map((call) =>
          call.id === pickup.pickupId ? { ...call, status: "pickedUp" } : call
        );
        SocketService.saveAvailableCalls(updated);
        return updated;
      });

      // Update matched call if it's the current one
      if (matchedCall && pickup.pickupId === matchedCall.id) {
        console.log("🚀 [BUDDI] Updating matched call status to pickedUp");
        const updatedCall = { ...matchedCall, status: "pickedUp" };
        setMatchedCall(updatedCall);
        SocketService.saveMatchedCall(updatedCall);
      }
    };

    // Handler for trip-completed event
    const handleTripCompleted = async (pickupData: any) => {
      console.log("🚀 [BUDDI] Trip completed event received:", pickupData);

      let pickup;
      try {
        pickup =
          typeof pickupData === "string" ? JSON.parse(pickupData) : pickupData;
        console.log("🚀 [BUDDI] Parsed trip completed data:", pickup);
      } catch (err) {
        console.error("❌ [BUDDI] Parse error (trip-completed):", err);
        return;
      }

      // If this trip is the current matchedCall, update it
      if (matchedCall && pickup.pickupId === matchedCall.id) {
        console.log("🚀 [BUDDI] Updating matched call status to completed");
        const updatedCall = { ...matchedCall, status: "completed" };
        setMatchedCall(updatedCall);
        SocketService.saveMatchedCall(updatedCall);

        // Add to completed trips
        setCompletedTrips((prev) => {
          const newTrips = [...prev, updatedCall];
          SocketService.saveCompletedTrips(newTrips);
          return newTrips;
        });
      }
    };

    // Add socket event listeners using SocketService
    SocketService.onPickupRequested(handlePickupRequested);
    SocketService.onPickupStarted(handlePickupStarted);
    SocketService.onChildPickedUp(handleChildPickedUp);
    SocketService.onTripCompleted(handleTripCompleted);

    // Cleanup listeners on unmount
    return () => {
      const socket = getSocket();
      if (socket) {
        socket.off("pickup-requested", handlePickupRequested);
        socket.off("pickup-started", handlePickupStarted);
        socket.off("child-picked-up", handleChildPickedUp);
        socket.off("trip-completed", handleTripCompleted);
      }
    };
  }, [matchedCall, buddiDetails?.id]);

  React.useEffect(() => {
    const fetchCalls = async () => {
      try {
        const res = await BuddiService.getAvailableCalls(1, 10);
        setAvailableCalls(res.data || []);
        if (buddiDetails?.id) {
          const matched = res.data.find(
            (call: any) => call.matchedBuddiId === buddiDetails.id
          );
          setMatchedCall(matched || null);
        } else {
          setMatchedCall(null);
        }
      } catch (err) {
        setAvailableCalls([]);
        setMatchedCall(null);
      }
    };
    fetchCalls();
  }, [buddiDetails?.id]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const cardWidth = 300 + 12; // card width + margin
    const newIndex = Math.round(contentOffset / cardWidth);
    setActiveCard(newIndex);
  };

  const handleLogout = () => {
    console.log("Logout button clicked!"); // Debug log
    // Show confirmation modal before logout
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: handleLogoutConfirmed },
    ]);
  };

  // On logout, clear completed trips
  const handleLogoutConfirmed = async () => {
    console.log("User confirmed logout"); // Debug log
    try {
      console.log("Calling logout function..."); // Debug log
      await logout();
      await AsyncStorage.removeItem("completedTrips");
      console.log("Logout successful, navigating to login..."); // Debug log
      router.replace("/auth/login");
    } catch (error) {
      console.error("Logout error:", error); // Debug log
      if (typeof window !== "undefined") {
        window.alert("Failed to logout. Please try again.");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 pt-2"
        contentContainerStyle={{
          paddingBottom: Platform.select({
            ios: 90 + insets.bottom,
            android: 80 + insets.bottom,
          }),
        }}
      >
        <View className="flex-row justify-between px-1 pt-6">
          <Image
            source={require("../../assets/images/logo.png")}
            className="w-[75px] h-[40px]"
            resizeMode="contain"
          />
          <View className="flex-row items-center gap-2 pr-1">
            <TouchableOpacity className="p-2 bg-primary rounded-xl shadow-sm">
              <Ionicons name="search-outline" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              className="p-2 bg-primary rounded-xl shadow-sm"
              onPress={() => router.push("/buddi/messages")}
            >
              <Ionicons name="chatbubbles-outline" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              className="p-2 bg-red-500 rounded-xl shadow-sm"
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <Ionicons name="log-out-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <Text className="text-2xl text-black font-comfortaa-bold m-4">
          Good morning, {user?.firstName || "Buddi"}
        </Text>
        <Text className="text-[#71727A] font-comfortaa mx-5">
          Happy that you are back 😊
        </Text>

        {/* Available Calls CTA Card */}
        <AvailableCallsCard
          onApplyPress={() => {
            router.push("/buddi/available-calls");
          }}
          availableCalls={availableCalls.length}
          matchedCall={matchedCall}
          onViewMatchedCall={(callId) => {
            router.push({
              pathname: "/buddi/call-details/[id]",
              params: { id: callId.toString() },
            });
          }}
        />

        {/* Analytics Cards */}
        <View className="flex-row justify-between px-4 pt-4 gap-3">
          <AnalyticsCard
            icon={
              <View className="bg-[#8B5CF6] w-10 h-10 rounded-full items-center justify-center">
                <Ionicons name="flash" size={20} color="white" />
              </View>
            }
            title="Today's Pickups"
            value="12"
            subtitle="2 Schools"
          />
          <AnalyticsCard
            icon={
              <View className="bg-[#00C6AE] w-10 h-10 rounded-full items-center justify-center">
                <Ionicons name="wallet" size={20} color="white" />
              </View>
            }
            title="Total Earnings"
            value="$1,234"
            subtitle="All time"
          />
        </View>

        {/* Congratulations */}
        <CongratulationsCard
          onViewPress={() => {
            // Handle view press
          }}
        />

        {/* Pickups Header */}
        <View className="flex-row justify-between items-center mx-4 mb-2 pt-5">
          <Text className="font-comfortaa-bold text-xl">Pickups</Text>
          <TouchableOpacity
            onPress={() => router.push("/buddi/schedule" as any)}
          >
            <Text className="text-primary font-comfortaa">View All</Text>
          </TouchableOpacity>
        </View>

        {/* Pickup Cards Horizontal */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12 }}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          pagingEnabled
          decelerationRate="fast"
          snapToInterval={352} // card width (340) + margin (12)
        >
          {currentDayPickup ? (
            <PickupCard
              id={currentDayPickup.id.toString()}
              name={"Child"}
              time={currentDayPickup.pickupTime || "-"}
              days={currentDayPickup.currentDay || "-"}
              school={
                currentDayPickup.fromLocation ||
                currentDayPickup.fromZone ||
                "School"
              }
              home={
                currentDayPickup.toLocation || currentDayPickup.toZone || "Home"
              }
              status={
                currentDayPickup.status === "pickedUp"
                  ? "pickedUp"
                  : currentDayPickup.status === "enRoute"
                  ? "enRoute"
                  : currentDayPickup.status === "completed"
                  ? "completed"
                  : "notStarted"
              }
              pickupTime={currentDayPickup.pickupTime}
              tripStartTime={currentDayPickup.tripStartTime}
              dropoffTime={currentDayPickup.dropoffTime}
              fare={currentDayPickup.fare}
              onButtonPress={
                currentDayPickup.status === "enRoute" ||
                currentDayPickup.status === "pickedUp" ||
                currentDayPickup.status === "completed"
                  ? () => {}
                  : async () => {
                      Alert.alert(
                        "Start Trip",
                        "Are you ready to start this pickup trip?",
                        [
                          { text: "Cancel", style: "cancel" },
                          {
                            text: "Yes, Start Trip",
                            style: "default",
                            onPress: async () => {
                              try {
                                console.log(
                                  "🚀 [BUDDI] Starting pickup trip..."
                                );
                                const res = await BuddiService.startPickupTrip(
                                  currentDayPickup.id
                                );
                                console.log("🚀 [BUDDI] API response:", res);
                                setMatchedCall(res.pickup);

                                // Emit pickup-started event to parent
                                const socket = getSocket();
                                if (socket && currentDayPickup.parentId) {
                                  const eventData = {
                                    pickupId: currentDayPickup.id,
                                    parentId: currentDayPickup.parentId,
                                    buddiId: buddiDetails?.id,
                                    status: "enRoute",
                                    timestamp: new Date().toISOString(),
                                  };
                                  console.log(
                                    "🚀 [BUDDI] Emitting pickup-started event:",
                                    eventData
                                  );
                                  SocketService.emitPickupStarted(eventData);
                                } else {
                                  console.log(
                                    "❌ [BUDDI] Socket not available or parentId missing"
                                  );
                                }
                              } catch (err) {
                                Alert.alert(
                                  "Error",
                                  (err as any)?.message ||
                                    "Failed to start trip."
                                );
                              }
                            },
                          },
                        ]
                      );
                    }
              }
              onPickUp={
                currentDayPickup.status === "enRoute"
                  ? async () => {
                      Alert.alert(
                        "Child Picked Up",
                        "Confirm you have picked up the child?",
                        [
                          { text: "Cancel", style: "cancel" },
                          {
                            text: "Yes, Picked Up",
                            style: "default",
                            onPress: async () => {
                              try {
                                console.log("🚀 [BUDDI] Picking up child...");
                                const res = await BuddiService.pickUpChild(
                                  currentDayPickup.id
                                );
                                console.log("🚀 [BUDDI] API response:", res);
                                setMatchedCall(res.pickup);

                                // Emit child-picked-up event to parent
                                const socket = getSocket();
                                if (socket && currentDayPickup.parentId) {
                                  const eventData = {
                                    pickupId: currentDayPickup.id,
                                    parentId: currentDayPickup.parentId,
                                    buddiId: buddiDetails?.id,
                                    status: "pickedUp",
                                    timestamp: new Date().toISOString(),
                                  };
                                  console.log(
                                    "🚀 [BUDDI] Emitting child-picked-up event:",
                                    eventData
                                  );
                                  SocketService.emitChildPickedUp(eventData);
                                } else {
                                  console.log(
                                    "❌ [BUDDI] Socket not available or parentId missing"
                                  );
                                }
                              } catch (err) {
                                Alert.alert(
                                  "Error",
                                  (err as any)?.message ||
                                    "Failed to mark as picked up."
                                );
                              }
                            },
                          },
                        ]
                      );
                    }
                  : undefined
              }
              onClockOut={
                currentDayPickup.status === "pickedUp"
                  ? async () => {
                      Alert.alert(
                        "Complete Trip",
                        "Are you sure you want to complete this trip?",
                        [
                          { text: "Cancel", style: "cancel" },
                          {
                            text: "Yes, Complete Trip",
                            style: "default",
                            onPress: async () => {
                              try {
                                console.log(
                                  "🚀 [BUDDI] Completing pickup trip..."
                                );
                                const res =
                                  await BuddiService.completePickupTrip(
                                    currentDayPickup.id,
                                    currentDayPickup.pickupTime
                                  );
                                console.log("🚀 [BUDDI] API response:", res);
                                setMatchedCall(res.pickup);

                                // Emit trip-completed event to parent
                                const socket = getSocket();
                                if (socket && currentDayPickup.parentId) {
                                  const eventData = {
                                    pickupId: currentDayPickup.id,
                                    parentId: currentDayPickup.parentId,
                                    buddiId: buddiDetails?.id,
                                    status: "completed",
                                    timestamp: new Date().toISOString(),
                                  };
                                  console.log(
                                    "🚀 [BUDDI] Emitting trip-completed event:",
                                    eventData
                                  );
                                  SocketService.emitTripCompleted(eventData);
                                } else {
                                  console.log(
                                    "❌ [BUDDI] Socket not available or parentId missing"
                                  );
                                }
                              } catch (err) {
                                Alert.alert(
                                  "Error",
                                  (err as any)?.message ||
                                    "Failed to complete trip."
                                );
                              }
                            },
                          },
                        ]
                      );
                    }
                  : undefined
              }
            />
          ) : (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: 340,
                height: 180,
                backgroundColor: "#FFF7ED",
                borderRadius: 16,
                borderWidth: 1.2,
                borderColor: "#FFD9B3",
                marginRight: 12,
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
                No pickups for this day.
              </Text>
              <Text
                style={{
                  fontFamily: "Comfortaa-Regular",
                  fontSize: 13,
                  color: "#A3A3A3",
                  textAlign: "center",
                }}
              >
                No pickups for {today}.
                {matchedCall?.availableDays
                  ? ` Your available days are ${matchedCall.availableDays.join(
                      ", "
                    )}`
                  : " No pickups assigned yet."}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Pagination Dots removed */}

        {/* Calendar Section */}
        {/* <View className="mx-4 mb-6">
          <View className="flex-row justify-between items-center mb-4">
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
