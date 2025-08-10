// app/buddi/index.tsx
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
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
import SuccessModal from "../../components/modals/SuccessModal";
import { useAuth } from "../../context/AuthContext";
import BuddiService from "../../services/api/buddi.service";
import SocketService from "../../services/socket";
// import ChildrenService from "../../services/api/children.service";

export default function BuddiHome() {
  // const [activeCard, setActiveCard] = useState(0);
  // const [selectedDate, setSelectedDate] = useState(new Date());
  const scrollViewRef = useRef(null);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout, buddiDetails } = useAuth();
  const [availableCalls, setAvailableCalls] = useState<any[]>([]);
  const [matchedCall, setMatchedCall] = useState<any>(null);
  const [activePickup, setActivePickup] = useState<any>(null); // New state for current trip
  // const [completedTrips, setCompletedTrips] = useState<any[]>([]);
  const [matchedPickups, setMatchedPickups] = useState<any[]>([]);

  // Store the pickup ID from real-time events
  const [currentPickupId, setCurrentPickupId] = useState<number | null>(null);

  // State for weekly pickup summary (completed pickups)
  const [weeklyPickupSummary, setWeeklyPickupSummary] = useState<any>(null);
  const [weeklySummaryLoading, setWeeklySummaryLoading] = useState(false);
  const [weeklySummaryError, setWeeklySummaryError] = useState<string | null>(
    null
  );

  // Success modal states
  const [successModal, setSuccessModal] = useState({
    visible: false,
    title: "",
    message: "",
    iconName: "checkmark-circle" as keyof typeof Ionicons.glyphMap,
    iconColor: "#22C55E",
  });

  // const [childInfo, setChildInfo] = useState<any>(null);

  // Helper to get the socket instance (assume SocketService exposes getSocket())
  const getSocket = () =>
    SocketService.getSocket ? SocketService.getSocket() : null;

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

  // Enhanced helper to emit pickup events to parent's room
  const emitPickupEvent = (
    eventName: string,
    pickupData: any,
    parentId?: string
  ) => {
    const socket = getSocket();
    const targetParentId = parentId || matchedCall?.parentId;

    if (socket && targetParentId) {
      const parentRoomId = `parent-${targetParentId}`;
      console.log(
        `[BUDDI] 📡 Emitting ${eventName} to parent room:`,
        parentRoomId
      );
      console.log(`[BUDDI] 📦 Pickup data:`, pickupData);
      console.log(`[BUDDI] 👥 Target parent ID:`, targetParentId);

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

      console.log(`[BUDDI] ✅ ${eventName} event emitted successfully`);
    } else {
      console.log(`[BUDDI] ❌ Cannot emit ${eventName}:`, {
        hasSocket: !!socket,
        hasMatchedCall: !!matchedCall,
        targetParentId,
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

  // Helper to fetch weekly pickup summary
  const fetchWeeklyPickupSummary = async () => {
    if (!buddiDetails?.id) return;

    setWeeklySummaryLoading(true);
    setWeeklySummaryError(null);

    try {
      const summary = await BuddiService.getWeeklyPickupSummary(
        buddiDetails.id
      );
      console.log("[BUDDI HOME] Weekly pickup summary:", summary);
      setWeeklyPickupSummary(summary);
    } catch (err: any) {
      console.error("[BUDDI HOME] Error fetching weekly pickup summary:", err);
      setWeeklySummaryError(err.message || "Failed to fetch weekly summary");
    } finally {
      setWeeklySummaryLoading(false);
    }
  };

  // New function to fetch pickup data from API as alternative to socket events
  const fetchPickupFromAPI = async () => {
    try {
      if (!buddiDetails?.id) {
        console.log("[BUDDI] No buddi details available for API fetch");
        return null;
      }

      console.log("[BUDDI] 🔍 Fetching pickup data from API as alternative...");
      const pickups = await BuddiService.getPickups(buddiDetails.id);
      console.log("[BUDDI] 📋 API response:", pickups);

      // Find the most recent pending pickup for this buddi
      const pendingPickup = pickups.find(
        (pickup: any) =>
          pickup.buddiId === buddiDetails.id && pickup.status === "pending"
      );

      if (pendingPickup) {
        console.log(
          "[BUDDI] ✅ Found pending pickup from API:",
          pendingPickup.id
        );
        return pendingPickup;
      } else {
        console.log("[BUDDI] ❌ No pending pickups found from API");
        return null;
      }
    } catch (error) {
      console.error("[BUDDI] Error fetching pickup from API:", error);
      return null;
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

  // Helper to check if matchedCall is for today
  const isPickupToday = (() => {
    if (
      !matchedCall ||
      !matchedCall.availableDays ||
      !Array.isArray(matchedCall.availableDays)
    ) {
      return false;
    }

    // Parse all available days from the array
    const allAvailableDays: string[] = [];
    matchedCall.availableDays.forEach((dayString: string) => {
      const days = dayString
        .split(",")
        .map((day: string) => day.trim().toLowerCase());
      allAvailableDays.push(...days);
    });

    console.log("[BUDDI] Available days array:", matchedCall.availableDays);
    console.log("[BUDDI] Parsed all available days:", allAvailableDays);
    console.log("[BUDDI] Today:", today.toLowerCase());

    return allAvailableDays.includes(today.toLowerCase());
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
        // setCompletedTrips(completed); // Commented out as completedTrips state is not used
      } catch (err) {
        console.error("Error storing completed trip:", err);
      }

      // Refresh weekly pickup summary after trip completion
      if (buddiDetails?.id) {
        await fetchWeeklyPickupSummary();
      }
    },
    [activePickup, buddiDetails?.id, fetchWeeklyPickupSummary]
  );

  // Check for any locally stored pickup requests that might have been missed
  const checkLocalPickupRequests = React.useCallback(async () => {
    try {
      console.log(
        "[BUDDI] 🔍 Checking local storage for missed pickup requests..."
      );
      const stored = await AsyncStorage.getItem("buddiPickupRequests");
      if (stored) {
        const localRequests = JSON.parse(stored);
        console.log("[BUDDI] 📋 Found local pickup requests:", localRequests);

        // Check if any of these are for this buddi and still relevant
        const relevantRequests = localRequests.filter(
          (req: any) =>
            req.buddiId === buddiDetails?.id &&
            req.status !== "completed" &&
            req.status !== "cancelled"
        );

        if (relevantRequests.length > 0) {
          console.log(
            "[BUDDI] ✅ Found relevant local pickup requests:",
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
            "[BUDDI] 🎯 Set most recent local pickup as active:",
            mostRecent.id
          );
        }
      }
    } catch (error) {
      console.error("[BUDDI] ❌ Error checking local pickup requests:", error);
    }
  }, [buddiDetails?.id]);

  // Enhanced socket connection and room management
  useEffect(() => {
    if (!buddiDetails?.id || !user?.userId) return;

    // Enhanced socket connection and room management
    const connectAndJoinRoom = () => {
      console.log("[BUDDI] 🔌 Connecting to socket as buddi:", user.userId);
      console.log("[BUDDI] 🏠 Buddi details:", buddiDetails);
      console.log("[BUDDI] 🆔 Buddi ID for room:", buddiDetails.id);

      // Connect to socket
      SocketService.connect(user.userId.toString(), "Buddi");

      // Join buddi-specific room for real-time updates
      const socket = SocketService.getSocket();
      if (socket) {
        console.log("[BUDDI] 🚪 Joining buddi room with ID:", buddiDetails.id);
        console.log("[BUDDI] 🚪 Emitting join-buddi-room event...");
        socket.emit("join-buddi-room", buddiDetails.id);
        console.log(
          "[BUDDI] ✅ join-buddi-room event emitted for buddi:",
          buddiDetails.id
        );

        // Listen for room join confirmation (if your server sends it)
        socket.on("room-joined", (data) => {
          console.log("[BUDDI] ✅ Successfully joined room:", data);
          // When successfully joined, fetch any missed pickup requests
          fetchMissedPickupRequests();
        });

        socket.on("room-join-error", (error) => {
          console.error("[BUDDI] ❌ Failed to join room:", error);
        });
      } else {
        console.error("[BUDDI] ❌ Socket not available for room joining");
      }
    };

    // Function to fetch any missed pickup requests when joining room
    const fetchMissedPickupRequests = async () => {
      if (!buddiDetails?.id) return;

      try {
        console.log("[BUDDI] 🔍 Checking for missed pickup requests...");

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
            "[BUDDI] 📋 Refreshed matched requests:",
            matchedRequestsResponse.data
          );

          // Update available calls with latest data
          setAvailableCalls(matchedRequestsResponse.data);

          // If we have a matched call but no pickup ID, it means we might have missed the pickup-requested event
          const currentMatchedCall = matchedRequestsResponse.data.find(
            (call: any) => call.status === "matched"
          );
          if (currentMatchedCall && !(currentMatchedCall as any).pickupId) {
            console.log(
              "[BUDDI] ⚠️  Found matched call without pickup ID - waiting for pickup request event"
            );
          }
        }
      } catch (error) {
        console.error(
          "[BUDDI] ❌ Error fetching missed pickup requests:",
          error
        );
      }
    };

    // Initial connection
    connectAndJoinRoom();

    // Check for any locally stored pickup requests that might have been missed
    console.log(
      "[BUDDI] 🔍 Checking for any missed pickup requests from earlier..."
    );
    checkLocalPickupRequests();

    // Reconnect on socket reconnection
    const socket = SocketService.getSocket();
    if (socket) {
      socket.on("connect", () => {
        console.log("[BUDDI] 🔄 Socket reconnected, rejoining room");
        connectAndJoinRoom();
        // Re-check local pickup requests after reconnection
        checkLocalPickupRequests();
      });

      socket.on("disconnect", (reason) => {
        console.log("[BUDDI] 💔 Socket disconnected:", reason);
      });
    }

    // Enhanced handlers for all trip events matching your server's event names
    const handlePickupRequested = (pickupData: any) => {
      console.log("🎯 [BUDDI] ===== PICKUP-REQUESTED EVENT RECEIVED =====");
      console.log("[BUDDI] 📋 Received pickup-requested event:", pickupData);
      console.log(
        "[BUDDI] 📋 Pickup data structure:",
        JSON.stringify(pickupData, null, 2)
      );

      // Check if this pickup is for this buddi (same pattern as other working handlers)
      console.log("[BUDDI] 🔍 Checking pickup compatibility:", {
        pickupBuddiId: pickupData.buddiId,
        thisBuddiId: buddiDetails?.id,
        pickupStatus: pickupData.status,
        buddiIdsMatch: pickupData.buddiId === buddiDetails?.id,
        scheduledTime: pickupData.scheduledTime,
        currentTime: new Date().toISOString(),
      });

      if (pickupData.buddiId === buddiDetails?.id) {
        console.log(
          "[BUDDI] ✅ REAL-TIME pickup request received for this buddi!"
        );
        console.log("[BUDDI] 🆔 Pickup ID:", pickupData.id);
        console.log(
          "[BUDDI] 📍 From:",
          pickupData.fromLocation,
          "To:",
          pickupData.toLocation
        );

        // Log timing information
        const now = new Date();
        const pickupScheduledTime = pickupData.scheduledTime
          ? new Date(pickupData.scheduledTime)
          : null;
        console.log("[BUDDI] ⏰ Current time:", now.toISOString());
        console.log(
          "[BUDDI] ⏰ Scheduled pickup time:",
          pickupScheduledTime?.toISOString() || "Not specified"
        );
        if (pickupScheduledTime) {
          const timeDiff = pickupScheduledTime.getTime() - now.getTime();
          const minutesUntilPickup = Math.floor(timeDiff / (1000 * 60));
          console.log("[BUDDI] ⏰ Minutes until pickup:", minutesUntilPickup);
        }

        // Store the pickup ID from the event to use directly
        console.log("[BUDDI] ✅ Storing pickup ID from event:", pickupData.id);
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
        console.log("🎉 [BUDDI] SUCCESSFULLY ASSIGNED TO PICKUP! 🎉");
        console.log("[BUDDI] ✅ Pickup ID:", pickupData.id);
        console.log("[BUDDI] ✅ Status: Assigned");
        console.log("[BUDDI] ✅ Ready to start trip when scheduled");

        showSuccessModal(
          "🚨 New Pickup Assignment!",
          notificationMessage,
          "notifications",
          "#FF932E"
        );

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
            console.log("[BUDDI] 💾 Stored pickup request locally");
          });
        } catch (error) {
          console.error(
            "[BUDDI] ❌ Error storing pickup request locally:",
            error
          );
        }
      } else {
        console.log("[BUDDI] 📋 Pickup not for this buddi:", {
          pickupBuddiId: pickupData.buddiId,
          thisBuddiId: buddiDetails?.id,
          status: pickupData.status,
        });
      }
    };

    const handlePickupStarted = (pickupData: any) => {
      console.log("[BUDDI] 🚀 Received pickup-started event:", pickupData);
      // Update active pickup if this matches our buddi
      if (pickupData.buddiId === buddiDetails?.id) {
        console.log("[BUDDI] 🔄 Updating active pickup with started data");
        setActivePickup(pickupData);
      }
    };

    const handleChildPickedUp = (pickupData: any) => {
      console.log("[BUDDI] 👶 Received child-picked-up event:", pickupData);
      // Update active pickup if this is for this buddi
      if (pickupData.buddiId === buddiDetails?.id) {
        console.log(
          "[BUDDI] 🔄 Updating active pickup with child picked up data"
        );
        setActivePickup(pickupData);
      }
    };

    const handleTripCompletedEvent = (data: any) => {
      console.log("[BUDDI] ✅ Raw trip-completed event received:", data);

      let pickupData;
      try {
        // Backend sends JSON.stringify(pickup)
        pickupData = typeof data === "string" ? JSON.parse(data) : data;
      } catch (err) {
        console.error("[BUDDI] Parse error (trip-completed):", err);
        return;
      }

      console.log("[BUDDI] ✅ Parsed trip-completed data:", pickupData);
      console.log(
        "[BUDDI] ✅ Check buddiId match:",
        pickupData.buddiId,
        "===",
        buddiDetails?.id
      );

      // Update active pickup if this is for this buddi
      if (pickupData.buddiId === buddiDetails?.id) {
        console.log("[BUDDI] 🔄 Updating active pickup with completed data");
        setActivePickup(pickupData);

        // Store completed trip and show success message
        handleTripCompleted(pickupData);

        showSuccessModal(
          "Trip Completed! 🎉",
          "Great job! You've successfully completed the pickup trip. Well done!",
          "trophy",
          "#FFD700"
        );

        // Refresh weekly pickup summary after trip completion
        fetchWeeklyPickupSummary();
      } else {
        console.log("[BUDDI] ❌ Trip completed not for this buddi");
      }
    };

    const handleEarningsUpdated = (data: any) => {
      console.log("[BUDDI] 💰 Received earnings-updated event:", data);
      // Update earnings display if needed
      // You can add earnings state management here if needed
    };

    const handleTimesheetUpdated = (timesheetData: any) => {
      console.log(
        "[BUDDI] 📝 Received timesheet-updated event:",
        timesheetData
      );
      // Update timesheet display if neededf
      // You can add timesheet state management here if needed
    };

    // Register all event listeners matching your server's event names
    console.log("[BUDDI] 👂 Registering real-time event listeners...");
    console.log("[BUDDI] 🎯 READY TO RECEIVE AUTOMATIC PICKUP REQUESTS!");
    console.log(
      "[BUDDI] 🎯 Listening for: pickup-requested, pickup-started, child-picked-up, trip-completed"
    );
    SocketService.on("pickup-requested", handlePickupRequested);
    SocketService.on("pickup-started", handlePickupStarted);
    SocketService.on("child-picked-up", handleChildPickedUp);
    SocketService.on("trip-completed", handleTripCompletedEvent);
    SocketService.on("earnings-updated", handleEarningsUpdated);
    SocketService.on("timesheet-updated", handleTimesheetUpdated);

    // Additional events from your server
    SocketService.on("active-pickups", (data: any) => {
      console.log("[BUDDI] 📋 Active pickups updated:", data);
      if (data && data.buddiId === buddiDetails?.id) {
        setActivePickup(data);
      }
    });

    SocketService.on("pickup-history", (data: any) => {
      console.log("[BUDDI] 📚 Pickup history updated:", data);
      // Handle pickup history updates if needed
    });

    // Cleanup listeners on unmount
    return () => {
      console.log("[BUDDI] 🧹 Cleaning up real-time event listeners...");
      const socket = SocketService.getSocket();
      if (socket) {
        socket.off("connect");
        socket.off("disconnect");
        socket.off("room-joined");
        socket.off("room-join-error");
      }
      SocketService.off("pickup-requested", handlePickupRequested);
      SocketService.off("pickup-started", handlePickupStarted);
      SocketService.off("child-picked-up", handleChildPickedUp);
      SocketService.off("trip-completed", handleTripCompletedEvent);
      SocketService.off("earnings-updated", handleEarningsUpdated);
      SocketService.off("timesheet-updated", handleTimesheetUpdated);
      SocketService.off("active-pickups");
      SocketService.off("pickup-history");
    };
  }, [
    buddiDetails?.id,
    user?.userId,
    matchedCall,
    activePickup,
    handleTripCompleted,
  ]); // Include all dependencies

  // Periodic room check to ensure we stay connected and ready for pickup requests
  React.useEffect(() => {
    if (!buddiDetails?.id || !user?.userId) return;

    const intervalId = setInterval(() => {
      const socket = SocketService.getSocket();
      if (socket && socket.connected) {
        console.log(
          "[BUDDI] 🔄 Periodic room rejoin check for buddi:",
          buddiDetails.id
        );
        console.log("[BUDDI] 🔄 Re-emitting join-buddi-room...");
        socket.emit("join-buddi-room", buddiDetails.id);
        console.log("[BUDDI] ✅ Periodic join-buddi-room event emitted");

        // Also check for any missed pickup requests periodically
        // This ensures we catch any automatic pickup requests that were sent earlier
        checkLocalPickupRequests();
      } else {
        console.log(
          "[BUDDI] 🚨 Socket disconnected during periodic check, reconnecting..."
        );
        SocketService.connect(user.userId.toString(), "Buddi");
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(intervalId);
  }, [buddiDetails?.id, user?.userId, checkLocalPickupRequests]);

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
        // setCompletedTrips(completed); // Commented out as completedTrips state is not used
      } catch (err) {
        console.error("Error storing completed trip:", err);
      }
    };

    // Handler for pickup-started event
    const handlePickupStarted = (data: any) => {
      console.log("[BUDDI] 🚀 Raw pickup-started event received:", data);

      let pickupData;
      try {
        // Backend sends JSON.stringify(pickup)
        pickupData = typeof data === "string" ? JSON.parse(data) : data;
      } catch (err) {
        console.error("[BUDDI] Parse error (pickup-started):", err);
        return;
      }

      console.log("[BUDDI] 🚀 Parsed pickup-started data:", pickupData);
      console.log(
        "[BUDDI] 🚀 Check buddiId match:",
        pickupData.buddiId,
        "===",
        buddiDetails?.id
      );

      // Verify this is for this buddi
      if (pickupData.buddiId === buddiDetails?.id) {
        console.log(
          "[BUDDI] ✅ Pickup started for this buddi, updating active pickup"
        );
        setActivePickup(pickupData);
      } else {
        console.log("[BUDDI] ❌ Pickup started not for this buddi");
      }
    };

    // Handler for child-picked-up event
    const handleChildPickedUp = (data: any) => {
      console.log("[BUDDI] 👶 Raw child-picked-up event received:", data);

      let pickupData;
      try {
        // Backend sends JSON.stringify(pickup)
        pickupData = typeof data === "string" ? JSON.parse(data) : data;
      } catch (err) {
        console.error("[BUDDI] Parse error (child-picked-up):", err);
        return;
      }

      console.log("[BUDDI] 👶 Parsed child-picked-up data:", pickupData);
      console.log(
        "[BUDDI] 👶 Check buddiId match:",
        pickupData.buddiId,
        "===",
        buddiDetails?.id
      );

      // Verify this is for this buddi
      if (pickupData.buddiId === buddiDetails?.id) {
        console.log(
          "[BUDDI] ✅ Child picked up for this buddi, updating active pickup"
        );
        setActivePickup(pickupData);
      } else {
        console.log("[BUDDI] ❌ Child picked up not for this buddi");
      }
    };

    // Socket event listeners are already registered via SocketService.on above

    // On mount, load completed trips from AsyncStorage
    AsyncStorage.getItem("completedTrips").then((stored) => {
      // setCompletedTrips(stored ? JSON.parse(stored) : []); // Commented out as completedTrips state is not used
    });

    // Cleanup is handled by SocketService automatically
  }, [matchedCall, activePickup]); // Include both dependencies

  React.useEffect(() => {
    const fetchCalls = async () => {
      try {
        console.log("[BuddiHome] Fetching matched requests...");

        if (buddiDetails?.id) {
          // Fetch matched requests using the new API
          const matchedRes = await BuddiService.getMatchedRequests(
            buddiDetails.id
          );
          const matchedList = matchedRes.data || [];
          setMatchedPickups(matchedList);
          const matched = matchedList[0] || null;
          setMatchedCall(matched);
          // Fetch available calls for application (pending requests)
          const availableRes = await BuddiService.getAvailableCalls(1, 50);
          const availableForApplication = availableRes.data.filter(
            (call: any) =>
              call.status === "pending" && call.matchedBuddiId === null
          );
          setAvailableCalls(availableForApplication || []);
          // Clear active pickup when fetching new calls
          setActivePickup(null);

          // Fetch weekly pickup summary for completed pickups
          await fetchWeeklyPickupSummary();
        } else {
          console.log("[BuddiHome] No buddi details available");
          setMatchedCall(null);
          setAvailableCalls([]);
          setActivePickup(null);
          setMatchedPickups([]);
        }
      } catch (err) {
        console.error("[BuddiHome] Error fetching calls:", err);
        setAvailableCalls([]);
        setMatchedCall(null);
        setActivePickup(null);
        setMatchedPickups([]);
      }
    };
    fetchCalls();
  }, [buddiDetails?.id]);

  // const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
  //   const contentOffset = event.nativeEvent.contentOffset.x;
  //   const cardWidth = 300 + 12; // card width + margin
  //   const newIndex = Math.round(contentOffset / cardWidth);
  //   setActiveCard(newIndex);
  // };

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

  const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todaysPickups = matchedPickups.filter((pickup) => {
    if (!pickup.availableDays || !Array.isArray(pickup.availableDays))
      return false;
    const days = pickup.availableDays
      .flatMap((d: string) => d.split(","))
      .map((d: string) => d.trim().toLowerCase());
    return days.includes(todayName.toLowerCase());
  });

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
            {/* <TouchableOpacity className="p-2 bg-primary rounded-xl shadow-sm">
              <Ionicons name="search-outline" size={20} color="white" />
            </TouchableOpacity> */}
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
            value={todaysPickups.length.toString()}
            subtitle={
              todaysPickups.length > 0
                ? `${
                    [
                      ...new Set(
                        todaysPickups.map((p) =>
                          p.fromZone &&
                          typeof p.fromZone === "string" &&
                          p.fromZone.trim() !== ""
                            ? p.fromZone.trim()
                            : "-"
                        )
                      ),
                    ].length
                  }`
                : "0 Zones"
            }
          />
          <AnalyticsCard
            icon={
              <View className="bg-[#00C6AE] w-10 h-10 rounded-full items-center justify-center">
                <Ionicons name="wallet" size={20} color="white" />
              </View>
            }
            title="Paid Timesheets"
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
          // onScroll={handleScroll}
          scrollEventThrottle={16}
          pagingEnabled
          decelerationRate="fast"
          snapToInterval={352} // card width (340) + margin (12)
        >
          {matchedCall && isPickupToday ? (
            // Create separate cards for each available day that matches today
            (() => {
              // Parse all available days from the array
              const allAvailableDays: string[] = [];
              matchedCall.availableDays.forEach((dayString: string) => {
                const days = dayString
                  .split(",")
                  .map((day: string) => day.trim());
                allAvailableDays.push(...days);
              });

              console.log(
                "[BUDDI] Rendering pickup cards for all available days:",
                allAvailableDays
              );

              // Filter for today's day
              const todaysDays = allAvailableDays.filter(
                (day: string) => day.toLowerCase() === today.toLowerCase()
              );

              console.log("[BUDDI] Today's days to render:", todaysDays);

              return todaysDays.map((day: string, index: number) => {
                // Use activePickup data if available, otherwise use matchedCall data
                const pickupData = activePickup || matchedCall;
                const status = activePickup
                  ? activePickup.status
                  : matchedCall.status;

                // Check if this pickup is completed for today
                const isCompleted = isPickupCompletedForToday(matchedCall);

                console.log("[BUDDI] Rendering pickup card with data:", {
                  pickupData,
                  status,
                  isActivePickup: !!activePickup,
                  isCompleted,
                });

                return (
                  <PickupCard
                    key={`${matchedCall.id}-${day}-${index}`}
                    id={pickupData.id?.toString() || "0"}
                    name={matchedCall.description || "Pickup"}
                    time={matchedCall.callPickupTime || "-"}
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
                      isCompleted
                        ? "completed"
                        : status === "pickedUp"
                        ? "pickedUp"
                        : status === "enRoute"
                        ? "enRoute"
                        : status === "completed"
                        ? "completed"
                        : "notStarted"
                    }
                    pickupTime={
                      activePickup?.callPickupTime ||
                      matchedCall.callPickupTime ||
                      "-"
                    }
                    tripStartTime={
                      activePickup?.tripStartTime ||
                      matchedCall.tripStartTime ||
                      "-"
                    }
                    dropoffTime={
                      activePickup?.callDropTime ||
                      matchedCall.callDropTime ||
                      "-"
                    }
                    fare={activePickup?.fare || matchedCall.fare || 0}
                    kidsCount={matchedCall.kidsCount || 0}
                    callType={matchedCall.type}
                    startDate={matchedCall.startDate}
                    endDate={matchedCall.endDate}
                    fromZone={matchedCall.fromZone}
                    toZone={matchedCall.toZone}
                    onButtonPress={
                      isCompleted ||
                      status === "enRoute" ||
                      status === "pickedUp" ||
                      status === "completed"
                        ? () => {
                            if (isCompleted) {
                              Alert.alert(
                                "Pickup Completed",
                                "This pickup has already been completed for today.",
                                [{ text: "OK", style: "default" }]
                              );
                            }
                          }
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
                                      // Debug: Log current user and pickup details
                                      console.log(
                                        "[BUDDI] Starting trip with details:",
                                        {
                                          buddiId: buddiDetails?.id,
                                          buddiRequestId: matchedCall.id,
                                          pickupIdFromEvent: currentPickupId,
                                          pickupStatus: matchedCall.status,
                                          matchedBuddiId:
                                            matchedCall.matchedBuddiId,
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
                                            "[BUDDI] Using API pickup ID for trip start:",
                                            apiPickup.id
                                          );
                                          pickupIdToUse = apiPickup.id;
                                          setCurrentPickupId(apiPickup.id);
                                        } else {
                                          Alert.alert(
                                            "Trip Not Ready",
                                            "No pickup request found. Please wait for the parent to request a pickup.",
                                            [{ text: "OK", style: "default" }]
                                          );
                                          return;
                                        }
                                      }

                                      // Ensure we have a valid pickup ID before proceeding
                                      if (!pickupIdToUse) {
                                        Alert.alert(
                                          "Trip Not Ready",
                                          "Unable to get pickup ID. Please try again.",
                                          [{ text: "OK", style: "default" }]
                                        );
                                        return;
                                      }
                                      console.log(
                                        "[BUDDI] Using pickup ID for trip start:",
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

                                      // Show success modal
                                      showSuccessModal(
                                        "Trip Started! 🚀",
                                        "Your pickup trip has started successfully! You can now navigate to pick up the child.",
                                        "car-sport",
                                        "#22C55E"
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
                      isCompleted
                        ? undefined
                        : status === "enRoute"
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

                                      // Show success modal
                                      showSuccessModal(
                                        "Child Picked Up! 👶",
                                        "Great! You've successfully picked up the child. Now head to the destination.",
                                        "people",
                                        "#8B5CF6"
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
                      isCompleted
                        ? undefined
                        : status === "pickedUp"
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

                                      // Show success modal
                                      showSuccessModal(
                                        "Trip Completed! 🎉",
                                        "Excellent work! You've successfully completed the pickup trip. Well done!",
                                        "checkmark-circle",
                                        "#16A34A"
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
