// app/buddi/index.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
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
import { useAuth } from "../../context/AuthContext";
import BuddiService from "../../services/api/buddi.service";

export default function BuddiHome() {
  const scrollViewRef = useRef(null);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout, buddiDetails } = useAuth();
  const [availableCalls, setAvailableCalls] = useState<any[]>([]);
  const [matchedCall, setMatchedCall] = useState<any>(null);
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

          // Fetch weekly pickup summary for completed pickups
          await fetchWeeklyPickupSummary();
        } else {
          console.log("[BuddiHome] No buddi details available");
          setMatchedCall(null);
          setAvailableCalls([]);
          setMatchedPickups([]);
        }
      } catch (err) {
        console.error("[BuddiHome] Error fetching calls:", err);
        setAvailableCalls([]);
        setMatchedCall(null);
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
                // Check if this pickup is completed for today
                const isCompleted = isPickupCompletedForToday(matchedCall);

                console.log("[BUDDI] Rendering pickup card with data:", {
                  pickupData: matchedCall,
                  status: matchedCall.status,
                  isCompleted,
                });

                return (
                  <PickupCard
                    key={`${matchedCall.id}-${day}-${index}`}
                    id={matchedCall.id?.toString() || "0"}
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
                    status={isCompleted ? "completed" : "notStarted"}
                    pickupTime={matchedCall.callPickupTime || "-"}
                    tripStartTime={matchedCall.tripStartTime || "-"}
                    dropoffTime={matchedCall.callDropTime || "-"}
                    fare={matchedCall.fare || 0}
                    kidsCount={matchedCall.kidsCount || 0}
                    callType={matchedCall.type}
                    startDate={matchedCall.startDate}
                    endDate={matchedCall.endDate}
                    fromZone={matchedCall.fromZone}
                    toZone={matchedCall.toZone}
                    onButtonPress={() => {
                      if (isCompleted) {
                        Alert.alert(
                          "Pickup Completed",
                          "This pickup has already been completed for today.",
                          [{ text: "OK", style: "default" }]
                        );
                      } else {
                        // Navigate to schedule page for trip management
                        router.push("/buddi/schedule");
                      }
                    }}
                    onPickUp={undefined}
                    onClockOut={undefined}
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
