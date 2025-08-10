import PickupCard from "@/components/commons/PickupCard";
import { useAuth } from "@/context/AuthContext";
import BuddiService from "@/services/api/buddi.service";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
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

export default function AllPickupsPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { buddiDetails } = useAuth();
  const [matchedPickups, setMatchedPickups] = React.useState<any[]>([]);
  const [weeklyPickupSummary, setWeeklyPickupSummary] =
    React.useState<any>(null);
  const [weeklySummaryLoading, setWeeklySummaryLoading] = React.useState(false);
  const [weeklySummaryError, setWeeklySummaryError] = React.useState<
    string | null
  >(null);

  // Helper to get today's day as a string (e.g., 'Monday')
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  // Helper to fetch weekly pickup summary
  const fetchWeeklyPickupSummary = async () => {
    if (!buddiDetails?.id) return;

    setWeeklySummaryLoading(true);
    setWeeklySummaryError(null);

    try {
      const summary = await BuddiService.getWeeklyPickupSummary(
        buddiDetails.id
      );
      console.log("[ALL-PICKUPS] Weekly pickup summary:", summary);
      setWeeklyPickupSummary(summary);
    } catch (err: any) {
      console.error("[ALL-PICKUPS] Error fetching weekly pickup summary:", err);
      setWeeklySummaryError(err.message || "Failed to fetch weekly summary");
    } finally {
      setWeeklySummaryLoading(false);
    }
  };

  // Helper to check if a pickup is completed for a specific day
  const isPickupCompletedForDay = (pickup: any, day: string) => {
    if (!weeklyPickupSummary?.completed) return false;

    const dayKey = day as keyof typeof weeklyPickupSummary.completed;
    const completedForDay = weeklyPickupSummary.completed[dayKey];

    if (!completedForDay) return false;

    // Check if this pickup matches the completed one
    // We'll match based on fromLocation and toLocation for now
    return (
      completedForDay.fromLocation === pickup.fromZone &&
      completedForDay.toLocation === pickup.toZone
    );
  };

  React.useEffect(() => {
    const fetchMatchedPickups = async () => {
      try {
        if (buddiDetails?.id) {
          const res = await BuddiService.getMatchedRequests(buddiDetails.id);
          setMatchedPickups(res.data || []);

          // Also fetch weekly pickup summary
          await fetchWeeklyPickupSummary();
        } else {
          setMatchedPickups([]);
        }
      } catch (err) {
        console.error(
          "[BUDDI ALL-PICKUPS] Error fetching matched pickups:",
          err
        );
        setMatchedPickups([]);
      }
    };
    fetchMatchedPickups();
  }, [buddiDetails?.id]);

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
      <View className="flex-row items-center justify-between px-4 mb-6 pt-6">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 bg-primary rounded-xl items-center justify-center"
        >
          <Ionicons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
        <Text className="text-xl font-comfortaa-bold">All Pickups</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: Platform.select({
            ios: 90 + insets.bottom,
            android: 80 + insets.bottom,
          }),
          paddingHorizontal: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {matchedPickups.length > 0 ? (
          (() => {
            // Create a sortable array of {pickup, day}
            const dayOrder = {
              monday: 1,
              tuesday: 2,
              wednesday: 3,
              thursday: 4,
              friday: 5,
              saturday: 6,
              sunday: 7,
            };
            const pickupDayPairs = matchedPickups.flatMap((pickup) => {
              console.log("[BUDDI ALL-PICKUPS] Processing pickup:", pickup.id);

              if (
                !pickup.availableDays ||
                !Array.isArray(pickup.availableDays)
              ) {
                console.log(
                  "[BUDDI ALL-PICKUPS] No available days for pickup:",
                  pickup.id
                );
                return [{ pickup, day: "-" }];
              }

              // Parse the available days array
              const availableDays = pickup.availableDays.flatMap(
                (dayString: string) => {
                  return dayString.split(",").map((day: string) => day.trim());
                }
              );

              console.log(
                "[BUDDI ALL-PICKUPS] Available days array:",
                pickup.availableDays
              );
              console.log(
                "[BUDDI ALL-PICKUPS] Parsed available days:",
                availableDays
              );

              return availableDays.map((day: string) => ({ pickup, day }));
            });
            // Sort by day of week
            pickupDayPairs.sort((a, b) => {
              const aDay = (a.day || "").toLowerCase();
              const bDay = (b.day || "").toLowerCase();
              return (
                (dayOrder[aDay as keyof typeof dayOrder] || 99) -
                (dayOrder[bDay as keyof typeof dayOrder] || 99)
              );
            });
            return pickupDayPairs.map(({ pickup, day }) => {
              // Check if this pickup is completed for this day
              const isCompleted = isPickupCompletedForDay(pickup, day);

              return (
                <View key={`${pickup.id}-${day}`} style={{ marginBottom: 18 }}>
                  <PickupCard
                    id={pickup.id.toString()}
                    name={pickup.description || "Pickup Request"}
                    time={pickup.callPickupTime || "-"}
                    days={day}
                    school={pickup.fromZone || "School"}
                    home={pickup.toZone || "Home"}
                    dropoffTime={pickup.callDropTime || "-"}
                    kidsCount={pickup.kidsCount || 0}
                    status={isCompleted ? "completed" : "notStarted"}
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
                      router.push(`/buddi`);
                    }}
                  />
                </View>
              );
            });
          })()
        ) : (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: 180,
              backgroundColor: "#FFF7ED",
              borderRadius: 16,
              borderWidth: 1.2,
              borderColor: "#FFD9B3",
              marginTop: 32,
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
    </SafeAreaView>
  );
}
