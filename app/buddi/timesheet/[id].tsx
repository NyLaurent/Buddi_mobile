import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
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
  isSubmited: boolean;
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

  // Modal states
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatedHours, setUpdatedHours] = useState<string>("");

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
      } catch (error: any) {
        console.error("Error fetching timesheet:", error);
        setError("Failed to fetch timesheet details.");
      } finally {
        setLoading(false);
      }
    };
    fetchTimesheet();
  }, [id, buddiDetails?.id]);

  // Submit timesheet function
  const handleSubmitTimesheet = async () => {
    if (!timesheet || !buddiDetails?.id) return;

    setIsSubmitting(true);
    try {
      await authorizedApi.patch(`/buddi/${timesheet.id}/submit`, {
        buddiId: buddiDetails.id,
      });

      // Update local state
      setTimesheet((prev) => (prev ? { ...prev, isSubmited: true } : null));
      setShowSubmitModal(false);

      Alert.alert(
        "Success! 🎉",
        "Your timesheet has been submitted successfully! It will be reviewed by the parent.",
        [{ text: "OK", style: "default" }]
      );
    } catch (error: any) {
      console.error("Error submitting timesheet:", error);
      Alert.alert(
        "Submission Failed",
        error?.response?.data?.error ||
          "Failed to submit timesheet. Please try again.",
        [{ text: "OK", style: "default" }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update hours function
  const handleUpdateHours = async () => {
    if (!timesheet || !buddiDetails?.id || !updatedHours) return;

    const hours = parseFloat(updatedHours);
    if (isNaN(hours) || hours < 0) {
      Alert.alert("Invalid Hours", "Please enter valid hours (numbers only).");
      return;
    }

    setIsUpdating(true);
    try {
      await authorizedApi.patch(`/buddi/${timesheet.id}/update-hours`, {
        totalHours: hours,
        buddiId: buddiDetails.id,
      });

      // Update local state
      setTimesheet((prev) => (prev ? { ...prev, totalHours: hours } : null));
      setShowUpdateModal(false);
      setUpdatedHours("");

      Alert.alert(
        "Hours Updated! ✅",
        `Your total hours have been updated to ${hours} hours.`,
        [{ text: "OK", style: "default" }]
      );
    } catch (error: any) {
      console.error("Error updating hours:", error);
      Alert.alert(
        "Update Failed",
        error?.response?.data?.error ||
          "Failed to update hours. Please try again.",
        [{ text: "OK", style: "default" }]
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // Open update modal with current hours
  const openUpdateModal = () => {
    setUpdatedHours(timesheet?.totalHours?.toString() || "0");
    setShowUpdateModal(true);
  };

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
            {timesheet.isSubmited && (
              <View
                style={{
                  backgroundColor: "#7C3AED",
                  borderRadius: 8,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  marginRight: 8,
                  marginBottom: 6,
                }}
              >
                <Text style={{ color: "#fff", fontSize: 13 }}>Submitted</Text>
              </View>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={{ marginBottom: 18 }}>
          {/* Update Hours Button - Always visible */}
          <TouchableOpacity
            onPress={openUpdateModal}
            style={{
              backgroundColor: "#2563EB",
              borderRadius: 12,
              paddingVertical: 14,
              paddingHorizontal: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
              shadowColor: "#2563EB",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Ionicons
              name="time-outline"
              size={20}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text
              style={{
                color: "#fff",
                fontFamily: "Comfortaa-Bold",
                fontSize: 16,
              }}
            >
              Update Hours
            </Text>
          </TouchableOpacity>

          {/* Submit Button - Show if timesheet is full (complete) and not submitted */}
          {timesheet.isFull && !timesheet.isSubmited ? (
            <TouchableOpacity
              onPress={() => setShowSubmitModal(true)}
              style={{
                backgroundColor: "#16A34A",
                borderRadius: 12,
                paddingVertical: 14,
                paddingHorizontal: 20,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#16A34A",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text
                style={{
                  color: "#fff",
                  fontFamily: "Comfortaa-Bold",
                  fontSize: 16,
                }}
              >
                Submit Timesheet
              </Text>
            </TouchableOpacity>
          ) : timesheet.isFull && timesheet.isSubmited ? (
            <View
              style={{
                backgroundColor: "#E6FCEB",
                borderRadius: 12,
                paddingVertical: 14,
                paddingHorizontal: 20,
                borderWidth: 1,
                borderColor: "#16A34A",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="checkmark-circle"
                size={20}
                color="#16A34A"
                style={{ marginBottom: 8 }}
              />
              <Text
                style={{
                  color: "#16A34A",
                  fontFamily: "Comfortaa-Bold",
                  fontSize: 14,
                  textAlign: "center",
                }}
              >
                Timesheet Submitted
              </Text>
              <Text
                style={{
                  color: "#059669",
                  fontFamily: "Comfortaa-Regular",
                  fontSize: 12,
                  textAlign: "center",
                  marginTop: 4,
                }}
              >
                Your timesheet has been submitted successfully
              </Text>
            </View>
          ) : (
            <View
              style={{
                backgroundColor: "#FFF7ED",
                borderRadius: 12,
                paddingVertical: 14,
                paddingHorizontal: 20,
                borderWidth: 1,
                borderColor: "#FFD9B3",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="time-outline"
                size={20}
                color="#FF932E"
                style={{ marginBottom: 8 }}
              />
              <Text
                style={{
                  color: "#FF932E",
                  fontFamily: "Comfortaa-Bold",
                  fontSize: 14,
                  textAlign: "center",
                }}
              >
                Wait for your timesheet to be completed
              </Text>
              <Text
                style={{
                  color: "#A3A3A3",
                  fontFamily: "Comfortaa-Regular",
                  fontSize: 12,
                  textAlign: "center",
                  marginTop: 4,
                }}
              >
                Complete all pickups before submitting it
              </Text>
            </View>
          )}
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

      {/* Submit Confirmation Modal */}
      <Modal
        visible={showSubmitModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSubmitModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 24,
              width: "100%",
              maxWidth: 400,
            }}
          >
            <View style={{ alignItems: "center", marginBottom: 20 }}>
              <Ionicons name="warning-outline" size={48} color="#FF932E" />
              <Text
                style={{
                  fontFamily: "Comfortaa-Bold",
                  fontSize: 18,
                  color: "#232B3A",
                  textAlign: "center",
                  marginTop: 12,
                }}
              >
                Submit Timesheet
              </Text>
            </View>

            <Text
              style={{
                fontFamily: "Comfortaa-Regular",
                fontSize: 15,
                color: "#666",
                textAlign: "center",
                marginBottom: 24,
                lineHeight: 22,
              }}
            >
              Please review your timesheet carefully before submitting. Once
              submitted, you cannot make changes unless flagged by the parent.
              {"\n\n"}Make sure all hours and details are accurate to avoid
              being flagged.
            </Text>

            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                onPress={() => setShowSubmitModal(false)}
                style={{
                  flex: 1,
                  backgroundColor: "#E5E7EB",
                  borderRadius: 12,
                  paddingVertical: 14,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Comfortaa-Bold",
                    fontSize: 16,
                    color: "#374151",
                  }}
                >
                  Review Again
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSubmitTimesheet}
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  backgroundColor: isSubmitting ? "#9CA3AF" : "#16A34A",
                  borderRadius: 12,
                  paddingVertical: 14,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                {isSubmitting && (
                  <ActivityIndicator
                    size="small"
                    color="#fff"
                    style={{ marginRight: 8 }}
                  />
                )}
                <Text
                  style={{
                    fontFamily: "Comfortaa-Bold",
                    fontSize: 16,
                    color: "#fff",
                  }}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Update Hours Modal */}
      <Modal
        visible={showUpdateModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowUpdateModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 24,
              width: "100%",
              maxWidth: 400,
            }}
          >
            <View style={{ alignItems: "center", marginBottom: 20 }}>
              <Ionicons name="time-outline" size={48} color="#2563EB" />
              <Text
                style={{
                  fontFamily: "Comfortaa-Bold",
                  fontSize: 18,
                  color: "#232B3A",
                  textAlign: "center",
                  marginTop: 12,
                }}
              >
                Update Total Hours
              </Text>
            </View>

            <Text
              style={{
                fontFamily: "Comfortaa-Regular",
                fontSize: 15,
                color: "#666",
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              Enter the correct total hours for this timesheet:
            </Text>

            <TextInput
              value={updatedHours}
              onChangeText={setUpdatedHours}
              placeholder="Enter hours (e.g., 8.5)"
              keyboardType="decimal-pad"
              style={{
                borderWidth: 2,
                borderColor: "#E5E7EB",
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 14,
                fontSize: 16,
                fontFamily: "Comfortaa-Regular",
                marginBottom: 24,
                textAlign: "center",
              }}
            />

            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                onPress={() => setShowUpdateModal(false)}
                style={{
                  flex: 1,
                  backgroundColor: "#E5E7EB",
                  borderRadius: 12,
                  paddingVertical: 14,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Comfortaa-Bold",
                    fontSize: 16,
                    color: "#374151",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleUpdateHours}
                disabled={isUpdating}
                style={{
                  flex: 1,
                  backgroundColor: isUpdating ? "#9CA3AF" : "#2563EB",
                  borderRadius: 12,
                  paddingVertical: 14,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                {isUpdating && (
                  <ActivityIndicator
                    size="small"
                    color="#fff"
                    style={{ marginRight: 8 }}
                  />
                )}
                <Text
                  style={{
                    fontFamily: "Comfortaa-Bold",
                    fontSize: 16,
                    color: "#fff",
                  }}
                >
                  {isUpdating ? "Updating..." : "Update"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
