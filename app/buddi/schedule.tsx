import AnalyticsCard from "@/components/commons/AnalyticsCard";
import PageHeader from "@/components/commons/PageHeader";
import PickupCard from "@/components/commons/PickupCard";
import CoverageRequestModal from "@/components/modals/CoverageRequestModal";
import CoverageRequestCard from "@/components/parent/CoverageRequestCard";
import { useAuth } from "@/context/AuthContext";
import BuddiService from "@/services/api/buddi.service";
import ChildrenService from "@/services/api/children.service";
import CoverageService from "@/services/api/coverage.service";
import ParentService from "@/services/api/parent.service";
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

  // State for active pickup tracking
  const [activePickup, setActivePickup] = React.useState<any>(null);

  // Store the pickup ID from real-time events
  const [currentPickupId, setCurrentPickupId] = React.useState<number | null>(
    null
  );

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

  // Helper to get current pickup status
  const getCurrentPickupStatus = (pickupId: number) => {
    // Check if this pickup is the active one
    if (activePickup && activePickup.id === pickupId) {
      return activePickup.status || "enRoute";
    }
    return "notStarted";
  };

  // Enhanced helper to emit pickup events to parent's room
  const emitPickupEvent = (
    eventName: string,
    pickupData: any,
    parentId?: string
  ) => {
    const socket = SocketService.getSocket ? SocketService.getSocket() : null;
    const targetParentId = parentId || pickupData?.parentId;

    if (socket && targetParentId) {
      const parentRoomId = `parent-${targetParentId}`;
      console.log(
        `[SCHEDULE] 📡 Emitting ${eventName} to parent room:`,
        parentRoomId
      );
      console.log(`[SCHEDULE] 📦 Pickup data:`, pickupData);
      console.log(`[SCHEDULE] 👥 Target parent ID:`, targetParentId);

      // Emit the event with enhanced data structure
      socket.emit(eventName, {
        roomId: parentRoomId,
        pickupData: {
          ...pickupData,
          buddiId: buddiDetails?.id,
          timestamp: new Date().toISOString(),
        },
        eventType: eventName,
        from: "buddi",
        to: "parent",
      });

      console.log(`[SCHEDULE] ✅ ${eventName} event emitted successfully`);
    } else {
      console.log(`[SCHEDULE] ❌ Cannot emit ${eventName}:`, {
        hasSocket: !!socket,
        hasPickupData: !!pickupData,
        targetParentId,
        pickupDataParentId: pickupData?.parentId,
      });
    }
  };

  // New function to fetch pickup data from API as alternative to socket events
  const fetchPickupFromAPI = async () => {
    try {
      if (!buddiDetails?.id) {
        console.log("[SCHEDULE] No buddi details available for API fetch");
        return null;
      }

      console.log(
        "[SCHEDULE] 🔍 Fetching pickup data from API as alternative..."
      );
      const pickups = await BuddiService.getPickups(buddiDetails.id);
      console.log("[SCHEDULE] 📋 API response:", pickups);

      // Log all pickups for debugging
      console.log("[SCHEDULE] 📋 All pickups from API:", pickups);

      // Find the most recent pending pickup for this buddi (status only)
      const pendingPickup = pickups.find(
        (pickup: any) =>
          pickup.buddiId === buddiDetails.id && pickup.status === "pending"
      );

      if (pendingPickup) {
        console.log(
          "[SCHEDULE] ✅ Found pending pickup from API:",
          pendingPickup.id,
          "Status:",
          pendingPickup.status
        );
        return pendingPickup;
      } else {
        console.log("[SCHEDULE] ❌ No pending pickups found from API");
        return null;
      }
    } catch (error) {
      console.error("[SCHEDULE] Error fetching pickup from API:", error);
      return null;
    }
  };

  // Check for any locally stored pickup requests that might have been missed
  const checkLocalPickupRequests = React.useCallback(async () => {
    try {
      console.log(
        "[SCHEDULE] 🔍 Checking local storage for missed pickup requests..."
      );
      const stored = await AsyncStorage.getItem("buddiPickupRequests");
      if (stored) {
        const localRequests = JSON.parse(stored);
        console.log(
          "[SCHEDULE] 📋 Found local pickup requests:",
          localRequests
        );

        // Check if any of these are for this buddi and still relevant
        const relevantRequests = localRequests.filter(
          (req: any) =>
            req.buddiId === buddiDetails?.id &&
            req.status !== "completed" &&
            req.status !== "cancelled"
        );

        if (relevantRequests.length > 0) {
          console.log(
            "[SCHEDULE] ✅ Found relevant local pickup requests:",
            relevantRequests
          );

          // Set the most recent one as active pickup
          const mostRecent = relevantRequests.sort(
            (a: any, b: any) =>
              new Date(b.scheduledTime || b.createdAt || 0).getTime() -
              new Date(a.scheduledTime || a.createdAt || 0).getTime()
          )[0];

          setActivePickup(mostRecent);
          setCurrentPickupId(mostRecent.id);

          console.log(
            "[SCHEDULE] 🎯 Set most recent local pickup as active:",
            mostRecent.id
          );
        }
      }
    } catch (error) {
      console.error(
        "[SCHEDULE] ❌ Error checking local pickup requests:",
        error
      );
    }
  }, [buddiDetails?.id]);

  // Handle pickup started (clock in)
  const handlePickupStarted = async (pickup: any) => {
    try {
      console.log("[SCHEDULE] 🚀 Starting pickup:", pickup.id);

      // Update local state
      setActivePickup({
        ...pickup,
        status: "enRoute",
        tripStartTime: new Date().toISOString(),
      });

      // Emit event to parent
      emitPickupEvent("pickup-started", {
        ...pickup,
        buddiId: buddiDetails?.id,
        status: "enRoute",
        tripStartTime: new Date().toISOString(),
      });

      // Send system notification for trip started
      try {
        await notificationService.sendImmediateNotification({
          title: "🚗 Trip Started!",
          body: `You're now en route to pick up your passenger. Drive safely!`,
          data: { type: "trip_started", pickupId: pickup.id },
          priority: "high",
          sound: "default",
        });
      } catch (error) {
        console.log("Failed to send notification:", error);
      }

      // Show success feedback
      console.log("[SCHEDULE] ✅ Pickup started successfully");
    } catch (error) {
      console.error("[SCHEDULE] ❌ Error starting pickup:", error);
    }
  };

  // Handle child picked up
  const handleChildPickedUp = async (pickup: any) => {
    try {
      console.log("[SCHEDULE] 👶 Child picked up:", pickup.id);

      // Update local state
      setActivePickup({
        ...pickup,
        status: "pickedUp",
        pickupTime: new Date().toISOString(),
      });

      // Emit event to parent
      emitPickupEvent("child-picked-up", {
        ...pickup,
        buddiId: buddiDetails?.id,
        status: "pickedUp",
        pickupTime: new Date().toISOString(),
      });

      // Send system notification for child picked up
      try {
        await notificationService.sendImmediateNotification({
          title: "👶 Child Picked Up!",
          body: `Great! You've successfully picked up your passenger. Now head to the destination.`,
          data: { type: "child_picked_up", pickupId: pickup.id },
          priority: "high",
          sound: "default",
        });
      } catch (error) {
        console.log("Failed to send notification:", error);
      }

      // Show success feedback
      console.log("[SCHEDULE] ✅ Child picked up successfully");
    } catch (error) {
      console.error("[SCHEDULE] ❌ Error picking up child:", error);
    }
  };

  // Handle trip completed (clock out)
  const handleTripCompleted = async (pickup: any) => {
    try {
      console.log("[SCHEDULE] ✅ Completing trip:", pickup.id);

      // Update local state
      setActivePickup({
        ...pickup,
        status: "completed",
        dropoffTime: new Date().toISOString(),
      });

      // Emit event to parent
      emitPickupEvent("trip-completed", {
        ...pickup,
        buddiId: buddiDetails?.id,
        status: "completed",
        dropoffTime: new Date().toISOString(),
      });

      // Clear active pickup
      setActivePickup(null);

      // Refresh weekly summary to show completed pickup
      await fetchWeeklyPickupSummary();

      // Send system notification for successful trip completion
      try {
        await notificationService.sendTripCompletedNotification(
          pickup.kidName || "Child",
          25, // Default fare - you might want to get this from actual data
          "30 min" // Default duration - you might want to calculate this
        );
      } catch (error) {
        console.log("Failed to send notification:", error);
      }

      // Show success feedback
      console.log("[SCHEDULE] ✅ Trip completed successfully");
    } catch (error) {
      console.error("[SCHEDULE] ❌ Error completing trip:", error);
    }
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

        // Send system notification for successful coverage request
        try {
          await notificationService.sendImmediateNotification({
            title: "🆘 Coverage Request Sent!",
            body: `Your coverage request has been sent successfully. We'll notify you when someone responds.`,
            data: { type: "coverage_request_sent", reason },
            priority: "high",
            sound: "default",
          });
        } catch (error) {
          console.log("Failed to send notification:", error);
        }

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

  // Enhanced socket connection and room management
  React.useEffect(() => {
    if (!buddiDetails?.id || !user?.userId) return;

    // Enhanced socket connection and room management
    const connectAndJoinRoom = () => {
      console.log("[SCHEDULE] 🔌 Connecting to socket as buddi:", user.userId);
      console.log("[SCHEDULE] 🏠 Buddi details:", buddiDetails);
      console.log("[SCHEDULE] 🆔 Buddi ID for room:", buddiDetails.id);

      // Connect to socket
      SocketService.connect(user.userId.toString(), "Buddi");

      // Join buddi-specific room for real-time updates
      const socket = SocketService.getSocket();
      if (socket) {
        console.log(
          "[SCHEDULE] 🚪 Joining buddi room with ID:",
          buddiDetails.id
        );
        console.log("[SCHEDULE] 🚪 Emitting join-buddi-room event...");
        socket.emit("join-buddi-room", buddiDetails.id);
        console.log(
          "[SCHEDULE] ✅ join-buddi-room event emitted for buddi:",
          buddiDetails.id
        );

        // Listen for room join confirmation (if your server sends it)
        socket.on("room-joined", (data) => {
          console.log("[SCHEDULE] ✅ Successfully joined room:", data);
          // When successfully joined, fetch any missed pickup requests
          fetchMissedPickupRequests();
        });

        socket.on("room-join-error", (error) => {
          console.error("[SCHEDULE] ❌ Failed to join room:", error);
        });
      } else {
        console.error("[SCHEDULE] ❌ Socket not available for room joining");
      }
    };

    // Function to fetch any missed pickup requests when joining room
    const fetchMissedPickupRequests = async () => {
      if (!buddiDetails?.id) return;

      try {
        console.log("[SCHEDULE] 🔍 Checking for missed pickup requests...");

        // Also re-fetch matched requests to ensure we have the latest data
        const matchedRequestsResponse = await BuddiService.getMatchedRequests(
          buddiDetails.id
        );

        if (
          matchedRequestsResponse &&
          matchedRequestsResponse.data &&
          matchedRequestsResponse.data.length > 0
        ) {
          console.log(
            "[SCHEDULE] 📋 Refreshed matched requests:",
            matchedRequestsResponse.data
          );

          // Update pickup requests with latest data
          setPickupRequests(matchedRequestsResponse.data);

          // If we have a matched call but no pickup ID, it means we might have missed the pickup-requested event
          const currentMatchedCall = matchedRequestsResponse.data.find(
            (call: any) => call.status === "matched"
          );
          if (currentMatchedCall && !(currentMatchedCall as any).pickupId) {
            console.log(
              "[SCHEDULE] ⚠️  Found matched call without pickup ID - waiting for pickup request event"
            );
          }
        }
      } catch (error) {
        console.error(
          "[SCHEDULE] ❌ Error fetching missed pickup requests:",
          error
        );
      }
    };

    // Initial connection
    connectAndJoinRoom();

    // Check for any locally stored pickup requests that might have been missed
    console.log(
      "[SCHEDULE] 🔍 Checking for any missed pickup requests from earlier..."
    );
    checkLocalPickupRequests();

    // Reconnect on socket reconnection
    const socket = SocketService.getSocket();
    if (socket) {
      socket.on("connect", () => {
        console.log("[SCHEDULE] 🔄 Socket reconnected, rejoining room");
        connectAndJoinRoom();
        // Re-check local pickup requests after reconnection
        checkLocalPickupRequests();
      });

      socket.on("disconnect", (reason) => {
        console.log("[SCHEDULE] 💔 Socket disconnected:", reason);
      });
    }

    // Enhanced handlers for all trip events matching your server's event names
    const handlePickupRequested = async (pickupData: any) => {
      console.log("🎯 [SCHEDULE] ===== PICKUP-REQUESTED EVENT RECEIVED =====");
      console.log("[SCHEDULE] 📋 Received pickup-requested event:", pickupData);
      console.log(
        "[SCHEDULE] 📋 Pickup data structure:",
        JSON.stringify(pickupData, null, 2)
      );

      // Check if this pickup is for this buddi (same pattern as other working handlers)
      console.log("[SCHEDULE] 🔍 Checking pickup compatibility:", {
        pickupBuddiId: pickupData.buddiId,
        thisBuddiId: buddiDetails?.id,
        pickupStatus: pickupData.status,
        buddiIdsMatch: pickupData.buddiId === buddiDetails?.id,
        scheduledTime: pickupData.scheduledTime,
        currentTime: new Date().toISOString(),
      });

      if (pickupData.buddiId === buddiDetails?.id) {
        console.log(
          "[SCHEDULE] ✅ REAL-TIME pickup request received for this buddi!"
        );
        console.log("[SCHEDULE] 🆔 Pickup ID:", pickupData.id);
        console.log(
          "[SCHEDULE] 📍 From:",
          pickupData.fromLocation,
          "To:",
          pickupData.toLocation
        );

        // Log timing information
        const now = new Date();
        const pickupScheduledTime = pickupData.scheduledTime
          ? new Date(pickupData.scheduledTime)
          : null;
        console.log("[SCHEDULE] ⏰ Current time:", now.toISOString());
        console.log(
          "[SCHEDULE] ⏰ Scheduled pickup time:",
          pickupScheduledTime?.toISOString() || "Not specified"
        );
        if (pickupScheduledTime) {
          const timeDiff = pickupScheduledTime.getTime() - now.getTime();
          const minutesUntilPickup = Math.floor(timeDiff / (1000 * 60));
          console.log(
            "[SCHEDULE] ⏰ Minutes until pickup:",
            minutesUntilPickup
          );
        }

        // Store the pickup ID from the event to use directly
        console.log(
          "[SCHEDULE] ✅ Storing pickup ID from event:",
          pickupData.id
        );
        setCurrentPickupId(pickupData.id);

        // Enhanced notification with more details
        const scheduledTime = pickupData.scheduledTime
          ? new Date(pickupData.scheduledTime)
          : null;
        const timeUntilPickup = scheduledTime
          ? Math.max(
              0,
              Math.floor((scheduledTime.getTime() - Date.now()) / (1000 * 60))
            )
          : null;

        let notificationMessage = `🚨 New Pickup Request!\n\n`;
        notificationMessage += `📍 From: ${pickupData.fromLocation}\n`;
        notificationMessage += `🎯 To: ${pickupData.toLocation}\n`;

        if (scheduledTime && timeUntilPickup !== null) {
          if (timeUntilPickup > 0) {
            notificationMessage += `⏰ Pickup in: ${timeUntilPickup} minutes\n`;
          } else {
            notificationMessage += `⏰ Pickup time: ${scheduledTime.toLocaleTimeString()}\n`;
          }
        }

        notificationMessage += `\n✅ You're now assigned to this pickup!\n`;
        notificationMessage += `🚗 Get ready to start the trip when it's time.`;

        // Show immediate notification with enhanced success modal
        console.log("🎉 [SCHEDULE] SUCCESSFULLY ASSIGNED TO PICKUP! 🎉");
        console.log("[SCHEDULE] ✅ Pickup ID:", pickupData.id);
        console.log("[SCHEDULE] ✅ Status: Assigned");
        console.log("[SCHEDULE] ✅ Ready to start trip when scheduled");

        // Send system notification for new pickup assignment
        try {
          await notificationService.sendNewPickupAssignmentNotification(
            pickupData.kidName || "Child",
            pickupData.scheduledTime
              ? new Date(pickupData.scheduledTime).toLocaleTimeString()
              : "Now",
            pickupData.fromLocation || "Pickup Location"
          );
        } catch (error) {
          console.log("Failed to send notification:", error);
        }

        // Show alert notification
        Alert.alert("🚨 New Pickup Assignment!", notificationMessage, [
          { text: "OK", style: "default" },
        ]);

        // Also update any existing pickup requests to show this new assignment
        // This ensures the buddi sees the pickup even if they missed the initial event
        if (pickupData.id) {
          setActivePickup((prev: any) => {
            if (prev && prev.id === pickupData.id) {
              return { ...prev, ...pickupData };
            }
            return pickupData;
          });
        }

        // Store this pickup request locally for persistence
        try {
          AsyncStorage.getItem("buddiPickupRequests").then((stored) => {
            const requests = stored ? JSON.parse(stored) : [];
            const existingIndex = requests.findIndex(
              (r: any) => r.id === pickupData.id
            );

            if (existingIndex !== -1) {
              requests[existingIndex] = {
                ...requests[existingIndex],
                ...pickupData,
              };
            } else {
              requests.push(pickupData);
            }

            AsyncStorage.setItem(
              "buddiPickupRequests",
              JSON.stringify(requests)
            );
            console.log("[SCHEDULE] 💾 Stored pickup request locally");
          });
        } catch (error) {
          console.error(
            "[SCHEDULE] ❌ Error storing pickup request locally:",
            error
          );
        }
      } else {
        console.log("[SCHEDULE] 📋 Pickup not for this buddi:", {
          pickupBuddiId: pickupData.buddiId,
          thisBuddiId: buddiDetails?.id,
          status: pickupData.status,
        });
      }
    };

    const handlePickupStartedEvent = (pickupData: any) => {
      console.log("[SCHEDULE] 🚀 Received pickup-started event:", pickupData);
      // Update active pickup if this matches our buddi
      if (pickupData.buddiId === buddiDetails?.id) {
        console.log("[SCHEDULE] 🔄 Updating active pickup with started data");
        setActivePickup(pickupData);
      }
    };

    const handleChildPickedUpEvent = (pickupData: any) => {
      console.log("[SCHEDULE] 👶 Received child-picked-up event:", pickupData);
      // Update active pickup if this is for this buddi
      if (pickupData.buddiId === buddiDetails?.id) {
        console.log(
          "[SCHEDULE] 🔄 Updating active pickup with child picked up data"
        );
        setActivePickup(pickupData);
      }
    };

    const handleTripCompletedEvent = (data: any) => {
      console.log("[SCHEDULE] ✅ Raw trip-completed event received:", data);

      let pickupData;
      try {
        // Backend sends JSON.stringify(pickup)
        pickupData = typeof data === "string" ? JSON.parse(data) : data;
      } catch (err) {
        console.error("[SCHEDULE] Parse error (trip-completed):", err);
        return;
      }

      console.log("[SCHEDULE] ✅ Parsed trip-completed data:", pickupData);
      console.log(
        "[SCHEDULE] ✅ Check buddiId match:",
        pickupData.buddiId,
        "===",
        buddiDetails?.id
      );

      // Update active pickup if this is for this buddi
      if (pickupData.buddiId === buddiDetails?.id) {
        console.log("[SCHEDULE] 🔄 Updating active pickup with completed data");
        setActivePickup(pickupData);

        // Store completed trip and show success message
        handleTripCompleted(pickupData);

        Alert.alert(
          "Trip Completed! 🎉",
          "Great job! You've successfully completed the pickup trip. Well done!",
          [{ text: "OK", style: "default" }]
        );

        // Refresh weekly pickup summary after trip completion
        fetchWeeklyPickupSummary();
      } else {
        console.log("[SCHEDULE] ❌ Trip completed not for this buddi");
      }
    };

    const handleEarningsUpdated = (data: any) => {
      console.log("[SCHEDULE] 💰 Received earnings-updated event:", data);
      // Update earnings display if needed
      // You can add earnings state management here if needed
    };

    const handleTimesheetUpdated = (timesheetData: any) => {
      console.log(
        "[SCHEDULE] 📝 Received timesheet-updated event:",
        timesheetData
      );
      // Update timesheet display if needed
      // You can add timesheet state management here if needed
    };

    // Register all event listeners matching your server's event names
    console.log("[SCHEDULE] 👂 Registering real-time event listeners...");
    console.log("[SCHEDULE] 🎯 READY TO RECEIVE AUTOMATIC PICKUP REQUESTS!");
    console.log(
      "[SCHEDULE] 🎯 Listening for: pickup-requested, pickup-started, child-picked-up, trip-completed"
    );
    SocketService.on("pickup-requested", handlePickupRequested);
    SocketService.on("pickup-started", handlePickupStartedEvent);
    SocketService.on("child-picked-up", handleChildPickedUpEvent);
    SocketService.on("trip-completed", handleTripCompletedEvent);
    SocketService.on("earnings-updated", handleEarningsUpdated);
    SocketService.on("timesheet-updated", handleTimesheetUpdated);

    // Additional events from your server
    SocketService.on("active-pickups", (data: any) => {
      console.log("[SCHEDULE] 📋 Active pickups updated:", data);
      if (data && data.buddiId === buddiDetails?.id) {
        setActivePickup(data);
      }
    });

    SocketService.on("pickup-history", (data: any) => {
      console.log("[SCHEDULE] 📚 Pickup history updated:", data);
      // Handle pickup history updates if needed
    });

    // Cleanup listeners on unmount
    return () => {
      console.log("[SCHEDULE] 🧹 Cleaning up real-time event listeners...");
      const socket = SocketService.getSocket();
      if (socket) {
        socket.off("connect");
        socket.off("disconnect");
        socket.off("room-joined");
        socket.off("room-join-error");
      }
      SocketService.off("pickup-requested", handlePickupRequested);
      SocketService.off("pickup-started", handlePickupStartedEvent);
      SocketService.off("child-picked-up", handleChildPickedUpEvent);
      SocketService.off("trip-completed", handleTripCompletedEvent);
      SocketService.off("earnings-updated", handleEarningsUpdated);
      SocketService.off("timesheet-updated", handleTimesheetUpdated);
      SocketService.off("active-pickups");
      SocketService.off("pickup-history");
    };
  }, [
    buddiDetails?.id,
    user?.userId,
    activePickup,
    handleTripCompleted,
    fetchWeeklyPickupSummary,
    checkLocalPickupRequests,
  ]); // Include all dependencies

  // Periodic room check to ensure we stay connected and ready for pickup requests
  React.useEffect(() => {
    if (!buddiDetails?.id || !user?.userId) return;

    const intervalId = setInterval(() => {
      const socket = SocketService.getSocket();
      if (socket && socket.connected) {
        console.log(
          "[SCHEDULE] 🔄 Periodic room rejoin check for buddi:",
          buddiDetails.id
        );
        console.log("[SCHEDULE] 🔄 Re-emitting join-buddi-room...");
        socket.emit("join-buddi-room", buddiDetails.id);
        console.log("[SCHEDULE] ✅ Periodic join-buddi-room event emitted");

        // Also check for any missed pickup requests periodically
        // This ensures we catch any automatic pickup requests that were sent earlier
        checkLocalPickupRequests();
      } else {
        console.log(
          "[SCHEDULE] 🚨 Socket disconnected during periodic check, reconnecting..."
        );
        SocketService.connect(user.userId.toString(), "Buddi");
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(intervalId);
  }, [buddiDetails?.id, user?.userId, checkLocalPickupRequests]);

  // Check socket connection status periodically
  React.useEffect(() => {
    const checkConnection = () => {
      const status = SocketService.getConnectionStatus();
      console.log("[SCHEDULE] Socket connection status:", status);
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

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
                              <PickupCard
                                id={pickup.id.toString()}
                                name={pickup.description || "Pickup Request"}
                                time={pickup.callPickupTime || "-"}
                                days={day}
                                school={pickup.fromZone || "School"}
                                home={pickup.toZone || "Home"}
                                dropoffTime={pickup.callDropTime || "-"}
                                kidsCount={pickup.kidsCount || 0}
                                status={
                                  isCompleted
                                    ? "completed"
                                    : getCurrentPickupStatus(pickup.id)
                                }
                                callType={pickup.type}
                                startDate={pickup.startDate}
                                endDate={pickup.endDate}
                                fromZone={pickup.fromZone}
                                toZone={pickup.toZone}
                                onButtonPress={() => {
                                  // Don't allow navigation if pickup is completed
                                  if (isCompleted) {
                                    return;
                                  }
                                  // Handle pickup action based on status
                                  const currentStatus = getCurrentPickupStatus(
                                    pickup.id
                                  );
                                  if (currentStatus === "notStarted") {
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
                                              // Debug: Log current user and pickup details
                                              console.log(
                                                "[SCHEDULE] Starting trip with details:",
                                                {
                                                  buddiId: buddiDetails?.id,
                                                  buddiRequestId: pickup.id,
                                                  pickupIdFromEvent:
                                                    currentPickupId,
                                                  pickupStatus: pickup.status,
                                                  matchedBuddiId:
                                                    pickup.matchedBuddiId,
                                                  userRole: user?.role,
                                                }
                                              );

                                              // Check if we have the actual pickup ID from the pickup-requested event
                                              let pickupIdToUse: number | null =
                                                currentPickupId;

                                              if (!pickupIdToUse) {
                                                // Fallback to fetching from API if currentPickupId is not available
                                                const apiPickup =
                                                  await fetchPickupFromAPI();
                                                if (apiPickup && apiPickup.id) {
                                                  console.log(
                                                    "[SCHEDULE] Using API pickup ID for trip start:",
                                                    apiPickup.id
                                                  );
                                                  pickupIdToUse = apiPickup.id;
                                                  setCurrentPickupId(
                                                    apiPickup.id
                                                  );
                                                } else {
                                                  Alert.alert(
                                                    "Trip Not Ready",
                                                    "No pickup request found. Please wait for the parent to request a pickup.",
                                                    [
                                                      {
                                                        text: "OK",
                                                        style: "default",
                                                      },
                                                    ]
                                                  );
                                                  return;
                                                }
                                              }

                                              // Ensure we have a valid pickup ID before proceeding
                                              if (!pickupIdToUse) {
                                                Alert.alert(
                                                  "Trip Not Ready",
                                                  "Unable to get pickup ID. Please try again.",
                                                  [
                                                    {
                                                      text: "OK",
                                                      style: "default",
                                                    },
                                                  ]
                                                );
                                                return;
                                              }
                                              console.log(
                                                "[SCHEDULE] Using pickup ID for trip start:",
                                                pickupIdToUse
                                              );

                                              const res =
                                                await BuddiService.startPickupTrip(
                                                  pickupIdToUse
                                                );
                                              setActivePickup(res.pickup);
                                              // Clear the pickup ID since trip is started
                                              setCurrentPickupId(null);
                                              // Emit pickup-started event to parent
                                              emitPickupEvent(
                                                "pickup-started",
                                                res.pickup
                                              );

                                              // Show success feedback
                                              Alert.alert(
                                                "Trip Started! 🚀",
                                                "Your pickup trip has started successfully! You can now navigate to pick up the child.",
                                                [
                                                  {
                                                    text: "OK",
                                                    style: "default",
                                                  },
                                                ]
                                              );
                                            } catch (err) {
                                              console.log(
                                                "[SCHEDULE] Start trip error:",
                                                err
                                              );

                                              // Handle different types of errors
                                              let errorMessage =
                                                "Failed to start trip.";

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
                                              } else {
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
                                }}
                                onPickUp={() => {
                                  if (!isCompleted) {
                                    const currentStatus =
                                      getCurrentPickupStatus(pickup.id);
                                    if (currentStatus === "enRoute") {
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

                                                // Show success feedback
                                                Alert.alert(
                                                  "Child Picked Up! 👶",
                                                  "Great! You've successfully picked up the child. Now head to the destination.",
                                                  [
                                                    {
                                                      text: "OK",
                                                      style: "default",
                                                    },
                                                  ]
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
                                  }
                                }}
                                onClockOut={() => {
                                  if (!isCompleted) {
                                    const currentStatus =
                                      getCurrentPickupStatus(pickup.id);
                                    if (currentStatus === "pickedUp") {
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
                                                  res.pickup
                                                );

                                                // Show success feedback
                                                Alert.alert(
                                                  "Trip Completed! 🎉",
                                                  "Excellent work! You've successfully completed the pickup trip. Well done!",
                                                  [
                                                    {
                                                      text: "OK",
                                                      style: "default",
                                                    },
                                                  ]
                                                );

                                                // Refresh weekly pickup summary after trip completion
                                                await fetchWeeklyPickupSummary();
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
                                  }
                                }}
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
