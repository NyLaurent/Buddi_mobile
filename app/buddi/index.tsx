// app/buddi/index.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
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
import MatchedRequestCard from "../../components/commons/MatchedRequestCard";
import { useAuth } from "../../context/AuthContext";
import BuddiService from "../../services/api/buddi.service";

export default function BuddiHome() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout, buddiDetails } = useAuth();
  const [availableCalls, setAvailableCalls] = useState<any[]>([]);
  const [matchedPickups, setMatchedPickups] = useState<any[]>([]);

  // State for weekly pickup summary (completed pickups)
  const [weeklyPickupSummary, setWeeklyPickupSummary] = useState<any>(null);

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
  const fetchWeeklyPickupSummary = useCallback(async () => {
    if (!buddiDetails?.id) return;

    try {
      const summary = await BuddiService.getWeeklyPickupSummary(
        buddiDetails.id
      );
      console.log("[BUDDI HOME] Weekly pickup summary:", summary);
      setWeeklyPickupSummary(summary);
    } catch (err: any) {
      console.error("[BUDDI HOME] Error fetching weekly pickup summary:", err);
    }
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

  // Helper to check if a request is available today
  const isRequestAvailableToday = (request: any) => {
    if (!request.availableDays || !Array.isArray(request.availableDays)) {
      return false;
    }
    return request.availableDays
      .map((day: string) => day.toLowerCase())
      .includes(today.toLowerCase());
  };

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
          // Fetch available calls for application (pending requests)
          const availableRes = await BuddiService.getAvailableCalls(1, 50);
          const availableForApplication = availableRes.data.filter(
            (call: any) =>
              call.status === "pending" && call.matchedBuddiId === null
          );
          setAvailableCalls(availableForApplication || []);

          // Fetch weekly pickup summary for completed pickups
          await fetchWeeklyPickupSummary();
        } else {
          console.log("[BuddiHome] No buddi details available");
          setAvailableCalls([]);
          setMatchedPickups([]);
        }
      } catch (err) {
        console.error("[BuddiHome] Error fetching calls:", err);
        setAvailableCalls([]);
        setMatchedPickups([]);
      }
    };
    fetchCalls();
  }, [buddiDetails?.id, fetchWeeklyPickupSummary]);

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

  // On logout
  const handleLogoutConfirmed = async () => {
    console.log("User confirmed logout"); // Debug log
    try {
      console.log("Calling logout function..."); // Debug log
      await logout();
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

  // Count today's pickup requests (not individual slots)
  const todaysPickupRequests = matchedPickups.filter((pickup) => {
    if (!pickup.availableDays || !Array.isArray(pickup.availableDays))
      return false;
    return pickup.availableDays
      .map((day: string) => day.toLowerCase())
      .includes(todayName.toLowerCase());
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
        />

        {/* Analytics Cards */}
        <View className="flex-row justify-between px-4 pt-4 gap-3">
          <AnalyticsCard
            icon={
              <View className="bg-[#8B5CF6] w-10 h-10 rounded-full items-center justify-center">
                <Ionicons name="flash" size={20} color="white" />
              </View>
            }
            title="Today's Requests"
            value={todaysPickupRequests.length.toString()}
            subtitle={
              todaysPickupRequests.length > 0
                ? `${todaysPickupRequests.reduce(
                    (total, request) => total + (request.slots?.length || 0),
                    0
                  )} ${
                    todaysPickupRequests.reduce(
                      (total, request) => total + (request.slots?.length || 0),
                      0
                    ) === 1
                      ? "Slot"
                      : "Slots"
                  }`
                : "No requests"
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

        {/* Your Matched Request Header */}
        <View className="flex-row justify-between items-center mx-4 mb-2 pt-5">
          <Text className="font-comfortaa-bold text-xl">
            Your Matched Request
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/buddi/schedule" as any)}
          >
            <Text className="text-primary font-comfortaa">View All</Text>
          </TouchableOpacity>
        </View>

        {/* Matched Request Cards Vertical */}
        <View className="px-4">
          {matchedPickups.length > 0 ? (
            matchedPickups.map((request, index) => {
              const isToday = isRequestAvailableToday(request);

              console.log("[BUDDI] Rendering matched request card with data:", {
                requestData: request,
                isToday,
              });

              return (
                <MatchedRequestCard
                  key={`${request.id}-${index}`}
                  request={request}
                  isToday={isToday}
                  onViewDetails={() => {
                    // Navigate to call details page
                    router.push({
                      pathname: "/buddi/call-details/[id]",
                      params: { id: request.id.toString() },
                    });
                  }}
                />
              );
            })
          ) : (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#FFF7ED",
                borderRadius: 16,
                borderWidth: 2,
                borderColor: "#FFD9B3",
                padding: 32,
                marginBottom: 16,
              }}
            >
              <View className="bg-orange-100 rounded-full p-4 mb-4">
                <Ionicons name="briefcase-outline" size={32} color="#FF932E" />
              </View>
              <Text
                style={{
                  fontFamily: "Comfortaa-Bold",
                  fontSize: 18,
                  color: "#FF932E",
                  marginBottom: 8,
                  textAlign: "center",
                }}
              >
                No matched requests
              </Text>
              <Text
                style={{
                  fontFamily: "Comfortaa-Regular",
                  fontSize: 14,
                  color: "#A3A3A3",
                  textAlign: "center",
                  lineHeight: 20,
                  marginBottom: 16,
                }}
              >
                You don't have any matched pickup requests yet. Check available
                calls to apply for new requests.
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/buddi/available-calls")}
                style={{
                  backgroundColor: "#FF932E",
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  borderRadius: 12,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontFamily: "Comfortaa-Medium",
                    fontSize: 14,
                  }}
                >
                  View Available Calls
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

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
