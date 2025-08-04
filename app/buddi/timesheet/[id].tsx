import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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

export default function TimesheetDetailsPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { buddiDetails } = useAuth();
  const [timesheet, setTimesheet] = useState<Timesheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTimesheet = async () => {
      if (!id || !buddiDetails?.id) return;
      setLoading(true);
      setError(null);
      try {
        const response = await authorizedApi.get(
          `/timesheets/buddi/${buddiDetails.id}/sheet/${id}`
        );
        setTimesheet(response.data);
      } catch (err: any) {
        setError("Failed to fetch timesheet details.");
      } finally {
        setLoading(false);
      }
    };
    fetchTimesheet();
  }, [id, buddiDetails?.id]);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent={true}
        />
        <ActivityIndicator
          size="large"
          color="#FF932E"
          style={{ marginTop: 48 }}
        />
      </SafeAreaView>
    );
  }
  if (error || !timesheet) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent={true}
        />
        <Text style={{ color: "red", textAlign: "center", marginTop: 48 }}>
          {error || "No data found."}
        </Text>
      </SafeAreaView>
    );
  }

  // Calculate week label and range
  const weekLabel = `Week Details`;
  const weekRange = `${new Date(timesheet.weekStart).getDate()}-${new Date(
    timesheet.weekEnd
  ).getDate()} th, ${new Date(timesheet.weekEnd).toLocaleString("default", {
    month: "long",
  })}, ${new Date(timesheet.weekEnd).getFullYear()}`;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: Platform.select({
            ios: 90,
            android: 80,
          }),
          paddingHorizontal: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 24,
            marginBottom: 18,
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginRight: 12 }}
          >
            <Ionicons name="arrow-back" size={24} color="#FF932E" />
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: "Comfortaa-Bold",
              fontSize: 20,
              color: "#232B3A",
            }}
          >
            Timesheet Details
          </Text>
        </View>
        {/* Summary Card */}
        <TimesheetSummaryCard
          weekLabel={weekLabel}
          weekRange={weekRange}
          shifts={timesheet.totalPickups}
          pending={timesheet.totalEarnings}
          isFull={timesheet.isFull}
          isPaid={timesheet.isPaid}
        />
        {/* Details Section */}
        <View
          style={{
            backgroundColor: "#FFF7ED",
            borderRadius: 16,
            padding: 18,
            marginBottom: 18,
          }}
        >
          <Text
            style={{
              fontFamily: "Comfortaa-Bold",
              fontSize: 16,
              color: "#FF932E",
              marginBottom: 8,
            }}
          >
            Details
          </Text>
          <Text
            style={{
              fontFamily: "Comfortaa-Regular",
              fontSize: 15,
              color: "#232B3A",
              marginBottom: 4,
            }}
          >
            <Text style={{ fontFamily: "Comfortaa-Bold" }}>
              Available Days:
            </Text>{" "}
            {(timesheet.availableDays || []).join(", ")}
          </Text>
          <Text
            style={{
              fontFamily: "Comfortaa-Regular",
              fontSize: 15,
              color: "#232B3A",
              marginBottom: 4,
            }}
          >
            <Text style={{ fontFamily: "Comfortaa-Bold" }}>Total Hours:</Text>{" "}
            {timesheet.totalHours || 0}
          </Text>
          <Text
            style={{
              fontFamily: "Comfortaa-Regular",
              fontSize: 15,
              color: "#232B3A",
              marginBottom: 4,
            }}
          >
            <Text style={{ fontFamily: "Comfortaa-Bold" }}>Total Pickups:</Text>{" "}
            {timesheet.totalPickups || 0}
          </Text>
          <Text
            style={{
              fontFamily: "Comfortaa-Regular",
              fontSize: 15,
              color: "#232B3A",
              marginBottom: 4,
            }}
          >
            <Text style={{ fontFamily: "Comfortaa-Bold" }}>
              Total Earnings:
            </Text>{" "}
            {(timesheet.totalEarnings || 0).toFixed(2)}
          </Text>
          <View
            style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 8 }}
          >
            {timesheet.isPaid && (
              <View
                style={{
                  backgroundColor: "#16A34A",
                  borderRadius: 8,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  marginRight: 8,
                  marginBottom: 6,
                }}
              >
                <Text style={{ color: "#fff", fontSize: 13 }}>Paid</Text>
              </View>
            )}
            {timesheet.isFull && (
              <View
                style={{
                  backgroundColor: "#2563EB",
                  borderRadius: 8,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  marginRight: 8,
                  marginBottom: 6,
                }}
              >
                <Text style={{ color: "#fff", fontSize: 13 }}>Full</Text>
              </View>
            )}
            {timesheet.isApproved && (
              <View
                style={{
                  backgroundColor: "#FB8500",
                  borderRadius: 8,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  marginRight: 8,
                  marginBottom: 6,
                }}
              >
                <Text style={{ color: "#fff", fontSize: 13 }}>Approved</Text>
              </View>
            )}
          </View>
        </View>
        {/* Daily Pickups */}
        <Text
          style={{
            fontFamily: "Comfortaa-Bold",
            fontSize: 16,
            color: "#232B3A",
            marginBottom: 10,
          }}
        >
          Daily Pickups
        </Text>
        {timesheet.dailyPickups && timesheet.dailyPickups.length > 0 ? (
          timesheet.dailyPickups.map((dp) => (
            <View
              key={dp.id}
              style={{
                backgroundColor: "#fff",
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#FFD9B3",
                marginBottom: 12,
                padding: 14,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontFamily: "Comfortaa-Bold",
                  fontSize: 15,
                  color: "#FB8500",
                }}
              >
                {dp.day}
              </Text>
              <Text
                style={{
                  fontFamily: "Comfortaa-Regular",
                  fontSize: 14,
                  color: "#232B3A",
                }}
              >
                Pickups:{" "}
                <Text style={{ fontWeight: "bold" }}>{dp.pickups}</Text>
              </Text>
              <Text
                style={{
                  fontFamily: "Comfortaa-Regular",
                  fontSize: 14,
                  color: "#232B3A",
                }}
              >
                Fare:{" "}
                <Text style={{ fontWeight: "bold" }}>
                  ${(dp.fare || 0).toFixed(2)}
                </Text>
              </Text>
            </View>
          ))
        ) : (
          <Text
            style={{
              color: "#A3A3A3",
              fontFamily: "Comfortaa-Regular",
              fontSize: 13,
              marginTop: 6,
            }}
          >
            No daily pickups for this week.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
