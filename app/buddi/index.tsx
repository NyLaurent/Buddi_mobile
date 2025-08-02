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

  // Helper to emit pickup events to parent's room
  const emitPickupEvent = (eventName: string, pickupData: any) => {
    const socket = getSocket();
    if (socket && matchedCall) {
      const parentRoomId = `parent-${matchedCall.parentId}`;
      console.log(
        `[BUDDI] Emitting ${eventName} to parent room:`,
        parentRoomId
      );
      console.log(`[BUDDI] Pickup data:`, pickupData);
      console.log(`[BUDDI] Matched call:`, matchedCall);
      socket.emit(eventName, {
        roomId: parentRoomId,
        pickupData: pickupData,
      });
    } else {
      console.log(`[BUDDI] Cannot emit ${eventName}:`, {
        socket: !!socket,
        matchedCall: !!matchedCall,
        matchedCallParentId: matchedCall?.parentId,
      });
    }
  };

  // Helper to get today's day as a string (e.g., 'Monday')
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  // Helper to get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return "Good morning";
    } else if (hour >= 12 && hour < 17) {
      return "Good afternoon";
    } else if (hour >= 17 && hour < 21) {
      return "Good evening";
    } else {
      return "Good night";
    }
  };

  // Helper to check if matchedCall is for today
  const isPickupToday =
    matchedCall &&
    matchedCall.availableDays &&
    Array.isArray(matchedCall.availableDays)
      ? matchedCall.availableDays
          .map((d: string) => d.trim().toLowerCase())
          .includes(today.toLowerCase())
      : false;

  // Real-time trip event listeners and local persistence
  useEffect(() => {
    // Handler for trip-completed event
    const handleTripCompleted = async (pickupData: any) => {
      // If this trip is the current matchedCall, update it
      if (matchedCall && pickupData.id === matchedCall.id) {
        setMatchedCall(pickupData);
      }
      // Store in AsyncStorage
      try {
        const stored = await AsyncStorage.getItem("completedTrips");
        const completed = stored ? JSON.parse(stored) : [];
        completed.push(pickupData);
        await AsyncStorage.setItem("completedTrips", JSON.stringify(completed));
        setCompletedTrips(completed);
      } catch (err) {
        console.error("Error storing completed trip:", err);
      }
    };

    // Handler for pickup-requested event (when parent requests pickup)
    const handlePickupRequested = (data: any) => {
      let pickup;
      try {
        pickup = typeof data === "string" ? JSON.parse(data) : data;
      } catch (err) {
        console.error("[BUDDI] Parse error (pickup-requested):", err);
        return;
      }
      console.log("[BUDDI] Pickup requested event received:", pickup);
      console.log(
        "[BUDDI] Current available calls count:",
        availableCalls.length
      );
      console.log("[BUDDI] Current matched call:", matchedCall);

      // Add to available calls if not already there
      setAvailableCalls((prev) => {
        const exists = prev.find((call: any) => call.id === pickup.id);
        if (!exists) {
          console.log("[BUDDI] Adding new pickup to available calls");
          return [...prev, pickup];
        } else {
          console.log("[BUDDI] Pickup already exists in available calls");
        }
        return prev;
      });
    };

    // Handler for pickup-started event
    const handlePickupStarted = (data: any) => {
      let pickup;
      try {
        pickup = typeof data === "string" ? JSON.parse(data) : data;
      } catch (err) {
        console.error("[BUDDI] Parse error (pickup-started):", err);
        return;
      }
      console.log("[BUDDI] Pickup started event received:", pickup);
      console.log("[BUDDI] Current matched call:", matchedCall);
      if (matchedCall && pickup.id === matchedCall.id) {
        console.log("[BUDDI] Updating matched call with pickup started data");
        setMatchedCall(pickup);
      } else {
        console.log("[BUDDI] No match found or different pickup ID");
      }
    };

    // Handler for child-picked-up event
    const handleChildPickedUp = (data: any) => {
      let pickup;
      try {
        pickup = typeof data === "string" ? JSON.parse(data) : data;
      } catch (err) {
        console.error("[BUDDI] Parse error (child-picked-up):", err);
        return;
      }
      console.log("[BUDDI] Child picked up event received:", pickup);
      console.log("[BUDDI] Current matched call:", matchedCall);
      if (matchedCall && pickup.id === matchedCall.id) {
        console.log("[BUDDI] Updating matched call with child picked up data");
        setMatchedCall(pickup);
      } else {
        console.log("[BUDDI] No match found or different pickup ID");
      }
    };

    // Add socket event listeners
    const socket = getSocket();
    if (socket) {
      console.log("[BUDDI] Setting up socket event listeners");
      socket.on("trip-completed", handleTripCompleted);
      socket.on("pickup-requested", handlePickupRequested);
      socket.on("pickup-started", handlePickupStarted);
      socket.on("child-picked-up", handleChildPickedUp);
      console.log("[BUDDI] Socket event listeners set up successfully");
      // Add other event listeners here as needed
    } else {
      console.log("[BUDDI] Socket not available for event listeners");
    }

    // On mount, load completed trips from AsyncStorage
    AsyncStorage.getItem("completedTrips").then((stored) => {
      setCompletedTrips(stored ? JSON.parse(stored) : []);
    });

    // Cleanup listeners on unmount
    return () => {
      const socket = getSocket();
      if (socket) {
        socket.off("trip-completed", handleTripCompleted);
        socket.off("pickup-requested", handlePickupRequested);
        socket.off("pickup-started", handlePickupStarted);
        socket.off("child-picked-up", handleChildPickedUp);
        // Remove other listeners here as needed
      }
    };
  }, [matchedCall]);

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
          {getGreeting()}, {user?.firstName || "Buddi"}
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
            value="0"
            subtitle="0 Schools"
          />
          <AnalyticsCard
            icon={
              <View className="bg-[#00C6AE] w-10 h-10 rounded-full items-center justify-center">
                <Ionicons name="wallet" size={20} color="white" />
              </View>
            }
            title="Total Earnings"
            value="$0"
            subtitle="All time"
          />
        </View>

        {/* Congratulations */}
        {/* <CongratulationsCard
          onViewPress={() => {
            // Handle view press
          }}
        /> */}

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
          {matchedCall && isPickupToday ? (
            // Create separate cards for each available day that matches today
            matchedCall.availableDays
              ?.filter(
                (day: string) =>
                  day.trim().toLowerCase() === today.toLowerCase()
              )
              .map((day: string, index: number) => (
                <PickupCard
                  key={`${matchedCall.id}-${day}-${index}`}
                  id={matchedCall.id?.toString() || "0"}
                  name={"Child"}
                  time={matchedCall.pickupTime || "-"}
                  days={day} // Show only the specific day
                  school={
                    matchedCall.fromLocation || matchedCall.fromZone || "School"
                  }
                  home={matchedCall.toLocation || matchedCall.toZone || "Home"}
                  status={
                    matchedCall.status === "pickedUp"
                      ? "pickedUp"
                      : matchedCall.status === "enRoute"
                      ? "enRoute"
                      : matchedCall.status === "completed"
                      ? "completed"
                      : "notStarted"
                  }
                  pickupTime={matchedCall.pickupTime || "-"}
                  tripStartTime={matchedCall.tripStartTime || "-"}
                  dropoffTime={matchedCall.dropoffTime || "-"}
                  fare={matchedCall.fare || 0}
                  onButtonPress={
                    matchedCall.status === "enRoute" ||
                    matchedCall.status === "pickedUp" ||
                    matchedCall.status === "completed"
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
                                    const res =
                                      await BuddiService.startPickupTrip(
                                        matchedCall.id
                                      );
                                    setMatchedCall(res.pickup);
                                    // Emit pickup-started event to parent
                                    emitPickupEvent(
                                      "pickup-started",
                                      res.pickup
                                    );
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
                    matchedCall.status === "enRoute"
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
                                    const res = await BuddiService.pickUpChild(
                                      matchedCall.id
                                    );
                                    setMatchedCall(res.pickup);
                                    // Emit child-picked-up event to parent
                                    emitPickupEvent(
                                      "child-picked-up",
                                      res.pickup
                                    );
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
                    matchedCall.status === "pickedUp"
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
                                    const res =
                                      await BuddiService.completePickupTrip(
                                        matchedCall.id,
                                        matchedCall.pickupTime
                                      );
                                    setMatchedCall(res.pickup);
                                    // Emit trip-completed event to parent
                                    emitPickupEvent(
                                      "trip-completed",
                                      res.pickup
                                    );
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
              ))
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
                This day is not available for pickups.
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
