import AnalyticsCard from "@/components/commons/AnalyticsCard";
import PageHeader from "@/components/commons/PageHeader";
import CoverageRequestModal from "@/components/modals/CoverageRequestModal";
import SuccessModal from "@/components/modals/SuccessModal";
import CoverageRequestCard from "@/components/parent/CoverageRequestCard";
import KidPickupCard from "@/components/parent/KidPickupCard";
import { useAuth } from "@/context/AuthContext";
import BuddiService from "@/services/api/buddi.service";
import ChildrenService from "@/services/api/children.service";
import ParentService, {
  ParentPickupRequest,
  Pickup,
} from "@/services/api/parent.service";
import notificationService from "@/services/notifications/notification.service";
import SocketService from "@/services/socket";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SchedulePage = () => {
  const router = useRouter();
  const { parentDetails } = useAuth();
  const [activeTab, setActiveTab] = React.useState("pickups");

  // State for real pickup requests and details
  const [pickupRequests, setPickupRequests] = React.useState<
    ParentPickupRequest[]
  >([]);
  const [childDetailsMap, setChildDetailsMap] = React.useState<
    Record<string, any>
  >({});
  const [buddiDetailsMap, setBuddiDetailsMap] = React.useState<
    Record<string, any>
  >({});
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // State for actual pickups tracking
  const [pickups, setPickups] = React.useState<Pickup[]>([]);

  // State for tracking pickup statuses
  const [pickupStatuses, setPickupStatuses] = React.useState<
    Record<number, string>
  >({});
  const [startingTripId, setStartingTripId] = React.useState<number | null>(
    null
  );

  // Notification debouncing to prevent spam
  const [lastNotificationTime, setLastNotificationTime] = React.useState<
    Record<string, number>
  >({});

  // New state for tab navigation
  const [selectedRequestId, setSelectedRequestId] = React.useState<
    number | null
  >(null);
  const [selectedDay, setSelectedDay] = React.useState<string>("");

  // Success modal states
  const [successModal, setSuccessModal] = React.useState({
    visible: false,
    title: "",
    message: "",
    iconName: "checkmark-circle" as keyof typeof Ionicons.glyphMap,
    iconColor: "#22C55E",
  });

  // Helper to send notification only if not sent recently (debouncing)
  const sendNotificationOnce = React.useCallback(
    async (key: string, notificationData: any, minInterval: number = 5000) => {
      const now = Date.now();
      const lastTime = lastNotificationTime[key] || 0;

      if (now - lastTime > minInterval) {
        try {
          await notificationService.sendImmediateNotification(notificationData);
          setLastNotificationTime((prev) => ({ ...prev, [key]: now }));
        } catch (error) {
          console.error(
            `[PARENT] Failed to send notification for key ${key}:`,
            error
          );
        }
      }
    },
    [lastNotificationTime]
  );

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

  // Coverage request modal is handled in the coverage tab only

  // State for coverage requests
  const [coverageRequests, setCoverageRequests] = React.useState<any[]>([]);
  const [coverageLoading, setCoverageLoading] = React.useState(false);
  const [coverageError, setCoverageError] = React.useState<string | null>(null);
  const [coveragePagination, setCoveragePagination] = React.useState({
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 0,
  });

  // Get matched requests only
  const matchedRequests = pickupRequests.filter(
    (request) => request.matchedBuddiId
  );

  // Get all unique days from all matched requests
  const getAllAvailableDays = () => {
    const allDays = new Set<string>();
    matchedRequests.forEach((request) => {
      if (request.availableDays && Array.isArray(request.availableDays)) {
        request.availableDays.forEach((day) => allDays.add(day));
      }
    });
    return Array.from(allDays).sort();
  };

  // Get slots for a specific request and day
  const getSlotsForRequestAndDay = (requestId: number, day: string) => {
    const request = pickupRequests.find((r) => r.id === requestId);
    if (!request || !request.slots) return [];

    // For now, return all slots since we don't have day-specific slot mapping
    // In the future, this could be enhanced to filter by day
    return request.slots;
  };

  // Set initial selected request and day
  React.useEffect(() => {
    if (matchedRequests.length > 0 && !selectedRequestId) {
      setSelectedRequestId(matchedRequests[0].id);
      const firstRequest = matchedRequests[0];
      if (firstRequest.availableDays && firstRequest.availableDays.length > 0) {
        setSelectedDay(firstRequest.availableDays[0]);
      }
    }
  }, [matchedRequests, selectedRequestId]);

  // Get all available days for the selected request
  const getAvailableDaysForRequest = (requestId: number) => {
    const request = pickupRequests.find((r) => r.id === requestId);
    return request?.availableDays || [];
  };

  React.useEffect(() => {
    const fetchDetailsForRequests = async () => {
      if (!parentDetails?.id) return;
      setLoading(true);
      setError(null);
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
          } catch {
            buddiMap[buddiId] = { id: buddiId };
          }
        }
        setBuddiDetailsMap(buddiMap);
      } catch (err: any) {
        setError(err.message || "Failed to fetch pickup requests.");
      } finally {
        setLoading(false);
      }
    };

    const fetchPickups = async () => {
      if (!parentDetails?.id) return;
      try {
        const res = await ParentService.getAllPickups(
          parentDetails.id.toString()
        );
        setPickups(res.pickups || []);
      } catch (err: any) {
        console.error("Failed to fetch pickups:", err);
      }
    };

    fetchDetailsForRequests();
    fetchPickups();

    // On mount, load pickups from AsyncStorage
    AsyncStorage.getItem("parentPickups").then((stored) => {
      if (stored) {
        setPickupRequests(JSON.parse(stored));
      }
    });
  }, [parentDetails?.id]);

  // Socket event listeners for real-time pickup status updates
  React.useEffect(() => {
    // Enhanced socket event listeners for real-time updates
    SocketService.on("pickup-started", (pickupData: any) => {
      // Update both pickups and pickup statuses
      setPickups((prev) => {
        const updated = prev.map((pickup) =>
          pickup.id === pickupData.id
            ? { ...pickup, status: "enRoute" as const, ...pickupData }
            : pickup
        ) as Pickup[];

        // Add new pickup if it doesn't exist
        const exists = updated.find((p) => p.id === pickupData.id);
        if (!exists) {
          updated.push({ ...pickupData, status: "enRoute" as const });
        }

        return updated;
      });

      // Update pickup statuses - use the actual pickup ID from the data
      const pickupId = pickupData.pickupId || pickupData.id;
      setPickupStatuses((prev) => ({
        ...prev,
        [pickupId]: "enRoute",
      }));

      // Send debounced notification to parent that Buddi is en route
      sendNotificationOnce(`pickup-started-${pickupId}`, {
        title: "🚗 Buddi is En Route!",
        body: `Your Buddi has started the trip and is on the way to pick up your child.`,
        data: { type: "pickup_started", pickupId: pickupId },
        priority: "high",
        sound: "default",
      });
    });

    SocketService.on("child-picked-up", (pickupData: any) => {
      setPickups((prev) => {
        const updated = prev.map((pickup) =>
          pickup.id === pickupData.id
            ? { ...pickup, status: "pickedUp" as const, ...pickupData }
            : pickup
        ) as Pickup[];
        return updated;
      });

      // Update pickup statuses
      const pickupId = pickupData.pickupId || pickupData.id;
      setPickupStatuses((prev) => ({
        ...prev,
        [pickupId]: "pickedUp",
      }));

      // Send debounced notification to parent that child has been picked up
      sendNotificationOnce(`child-picked-up-${pickupId}`, {
        title: "👶 Child Picked Up!",
        body: `Great news! Your child has been picked up and is on the way to the destination.`,
        data: { type: "child_picked_up", pickupId: pickupId },
        priority: "high",
        sound: "default",
      });
    });

    SocketService.on("trip-completed", (pickupData: any) => {
      setPickups((prev) => {
        const updated = prev.map((pickup) =>
          pickup.id === pickupData.id
            ? { ...pickup, status: "completed" as const, ...pickupData }
            : pickup
        ) as Pickup[];
        return updated;
      });

      // Update pickup statuses
      const pickupId = pickupData.pickupId || pickupData.id;
      setPickupStatuses((prev) => ({
        ...prev,
        [pickupId]: "completed",
      }));

      // Show completion success modal
      showSuccessModal(
        "Trip Completed! 🎉",
        "Your pickup trip has been completed successfully! Wait for the next day pickup and your buddi to submit their timesheet.",
        "trophy",
        "#FFD700"
      );

      // Send debounced notification to parent that trip is completed
      sendNotificationOnce(`trip-completed-${pickupId}`, {
        title: "✅ Trip Completed!",
        body: `Your child has arrived safely at the destination. The trip has been completed successfully.`,
        data: { type: "trip_completed", pickupId: pickupId },
        priority: "high",
        sound: "default",
      });
    });

    SocketService.on("trip-cancelled", (pickupData: any) => {
      setPickups((prev) => {
        const updated = prev.map((pickup) =>
          pickup.id === pickupData.id
            ? { ...pickup, status: "cancelled" as const, ...pickupData }
            : pickup
        ) as Pickup[];
        return updated;
      });

      // Update pickup statuses
      const pickupId = pickupData.pickupId || pickupData.id;
      setPickupStatuses((prev) => ({
        ...prev,
        [pickupId]: "cancelled",
      }));

      Alert.alert(
        "Trip Cancelled",
        "Your pickup trip has been cancelled. Please contact support if you need assistance.",
        [{ text: "OK", style: "default" }]
      );

      // Send debounced notification to parent that trip was cancelled
      sendNotificationOnce(`trip-cancelled-${pickupId}`, {
        title: "❌ Trip Cancelled",
        body: `Your pickup request has been cancelled. Please check the app for details or contact support.`,
        data: { type: "trip_cancelled", pickupId: pickupId },
        priority: "high",
        sound: "default",
      });
    });

    // Cleanup listeners on unmount
    return () => {
      SocketService.off("pickup-started");
      SocketService.off("child-picked-up");
      SocketService.off("trip-completed");
      SocketService.off("trip-cancelled");
    };
  }, [sendNotificationOnce]);

  // Helper function to get pickup status for a specific slot
  const getPickupStatus = (slotId: number) => {
    return pickupStatuses[slotId] || null;
  };

  // Helper function to get pickup data for a specific slot
  const getPickupData = (slotId: number) => {
    return pickups.find((p) => p.id === slotId);
  };

  // Helper function to get pickup status for a specific request (fallback)
  const getPickupStatusForRequest = (buddiRequestId: number) => {
    return pickupStatuses[buddiRequestId] || null;
  };

  // Helper to refresh pickups
  const refreshPickups = async () => {
    if (!parentDetails?.id) return;
    try {
      const res = await ParentService.getAllPickups(
        parentDetails.id.toString()
      );
      setPickups(res.pickups || []);

      // Also update pickup statuses based on the fetched data
      const newStatuses: Record<number, string> = {};
      (res.pickups || []).forEach((pickup: any) => {
        if (pickup.status) {
          newStatuses[pickup.id] = pickup.status;
        }
      });
      setPickupStatuses(newStatuses);
    } catch (err: any) {
      console.error("Failed to refresh pickups:", err);
    }
  };

  // Function to cancel a trip
  const cancelTrip = async (slotId: number) => {
    try {
      setStartingTripId(slotId);

      // Here you would call the API to cancel the trip
      // For now, we'll just update the local state
      setPickupStatuses((prev) => ({
        ...prev,
        [slotId]: "cancelled",
      }));

      // Show success message
      showSuccessModal(
        "Trip Cancelled",
        "Your pickup trip has been cancelled successfully.",
        "close-circle",
        "#EF4444"
      );

      // Refresh pickups
      await refreshPickups();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to cancel trip.");
    } finally {
      setStartingTripId(null);
    }
  };

  // Function to get trip status display text
  const getTripStatusText = (slotId: number, requestStatus: string) => {
    const pickupStatus = getPickupStatus(slotId);

    if (startingTripId === slotId) {
      return "Starting Trip...";
    }

    // Real-time status from socket events takes priority
    if (pickupStatus === "enRoute") return "En Route";
    if (pickupStatus === "pickedUp") return "Child Picked Up";
    if (pickupStatus === "completed") return "Trip Completed";
    if (pickupStatus === "cancelled") return "Trip Cancelled";

    // Fallback to request status
    if (requestStatus === "matched") {
      return parentDetails?.approvalStage === "pending"
        ? "Background Check Required"
        : "Trip Not Yet Started";
    }

    return "Pending";
  };

  // Function to get trip status color
  const getTripStatusColor = (slotId: number, requestStatus: string) => {
    const pickupStatus = getPickupStatus(slotId);

    if (pickupStatus === "pending") return "#FF932E";
    if (pickupStatus === "enRoute") return "#3B82F6";
    if (pickupStatus === "pickedUp") return "#7C3AED";
    if (pickupStatus === "completed") return "#16A34A";
    if (pickupStatus === "cancelled") return "#EF4444";

    if (
      requestStatus === "matched" &&
      parentDetails?.approvalStage === "pending"
    ) {
      return "#EF4444";
    }

    return undefined;
  };

  // Coverage request modal states - only used in coverage tab
  const [showCoverageModal, setShowCoverageModal] = React.useState(false);
  const [selectedBuddiId, setSelectedBuddiId] = React.useState<string | null>(
    null
  );
  const [selectedBuddiName, setSelectedBuddiName] = React.useState<string>("");

  // Function to handle coverage request creation
  const handleCreateCoverageRequest = async (reason: string) => {
    if (!parentDetails?.id || !selectedBuddiId) {
      Alert.alert(
        "Error",
        "Missing required information for coverage request."
      );
      return;
    }

    try {
      await ParentService.createCoverageRequest({
        parentId: parentDetails.id.toString(),
        buddiId: selectedBuddiId,
        reason: reason,
      });

      // Send debounced notification for successful coverage request
      await sendNotificationOnce(`coverage-request-${Date.now()}`, {
        title: "📋 Coverage Request Sent",
        body: `Your coverage request has been sent to ${
          selectedBuddiName || "Buddi"
        }.`,
        data: { type: "coverage_request_sent", buddiName: selectedBuddiName },
        priority: "high",
        sound: "default",
      });

      Alert.alert(
        "Success",
        "Coverage request sent successfully! Your Buddi will be notified.",
        [
          {
            text: "OK",
            onPress: () => {
              setShowCoverageModal(false);
              setSelectedBuddiId(null);
              setSelectedBuddiName("");
              // Refresh coverage requests list
              if (activeTab === "coverage") {
                fetchCoverageRequests(1);
              }
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Failed to create coverage request."
      );
    }
  };

  // Function to open coverage request modal - only used in coverage tab
  const openCoverageRequestModal = (
    buddiId: string | number,
    buddiName: string
  ) => {
    setSelectedBuddiId(buddiId.toString());
    setSelectedBuddiName(buddiName);
    setShowCoverageModal(true);
  };

  // Function to fetch coverage requests
  const fetchCoverageRequests = async (page: number = 1) => {
    if (!parentDetails?.id) return;

    setCoverageLoading(true);
    setCoverageError(null);

    try {
      const response = await ParentService.getCoverageRequests(
        parentDetails.id.toString(),
        page,
        5
      );

      if (page === 1) {
        setCoverageRequests(response.data);
      } else {
        setCoverageRequests((prev) => [...prev, ...response.data]);
      }

      setCoveragePagination(response.pagination);
    } catch (err: any) {
      setCoverageError(err.message || "Failed to fetch coverage requests.");
    } finally {
      setCoverageLoading(false);
    }
  };

  // Fetch coverage requests when tab is active
  React.useEffect(() => {
    if (activeTab === "coverage" && parentDetails?.id) {
      fetchCoverageRequests(1);
    }
  }, [activeTab, parentDetails?.id]);

  // Periodically refresh pickup statuses to keep them in sync
  React.useEffect(() => {
    if (activeTab === "pickups" && parentDetails?.id) {
      const interval = setInterval(() => {
        refreshPickups();
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [activeTab, parentDetails?.id]);

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
        className="flex-1 bg-white"
        contentContainerStyle={{
          paddingBottom: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="pt-12">
          <PageHeader
            title="Pickup Schedule"
            onMenuPress={() => {
              // Add your menu press handler here
            }}
          />
        </View>

        <View className="px-4 mb-6">
          <View className="flex-row gap-3">
            {/* Today's Pickups */}
            <View className="w-[48%]">
              <AnalyticsCard
                icon={<Ionicons name="calendar" size={20} color="#FF932E" />}
                title="Today's Pickups"
                value={pickupRequests
                  .filter((p) => p.status === "matched")
                  .length.toString()}
                subtitle="Scheduled"
              />
            </View>

            {/* Coverage Requests */}
            <View className="w-[48%]">
              <AnalyticsCard
                icon={
                  <Ionicons name="shield-outline" size={20} color="#3B82F6" />
                }
                title="Coverage Requests"
                value={coveragePagination.total.toString()}
                subtitle={`${
                  coverageRequests.filter((cr) => cr.status === "pending")
                    .length
                } Active`}
              />
            </View>
          </View>
        </View>
        <View className="px-4 mb-6">
          <TouchableOpacity
            className="bg-primary rounded-full py-4 items-center"
            onPress={() => router.push("/parent/timesheets")}
          >
            <View className="flex-row items-center gap-2">
              <Text className="text-white font-comfortaa-bold text-lg">
                View Your Buddis&apos;s Timesheets
              </Text>
              <Ionicons name="arrow-forward" size={18} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        <View className="px-4 pb-5">
          <Text className="text-xl font-comfortaa-bold">Pickup Schedule</Text>
        </View>
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
                    Your Pickup Schedule
                  </Text>
                  <TouchableOpacity
                    onPress={refreshPickups}
                    style={{
                      backgroundColor: "#F3F4F6",
                      padding: 8,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: "#E5E7EB",
                    }}
                  >
                    <Ionicons name="refresh" size={20} color="#374151" />
                  </TouchableOpacity>
                </View>
                {loading ? (
                  <Text
                    style={{
                      color: "#888",
                      fontFamily: "Comfortaa-Regular",
                      marginTop: 10,
                    }}
                  >
                    Loading pickups...
                  </Text>
                ) : error ? (
                  <Text
                    style={{
                      color: "red",
                      fontFamily: "Comfortaa-Regular",
                      marginTop: 10,
                    }}
                  >
                    {error}
                  </Text>
                ) : matchedRequests.length === 0 ? (
                  <View
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
                      No Matched Buddies Yet
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Comfortaa-Regular",
                        fontSize: 13,
                        color: "#A3A3A3",
                        textAlign: "center",
                      }}
                    >
                      Once your buddi requests are matched with buddies,
                      you&apos;ll see your pickup schedule here.
                    </Text>
                  </View>
                ) : (
                  <>
                    {/* Buddi Request Tabs */}
                    <View style={{ marginBottom: 20 }}>
                      <Text
                        style={{
                          fontFamily: "Comfortaa-Bold",
                          fontSize: 16,
                          color: "#374151",
                          marginBottom: 12,
                        }}
                      >
                        Select Request:
                      </Text>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingRight: 16 }}
                      >
                        {matchedRequests.map((request) => {
                          const child = childDetailsMap[request.childId];
                          const isSelected = selectedRequestId === request.id;

                          return (
                            <TouchableOpacity
                              key={request.id}
                              style={{
                                backgroundColor: isSelected
                                  ? "#FF932E"
                                  : "#F3F4F6",
                                borderRadius: 12,
                                paddingVertical: 12,
                                paddingHorizontal: 20,
                                marginRight: 12,
                                borderWidth: 1,
                                borderColor: isSelected ? "#FF932E" : "#E5E7EB",
                                minWidth: 120,
                                alignItems: "center",
                              }}
                              onPress={() => {
                                setSelectedRequestId(request.id);
                                if (
                                  request.availableDays &&
                                  request.availableDays.length > 0
                                ) {
                                  setSelectedDay(request.availableDays[0]);
                                }
                              }}
                            >
                              <Text
                                style={{
                                  fontFamily: "Comfortaa-Bold",
                                  fontSize: 14,
                                  color: isSelected ? "#fff" : "#374151",
                                  textAlign: "center",
                                }}
                              >
                                {request.description || `Request ${request.id}`}
                              </Text>
                              <Text
                                style={{
                                  fontFamily: "Comfortaa-Regular",
                                  fontSize: 11,
                                  color: isSelected ? "#FFE4CC" : "#6B7280",
                                  marginTop: 2,
                                  textAlign: "center",
                                }}
                              >
                                {child?.name || "Child"}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </ScrollView>
                    </View>

                    {/* Day Tabs */}
                    {selectedRequestId && (
                      <View style={{ marginBottom: 20 }}>
                        <Text
                          style={{
                            fontFamily: "Comfortaa-Bold",
                            fontSize: 16,
                            color: "#374151",
                            marginBottom: 12,
                          }}
                        >
                          Select Day:
                        </Text>
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={{ paddingRight: 16 }}
                        >
                          {getAvailableDaysForRequest(selectedRequestId).map(
                            (day) => {
                              const isSelected = selectedDay === day;

                              return (
                                <TouchableOpacity
                                  key={day}
                                  style={{
                                    backgroundColor: isSelected
                                      ? "#3B82F6"
                                      : "#F3F4F6",
                                    borderRadius: 12,
                                    paddingVertical: 10,
                                    paddingHorizontal: 16,
                                    marginRight: 10,
                                    borderWidth: 1,
                                    borderColor: isSelected
                                      ? "#3B82F6"
                                      : "#E5E7EB",
                                    minWidth: 80,
                                    alignItems: "center",
                                  }}
                                  onPress={() => setSelectedDay(day)}
                                >
                                  <Text
                                    style={{
                                      fontFamily: "Comfortaa-Bold",
                                      fontSize: 13,
                                      color: isSelected ? "#fff" : "#374151",
                                    }}
                                  >
                                    {day}
                                  </Text>
                                </TouchableOpacity>
                              );
                            }
                          )}
                        </ScrollView>
                      </View>
                    )}

                    {/* Pickup Slots for Selected Request and Day */}
                    {selectedRequestId && selectedDay && (
                      <View>
                        <Text
                          style={{
                            fontFamily: "Comfortaa-Bold",
                            fontSize: 16,
                            color: "#374151",
                            marginBottom: 12,
                          }}
                        >
                          Pickups for {selectedDay}:
                        </Text>

                        {(() => {
                          const request = pickupRequests.find(
                            (r) => r.id === selectedRequestId
                          );
                          if (!request) {
                            return (
                              <Text
                                style={{
                                  color: "#888",
                                  fontFamily: "Comfortaa-Regular",
                                }}
                              >
                                Request not found
                              </Text>
                            );
                          }

                          const child = childDetailsMap[request.childId];
                          const slots = getSlotsForRequestAndDay(
                            selectedRequestId,
                            selectedDay
                          );

                          if (!child) {
                            return (
                              <Text
                                style={{
                                  color: "#888",
                                  fontFamily: "Comfortaa-Regular",
                                }}
                              >
                                Loading child details...
                              </Text>
                            );
                          }

                          if (slots.length === 0) {
                            return (
                              <View
                                style={{
                                  backgroundColor: "#F3F4F6",
                                  borderRadius: 16,
                                  padding: 20,
                                  alignItems: "center",
                                  borderWidth: 1,
                                  borderColor: "#E5E7EB",
                                }}
                              >
                                <Text
                                  style={{
                                    fontFamily: "Comfortaa-Regular",
                                    fontSize: 14,
                                    color: "#6B7280",
                                    textAlign: "center",
                                  }}
                                >
                                  No pickup slots scheduled for {selectedDay}
                                </Text>
                              </View>
                            );
                          }

                          return (
                            <View style={{ gap: 12 }}>
                              {slots.map((slot: any) => {
                                const buddi = request.matchedBuddiId
                                  ? buddiDetailsMap[request.matchedBuddiId]
                                  : null;
                                const buddiName = buddi?.User?.firstName
                                  ? `${buddi.User.firstName} ${
                                      buddi.User.lastName || ""
                                    }`.trim()
                                  : request.matchedBuddiId
                                  ? `Buddi ${request.matchedBuddiId}`
                                  : "No Buddi";
                                const buddiEmail =
                                  buddi?.User?.email ||
                                  buddi?.email ||
                                  "buddi@email.com";
                                const buddiStatus =
                                  request.status === "matched"
                                    ? "Available"
                                    : "Pending";

                                // Get current pickup status for this slot
                                const currentPickupStatus = getPickupStatus(
                                  slot.id
                                );

                                return (
                                  <View key={slot.id}>
                                    <KidPickupCard
                                      childName={child?.name || "Child"}
                                      remaining={slot.slotStartTime || "-"}
                                      schedule={selectedDay}
                                      buddiName={buddiName}
                                      buddiEmail={buddiEmail}
                                      buddiStatus={buddiStatus}
                                      schoolName={slot.fromLocation || "School"}
                                      destination={slot.toLocation || "Home"}
                                      callPickupTime={slot.slotStartTime}
                                      callDropTime={slot.slotEndTime}
                                      type={request.type}
                                      startDate={request.startDate}
                                      endDate={request.endDate}
                                      fromZone={slot.fromLocation}
                                      toZone={slot.toLocation}
                                      mainAction={getTripStatusText(
                                        slot.id,
                                        request.status
                                      )}
                                      mainActionColor={getTripStatusColor(
                                        slot.id,
                                        request.status
                                      )}
                                      disabled={
                                        currentPickupStatus === "enRoute" ||
                                        currentPickupStatus === "pickedUp" ||
                                        currentPickupStatus === "completed" ||
                                        currentPickupStatus === "cancelled" ||
                                        startingTripId === slot.id ||
                                        (request.status === "matched" &&
                                          parentDetails?.approvalStage ===
                                            "pending")
                                      }
                                      onMainAction={
                                        request.status === "matched" &&
                                        !currentPickupStatus
                                          ? async () => {
                                              // Check if parent has pending approval status
                                              if (
                                                parentDetails?.approvalStage ===
                                                "pending"
                                              ) {
                                                Alert.alert(
                                                  "Background Check Required",
                                                  "To ensure the safety of all children, we require a background check before you can create pickup requests. Please complete your background check first.",
                                                  [
                                                    {
                                                      text: "Cancel",
                                                      style: "cancel",
                                                    },
                                                    {
                                                      text: "Perform Background Check",
                                                      style: "default",
                                                      onPress: () => {
                                                        router.push(
                                                          "/parent/background-check"
                                                        );
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
                                                  {
                                                    text: "Cancel",
                                                    style: "cancel",
                                                  },
                                                  {
                                                    text: "Yes, Start Trip",
                                                    style: "default",
                                                    onPress: async () => {
                                                      try {
                                                        setStartingTripId(
                                                          slot.id
                                                        );

                                                        const res =
                                                          await ParentService.createPickupRequest(
                                                            {
                                                              parentId:
                                                                parentDetails!
                                                                  .id,
                                                              buddiId: Number(
                                                                request.matchedBuddiId!
                                                              ),
                                                              childId:
                                                                request.childId,
                                                              fromLocation:
                                                                slot.fromLocation,
                                                              toLocation:
                                                                slot.toLocation,
                                                              buddiRequestId:
                                                                request.id,
                                                              callId: slot.id,
                                                            }
                                                          );

                                                        // Refresh pickups to get updated status
                                                        await refreshPickups();

                                                        // Show success modal
                                                        showSuccessModal(
                                                          "Trip Started! 🚀",
                                                          "Your pickup trip has been started successfully! The Buddi is now on their way.",
                                                          "car-sport",
                                                          "#22C55E"
                                                        );
                                                      } catch (err: any) {
                                                        let errorMessage =
                                                          "Failed to start trip.";

                                                        // Handle specific 400 error for duplicate pickup
                                                        if (
                                                          err?.response
                                                            ?.status === 400
                                                        ) {
                                                          if (
                                                            typeof err?.response
                                                              ?.data?.error ===
                                                              "string" &&
                                                            err.response.data.error.includes(
                                                              "already requested"
                                                            )
                                                          ) {
                                                            errorMessage =
                                                              "This pickup trip has already been started today. You can only start one trip per day.";
                                                          } else if (
                                                            typeof err?.response
                                                              ?.data?.error ===
                                                              "string" &&
                                                            err.response.data.error.includes(
                                                              "already started"
                                                            )
                                                          ) {
                                                            errorMessage =
                                                              "This pickup trip has already been started. Please check your trip status.";
                                                          } else if (
                                                            err?.response?.data
                                                              ?.error
                                                          ) {
                                                            errorMessage =
                                                              err.response.data
                                                                .error;
                                                          }
                                                        } else if (
                                                          err?.response?.data
                                                            ?.message
                                                        ) {
                                                          errorMessage =
                                                            err.response.data
                                                              .message;
                                                        } else if (
                                                          err?.message
                                                        ) {
                                                          if (
                                                            err.message.includes(
                                                              "Network"
                                                            )
                                                          ) {
                                                            errorMessage =
                                                              "Network error. Please check your connection and try again.";
                                                          } else if (
                                                            err.message.includes(
                                                              "timeout"
                                                            )
                                                          ) {
                                                            errorMessage =
                                                              "Request timed out. Please try again.";
                                                          } else {
                                                            errorMessage =
                                                              err.message;
                                                          }
                                                        }

                                                        Alert.alert(
                                                          "Cannot Start Trip",
                                                          errorMessage,
                                                          [
                                                            {
                                                              text: "OK",
                                                              style: "default",
                                                            },
                                                          ]
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
                                              const pickupData = getPickupData(
                                                slot.id
                                              );
                                              Alert.alert(
                                                "Trip Completed",
                                                `Your trip has been completed successfully!\n\nFare: $${
                                                  pickupData?.fare?.toFixed(
                                                    2
                                                  ) || "0.00"
                                                }\nDuration: ${
                                                  pickupData?.duration || "N/A"
                                                }`,
                                                [
                                                  {
                                                    text: "OK",
                                                    style: "default",
                                                  },
                                                ]
                                              );
                                            }
                                          : undefined
                                      }
                                    />

                                    {/* Cancel Trip Button for In-Progress Trips */}
                                    {(currentPickupStatus === "pending" ||
                                      currentPickupStatus === "enRoute" ||
                                      currentPickupStatus === "pickedUp") && (
                                      <TouchableOpacity
                                        style={{
                                          backgroundColor: "#FEF2F2",
                                          borderWidth: 1,
                                          borderColor: "#FECACA",
                                          borderRadius: 12,
                                          paddingVertical: 8,
                                          paddingHorizontal: 16,
                                          marginTop: 8,
                                          alignSelf: "center",
                                          flexDirection: "row",
                                          alignItems: "center",
                                        }}
                                        onPress={() => {
                                          Alert.alert(
                                            "Cancel Trip",
                                            "Are you sure you want to cancel this trip? This action cannot be undone.",
                                            [
                                              {
                                                text: "No, Keep Trip",
                                                style: "cancel",
                                              },
                                              {
                                                text: "Yes, Cancel Trip",
                                                style: "destructive",
                                                onPress: () =>
                                                  cancelTrip(slot.id),
                                              },
                                            ]
                                          );
                                        }}
                                        disabled={startingTripId === slot.id}
                                      >
                                        <Ionicons
                                          name="close-circle-outline"
                                          size={16}
                                          color="#EF4444"
                                          style={{ marginRight: 6 }}
                                        />
                                        <Text
                                          style={{
                                            color: "#EF4444",
                                            fontFamily: "Comfortaa-Bold",
                                            fontSize: 13,
                                          }}
                                        >
                                          Cancel Trip
                                        </Text>
                                      </TouchableOpacity>
                                    )}
                                  </View>
                                );
                              })}
                            </View>
                          );
                        })()}
                      </View>
                    )}
                  </>
                )}
              </>
            ) : (
              <>
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="font-comfortaa-bold text-xl">
                    Coverage Requests
                  </Text>
                  <TouchableOpacity
                    className="flex-row items-center gap-1"
                    onPress={() => router.push("/parent/coverage-requests")}
                  >
                    <Text className="text-primary font-comfortaa">
                      View All
                    </Text>
                    <Ionicons name="arrow-forward" size={16} color="#FF932E" />
                  </TouchableOpacity>
                </View>
                <View className="gap-4">
                  {coverageLoading && coverageRequests.length === 0 ? (
                    <View style={{ alignItems: "center", padding: 40 }}>
                      <ActivityIndicator size="large" color="#FF932E" />
                      <Text
                        style={{
                          fontFamily: "Comfortaa-Regular",
                          fontSize: 14,
                          color: "#6B7280",
                          marginTop: 12,
                        }}
                      >
                        Loading coverage requests...
                      </Text>
                    </View>
                  ) : coverageError ? (
                    <View
                      style={{
                        backgroundColor: "#FEF2F2",
                        borderRadius: 16,
                        padding: 24,
                        alignItems: "center",
                      }}
                    >
                      <Ionicons
                        name="alert-circle-outline"
                        size={40}
                        color="#F44336"
                      />
                      <Text
                        style={{
                          fontFamily: "Comfortaa-Bold",
                          fontSize: 16,
                          color: "#F44336",
                          marginTop: 12,
                          textAlign: "center",
                        }}
                      >
                        {coverageError}
                      </Text>
                      <TouchableOpacity
                        style={{
                          backgroundColor: "#FF932E",
                          borderRadius: 12,
                          paddingVertical: 12,
                          paddingHorizontal: 20,
                          marginTop: 16,
                        }}
                        onPress={() => fetchCoverageRequests(1)}
                      >
                        <Text
                          style={{
                            fontFamily: "Comfortaa-Bold",
                            fontSize: 14,
                            color: "white",
                          }}
                        >
                          Try Again
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : coverageRequests.length > 0 ? (
                    <>
                      {coverageRequests.map((coverage, index) => (
                        <CoverageRequestCard
                          key={coverage.id}
                          coverage={coverage}
                        />
                      ))}

                      {/* Load More Button */}
                      {coveragePagination.page <
                        coveragePagination.totalPages && (
                        <TouchableOpacity
                          style={{
                            backgroundColor: "#F4F7FE",
                            borderRadius: 12,
                            paddingVertical: 12,
                            paddingHorizontal: 20,
                            alignItems: "center",
                            borderWidth: 1,
                            borderColor: "#E6E6E6",
                          }}
                          onPress={() =>
                            fetchCoverageRequests(coveragePagination.page + 1)
                          }
                          disabled={coverageLoading}
                        >
                          {coverageLoading ? (
                            <ActivityIndicator size="small" color="#FF932E" />
                          ) : (
                            <Text
                              style={{
                                fontFamily: "Comfortaa-Bold",
                                fontSize: 14,
                                color: "#FF932E",
                              }}
                            >
                              Load More
                            </Text>
                          )}
                        </TouchableOpacity>
                      )}

                      {/* Create Coverage Request Button - Always visible when there are matched pickups */}
                      {pickupRequests.length > 0 &&
                        pickupRequests.some(
                          (pickup) => pickup.matchedBuddiId
                        ) && (
                          <TouchableOpacity
                            style={{
                              backgroundColor: "#FF932E",
                              borderRadius: 12,
                              paddingVertical: 12,
                              paddingHorizontal: 20,
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "center",
                              marginTop: 16,
                            }}
                            onPress={() => {
                              // Find the first matched buddi to request coverage from
                              const matchedPickup = pickupRequests.find(
                                (pickup) => pickup.matchedBuddiId
                              );
                              if (
                                matchedPickup &&
                                matchedPickup.matchedBuddiId
                              ) {
                                const buddiName = buddiDetailsMap[
                                  matchedPickup.matchedBuddiId
                                ]?.User?.firstName
                                  ? `${
                                      buddiDetailsMap[
                                        matchedPickup.matchedBuddiId
                                      ].User.firstName
                                    }`
                                  : `Buddi ${matchedPickup.matchedBuddiId}`;
                                openCoverageRequestModal(
                                  matchedPickup.matchedBuddiId,
                                  buddiName
                                );
                              }
                            }}
                          >
                            <Ionicons
                              name="add-circle-outline"
                              size={18}
                              color="white"
                              style={{ marginRight: 6 }}
                            />
                            <Text
                              style={{
                                fontFamily: "Comfortaa-Bold",
                                fontSize: 14,
                                color: "white",
                              }}
                            >
                              Create Another Coverage Request
                            </Text>
                          </TouchableOpacity>
                        )}
                    </>
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
                        No Coverage Requests So Far
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Comfortaa-Regular",
                          fontSize: 14,
                          color: "#6B7280",
                          textAlign: "center",
                          marginBottom: 16,
                        }}
                      >
                        You currently have no coverage requests. When a parent
                        requests coverage, you&apos;ll see it here!
                      </Text>

                      {/* Create Coverage Request Button */}
                      {pickupRequests.length > 0 &&
                        pickupRequests.some(
                          (pickup) => pickup.matchedBuddiId
                        ) && (
                          <TouchableOpacity
                            style={{
                              backgroundColor: "#FF932E",
                              borderRadius: 12,
                              paddingVertical: 12,
                              paddingHorizontal: 20,
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            onPress={() => {
                              // Find the first matched buddi to request coverage from
                              const matchedPickup = pickupRequests.find(
                                (pickup) => pickup.matchedBuddiId
                              );
                              if (
                                matchedPickup &&
                                matchedPickup.matchedBuddiId
                              ) {
                                const buddiName = buddiDetailsMap[
                                  matchedPickup.matchedBuddiId
                                ]?.User?.firstName
                                  ? `${
                                      buddiDetailsMap[
                                        matchedPickup.matchedBuddiId
                                      ].User.firstName
                                    }`
                                  : `Buddi ${matchedPickup.matchedBuddiId}`;
                                openCoverageRequestModal(
                                  matchedPickup.matchedBuddiId,
                                  buddiName
                                );
                              }
                            }}
                          >
                            <Ionicons
                              name="add-circle-outline"
                              size={18}
                              color="white"
                              style={{ marginRight: 6 }}
                            />
                            <Text
                              style={{
                                fontFamily: "Comfortaa-Bold",
                                fontSize: 14,
                                color: "white",
                              }}
                            >
                              Create Coverage Request
                            </Text>
                          </TouchableOpacity>
                        )}
                    </View>
                  )}
                </View>
              </>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Coverage Request Modal */}
      <CoverageRequestModal
        visible={showCoverageModal}
        onClose={() => setShowCoverageModal(false)}
        onSubmit={handleCreateCoverageRequest}
        buddiName={selectedBuddiName}
      />

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
};

export default SchedulePage;
