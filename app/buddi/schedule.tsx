import AnalyticsCard from "@/components/commons/AnalyticsCard";
import PageHeader from "@/components/commons/PageHeader";
import PickupCard from "@/components/commons/PickupCard";
import CoverageRequestModal from "@/components/modals/CoverageRequestModal";
import CoverageRequestCard from "@/components/parent/CoverageRequestCard";
import { useAuth } from "@/context/AuthContext";
import BuddiService from "@/services/api/buddi.service";
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

const SchedulePage = () => {
  const router = useRouter();
  const { parentDetails, buddiDetails, user } = useAuth();
  const [activeTab, setActiveTab] = React.useState("pickups");

  // State for managing multiple requests and days
  const [selectedRequestIndex, setSelectedRequestIndex] = React.useState(0);
  const [selectedDay, setSelectedDay] = React.useState<string>("");

  // State for real pickup requests and details
  const [pickupRequests, setPickupRequests] = React.useState<any[]>([]);
  const [buddiDetailsMap, setBuddiDetailsMap] = React.useState<
    Record<string, any>
  >({});
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

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

  // State for active pickup tracking
  const [activePickup, setActivePickup] = React.useState<any>(null);

  // Store the pickup ID from real-time events
  const [currentPickupId, setCurrentPickupId] = React.useState<number | null>(
    null
  );

  // Force re-render when pickup status changes
  const [pickupStatusTrigger, setPickupStatusTrigger] = React.useState(0);

  // Notification debouncing to prevent spam - use useRef to avoid recreation
  const lastNotificationTimeRef = React.useRef<Record<string, number>>({});
  const notificationQueueRef = React.useRef<Set<string>>(new Set());

  // Helper to send notification only if not sent recently (debouncing)
  const sendNotificationOnce = React.useCallback(
    async (key: string, notificationData: any, minInterval: number = 30000) => {
      const now = Date.now();
      const lastTime = lastNotificationTimeRef.current[key] || 0;

      // Check if notification is already in queue or was sent recently
      if (
        notificationQueueRef.current.has(key) ||
        now - lastTime < minInterval
      ) {
        console.log(
          `[SCHEDULE] Notification ${key} skipped - already queued or sent recently`
        );
        return;
      }

      try {
        // Mark as in queue to prevent duplicates
        notificationQueueRef.current.add(key);

        // Remove shadows and make notification look like system notifications
        const cleanNotificationData = {
          ...notificationData,
          // Remove any custom styling that might cause shadows
          android: {
            ...notificationData.android,
            // Ensure no custom styling
            style: undefined,
            color: undefined,
            largeIcon: undefined,
            bigText: undefined,
            subText: undefined,
            // Use default system notification appearance
            priority: "default",
            sound: "default",
            vibrate: [0, 250, 250, 250],
          },
          ios: {
            ...notificationData.ios,
            // Remove custom styling for iOS
            sound: "default",
            badge: undefined,
            category: undefined,
            userInfo: undefined,
          },
        };

        await notificationService.sendImmediateNotification(
          cleanNotificationData
        );
        lastNotificationTimeRef.current[key] = now;

        // Remove from queue after successful send
        notificationQueueRef.current.delete(key);

        console.log(`[SCHEDULE] Notification ${key} sent successfully`);
      } catch (error) {
        console.error(
          `[SCHEDULE] Failed to send notification for key ${key}:`,
          error
        );
        // Remove from queue on error
        notificationQueueRef.current.delete(key);
      }
    },
    []
  );

  // Helper to get today's day as a string (e.g., 'Monday')
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  // Helper to get unique days across all requests
  const getAllAvailableDays = React.useCallback(() => {
    const allDays = new Set<string>();
    pickupRequests.forEach((request) => {
      if (request.availableDays && Array.isArray(request.availableDays)) {
        request.availableDays.forEach((day: string) => allDays.add(day));
      }
    });
    return Array.from(allDays);
  }, [pickupRequests]);

  // Helper to get request type display text
  const getRequestTypeDisplayText = (type?: string) => {
    if (!type) return "One-time";
    return type === "repetitive" ? "Ongoing" : "One-time";
  };

  // Helper to get slots for selected request and day
  const getSlotsForSelectedDay = () => {
    if (
      pickupRequests.length === 0 ||
      selectedRequestIndex >= pickupRequests.length
    ) {
      return [];
    }

    const selectedRequest = pickupRequests[selectedRequestIndex];
    if (!selectedRequest.slots || !selectedDay) {
      return [];
    }

    // Check if the selected day is available for this request
    const isDayAvailable =
      selectedRequest.availableDays &&
      selectedRequest.availableDays.includes(selectedDay);

    if (!isDayAvailable) {
      return [];
    }

    // Return all slots for this request (since slots don't have specific days, they're all available on available days)
    return selectedRequest.slots.map((slot: any) => ({
      ...slot,
      request: selectedRequest,
    }));
  };

  // Helper to fetch weekly pickup summary
  const fetchWeeklyPickupSummary = React.useCallback(async () => {
    if (!buddiDetails?.id) return;

    try {
      const summary = await BuddiService.getWeeklyPickupSummary(
        buddiDetails.id
      );

      setWeeklyPickupSummary(summary);
    } catch {}
  }, [buddiDetails?.id]);

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
  const getCurrentPickupStatus = (requestId: number) => {
    // Check if this request has an active pickup
    if (activePickup && activePickup.buddiRequestId === requestId) {
      console.log(
        "[SCHEDULE] Found active pickup with status:",
        activePickup.status
      );
      // Map backend status to frontend status
      const status = activePickup.status;
      if (status === "pending") return "notStarted";
      if (status === "enRoute" || status === "started") return "enRoute";
      if (status === "pickedUp") return "pickedUp";
      if (status === "completed") return "completed";
      return status || "notStarted";
    }

    return "notStarted";
  };

  // Enhanced helper to emit pickup events to parent's room
  const emitPickupEvent = React.useCallback(
    (eventName: string, pickupData: any, parentId?: string) => {
      const socket = SocketService.getSocket ? SocketService.getSocket() : null;
      const targetParentId = parentId || pickupData?.parentId;

      if (socket && targetParentId) {
        const parentRoomId = `parent-${targetParentId}`;

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
      } else {
      }
    },
    [buddiDetails?.id]
  );

  // Function to fetch pickup data by buddi request ID using service
  const fetchPickupByRequestId = async (buddiRequestId: number) => {
    try {
      if (!buddiRequestId || !buddiDetails?.id) {
        return null;
      }

      const pickup = await BuddiService.getPickupsByRequestId(
        buddiRequestId,
        buddiDetails.id
      );

      return pickup;
    } catch (error) {
      console.error("[SCHEDULE] Error fetching pickup by request ID:", error);
      return null;
    }
  };

  // Check for any locally stored pickup requests that might have been missed
  const checkLocalPickupRequests = React.useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem("buddiPickupRequests");

      if (stored) {
        const localRequests = JSON.parse(stored);

        // Check if any of these are for this buddi and still relevant
        const relevantRequests = localRequests.filter(
          (req: any) =>
            req.buddiId === buddiDetails?.id &&
            req.status !== "completed" &&
            req.status !== "cancelled"
        );

        if (relevantRequests.length > 0) {
          // Set the most recent one as active pickup
          const mostRecent = relevantRequests.sort(
            (a: any, b: any) =>
              new Date(b.scheduledTime || b.createdAt || 0).getTime() -
              new Date(a.scheduledTime || a.createdAt || 0).getTime()
          )[0];

          setActivePickup(mostRecent);
          setCurrentPickupId(mostRecent.id);

          // Send notification about restored pickup (debounced)
          if (mostRecent.status === "enRoute") {
            await sendNotificationOnce(`trip-restored-${mostRecent.id}`, {
              title: "🚗 Active Trip Restored",
              body: `You have an active pickup trip. Navigate to ${
                mostRecent.fromLocation || "pickup location"
              }.`,
              data: {
                type: "trip_restored",
                pickupId: mostRecent.id,
                status: mostRecent.status,
              },
              priority: "default",
              sound: "default",
            });
          } else if (mostRecent.status === "pickedUp") {
            await sendNotificationOnce(`trip-restored-${mostRecent.id}`, {
              title: "👶 Complete Your Trip",
              body: `You have picked up the child. Head to ${
                mostRecent.toLocation || "destination"
              } to complete the trip.`,
              data: {
                type: "trip_restored",
                pickupId: mostRecent.id,
                status: mostRecent.status,
              },
              priority: "default",
              sound: "default",
            });
          }
        }
      }
    } catch (error) {
      console.error("[SCHEDULE] Failed to check local pickup requests:", error);
    }
  }, [buddiDetails?.id, sendNotificationOnce]);

  // Cleanup notification queue on unmount
  React.useEffect(() => {
    return () => {
      // Clear notification queue and timing data on unmount
      notificationQueueRef.current.clear();
      lastNotificationTimeRef.current = {};
    };
  }, []);

  // Handle trip completed (clock out)
  const handleTripCompleted = React.useCallback(
    async (pickup: any) => {
      try {
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

        // Trip completion notification is handled by socket event
        console.log("[SCHEDULE] Trip completion handled by socket events");
      } catch {}
    },
    [buddiDetails?.id, fetchWeeklyPickupSummary, emitPickupEvent]
  );

  // Get today's slots across all requests
  const todaysAllSlots = React.useMemo(() => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    const slots: any[] = [];

    pickupRequests.forEach((request) => {
      if (request.availableDays && request.availableDays.includes(today)) {
        request.slots?.forEach((slot: any) => {
          slots.push({
            ...slot,
            request,
          });
        });
      }
    });

    return slots;
  }, [pickupRequests]);

  // Count today's pickup requests
  const todaysRequestsCount = React.useMemo(() => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    return pickupRequests.filter(
      (request) =>
        request.availableDays && request.availableDays.includes(today)
    ).length;
  }, [pickupRequests]);

  const fetchDetailsForRequests = React.useCallback(async () => {
    // For Buddi users - get matched requests
    if (user?.role === "buddi" && buddiDetails?.id) {
      setLoading(true);
      setError(null);

      try {
        const res = await BuddiService.getMatchedRequests(buddiDetails.id);
        const requests = res.data || [];
        setPickupRequests(requests);

        // For Buddi, we don't need children details but we might need parent details
        // We can leave buddi details map empty for now
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

        // Fetch all children for this parent once (not needed for buddi view)
        // const childrenRes = await ChildrenService.getChildrenByParent(
        //   parentDetails.id.toString()
        // );
        // const childrenArr = Array.isArray(childrenRes) ? childrenRes : [];
        // Map childId to child details (not needed for buddi view)
        // const childMap: Record<string, any> = {};
        // childrenArr.forEach((child: any) => {
        //   childMap[child.id] = child;
        // });
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
  }, [user?.role, buddiDetails?.id, parentDetails?.id]);

  // Fail-safe: stop loading after 8s to avoid endless spinner
  React.useEffect(() => {
    if (!loading) return;

    const timeoutId = setTimeout(() => {
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
  }, [
    parentDetails?.id,
    buddiDetails?.id,
    user?.role,
    fetchDetailsForRequests,
    fetchWeeklyPickupSummary,
  ]);

  // Set initial selected day when pickup requests are loaded
  React.useEffect(() => {
    if (pickupRequests.length > 0 && !selectedDay) {
      const availableDays = getAllAvailableDays();
      if (availableDays.length > 0) {
        // Default to today if available, otherwise first available day
        const today = new Date().toLocaleDateString("en-US", {
          weekday: "long",
        });
        const dayToSelect = availableDays.includes(today)
          ? today
          : availableDays[0];
        setSelectedDay(dayToSelect);
      }
    }

    // Reset selected request index if it's out of bounds
    if (selectedRequestIndex >= pickupRequests.length) {
      setSelectedRequestIndex(0);
    }
  }, [pickupRequests, selectedDay, selectedRequestIndex, getAllAvailableDays]);

  // Socket event listeners for real-time pickup status updates - moved to main socket useEffect
  // These are now handled in the main socket connection useEffect below

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
            priority: "default",
            sound: "default",
          });
        } catch {}

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
          await notificationService.sendImmediateNotification({
            title: "🆘 Coverage Request Sent!",
            body: `Your coverage request has been sent successfully to ${
              selectedBuddiName || "Buddi"
            }.`,
            data: {
              type: "coverage_request_sent",
              buddiName: selectedBuddiName,
            },
            priority: "default",
            sound: "default",
          });
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
  const fetchCoverageRequests = React.useCallback(
    async (page: number = 1) => {
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
    },
    [user?.role, buddiDetails?.id, parentDetails?.id]
  );

  // Fetch coverage requests when tab is active

  React.useEffect(() => {
    if (
      activeTab === "coverage" &&
      (parentDetails?.id || (user?.role === "buddi" && buddiDetails?.id))
    ) {
      fetchCoverageRequests(1);
    }
  }, [
    activeTab,
    parentDetails?.id,
    buddiDetails?.id,
    user?.role,
    fetchCoverageRequests,
  ]);

  // Enhanced socket connection and room management
  React.useEffect(() => {
    if (!buddiDetails?.id || !user?.userId) return;

    // Enhanced socket connection and room management
    const connectAndJoinRoom = () => {
      // Connect to socket
      SocketService.connect(user.userId.toString(), "Buddi");

      // Join buddi-specific room for real-time updates
      const socket = SocketService.getSocket();

      if (socket) {
        socket.emit("join-buddi-room", buddiDetails.id);

        // Listen for room join confirmation (if your server sends it)
        socket.on("room-joined", (data) => {
          // When successfully joined, fetch any missed pickup requests
          fetchMissedPickupRequests();
        });

        socket.on("room-join-error", (error) => {});
      }
    };

    // Function to fetch any missed pickup requests when joining room

    const fetchMissedPickupRequests = async () => {
      if (!buddiDetails?.id) return;

      try {
        // Also re-fetch matched requests to ensure we have the latest data

        const matchedRequestsResponse = await BuddiService.getMatchedRequests(
          buddiDetails.id
        );

        if (
          matchedRequestsResponse &&
          matchedRequestsResponse.data &&
          matchedRequestsResponse.data.length > 0
        ) {
          // Update pickup requests with latest data

          setPickupRequests(matchedRequestsResponse.data);

          // If we have a matched call but no pickup ID, it means we might have missed the pickup-requested event

          const currentMatchedCall = matchedRequestsResponse.data.find(
            (call: any) => call.status === "matched"
          );

          if (currentMatchedCall && !(currentMatchedCall as any).pickupId) {
          }
        }
      } catch {}
    };

    // Initial connection

    connectAndJoinRoom();

    // Check for any locally stored pickup requests that might have been missed

    checkLocalPickupRequests();

    // Reconnect on socket reconnection

    const socket = SocketService.getSocket();

    if (socket) {
      socket.on("connect", () => {
        connectAndJoinRoom();

        // Re-check local pickup requests after reconnection

        checkLocalPickupRequests();
      });

      socket.on("disconnect", (reason) => {});
    }

    // Enhanced handlers for all trip events matching your server's event names

    const handlePickupRequested = async (pickupData: any) => {
      // Check if this pickup is for this buddi (same pattern as other working handlers)
      if (pickupData.buddiId === buddiDetails?.id) {
        // Log timing information
        const now = new Date();
        const pickupScheduledTime = pickupData.scheduledTime
          ? new Date(pickupData.scheduledTime)
          : null;

        if (pickupScheduledTime) {
          const timeDiff = pickupScheduledTime.getTime() - now.getTime();
          const minutesUntilPickup = Math.floor(timeDiff / (1000 * 60));
          console.log(
            "[SCHEDULE] Pickup scheduled for:",
            pickupScheduledTime,
            "Minutes until pickup:",
            minutesUntilPickup
          );
        }

        // Store the pickup ID from the event to use directly
        console.log(
          "[SCHEDULE] Setting current pickup ID from socket event:",
          pickupData.id
        );
        setCurrentPickupId(pickupData.id);

        // Send notification for new pickup assignment (debounced)
        await sendNotificationOnce(
          `pickup-requested-${pickupData.id}`,
          {
            title: "🚨 New Pickup Assignment!",
            body: `Pickup from ${
              pickupData.fromLocation || "Pickup Location"
            } to ${pickupData.toLocation || "Destination"} ${
              pickupData.scheduledTime
                ? `at ${new Date(
                    pickupData.scheduledTime
                  ).toLocaleTimeString()}`
                : "now"
            }`,
            data: {
              type: "pickup_requested",
              pickupId: pickupData.id,
              fromLocation: pickupData.fromLocation,
              toLocation: pickupData.toLocation,
              scheduledTime: pickupData.scheduledTime,
            },
            priority: "default",
            sound: "default",
          },
          30000
        ); // 30 second minimum interval to prevent spam

        // Also update any existing pickup requests to show this new assignment
        // This ensures the buddi sees the pickup even if they missed the initial event
        if (pickupData.id) {
          console.log(
            "[SCHEDULE] Updating active pickup state with new pickup data"
          );
          setActivePickup((prev: any) => {
            if (prev && prev.id === pickupData.id) {
              console.log("[SCHEDULE] Merging with existing pickup data");
              return { ...prev, ...pickupData };
            }

            console.log("[SCHEDULE] Setting new active pickup");
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
              console.log(
                "[SCHEDULE] Updating existing pickup in local storage"
              );
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
            console.log(
              "[SCHEDULE] Pickup stored in local storage successfully"
            );
          });
        } catch (error) {
          console.error(
            "[SCHEDULE] Failed to store pickup in local storage:",
            error
          );
        }
      } else {
      }
    };

    const handlePickupStartedEvent = async (pickupData: any) => {
      // Update active pickup if this matches our buddi
      if (pickupData.buddiId === buddiDetails?.id) {
        console.log(
          "[SCHEDULE] Pickup started is for current buddi, updating state..."
        );

        // Update active pickup state with proper buddiRequestId
        const updatedPickupData = {
          ...pickupData,
          status: "enRoute",
          buddiRequestId:
            pickupData.buddiRequestId || pickupData.BuddiRequest?.id,
        };
        setActivePickup(updatedPickupData);
        setPickupStatusTrigger((prev) => prev + 1); // Force re-render
        console.log(
          "[SCHEDULE] Updated active pickup with enRoute status:",
          updatedPickupData
        );

        // Update local storage with the started pickup
        try {
          const stored = await AsyncStorage.getItem("buddiPickupRequests");
          const requests = stored ? JSON.parse(stored) : [];

          const existingIndex = requests.findIndex(
            (r: any) => r.id === pickupData.id
          );

          if (existingIndex !== -1) {
            console.log(
              "[SCHEDULE] Updating existing pickup in storage with started status"
            );
            requests[existingIndex] = {
              ...requests[existingIndex],
              ...pickupData,
              status: "enRoute",
            };
          } else {
            requests.push({
              ...pickupData,
              status: "enRoute",
            });
          }

          await AsyncStorage.setItem(
            "buddiPickupRequests",
            JSON.stringify(requests)
          );
        } catch (error) {
          console.error(
            "[SCHEDULE] Failed to store pickup started data:",
            error
          );
        }

        // Send notification for pickup started (debounced)
        await sendNotificationOnce(`pickup-started-${pickupData.id}`, {
          title: "🚗 Trip Started!",
          body: `Your pickup trip has started. Navigate to ${
            pickupData.fromLocation || "pickup location"
          } to pick up the child.`,
          data: {
            type: "pickup_started",
            pickupId: pickupData.id,
            fromLocation: pickupData.fromLocation,
            toLocation: pickupData.toLocation,
          },
          priority: "default",
          sound: "default",
        });

        console.log(
          "[SCHEDULE] Pickup trip started successfully - UI should now show 'Pick Up' button"
        );
      } else {
        console.log(
          "[SCHEDULE] Pickup started is not for current buddi, ignoring"
        );
      }
    };

    const handleChildPickedUpEvent = async (pickupData: any) => {
      // Update active pickup if this is for this buddi
      if (pickupData.buddiId === buddiDetails?.id) {
        console.log(
          "[SCHEDULE] Child picked up is for current buddi, updating state..."
        );

        // Update active pickup state with proper buddiRequestId
        const updatedPickupData = {
          ...pickupData,
          status: "pickedUp",
          buddiRequestId:
            pickupData.buddiRequestId || pickupData.BuddiRequest?.id,
        };
        setActivePickup(updatedPickupData);
        setPickupStatusTrigger((prev) => prev + 1); // Force re-render
        console.log(
          "[SCHEDULE] Updated active pickup with pickedUp status:",
          updatedPickupData
        );

        // Update local storage with the picked up status
        try {
          const stored = await AsyncStorage.getItem("buddiPickupRequests");
          const requests = stored ? JSON.parse(stored) : [];

          const existingIndex = requests.findIndex(
            (r: any) => r.id === pickupData.id
          );

          if (existingIndex !== -1) {
            console.log(
              "[SCHEDULE] Updating existing pickup in storage with picked up status"
            );
            requests[existingIndex] = {
              ...requests[existingIndex],
              ...pickupData,
              status: "pickedUp",
            };
          } else {
            requests.push({
              ...pickupData,
              status: "pickedUp",
            });
          }

          await AsyncStorage.setItem(
            "buddiPickupRequests",
            JSON.stringify(requests)
          );
        } catch (error) {
          console.error(
            "[SCHEDULE] Failed to store child picked up data:",
            error
          );
        }

        // Send notification for child picked up (debounced)
        await sendNotificationOnce(`child-picked-up-${pickupData.id}`, {
          title: "👶 Child Picked Up!",
          body: `Great! You've picked up the child. Now head to ${
            pickupData.toLocation || "destination"
          } for drop-off.`,
          data: {
            type: "child_picked_up",
            pickupId: pickupData.id,
            fromLocation: pickupData.fromLocation,
            toLocation: pickupData.toLocation,
          },
          priority: "default",
          sound: "default",
        });

        console.log(
          "[SCHEDULE] Child picked up successfully - UI should now show 'Complete Trip' button"
        );
      } else {
        console.log(
          "[SCHEDULE] Child picked up is not for current buddi, ignoring"
        );
      }
    };

    const handleTripCompletedEvent = async (data: any) => {
      let pickupData;

      try {
        // Backend sends JSON.stringify(pickup)
        pickupData = typeof data === "string" ? JSON.parse(data) : data;
      } catch (err) {
        console.error("[SCHEDULE] Failed to parse trip completed data:", err);
        return;
      }

      console.log(
        "[SCHEDULE] Checking if trip completed is for current buddi:",
        buddiDetails?.id
      );

      // Update active pickup if this is for this buddi
      if (pickupData.buddiId === buddiDetails?.id) {
        console.log(
          "[SCHEDULE] Trip completed is for current buddi, updating state..."
        );

        // Update active pickup state with proper buddiRequestId
        const updatedPickupData = {
          ...pickupData,
          status: "completed",
          buddiRequestId:
            pickupData.buddiRequestId || pickupData.BuddiRequest?.id,
        };
        setActivePickup(updatedPickupData);
        setPickupStatusTrigger((prev) => prev + 1); // Force re-render
        console.log(
          "[SCHEDULE] Updated active pickup with completed status:",
          updatedPickupData
        );

        // Update local storage with completed status
        try {
          const stored = await AsyncStorage.getItem("buddiPickupRequests");
          const requests = stored ? JSON.parse(stored) : [];

          const existingIndex = requests.findIndex(
            (r: any) => r.id === pickupData.id
          );

          if (existingIndex !== -1) {
            console.log(
              "[SCHEDULE] Updating existing pickup in storage with completed status"
            );
            requests[existingIndex] = {
              ...requests[existingIndex],
              ...pickupData,
              status: "completed",
            };
          } else {
            requests.push({
              ...pickupData,
              status: "completed",
            });
          }

          await AsyncStorage.setItem(
            "buddiPickupRequests",
            JSON.stringify(requests)
          );
        } catch (error) {
          console.error(
            "[SCHEDULE] Failed to store trip completed data:",
            error
          );
        }

        // Store completed trip and show success message
        handleTripCompleted(pickupData);

        // Clear active pickup after completion
        setTimeout(() => {
          setActivePickup(null);
        }, 2000); // Clear after 2 seconds to allow UI to show completion status

        // Send notification for trip completion (debounced)
        await sendNotificationOnce(`trip-completed-${pickupData.id}`, {
          title: "🎉 Trip Completed!",
          body: `Great job! You've successfully completed the pickup from ${
            pickupData.fromLocation || "pickup location"
          } to ${pickupData.toLocation || "destination"}. Well done!`,
          data: {
            type: "trip_completed",
            pickupId: pickupData.id,
            fromLocation: pickupData.fromLocation,
            toLocation: pickupData.toLocation,
          },
          priority: "default",
          sound: "default",
        });

        // Refresh weekly pickup summary after trip completion
        fetchWeeklyPickupSummary();

        console.log(
          "[SCHEDULE] Trip completed successfully - pickup should be marked as completed in UI"
        );
      } else {
        console.log(
          "[SCHEDULE] Trip completed is not for current buddi, ignoring"
        );
      }
    };

    const handleEarningsUpdated = (data: any) => {
      // Update earnings display if needed
      // You can add earnings state management here if needed
    };

    const handleTimesheetUpdated = (timesheetData: any) => {
      // Update timesheet display if needed
      // You can add timesheet state management here if needed
    };

    // Register all event listeners matching your server's event names

    SocketService.on("pickup-requested", handlePickupRequested);

    SocketService.on("pickup-started", handlePickupStartedEvent);

    SocketService.on("child-picked-up", handleChildPickedUpEvent);

    SocketService.on("trip-completed", handleTripCompletedEvent);

    SocketService.on("earnings-updated", handleEarningsUpdated);

    SocketService.on("timesheet-updated", handleTimesheetUpdated);

    // Additional events from your server

    SocketService.on("active-pickups", (data: any) => {
      if (data && data.buddiId === buddiDetails?.id) {
        setActivePickup(data);
      }
    });

    SocketService.on("pickup-history", (data: any) => {
      // Handle pickup history updates if needed
    });

    // Cleanup listeners on unmount

    return () => {
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
    // Remove activePickup from dependencies to prevent recreation
    // Remove handleTripCompleted from dependencies to prevent recreation
    // Remove fetchWeeklyPickupSummary from dependencies to prevent recreation
    // Remove checkLocalPickupRequests from dependencies to prevent recreation
    // Remove emitPickupEvent from dependencies to prevent recreation
    // sendNotificationOnce is now stable (no dependencies)
  ]);

  // Periodic room check to ensure we stay connected (reduced frequency)
  React.useEffect(() => {
    if (!buddiDetails?.id || !user?.userId) return;

    const intervalId = setInterval(() => {
      const socket = SocketService.getSocket();

      if (socket && socket.connected) {
        socket.emit("join-buddi-room", buddiDetails.id);
      } else {
        SocketService.connect(user.userId.toString(), "Buddi");
      }
    }, 60000); // Reduced to check every 60 seconds

    return () => clearInterval(intervalId);
  }, [buddiDetails?.id, user?.userId]); // Removed checkLocalPickupRequests from dependencies

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
                value={todaysAllSlots.length.toString()}
                subtitle={`${todaysRequestsCount} ${
                  todaysRequestsCount === 1 ? "Request" : "Requests"
                }`}
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
                    Your Matched Requests
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
                ) : pickupRequests.length === 0 ? (
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
                      No Matched Requests
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
                      You don&apos;t have any matched pickup requests yet. Apply
                      for available requests to get started.
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
                  <>
                    {/* Request Tabs */}
                    {pickupRequests.length > 0 && (
                      <View style={{ marginBottom: 20 }}>
                        <Text
                          style={{
                            fontFamily: "Comfortaa-Bold",
                            fontSize: 16,
                            color: "#374151",
                            marginBottom: 12,
                          }}
                        >
                          {pickupRequests.length > 1
                            ? `Select Request (${pickupRequests.length} total):`
                            : "Your Request:"}
                        </Text>
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={{ paddingRight: 16 }}
                        >
                          {pickupRequests.map((request, index) => {
                            const isSelected = selectedRequestIndex === index;

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
                                  borderColor: isSelected
                                    ? "#FF932E"
                                    : "#E5E7EB",
                                  minWidth: 140,
                                  alignItems: "center",
                                }}
                                onPress={() => setSelectedRequestIndex(index)}
                              >
                                <Text
                                  style={{
                                    fontFamily: "Comfortaa-Bold",

                                    fontSize: 14,
                                    color: isSelected ? "#fff" : "#374151",
                                    textAlign: "center",
                                  }}
                                >
                                  {request.description ||
                                    `Request ${index + 1}`}
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
                                  {request.slots?.length || 0} slots •{" "}
                                  {getRequestTypeDisplayText(request.type)}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </ScrollView>
                      </View>
                    )}

                    {/* Day Tabs for Selected Request */}
                    {pickupRequests.length > 0 &&
                      selectedRequestIndex < pickupRequests.length && (
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
                            {pickupRequests[
                              selectedRequestIndex
                            ]?.availableDays?.map((day: string) => {
                              const isSelected = selectedDay === day;
                              const isToday =
                                day ===
                                new Date().toLocaleDateString("en-US", {
                                  weekday: "long",
                                });

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
                                  {isToday && (
                                    <Text
                                      style={{
                                        fontFamily: "Comfortaa-Regular",
                                        fontSize: 10,
                                        color: isSelected
                                          ? "#DBEAFE"
                                          : "#3B82F6",
                                        marginTop: 2,
                                      }}
                                    >
                                      Today
                                    </Text>
                                  )}
                                </TouchableOpacity>
                              );
                            })}
                          </ScrollView>
                        </View>
                      )}

                    {/* Slots for Selected Day */}
                    {getSlotsForSelectedDay().length > 0 ? (
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
                        <View style={{ gap: 12 }}>
                          {getSlotsForSelectedDay().map((slot: any) => {
                            const request = slot.request;

                            // Check if this pickup is completed for today
                            const isCompleted =
                              isPickupCompletedForToday(request);

                            return (
                              <PickupCard
                                key={`${slot.id}-${pickupStatusTrigger}`}
                                id={request.id.toString()}
                                name={`${request.description} - Slot ${slot.id}`}
                                time={slot.slotStartTime}
                                days={selectedDay}
                                school={slot.fromLocation}
                                home={slot.toLocation}
                                dropoffTime={slot.slotEndTime}
                                kidsCount={request.kidsCount || 0}
                                status={
                                  isCompleted
                                    ? "completed"
                                    : getCurrentPickupStatus(request.id)
                                }
                                callType={request.type}
                                startDate={request.startDate}
                                endDate={request.endDate}
                                fromZone={slot.fromLocation}
                                toZone={slot.toLocation}
                                onButtonPress={() => {
                                  // Don't allow navigation if pickup is completed

                                  if (isCompleted) {
                                    return;
                                  }

                                  // Handle pickup action based on status

                                  const currentStatus = getCurrentPickupStatus(
                                    request.id
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
                                              console.log(
                                                "[SCHEDULE] Starting trip for request:",
                                                request.id
                                              );
                                              console.log(
                                                "[SCHEDULE] Current pickup ID from state:",
                                                currentPickupId
                                              );

                                              // Always fetch fresh pickup data from API to get the latest pending pickup
                                              console.log(
                                                "[SCHEDULE] Fetching fresh pickup data from API..."
                                              );
                                              const apiPickup =
                                                await fetchPickupByRequestId(
                                                  request.id
                                                );

                                              console.log(
                                                "[SCHEDULE] API returned pickup:",
                                                apiPickup
                                              );

                                              let pickupIdToUse: number | null =
                                                null;

                                              if (
                                                apiPickup &&
                                                apiPickup.id &&
                                                apiPickup.status === "pending"
                                              ) {
                                                pickupIdToUse = apiPickup.id;
                                                console.log(
                                                  "[SCHEDULE] Using fresh pickup ID from API:",
                                                  pickupIdToUse
                                                );
                                                setCurrentPickupId(
                                                  apiPickup.id
                                                );
                                              } else {
                                                console.log(
                                                  "[SCHEDULE] No pending pickup found in API response"
                                                );
                                                Alert.alert(
                                                  "Trip Not Ready",
                                                  `No pending pickup found for "${request.description}". Please wait for the parent to request a pickup.`,
                                                  [
                                                    {
                                                      text: "OK",
                                                      style: "default",
                                                    },
                                                  ]
                                                );
                                                return;
                                              }

                                              // Ensure we have a valid pickup ID before proceeding
                                              if (!pickupIdToUse) {
                                                console.error(
                                                  "[SCHEDULE] No pickup ID available after all attempts"
                                                );
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
                                                "[SCHEDULE] Starting pickup trip with ID:",
                                                pickupIdToUse
                                              );
                                              const res =
                                                await BuddiService.startPickupTrip(
                                                  pickupIdToUse
                                                );

                                              console.log(
                                                "[SCHEDULE] Start trip response:",
                                                res
                                              );
                                              setActivePickup(res.pickup);

                                              // Store the started pickup in local storage immediately
                                              try {
                                                const stored =
                                                  await AsyncStorage.getItem(
                                                    "buddiPickupRequests"
                                                  );
                                                const requests = stored
                                                  ? JSON.parse(stored)
                                                  : [];

                                                const existingIndex =
                                                  requests.findIndex(
                                                    (r: any) =>
                                                      r.id === res.pickup.id
                                                  );

                                                if (existingIndex !== -1) {
                                                  console.log(
                                                    "[SCHEDULE] Updating existing pickup with started status"
                                                  );
                                                  requests[existingIndex] = {
                                                    ...requests[existingIndex],
                                                    ...res.pickup,
                                                    status: "enRoute",
                                                  };
                                                } else {
                                                  console.log(
                                                    "[SCHEDULE] Adding new started pickup to storage"
                                                  );
                                                  requests.push({
                                                    ...res.pickup,
                                                    status: "enRoute",
                                                  });
                                                }

                                                await AsyncStorage.setItem(
                                                  "buddiPickupRequests",
                                                  JSON.stringify(requests)
                                                );
                                                console.log(
                                                  "[SCHEDULE] Started pickup stored in local storage"
                                                );
                                              } catch (storageError) {
                                                console.error(
                                                  "[SCHEDULE] Failed to store started pickup:",
                                                  storageError
                                                );
                                              }

                                              console.log(
                                                "[SCHEDULE] Clearing current pickup ID from state"
                                              );
                                              setCurrentPickupId(null);

                                              console.log(
                                                "[SCHEDULE] Emitting pickup-started event"
                                              );
                                              emitPickupEvent(
                                                "pickup-started",

                                                res.pickup
                                              );

                                              // Success notification will come via socket event
                                              console.log(
                                                "[SCHEDULE] Trip started successfully, notification will follow via socket"
                                              );
                                            } catch (err) {
                                              console.error(
                                                "[SCHEDULE] Error starting trip:",
                                                err
                                              );
                                              Alert.alert(
                                                "Error",

                                                "Failed to start trip. Please try again."
                                              );
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
                                      getCurrentPickupStatus(request.id);
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

                                                emitPickupEvent(
                                                  "child-picked-up",

                                                  res.pickup
                                                );

                                                // Success notification will come via socket event
                                                console.log(
                                                  "[SCHEDULE] Child picked up successfully, notification will follow via socket"
                                                );
                                              } catch {
                                                Alert.alert(
                                                  "Error",

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
                                      getCurrentPickupStatus(request.id);
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
                                                    request.pickupTime
                                                  );

                                                setActivePickup(res.pickup);

                                                emitPickupEvent(
                                                  "trip-completed",

                                                  res.pickup
                                                );

                                                // Success notification will come via socket event
                                                console.log(
                                                  "[SCHEDULE] Trip completed successfully, notification will follow via socket"
                                                );

                                                await fetchWeeklyPickupSummary();
                                              } catch {
                                                Alert.alert(
                                                  "Error",

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
                            );
                          })}
                        </View>
                      </View>
                    ) : selectedDay ? (
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
                      </View>
                    ) : null}
                  </>
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
