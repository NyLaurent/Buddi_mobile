import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import AnalyticsCard from "../../components/commons/AnalyticsCard";
import CoverageRequestCard from "../../components/commons/CoverageRequestCard";
import PickupCard from "../../components/commons/PickupCard";
import { useAuth } from "../../context/AuthContext";
import BuddiService from "../../services/api/buddi.service";
import SocketService from "../../services/socket";

export default function SchedulePage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { buddiDetails } = useAuth();
  const [matchedPickups, setMatchedPickups] = React.useState<any[]>([]);
  const [activePickup, setActivePickup] = React.useState<any>(null); // New state for current trip

  // Helper to get the socket instance
  const getSocket = () =>
    SocketService.getSocket ? SocketService.getSocket() : null;

  // Helper to emit pickup events to parent's room
  const emitPickupEvent = (eventName: string, pickupData: any, pickup: any) => {
    const socket = getSocket();
    if (socket && pickup) {
      const parentRoomId = `parent-${pickup.parentId}`;
      console.log(
        `[BUDDI SCHEDULE] Emitting ${eventName} to parent room:`,
        parentRoomId
      );
      console.log(`[BUDDI SCHEDULE] Pickup data:`, pickupData);
      console.log(`[BUDDI SCHEDULE] Pickup:`, pickup);
      socket.emit(eventName, {
        roomId: parentRoomId,
        pickupData: pickupData,
      });
    } else {
      console.log(`[BUDDI SCHEDULE] Cannot emit ${eventName}:`, {
        socket: !!socket,
        pickup: !!pickup,
        pickupParentId: pickup?.parentId,
      });
    }
  };
  React.useEffect(() => {
    const fetchMatchedPickups = async () => {
      try {
        if (buddiDetails?.id) {
          const res = await BuddiService.getMatchedRequests(buddiDetails.id);
          setMatchedPickups(res.data || []);
        } else {
          setMatchedPickups([]);
        }
      } catch (err) {
        console.error("[BUDDI SCHEDULE] Error fetching matched pickups:", err);
        setMatchedPickups([]);
      }
    };
    fetchMatchedPickups();
  }, [buddiDetails?.id]);

  // Enhanced socket event listeners for real-time updates
  React.useEffect(() => {
    // Listen for pickup status updates from backend
    SocketService.on("pickup-started", (pickupData: any) => {
      console.log(
        "[BUDDI SCHEDULE] Received pickup-started event:",
        pickupData
      );
      // Update active pickup if this matches any of our pickups
      if (
        activePickup &&
        pickupData.parentPickupRequestId === activePickup.id
      ) {
        setActivePickup(pickupData);
      }
    });

    SocketService.on("child-picked-up", (pickupData: any) => {
      console.log(
        "[BUDDI SCHEDULE] Received child-picked-up event:",
        pickupData
      );
      // Update active pickup if this is the current trip
      if (activePickup && pickupData.id === activePickup.id) {
        setActivePickup(pickupData);
      }
    });

    SocketService.on("trip-completed", (pickupData: any) => {
      console.log(
        "[BUDDI SCHEDULE] Received trip-completed event:",
        pickupData
      );
      // Update active pickup if this is the current trip
      if (activePickup && pickupData.id === activePickup.id) {
        setActivePickup(pickupData);
      }
    });

    SocketService.on("trip-cancelled", (pickupData: any) => {
      console.log(
        "[BUDDI SCHEDULE] Received trip-cancelled event:",
        pickupData
      );
      // Update active pickup if this is the current trip
      if (activePickup && pickupData.id === activePickup.id) {
        setActivePickup(pickupData);
      }
    });

    // Cleanup listeners on unmount
    return () => {
      SocketService.off("pickup-started");
      SocketService.off("child-picked-up");
      SocketService.off("trip-completed");
      SocketService.off("trip-cancelled");
    };
  }, [activePickup]);

  // Tab state for navigator
  const [activeTab, setActiveTab] = React.useState<"pickups" | "coverage">(
    "pickups"
  );

  // Empty coverage requests data - waiting for integration
  const coverageRequestsData: any[] = [];

  // Helper to get today's day as a string (e.g., 'Monday')
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const pickupsToShow = matchedPickups;

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
        className="flex-1 bg-gray-50"
        contentContainerStyle={{
          paddingBottom: Platform.select({
            ios: 120 + insets.bottom,
            android: 110 + insets.bottom,
          }),
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 mb-6 pt-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 bg-primary rounded-xl items-center justify-center"
          >
            <Ionicons name="arrow-back" size={20} color="white" />
          </TouchableOpacity>
          <Text className="text-xl text-black font-comfortaa-bold">
            My Schedule
          </Text>
          <TouchableOpacity className="w-10 h-10 bg-primary rounded-xl items-center justify-center">
            <Ionicons name="ellipsis-horizontal" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View className="px-4 mb-6">
          <View className="flex-row gap-3 mb-3">
            {/* Today's Pickups */}
            <AnalyticsCard
              icon={<Ionicons name="flash" size={20} color="#8B5CF6" />}
              title="Today's Pickups"
              value="0"
              subtitle="0 Schools"
            />

            {/* This Week's Trips */}
            <AnalyticsCard
              icon={<Ionicons name="flash" size={20} color="#8B5CF6" />}
              title="This Week's Trips"
              value="0"
              subtitle="0 Schools"
            />
          </View>

          <View className="flex-row gap-3">
            {/* Coverage Requests */}
            <AnalyticsCard
              icon={<Ionicons name="flash" size={20} color="#8B5CF6" />}
              title="Coverage Requests"
              value="0"
              subtitle="0 Schools"
            />

            {/* Total Earnings */}
            <AnalyticsCard
              icon={
                <View className="w-6 h-6 bg-teal-500 rounded-full items-center justify-center">
                  <Text className="text-white font-bold text-sm">$</Text>
                </View>
              }
              title="Total Earnings"
              value="$0"
              subtitle="All time"
            />
          </View>
        </View>

        {/* View Timesheet Button */}
        <View className="px-4 mb-6">
          <TouchableOpacity
            className="bg-primary rounded-full py-4 items-center"
            onPress={() => router.push("/buddi/timesheet")}
          >
            <View className="flex-row items-center gap-2">
              <Text className="text-white font-comfortaa-bold text-lg">
                View Timesheet
              </Text>
              <Ionicons name="arrow-forward" size={18} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Content Section */}
        <View className="px-4 pb-5">
          {/* Tab Navigator */}
          <View>
            <View className="flex-row bg-[#F8F9FE] rounded-lg mb-6 items-center justify-between w-full min-h-[56px]">
              <TouchableOpacity
                className={`flex-1 items-center rounded-lg ${
                  activeTab === "pickups" ? "bg-white mx-1 py-3" : "py-2"
                }`}
                onPress={() => setActiveTab("pickups")}
              >
                <Text
                  className={`font-comfortaa-bold text-base ${
                    activeTab === "pickups" ? "text-black" : "text-[#71727A]"
                  }`}
                >
                  Your Pickups
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 items-center rounded-lg ${
                  activeTab === "coverage" ? "bg-white mx-1 py-3" : "py-2"
                }`}
                onPress={() => setActiveTab("coverage")}
              >
                <Text
                  className={`font-comfortaa-bold text-base ${
                    activeTab === "coverage" ? "text-black" : "text-[#71727A]"
                  }`}
                >
                  Coverage requests
                </Text>
              </TouchableOpacity>
            </View>
            {activeTab === "pickups" ? (
              <>
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="font-comfortaa-bold text-xl">
                    Your Pickups
                  </Text>
                  <TouchableOpacity
                    className="flex-row items-center gap-1"
                    onPress={() => router.push("/buddi/all-pickups")}
                  >
                    <Text className="text-primary font-comfortaa">
                      View All
                    </Text>
                    <Ionicons name="arrow-forward" size={16} color="#FF932E" />
                  </TouchableOpacity>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingRight: 16 }}
                >
                  {pickupsToShow.length > 0 ? (
                    pickupsToShow.flatMap((pickup) => {
                      console.log(
                        "[BUDDI SCHEDULE] Processing pickup:",
                        pickup.id
                      );

                      // Parse all available days from the array
                      if (
                        !pickup.availableDays ||
                        !Array.isArray(pickup.availableDays)
                      ) {
                        console.log(
                          "[BUDDI SCHEDULE] No available days for pickup:",
                          pickup.id
                        );
                        return [];
                      }

                      const allAvailableDays: string[] = [];
                      pickup.availableDays.forEach((dayString: string) => {
                        const days = dayString
                          .split(",")
                          .map((day: string) => day.trim());
                        allAvailableDays.push(...days);
                      });

                      console.log(
                        "[BUDDI SCHEDULE] All available days:",
                        allAvailableDays
                      );

                      // Show all available days
                      const daysToShow = allAvailableDays;

                      console.log(
                        "[BUDDI SCHEDULE] Days to render:",
                        daysToShow
                      );

                      return daysToShow.map((day: string, dayIndex: number) => (
                        <View
                          key={`${pickup.id}-${day}-${dayIndex}`}
                          className="mr-4"
                        >
                          <PickupCard
                            id={pickup.id.toString()}
                            name={pickup.description || "Pickup Request"}
                            time={pickup.pickupTime || "-"}
                            days={day} // Show only the specific day
                            school={pickup.fromZone || "School"}
                            home={pickup.toZone || "Home"}
                            status={
                              activePickup?.status === "pickedUp"
                                ? "pickedUp"
                                : activePickup?.status === "enRoute"
                                ? "enRoute"
                                : activePickup?.status === "completed"
                                ? "completed"
                                : "notStarted"
                            }
                            pickupTime={
                              activePickup?.pickupTime ||
                              pickup.pickupTime ||
                              "-"
                            }
                            tripStartTime={activePickup?.tripStartTime || "-"}
                            dropoffTime={activePickup?.dropoffTime || "-"}
                            fare={activePickup?.fare || 0}
                            onButtonPress={
                              activePickup?.status === "enRoute" ||
                              activePickup?.status === "pickedUp" ||
                              activePickup?.status === "completed"
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
                                                  pickup.id
                                                );
                                              setActivePickup(res.pickup);
                                              // Emit pickup-started event to parent
                                              emitPickupEvent(
                                                "pickup-started",
                                                res.pickup,
                                                pickup
                                              );
                                              console.log(
                                                "[BUDDI SCHEDULE] Trip started:",
                                                res
                                              );
                                            } catch (err) {
                                              console.error(
                                                "[BUDDI SCHEDULE] Start trip error:",
                                                err
                                              );

                                              // Handle different types of errors
                                              let errorMessage =
                                                "Failed to start trip.";
                                              let shouldShowAlert = true;

                                              if (
                                                err &&
                                                typeof err === "object"
                                              ) {
                                                // Check for network/HTTP errors
                                                if (
                                                  (err as any).status === 400
                                                ) {
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
                                                } else if (
                                                  (err as any).status >= 500
                                                ) {
                                                  errorMessage =
                                                    "Server error. Please try again later.";
                                                } else if (
                                                  (err as any).message
                                                ) {
                                                  errorMessage = (err as any)
                                                    .message;
                                                } else if (
                                                  (err as any).data?.error
                                                ) {
                                                  errorMessage = (err as any)
                                                    .data.error;
                                                }
                                              }

                                              // Check for specific error patterns
                                              if (
                                                errorMessage
                                                  .toLowerCase()
                                                  .includes(
                                                    "already started"
                                                  ) ||
                                                errorMessage
                                                  .toLowerCase()
                                                  .includes(
                                                    "pikcup already started"
                                                  ) ||
                                                errorMessage
                                                  .toLowerCase()
                                                  .includes("not available")
                                              ) {
                                                Alert.alert(
                                                  "Trip Already Started",
                                                  "This pickup trip has already been started. Please check the current status.",
                                                  [
                                                    {
                                                      text: "OK",
                                                      style: "default",
                                                    },
                                                  ]
                                                );
                                              } else if (
                                                errorMessage
                                                  .toLowerCase()
                                                  .includes(
                                                    "pickup not found"
                                                  ) ||
                                                errorMessage
                                                  .toLowerCase()
                                                  .includes("no pickup request")
                                              ) {
                                                Alert.alert(
                                                  "No Pickup Request",
                                                  "No pickup request found. Please wait for the parent to request a pickup.",
                                                  [
                                                    {
                                                      text: "OK",
                                                      style: "default",
                                                    },
                                                  ]
                                                );
                                              } else if (shouldShowAlert) {
                                                Alert.alert(
                                                  "Error",
                                                  errorMessage
                                                );
                                              }
                                            }
                                          },
                                        },
                                      ]
                                    );
                                  }
                            }
                            onPickUp={
                              activePickup?.status === "enRoute"
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
                                                res.pickup,
                                                pickup
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
                              activePickup?.status === "pickedUp"
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
                                                  pickup.pickupTime
                                                );
                                              setActivePickup(res.pickup);
                                              // Emit trip-completed event to parent
                                              emitPickupEvent(
                                                "trip-completed",
                                                res.pickup,
                                                pickup
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
                            cardWidth={340}
                          />
                        </View>
                      ));
                    })
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
                        No pickups assigned yet.
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Comfortaa-Regular",
                          fontSize: 13,
                          color: "#A3A3A3",
                          textAlign: "center",
                        }}
                      >
                        Once you are matched to a pickup, you will see it here.
                      </Text>
                    </View>
                  )}
                </ScrollView>
              </>
            ) : (
              <>
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="font-comfortaa-bold text-xl">
                    Coverage Requests
                  </Text>
                  <TouchableOpacity className="flex-row items-center gap-1">
                    <Text className="text-primary font-comfortaa">
                      View All
                    </Text>
                    <Ionicons name="arrow-forward" size={16} color="#FF932E" />
                  </TouchableOpacity>
                </View>
                <View className="gap-4">
                  {coverageRequestsData.length > 0 ? (
                    coverageRequestsData.map((request, index) => (
                      <CoverageRequestCard
                        key={index}
                        studentName={request.studentName}
                        time={request.time}
                        hourlyRate={request.hourlyRate}
                        school={request.school}
                        home={request.home}
                        requesterName={request.requesterName}
                        requesterEmail={request.requesterEmail}
                        requesterAvatar={request.requesterAvatar}
                        onViewDetails={() => {
                          console.log(
                            "Viewing details for coverage request:",
                            request.studentName
                          );
                        }}
                        onAccept={() => {
                          console.log(
                            "Accepted coverage request for",
                            request.studentName
                          );
                        }}
                      />
                    ))
                  ) : (
                    <View
                      style={{
                        backgroundColor: "#F4F7FE",
                        borderRadius: 16,
                        borderWidth: 1,
                        borderColor: "#E6E6E6",
                        padding: 24,
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 16,
                      }}
                    >
                      <Ionicons
                        name="shield-outline"
                        size={40}
                        color="#FF932E"
                        style={{ marginBottom: 12 }}
                      />
                      <Text
                        style={{
                          fontFamily: "Comfortaa-Bold",
                          fontSize: 18,
                          color: "#FF932E",
                          marginBottom: 6,
                        }}
                      >
                        No Coverage Requests Available
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Comfortaa-Regular",
                          fontSize: 14,
                          color: "#6B7280",
                          textAlign: "center",
                        }}
                      >
                        When parents request coverage for their children,
                        you&apos;ll see those requests here.
                      </Text>
                    </View>
                  )}
                </View>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
