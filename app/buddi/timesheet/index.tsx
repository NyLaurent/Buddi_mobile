import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
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
import { useAuth } from "../../../context/AuthContext";
import { authorizedApi } from "../../../services/api/config";
import TimesheetSummaryCard from "./TimesheetSummaryCard";

interface DailyPickup {
  id: number;
  timesheetId: number;
  day: string;
  pickups: number;
  fare: number;
  createdAt: string;
  updatedAt: string;
}

interface Timesheet {
  id: number;
  buddiId: number;
  parentId: string;
  buddiRequestId: number;
  weekStart: string;
  weekEnd: string;
  availableDays: string[];
  totalHours: number;
  totalPickups: number;
  totalEarnings: number;
  isPaid: boolean;
  isFull: boolean;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  dailyPickups: DailyPickup[];
}

export default function TimesheetPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { buddiDetails } = useAuth();
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTimesheets = useCallback(async () => {
    if (!buddiDetails?.id) {
      console.log("No buddiDetails.id found:", buddiDetails);
      return;
    }
    console.log("Fetching timesheets for buddi ID:", buddiDetails.id);
    setLoading(true);
    setError(null);
    try {
      const response = await authorizedApi.get(
        `/timesheets/buddi/${buddiDetails.id}?page=1&limit=10`
      );
      console.log("Full API response:", JSON.stringify(response.data, null, 2));
      console.log("Timesheets data:", response.data.data);
      console.log("Number of timesheets:", response.data.data?.length || 0);

      setTimesheets(response.data.data || []);
    } catch (err: any) {
      console.error("Error fetching timesheets:", err);
      console.error("Error message:", err.message);
      setError("Failed to fetch timesheets.");
    } finally {
      setLoading(false);
    }
  }, [buddiDetails?.id]);

  useEffect(() => {
    fetchTimesheets();
  }, [fetchTimesheets]);

  // Refresh timesheets when returning to this page
  useFocusEffect(
    useCallback(() => {
      fetchTimesheets();
    }, [fetchTimesheets])
  );

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString();
  };

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
        <Text className="text-xl font-comfortaa-bold">Timesheets</Text>
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
        {loading ? (
          <Text style={{ textAlign: "center", marginTop: 32 }}>
            Loading timesheets...
          </Text>
        ) : error ? (
          <Text style={{ color: "red", textAlign: "center", marginTop: 32 }}>
            {error}
          </Text>
        ) : timesheets.length === 0 ? (
          <View style={{ alignItems: "center", marginTop: 48 }}>
            <Ionicons name="document-text-outline" size={48} color="#FF932E" />
            <Text
              style={{
                fontFamily: "Comfortaa-Bold",
                fontSize: 18,
                color: "#FF932E",
                marginTop: 12,
              }}
            >
              No timesheets found
            </Text>
            <Text
              style={{
                fontFamily: "Comfortaa-Regular",
                fontSize: 14,
                color: "#A3A3A3",
                textAlign: "center",
                marginTop: 4,
              }}
            >
              Once you complete pickups, your timesheets will appear here.
            </Text>
          </View>
        ) : (
          timesheets.map((sheet, idx) => {
            console.log(`Rendering timesheet ${idx + 1}:`, {
              id: sheet.id,
              weekStart: sheet.weekStart,
              weekEnd: sheet.weekEnd,
              totalPickups: sheet.totalPickups,
              totalEarnings: sheet.totalEarnings,
              isFull: sheet.isFull,
              isPaid: sheet.isPaid,
              dailyPickups: sheet.dailyPickups,
            });

            // Calculate week label and range
            const weekLabel = `Week ${idx + 1}`;
            const weekRange = `${new Date(
              sheet.weekStart
            ).getDate()}-${new Date(sheet.weekEnd).getDate()} th, ${new Date(
              sheet.weekEnd
            ).toLocaleString("default", { month: "long" })}, ${new Date(
              sheet.weekEnd
            ).getFullYear()}`;

            console.log("Calculated weekLabel:", weekLabel);
            console.log("Calculated weekRange:", weekRange);

            // Shifts = totalPickups, Pending = totalEarnings (or use another field if needed)
            // Round the pending amount to 2 decimal places
            const roundedPending = sheet.totalEarnings
              ? Math.round(sheet.totalEarnings * 100) / 100
              : 0;

            console.log("Original totalEarnings:", sheet.totalEarnings);
            console.log("Rounded pending amount:", roundedPending);
            console.log("Type of roundedPending:", typeof roundedPending);
            console.log(
              "Is roundedPending undefined?",
              roundedPending === undefined
            );
            console.log("Is roundedPending null?", roundedPending === null);

            return (
              <TimesheetSummaryCard
                key={sheet.id}
                weekLabel={weekLabel}
                weekRange={weekRange}
                shifts={sheet.totalPickups}
                pending={roundedPending}
                isFull={sheet.isFull}
                isPaid={sheet.isPaid}
                onPress={() =>
                  router.push({
                    pathname: "/buddi/timesheet/[id]",
                    params: { id: sheet.id.toString() },
                  })
                }
              />
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
