import AnalyticsCard from "@/components/commons/AnalyticsCard";
import PageHeader from "@/components/commons/PageHeader";
import CoverageRequestModal from "@/components/modals/CoverageRequestModal";
import CoverageRequestCard from "@/components/parent/CoverageRequestCard";
import KidPickupCard from "@/components/parent/KidPickupCard";
import { useAuth } from "@/context/AuthContext";
import BuddiService from "@/services/api/buddi.service";
import ChildrenService from "@/services/api/children.service";
import CoverageService from "@/services/api/coverage.service";
import ParentService from "@/services/api/parent.service";
import SocketService from "@/services/socket";
import { Ionicons } from "@expo/vector-icons";
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

// const pickupData = [
//   {
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
  const { parentDetails, buddiDetails, user } = useAuth();
  const [activeTab, setActiveTab] = React.useState("pickups");

  // State for real pickup requests and details
  const [pickupRequests, setPickupRequests] = React.useState<any[]>([]);
  const [childDetailsMap, setChildDetailsMap] = React.useState<
    Record<string, any>
  >({});
  const [buddiDetailsMap, setBuddiDetailsMap] = React.useState<
    Record<string, any>
  >({});
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // State for tracking pickup statuses (copied from parent index)
  const [pickupStatuses, setPickupStatuses] = React.useState<
    Record<number, string>
  >({});

  // State for coverage request modal
  const [showCoverageModal, setShowCoverageModal] = React.useState(false);
  const [selectedBuddiId, setSelectedBuddiId] = React.useState<string | null>(
    null
  );
  const [selectedBuddiName, setSelectedBuddiName] = React.useState<string>("");

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

  // State for weekly pickup summary (completed pickups)
  const [weeklyPickupSummary, setWeeklyPickupSummary] =
    React.useState<any>(null);
  const [weeklySummaryLoading, setWeeklySummaryLoading] = React.useState(false);
  const [weeklySummaryError, setWeeklySummaryError] = React.useState<
    string | null
  >(null);

  // Helper to get today's day as a string (e.g., 'Monday')
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  // Helper to check if a pickup is for today
  const isPickupForToday = (pickup: any) => {
    if (!pickup.availableDays || !Array.isArray(pickup.availableDays)) {
      return false;
    }

    // Parse all available days from the array
    const allAvailableDays: string[] = [];
    pickup.availableDays.forEach((dayString: string) => {
      const days = dayString
        .split(",")
        .map((day: string) => day.trim().toLowerCase());
      allAvailableDays.push(...days);
    });

    return allAvailableDays.includes(today.toLowerCase());
  };

  // Helper to fetch weekly pickup summary
  const fetchWeeklyPickupSummary = async () => {
    if (!buddiDetails?.id) return;

    setWeeklySummaryLoading(true);
    setWeeklySummaryError(null);

    try {
      const summary = await BuddiService.getWeeklyPickupSummary(
        buddiDetails.id
      );
      console.log("[SCHEDULE] Weekly pickup summary:", summary);
      setWeeklyPickupSummary(summary);
    } catch (err: any) {
      console.error("[SCHEDULE] Error fetching weekly pickup summary:", err);
      setWeeklySummaryError(err.message || "Failed to fetch weekly summary");
    } finally {
      setWeeklySummaryLoading(false);
    }
  };

  // Helper to check if a pickup is completed for today
  const isPickupCompletedForToday = (pickup: any) => {
    if (!weeklyPickupSummary?.completed) return false;

    const todayKey = today as keyof typeof weeklyPickupSummary.completed;
    const completedToday = weeklyPickupSummary.completed[todayKey];

    if (!completedToday) return false;

    // Check if this pickup matches the completed one
    // We'll match based on fromLocation and toLocation for now
    return (
      completedToday.fromLocation === pickup.fromZone &&
      completedToday.toLocation === pickup.toZone
    );
  };

  // Filter pickups for today
  const todaysPickups = pickupRequests.filter(isPickupForToday);

  const fetchDetailsForRequests = async () => {
    // For Buddi users - get matched requests
    if (user?.role === "buddi" && buddiDetails?.id) {
      setLoading(true);
      setError(null);
      try {
        const res = await BuddiService.getMatchedRequests(buddiDetails.id);
        const requests = res.data || [];
        setPickupRequests(requests);

        // For Buddi, we don't need children details but we might need parent details
        // We can leave child and buddi details maps empty for now
        setChildDetailsMap({});
        setBuddiDetailsMap({});
      } catch (err: any) {
        setError(err.message || "Failed to fetch pickup requests.");
      } finally {
        setLoading(false);
      }
    }
    // For Parent users - existing functionality
    else if (parentDetails?.id) {
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
    }
  };

  // Fail-safe: stop loading after 8s to avoid endless spinner
  React.useEffect(() => {
    if (!loading) return;
    const timeoutId = setTimeout(() => {
      console.warn("[SCHEDULE] Loading timed out. Showing fallback UI.");
      setError(
        (prev) => prev ?? "This is taking longer than usual. Please try again."
      );
      setLoading(false);
    }, 8000);
    return () => clearTimeout(timeoutId);
  }, [loading]);

  React.useEffect(() => {
    if (!parentDetails?.id && !(user?.role === "buddi" && buddiDetails?.id)) {
      setLoading(false);
      setPickupRequests([]);
      return;
    }
    fetchDetailsForRequests();

    // Fetch weekly pickup summary for buddi users
    if (user?.role === "buddi" && buddiDetails?.id) {
      fetchWeeklyPickupSummary();
    }
  }, [parentDetails?.id, buddiDetails?.id, user?.role]);

  // Socket event listeners for real-time pickup status updates (copied from parent index)
  React.useEffect(() => {
    // Enhanced socket event listeners for real-time updates
    SocketService.on("pickup-started", (pickupData: any) => {
      console.log("[SCHEDULE] Received pickup-started event:", pickupData);
      // Update pickup status in real-time
      setPickupStatuses((prev) => ({
        ...prev,
        [pickupData.id]: "enRoute",
      }));
    });

    SocketService.on("child-picked-up", (pickupData: any) => {
      console.log("[SCHEDULE] Received child-picked-up event:", pickupData);
      // Update pickup status in real-time
      setPickupStatuses((prev) => ({
        ...prev,
        [pickupData.id]: "pickedUp",
      }));
    });

    SocketService.on("trip-completed", (pickupData: any) => {
      console.log("[SCHEDULE] Received trip-completed event:", pickupData);
      // Update pickup status in real-time
      setPickupStatuses((prev) => ({
        ...prev,
        [pickupData.id]: "completed",
      }));
    });

    SocketService.on("trip-cancelled", (pickupData: any) => {
      console.log("[SCHEDULE] Received trip-cancelled event:", pickupData);
      // Update pickup status in real-time
      setPickupStatuses((prev) => ({
        ...prev,
        [pickupData.id]: "cancelled",
      }));
    });

    // Cleanup listeners on unmount
    return () => {
      SocketService.off("pickup-started");
      SocketService.off("child-picked-up");
      SocketService.off("trip-completed");
      SocketService.off("trip-cancelled");
    };
  }, []);

  // Helper function to get pickup status (copied from parent index)
  const getPickupStatus = (buddiRequestId: number) => {
    return pickupStatuses[buddiRequestId] || null;
  };

  // Function to handle coverage request creation
  const handleCreateCoverageRequest = async (reason: string) => {
    // For Buddi users
    if (user?.role === "buddi" && buddiDetails?.id && selectedBuddiId) {
      try {
        await CoverageService.createBuddiCoverageRequest({
          parentId: selectedBuddiId, // This is actually the parent ID we got from matched request
          buddiId: buddiDetails.id.toString(),
          reason: reason,
        });

        Alert.alert(
          "Success",
          "Coverage request sent successfully! The parent will be notified.",
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
    }
    // For Parent users (existing functionality)
    else if (parentDetails?.id && selectedBuddiId) {
      try {
        await ParentService.createCoverageRequest({
          parentId: parentDetails.id.toString(),
          buddiId: selectedBuddiId,
          reason: reason,
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
    } else {
      Alert.alert(
        "Error",
        "Missing required information for coverage request."
      );
    }
  };

  // Function to open coverage request modal
  const openCoverageRequestModal = (
    buddiId: string | number,
    buddiName: string
  ) => {
    setSelectedBuddiId(buddiId.toString());
    setSelectedBuddiName(buddiName);
    setShowCoverageModal(true);
  };

  // Function to fetch coverage requests (for Buddi)
  const fetchCoverageRequests = async (page: number = 1) => {
    // Check if user is a Buddi or Parent
    if (user?.role === "buddi" && buddiDetails?.id) {
      setCoverageLoading(true);
      setCoverageError(null);

      try {
        const response = await CoverageService.getBuddiCoverageRequests(
          buddiDetails.id.toString(),
          page,
          2 // Only show 2 coverage requests on schedule page
        );

        if (page === 1) {
          setCoverageRequests(response.data);
        } else {
          setCoverageRequests((prev) => [...prev, ...response.data]);
        }

        setCoveragePagination({
          total: response.pagination.totalItems,
          page: response.pagination.currentPage,
          limit: response.pagination.perPage,
          totalPages: response.pagination.totalPages,
        });
      } catch (err: any) {
        setCoverageError(err.message || "Failed to fetch coverage requests.");
      } finally {
        setCoverageLoading(false);
      }
    } else if (parentDetails?.id) {
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
    }
  };

  // Fetch coverage requests when tab is active
  React.useEffect(() => {
    if (
      activeTab === "coverage" &&
      (parentDetails?.id || (user?.role === "buddi" && buddiDetails?.id))
    ) {
      fetchCoverageRequests(1);
    }
  }, [activeTab, parentDetails?.id, buddiDetails?.id, user?.role]);

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
                value={todaysPickups.length.toString()}
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
            onPress={() => router.push("/buddi/timesheet")}
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
                {loading ? (
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
                      Loading your pickups...
                    </Text>
                  </View>
                ) : error ? (
                  <View
                    style={{
                      backgroundColor: "#FEF2F2",
                      borderRadius: 16,
                      padding: 24,
                      alignItems: "center",
                      marginTop: 16,
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
                      {error}
                    </Text>
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#FF932E",
                        borderRadius: 12,
                        paddingVertical: 12,
                        paddingHorizontal: 20,
                        marginTop: 16,
                      }}
                      onPress={() => {
                        // Refresh the data
                        if (parentDetails?.id) {
                          fetchDetailsForRequests();
                        }
                      }}
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
                ) : todaysPickups.length === 0 ? (
                  <View
                    style={{
                      backgroundColor: "#F4F7FE",
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: "#E6E6E6",
                      padding: 32,
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: 16,
                    }}
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={48}
                      color="#FF932E"
                      style={{ marginBottom: 16 }}
                    />
                    <Text
                      style={{
                        fontFamily: "Comfortaa-Bold",
                        fontSize: 20,
                        color: "#FF932E",
                        marginBottom: 8,
                        textAlign: "center",
                      }}
                    >
                      No Pickups Scheduled Today
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Comfortaa-Regular",
                        fontSize: 14,
                        color: "#6B7280",
                        textAlign: "center",
                        marginBottom: 24,
                        lineHeight: 20,
                      }}
                    >
                      You don&apos;t have any pickup requests scheduled for
                      today.
                    </Text>

                    {/* <TouchableOpacity
                      style={{
                        backgroundColor: "#FF932E",
                        borderRadius: 12,
                        paddingVertical: 14,
                        paddingHorizontal: 24,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onPress={() => router.push("/parent/request-buddi")}
                    >
                      <Ionicons
                        name="add-circle-outline"
                        size={18}
                        color="white"
                        style={{ marginRight: 8 }}
                      />
                      <Text
                        style={{
                          fontFamily: "Comfortaa-Bold",
                          fontSize: 16,
                          color: "white",
                        }}
                      >
                        Request a Buddi
                      </Text>
                    </TouchableOpacity> */}
                  </View>
                ) : (
                  todaysPickups.map((pickup) => {
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

                    // Check if this pickup is completed for today
                    const isCompleted = isPickupCompletedForToday(pickup);

                    // Parse the available days string and show only today's day
                    let todaysDays: string[] = [];
                    if (
                      pickup.availableDays &&
                      pickup.availableDays.length > 0
                    ) {
                      // Parse the comma-separated available days string
                      const allAvailableDays: string[] = [];
                      pickup.availableDays.forEach((dayString: string) => {
                        const days = dayString
                          .split(",")
                          .map((day: string) => day.trim());
                        allAvailableDays.push(...days);
                      });

                      // Filter for today's day only
                      todaysDays = allAvailableDays.filter(
                        (day: string) =>
                          day.toLowerCase() === today.toLowerCase()
                      );

                      console.log(
                        "Available days string:",
                        pickup.availableDays
                      );
                      console.log(
                        "Parsed all available days:",
                        allAvailableDays
                      );
                      console.log("Today's days to display:", todaysDays);
                    }

                    // If no days for today, skip this pickup
                    if (todaysDays.length === 0) {
                      return null;
                    }

                    return (
                      <View key={pickup.id} style={{ marginBottom: 18 }}>
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={{ paddingRight: 16 }}
                        >
                          {todaysDays.map((day: string, idx: number) => (
                            <View
                              key={`${pickup.id}-${day}`}
                              style={{ width: 338, marginRight: 12 }}
                            >
                              <KidPickupCard
                                childName={child?.name || "Child"}
                                remaining={pickup.pickupTime || "-"}
                                schedule={day}
                                buddiName={buddiName}
                                buddiEmail={buddiEmail}
                                buddiAvatar={buddiAvatar}
                                buddiStatus={buddiStatus}
                                schoolName={
                                  child?.school || pickup.fromZone || "School"
                                }
                                destination={pickup.toZone || "Home"}
                                mainAction={
                                  isCompleted
                                    ? "Completed"
                                    : false
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
                                  isCompleted
                                    ? "#16A34A"
                                    : currentPickupStatus === "pending"
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
                                  isCompleted ||
                                  currentPickupStatus === "pending" ||
                                  currentPickupStatus === "enRoute" ||
                                  currentPickupStatus === "pickedUp" ||
                                  currentPickupStatus === "completed" ||
                                  false ||
                                  (pickup.status === "matched" &&
                                    parentDetails?.approvalStage === "pending")
                                }
                                // onMainAction={() => {
                                //   // If the main action is disabled, show coverage request option
                                //   if (
                                //     pickup.status === "matched" &&
                                //     !currentPickupStatus
                                //   ) {
                                //     openCoverageRequestModal(
                                //       pickup.matchedBuddiId!,
                                //       buddiName
                                //     );
                                //   }
                                // }}
                              />
                            </View>
                          ))}
                        </ScrollView>
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
                    onPress={() => router.push("/buddi/coverage-requests")}
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

                      {/* Show Load More only if there are more than 2 items */}
                      {coveragePagination.total > 2 && (
                        <TouchableOpacity
                          style={{
                            backgroundColor: "#F4F7FE",
                            borderRadius: 12,
                            paddingVertical: 12,
                            paddingHorizontal: 20,
                            alignItems: "center",
                            borderWidth: 1,
                            borderColor: "#E6E6E6",
                            marginTop: 8,
                          }}
                          onPress={() =>
                            router.push("/buddi/coverage-requests")
                          }
                        >
                          <Text
                            style={{
                              fontFamily: "Comfortaa-Bold",
                              fontSize: 14,
                              color: "#FF932E",
                            }}
                          >
                            View All ({coveragePagination.total} requests)
                          </Text>
                        </TouchableOpacity>
                      )}

                      {/* Create Coverage Request Button - For Buddi users */}
                      {user?.role === "buddi" &&
                        buddiDetails?.id &&
                        pickupRequests.length > 0 && (
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
                              // For Buddi, we need to get parent ID from matched pickup requests
                              const matchedPickup = pickupRequests.find(
                                (pickup) => pickup.matchedBuddiId
                              );
                              if (matchedPickup?.parentId) {
                                openCoverageRequestModal(
                                  matchedPickup.parentId,
                                  "Parent"
                                );
                              } else {
                                Alert.alert(
                                  "No Active Pickups",
                                  "You need to have active pickup requests to create coverage requests."
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

                      {/* Create Coverage Request Button - For Parent users */}
                      {user?.role === "parent" &&
                        pickupRequests.length > 0 &&
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
                        {user?.role === "buddi"
                          ? "You currently have no coverage requests. When you need coverage from parents, create a request here!"
                          : "You currently have no coverage requests. When a parent requests coverage, you'll see it here!"}
                      </Text>

                      {/* Create Coverage Request Button for Buddis */}
                      {user?.role === "buddi" &&
                        buddiDetails?.id &&
                        pickupRequests.length > 0 && (
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
                              // For Buddi, we need to get parent ID from matched pickup requests
                              const matchedPickup = pickupRequests.find(
                                (pickup) => pickup.matchedBuddiId
                              );
                              if (matchedPickup?.parentId) {
                                openCoverageRequestModal(
                                  matchedPickup.parentId,
                                  "Parent"
                                );
                              } else {
                                Alert.alert(
                                  "No Active Pickups",
                                  "You need to have active pickup requests to create coverage requests."
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
                              Request Coverage
                            </Text>
                          </TouchableOpacity>
                        )}

                      {/* Create Coverage Request Button for Parents */}
                      {user?.role === "parent" &&
                        pickupRequests.length > 0 &&
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
    </SafeAreaView>
  );
};

export default SchedulePage;
