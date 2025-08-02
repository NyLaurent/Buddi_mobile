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
  const [activePickup, setActivePickup] = useState<any>(null); // New state for current trip
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
  const isPickupToday = (() => {
    if (
      !matchedCall ||
      !matchedCall.availableDays ||
      !Array.isArray(matchedCall.availableDays)
    ) {
      return false;
    }

    // Parse the comma-separated available days string
    const availableDaysString = matchedCall.availableDays[0];
    const availableDays = availableDaysString
      .split(",")
      .map((day: string) => day.trim().toLowerCase());

    console.log("[BUDDI] Available days string:", availableDaysString);
    console.log("[BUDDI] Parsed available days:", availableDays);
    console.log("[BUDDI] Today:", today.toLowerCase());

    return availableDays.includes(today.toLowerCase());
  })();

  // Handler for trip-completed event (moved outside for stability)
  const handleTripCompleted = React.useCallback(
    async (pickupData: any) => {
      console.log("[BUDDI] Handling trip completed:", pickupData);
      // Update active pickup if this is the current trip
      if (activePickup && pickupData.id === activePickup.id) {
        setActivePickup(pickupData);
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
    },
    [activePickup]
  );

  // Enhanced socket event listeners for real-time updates
  useEffect(() => {
    // Listen for pickup status updates from backend
    SocketService.on("pickup-started", (pickupData: any) => {
      console.log("[BUDDI] Received pickup-started event:", pickupData);
      // Update active pickup instead of matched call
      if (matchedCall && pickupData.parentPickupRequestId === matchedCall.id) {
        setActivePickup(pickupData);
      }
    });

    SocketService.on("child-picked-up", (pickupData: any) => {
      console.log("[BUDDI] Received child-picked-up event:", pickupData);
      // Update active pickup instead of matched call
      if (activePickup && pickupData.id === activePickup.id) {
        setActivePickup(pickupData);
      }
    });

    SocketService.on("trip-completed", (pickupData: any) => {
      console.log("[BUDDI] Received trip-completed event:", pickupData);
      // Update active pickup instead of matched call
      if (activePickup && pickupData.id === activePickup.id) {
        setActivePickup(pickupData);
      }
      // Store in AsyncStorage
      handleTripCompleted(pickupData);
    });

    SocketService.on("trip-cancelled", (pickupData: any) => {
      console.log("[BUDDI] Received trip-cancelled event:", pickupData);
      // Update active pickup instead of matched call
      if (activePickup && pickupData.id === activePickup.id) {
        setActivePickup(pickupData);
      }
    });

    // Listen for earnings updates
    SocketService.on("earnings-updated", (data: any) => {
      console.log("[BUDDI] Received earnings-updated event:", data);
      // Update earnings display if needed
    });

    // Listen for timesheet updates
    SocketService.on("timesheet-updated", (timesheetData: any) => {
      console.log("[BUDDI] Received timesheet-updated event:", timesheetData);
      // Update timesheet display if needed
    });

    // Cleanup listeners on unmount
    return () => {
      SocketService.off("pickup-started");
      SocketService.off("child-picked-up");
      SocketService.off("trip-completed");
      SocketService.off("trip-cancelled");
      SocketService.off("earnings-updated");
      SocketService.off("timesheet-updated");
    };
  }, [matchedCall, activePickup]); // Include both dependencies

  // Check socket connection status periodically
  useEffect(() => {
    const checkConnection = () => {
      const status = SocketService.getConnectionStatus();
      console.log("[BUDDI] Socket connection status:", status);
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Real-time trip event listeners and local persistence (legacy)
  useEffect(() => {
    // Handler for trip-completed event
    const handleTripCompleted = async (pickupData: any) => {
      // Update active pickup if this is the current trip
      if (activePickup && pickupData.id === activePickup.id) {
        setActivePickup(pickupData);
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
      // Update active pickup instead of matched call
      if (matchedCall && pickup.parentPickupRequestId === matchedCall.id) {
        console.log("[BUDDI] Updating active pickup with pickup started data");
        setActivePickup(pickup);
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
      console.log("[BUDDI] Current active pickup:", activePickup);
      // Update active pickup instead of matched call
      if (activePickup && pickup.id === activePickup.id) {
        console.log("[BUDDI] Updating active pickup with child picked up data");
        setActivePickup(pickup);
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
  }, [matchedCall, activePickup]); // Include both dependencies

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
          // Clear active pickup when fetching new calls
          setActivePickup(null);
        } else {
          setMatchedCall(null);
          setActivePickup(null);
        }
      } catch (err) {
        setAvailableCalls([]);
        setMatchedCall(null);
        setActivePickup(null);
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
            (() => {
              // Parse the available days string
              const availableDaysString = matchedCall.availableDays[0];
              const availableDays = availableDaysString
                .split(",")
                .map((day: string) => day.trim());

              console.log(
                "[BUDDI] Rendering pickup cards for available days:",
                availableDays
              );

              // Filter for today's day
              const todaysDays = availableDays.filter(
                (day: string) => day.toLowerCase() === today.toLowerCase()
              );

              console.log("[BUDDI] Today's days to render:", todaysDays);

              return todaysDays.map((day: string, index: number) => {
                // Use activePickup data if available, otherwise use matchedCall data
                const pickupData = activePickup || matchedCall;
                const status = activePickup
                  ? activePickup.status
                  : matchedCall.status;

                console.log("[BUDDI] Rendering pickup card with data:", {
                  pickupData,
                  status,
                  isActivePickup: !!activePickup,
                });

                return (
                  <PickupCard
                    key={`${matchedCall.id}-${day}-${index}`}
                    id={pickupData.id?.toString() || "0"}
                    name={"Child"}
                    time={matchedCall.pickupTime || "-"}
                    days={day} // Show only the specific day
                    school={
                      matchedCall.fromLocation ||
                      matchedCall.fromZone ||
                      "School"
                    }
                    home={
                      matchedCall.toLocation || matchedCall.toZone || "Home"
                    }
                    status={
                      status === "pickedUp"
                        ? "pickedUp"
                        : status === "enRoute"
                        ? "enRoute"
                        : status === "completed"
                        ? "completed"
                        : "notStarted"
                    }
                    pickupTime={
                      activePickup?.pickupTime || matchedCall.pickupTime || "-"
                    }
                    tripStartTime={
                      activePickup?.tripStartTime ||
                      matchedCall.tripStartTime ||
                      "-"
                    }
                    dropoffTime={
                      activePickup?.dropoffTime ||
                      matchedCall.dropoffTime ||
                      "-"
                    }
                    fare={activePickup?.fare || matchedCall.fare || 0}
                    onButtonPress={
                      status === "enRoute" ||
                      status === "pickedUp" ||
                      status === "completed"
                        ? () => {}
                        : async () => {
                            // Check if we already have an active pickup to prevent duplicate calls
                            if (
                              activePickup &&
                              activePickup.status !== "pending"
                            ) {
                              Alert.alert(
                                "Trip Already Started",
                                "This pickup trip has already been started. Please check the current status.",
                                [{ text: "OK", style: "default" }]
                              );
                              return;
                            }

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
                                      setActivePickup(res.pickup);
                                      // Emit pickup-started event to parent
                                      emitPickupEvent(
                                        "pickup-started",
                                        res.pickup
                                      );
                                    } catch (err) {
                                      console.log(
                                        "[BUDDI] Start trip error:",
                                        err
                                      );

                                      // Handle different types of errors
                                      let errorMessage =
                                        "Failed to start trip.";
                                      let shouldShowAlert = true;

                                      if (err && typeof err === "object") {
                                        // Check for network/HTTP errors
                                        if ((err as any).status === 400) {
                                          errorMessage =
                                            "This trip has already been started or is not available.";
                                        } else if (
                                          (err as any).status === 401
                                        ) {
                                          errorMessage =
                                            "Please log in again to continue.";
                                        } else if (
                                          (err as any).status === 403
                                        ) {
                                          errorMessage =
                                            "You don't have permission to start this trip.";
                                        } else if (
                                          (err as any).status === 404
                                        ) {
                                          errorMessage =
                                            "No pickup request found. Please wait for the parent to request a pickup.";
                                        } else if ((err as any).status >= 500) {
                                          errorMessage =
                                            "Server error. Please try again later.";
                                        } else if ((err as any).message) {
                                          errorMessage = (err as any).message;
                                        } else if ((err as any).data?.error) {
                                          errorMessage = (err as any).data
                                            .error;
                                        }
                                      }

                                      // Check for specific error patterns
                                      if (
                                        errorMessage
                                          .toLowerCase()
                                          .includes("already started") ||
                                        errorMessage
                                          .toLowerCase()
                                          .includes("pikcup already started") ||
                                        errorMessage
                                          .toLowerCase()
                                          .includes("not available")
                                      ) {
                                        Alert.alert(
                                          "Trip Already Started",
                                          "This pickup trip has already been started. Please check the current status.",
                                          [{ text: "OK", style: "default" }]
                                        );
                                      } else if (
                                        errorMessage
                                          .toLowerCase()
                                          .includes("pickup not found") ||
                                        errorMessage
                                          .toLowerCase()
                                          .includes("no pickup request")
                                      ) {
                                        Alert.alert(
                                          "No Pickup Request",
                                          "No pickup request found. Please wait for the parent to request a pickup.",
                                          [{ text: "OK", style: "default" }]
                                        );
                                      } else if (shouldShowAlert) {
                                        Alert.alert("Error", errorMessage);
                                      }
                                    }
                                  },
                                },
                              ]
                            );
                          }
                    }
                    onPickUp={
                      status === "enRoute"
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
                                      const res =
                                        await BuddiService.pickUpChild(
                                          activePickup.id
                                        );
                                      setActivePickup(res.pickup);
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
                      status === "pickedUp"
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
                                          activePickup.id,
                                          matchedCall.pickupTime
                                        );
                                      setActivePickup(res.pickup);
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
                );
              });
            })()
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
