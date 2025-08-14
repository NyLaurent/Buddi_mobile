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

//     name: "Bryan Smith",
//     time: "2:23:04",
//     days: "$25 per hour",
//     school: "School Nome",
//     home: "Senen",
//   },
//   {
//     name: "Emma Johnson",
//     time: "3:15:30",
//     days: "$22 per hour",
//     school: "Lincoln Elementary",
//     home: "Downtown",
//   },
//   {
//     name: "Michael Davis",
//     time: "8:45:12",
//     days: "$28 per hour",
//     school: "Oak High School",
//     home: "Westside",
//   },
// ];

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

  // Socket event listeners for real-time pickup status updates (copied from parent index)
  React.useEffect(() => {
    // Enhanced socket event listeners for real-time updates
    SocketService.on("pickup-started", (pickupData: any) => {
      console.log("[SCHEDULE] Received pickup-started event:", pickupData);
      console.log("[SCHEDULE] 📊 Current pickups before update:", pickups);

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

        console.log(
          "[SCHEDULE] 📊 Updated pickups after pickup-started:",
          updated
        );
        return updated;
      });

      // Update pickup statuses
      setPickupStatuses((prev) => ({
        ...prev,
        [pickupData.id]: "enRoute",
      }));

      // Send notification to parent that Buddi is en route
      try {
        notificationService.sendImmediateNotification({
          title: "🚗 Buddi is En Route!",
          body: `Your Buddi has started the trip and is on the way to pick up your child.`,
          data: { type: "pickup_started", pickupId: pickupData.id },
          priority: "high",
          sound: "default",
        });
      } catch (error) {
        console.log("Failed to send notification:", error);
      }
    });

    SocketService.on("child-picked-up", (pickupData: any) => {
      console.log("[SCHEDULE] Received child-picked-up event:", pickupData);
      console.log("[SCHEDULE] 📊 Current pickups before update:", pickups);

      setPickups((prev) => {
        const updated = prev.map((pickup) =>
          pickup.id === pickupData.id
            ? { ...pickup, status: "pickedUp" as const, ...pickupData }
            : pickup
        ) as Pickup[];
        console.log(
          "[SCHEDULE] 📊 Updated pickups after child-picked-up:",
          updated
        );
        return updated;
      });

      // Update pickup statuses
      setPickupStatuses((prev) => ({
        ...prev,
        [pickupData.id]: "pickedUp",
      }));

      // Send notification to parent that child has been picked up
      try {
        notificationService.sendImmediateNotification({
          title: "👶 Child Picked Up!",
          body: `Great news! Your child has been picked up and is on the way to the destination.`,
          data: { type: "child_picked_up", pickupId: pickupData.id },
          priority: "high",
          sound: "default",
        });
      } catch (error) {
        console.log("Failed to send notification:", error);
      }
    });

    SocketService.on("trip-completed", (pickupData: any) => {
      console.log("[SCHEDULE] Received trip-completed event:", pickupData);
      console.log("[SCHEDULE] 📊 Current pickups before update:", pickups);

      setPickups((prev) => {
        const updated = prev.map((pickup) =>
          pickup.id === pickupData.id
            ? { ...pickup, status: "completed" as const, ...pickupData }
            : pickup
        ) as Pickup[];
        console.log(
          "[SCHEDULE] 📊 Updated pickups after trip-completed:",
          updated
        );
        return updated;
      });

      // Update pickup statuses
      setPickupStatuses((prev) => ({
        ...prev,
        [pickupData.id]: "completed",
      }));

      // Show completion success modal
      showSuccessModal(
        "Trip Completed! 🎉",
        "Your pickup trip has been completed successfully! Wait for the next day pickup and your buddi to submit their timesheet.",
        "trophy",
        "#FFD700"
      );

      // Send notification to parent that trip is completed
      try {
        notificationService.sendImmediateNotification({
          title: "✅ Trip Completed!",
          body: `Your child has arrived safely at the destination. The trip has been completed successfully.`,
          data: { type: "trip_completed", pickupId: pickupData.id },
          priority: "high",
          sound: "default",
        });
      } catch (error) {
        console.log("Failed to send notification:", error);
      }
    });

    SocketService.on("trip-cancelled", (pickupData: any) => {
      console.log("[SCHEDULE] Received trip-cancelled event:", pickupData);

      setPickups((prev) => {
        const updated = prev.map((pickup) =>
          pickup.id === pickupData.id
            ? { ...pickup, status: "cancelled" as const, ...pickupData }
            : pickup
        ) as Pickup[];
        console.log(
          "[SCHEDULE] 📊 Updated pickups after trip-cancelled:",
          updated
        );
        return updated;
      });

      // Update pickup statuses
      setPickupStatuses((prev) => ({
        ...prev,
        [pickupData.id]: "cancelled",
      }));

      Alert.alert(
        "Trip Cancelled",
        "Your pickup trip has been cancelled. Please contact support if you need assistance.",
        [{ text: "OK", style: "default" }]
      );

      // Send notification to parent that trip was cancelled
      try {
        notificationService.sendImmediateNotification({
          title: "❌ Trip Cancelled",
          body: `Your pickup request has been cancelled. Please check the app for details or contact support.`,
          data: { type: "trip_cancelled", pickupId: pickupData.id },
          priority: "high",
          sound: "default",
        });
      } catch (error) {
        console.log("Failed to send notification:", error);
      }
    });

    // Cleanup listeners on unmount
    return () => {
      SocketService.off("pickup-started");
      SocketService.off("child-picked-up");
      SocketService.off("trip-completed");
      SocketService.off("trip-cancelled");
    };
  }, []);

  // Helper function to get pickup status
  const getPickupStatus = (buddiRequestId: number) => {
    return pickupStatuses[buddiRequestId] || null;
  };

  // Helper function to get pickup data for a specific request
  const getPickupData = (buddiRequestId: number) => {
    return pickups.find((p) => p.buddiRequestId === buddiRequestId);
  };

  // Helper to refresh pickups
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

      // Send system notification for successful coverage request
      try {
        await notificationService.sendCoverageRequestNotification(
          selectedBuddiName || "Buddi",
          new Date().toLocaleTimeString()
        );
      } catch (error) {
        console.log("Failed to send notification:", error);
      }

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
                    Scheduled Pickups
                  </Text>
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
                ) : pickupRequests.length === 0 ? (
                  <Text
                    style={{
                      color: "#888",
                      fontFamily: "Comfortaa-Regular",
                      marginTop: 10,
                    }}
                  >
                    No pickups scheduled yet.
                  </Text>
                ) : (
                  pickupRequests.map((pickup) => {
                    console.log("Processing pickup request:", pickup.id);
                    console.log("Pickup request data:", pickup);

                    const child = childDetailsMap[pickup.childId];
                    console.log("Child details:", child);

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
                            Once a Buddi is matched to your request, you&apos;ll
                            see your pickups here.
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
                      buddiAvatar =
                        "https://randomuser.me/api/portraits/men/2.jpg";
                    }
                    const buddiStatus =
                      pickup.status === "matched" ? "Available" : "Pending";

                    // Get current pickup status for this request
                    const currentPickupStatus = getPickupStatus(pickup.id);

                    // Parse the available days string and show up to 3 cards
                    let days: string[] = [];
                    if (
                      pickup.availableDays &&
                      pickup.availableDays.length > 0
                    ) {
                      // Parse the comma-separated available days string
                      const availableDaysString = pickup.availableDays[0];
                      const availableDays = availableDaysString
                        .split(",")
                        .map((day: string) => day.trim());

                      console.log(
                        "Available days string:",
                        availableDaysString
                      );
                      console.log("Parsed available days:", availableDays);

                      // Take up to 3 days
                      days = availableDays.slice(0, 3);
                      console.log("Days to display:", days);
                    }
                    return (
                      <View key={pickup.id} style={{ marginBottom: 18 }}>
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={{ paddingRight: 16 }}
                        >
                          {days.map((day: string, idx: number) => (
                            <View
                              key={`${pickup.id}-${day}`}
                              style={{ width: 338, marginRight: 12 }}
                            >
                              <KidPickupCard
                                childName={child?.name || "Child"}
                                remaining={pickup.callPickupTime || "-"}
                                schedule={day}
                                buddiName={buddiName}
                                buddiEmail={buddiEmail}
                                buddiAvatar={buddiAvatar}
                                buddiStatus={buddiStatus}
                                schoolName={
                                  child?.school || pickup.fromZone || "School"
                                }
                                destination={pickup.toZone || "Home"}
                                callPickupTime={pickup.callPickupTime}
                                callDropTime={pickup.callDropTime}
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
                                  pickup.status === "matched" &&
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
                                            { text: "Cancel", style: "cancel" },
                                            {
                                              text: "Yes, Start Trip",
                                              style: "default",
                                              onPress: async () => {
                                                try {
                                                  setStartingTripId(pickup.id);

                                                  const res =
                                                    await ParentService.createPickupRequest(
                                                      {
                                                        parentId:
                                                          parentDetails!.id,
                                                        buddiId: Number(
                                                          pickup.matchedBuddiId!
                                                        ),
                                                        childId: pickup.childId,
                                                        fromLocation:
                                                          pickup.fromZone,
                                                        toLocation:
                                                          pickup.toZone,
                                                        buddiRequestId:
                                                          pickup.id,
                                                        callId: pickup.id,
                                                      }
                                                    );

                                                  console.log(
                                                    "[SCHEDULE] ✅ Pickup request created successfully:",
                                                    res
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
                                                    err?.response?.status ===
                                                    400
                                                  ) {
                                                    if (
                                                      typeof err?.response?.data
                                                        ?.error === "string" &&
                                                      err.response.data.error.includes(
                                                        "already requested"
                                                      )
                                                    ) {
                                                      errorMessage =
                                                        "This pickup trip has already been started today. You can only start one trip per day.";
                                                    } else if (
                                                      typeof err?.response?.data
                                                        ?.error === "string" &&
                                                      err.response.data.error.includes(
                                                        "already started"
                                                      )
                                                    ) {
                                                      errorMessage =
                                                        "This pickup trip has already been started. Please check your trip status.";
                                                    } else if (
                                                      err?.response?.data?.error
                                                    ) {
                                                      errorMessage =
                                                        err.response.data.error;
                                                    }
                                                  } else if (
                                                    err?.response?.data?.message
                                                  ) {
                                                    errorMessage =
                                                      err.response.data.message;
                                                  } else if (err?.message) {
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
                                          pickup.id
                                        );
                                        Alert.alert(
                                          "Trip Completed",
                                          `Your trip has been completed successfully!\n\nFare: $${
                                            pickupData?.fare?.toFixed(2) ||
                                            "0.00"
                                          }\nDuration: ${
                                            pickupData?.duration || "N/A"
                                          }`,
                                          [{ text: "OK", style: "default" }]
                                        );
                                      }
                                    : undefined
                                }
                              />
                            </View>
                          ))}
                        </ScrollView>
                        {/* Show View All if more than 3 days */}
                        {pickup.availableDays &&
                          pickup.availableDays.length > 3 && (
                            <TouchableOpacity
                              style={{
                                marginTop: 8,
                                alignSelf: "flex-end",
                                backgroundColor: "#FF932E",
                                borderRadius: 999,
                                paddingVertical: 8,
                                paddingHorizontal: 22,
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                              onPress={() => {
                                router.push({
                                  pathname: "/parent/all-pickups/[callId]",
                                  params: { callId: pickup.id.toString() },
                                });
                              }}
                            >
                              <Text
                                style={{
                                  color: "#fff",
                                  fontFamily: "Comfortaa-Bold",
                                  fontSize: 15,
                                  marginRight: 8,
                                }}
                              >
                                View All
                              </Text>
                              <Ionicons
                                name="arrow-forward"
                                size={18}
                                color="#fff"
                              />
                            </TouchableOpacity>
                          )}
                      </View>
                    );
                  })
                )}

                {/* Pagination Dots */}
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
