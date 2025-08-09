import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PaymentModal from "../../../components/modals/PaymentModal";
import { useAuth } from "../../../context/AuthContext";
import { authorizedApi } from "../../../services/api/config";
import ParentService, { Timesheet } from "../../../services/api/parent.service";

export default function TimesheetDetailsPage() {
  const { id } = useLocalSearchParams();
  const [timesheet, setTimesheet] = useState<Timesheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approving, setApproving] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Flag/Report modal states
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagMessage, setFlagMessage] = useState("");
  const [isReporting, setIsReporting] = useState(false);

  const router = useRouter();
  const { parentDetails, user } = useAuth();

  const fetchTimesheetDetails = useCallback(async () => {
    if (!parentDetails?.id || !id) return;

    try {
      setLoading(true);
      setError(null);

      // For now, we'll fetch all timesheets and find the specific one
      // In a real app, you'd have a specific endpoint for single timesheet
      const response = await ParentService.getTimesheets(
        parentDetails.id.toString(),
        undefined,
        1,
        100
      );
      const foundTimesheet = response.data.find(
        (ts: Timesheet) => ts.id.toString() === id
      );

      if (foundTimesheet) {
        setTimesheet(foundTimesheet);
      } else {
        setError("Timesheet not found");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch timesheet details");
    } finally {
      setLoading(false);
    }
  }, [parentDetails?.id, id]);

  useEffect(() => {
    fetchTimesheetDetails();
  }, [fetchTimesheetDetails]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatWeekRange = (weekStart: string, weekEnd: string) => {
    const start = new Date(weekStart);
    const end = new Date(weekEnd);
    return `${start.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} - ${end.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
  };

  const getStatusColor = (isPaid: boolean, isApproved: boolean) => {
    if (isPaid) return "#22C55E";
    if (isApproved) return "#3B82F6";
    return "#F59E0B";
  };

  const getStatusText = (isPaid: boolean, isApproved: boolean) => {
    if (isPaid) return "Paid";
    if (isApproved) return "Approved";
    return "Pending";
  };

  const getStatusIcon = (isPaid: boolean, isApproved: boolean) => {
    if (isPaid) return "checkmark-circle";
    if (isApproved) return "time";
    return "alert-circle";
  };

  const handleApproveTimesheet = async (timesheetId: number) => {
    try {
      setApproving(true);
      await ParentService.approveTimesheet(timesheetId);
      Alert.alert("Success", "Timesheet approved successfully!");
      // Refresh the timesheet data
      await fetchTimesheetDetails();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to approve timesheet");
    } finally {
      setApproving(false);
    }
  };

  const handleFlagTimesheet = async () => {
    if (!timesheet || !parentDetails || !flagMessage.trim()) {
      Alert.alert(
        "Error",
        "Please enter a reason for flagging this timesheet."
      );
      return;
    }

    setIsReporting(true);
    try {
      const reportData = {
        parentId: parentDetails.id,
        parentName: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
        buddiId: timesheet.buddiId,
        timesheetId: timesheet.id,
        message: flagMessage.trim(),
      };

      console.log("Reporting timesheet with data:", reportData);

      const response = await authorizedApi.post(
        "/reports/issue-reports",
        reportData
      );

      console.log("Report response:", response.data);

      setShowFlagModal(false);
      setFlagMessage("");

      Alert.alert(
        "Timesheet Flagged! 🚩",
        "Your report has been submitted successfully. The buddi will be notified to review and correct their timesheet.",
        [{ text: "OK", style: "default" }]
      );
    } catch (error: any) {
      console.error("Error reporting timesheet:", error);
      Alert.alert(
        "Report Failed",
        error?.response?.data?.error ||
          "Failed to submit report. Please try again.",
        [{ text: "OK", style: "default" }]
      );
    } finally {
      setIsReporting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ backgroundColor: "#F6F7FB" }}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#FF932E" />
          <Text
            style={{
              fontFamily: "Comfortaa-Regular",
              fontSize: 14,
              color: "#6B7280",
              marginTop: 12,
            }}
          >
            Loading timesheet details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !timesheet) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F6F7FB" }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text
            style={{
              fontFamily: "Comfortaa-Medium",
              fontSize: 16,
              color: "#EF4444",
              marginTop: 12,
              textAlign: "center",
            }}
          >
            {error || "Timesheet not found"}
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              backgroundColor: "#FF932E",
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 12,
              marginTop: 16,
            }}
          >
            <Text
              style={{
                fontFamily: "Comfortaa-Bold",
                fontSize: 14,
                color: "#fff",
              }}
            >
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F6F7FB" }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 16,
          backgroundColor: "#fff",
          borderBottomWidth: 1,
          borderBottomColor: "#E5E7EB",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            backgroundColor: "#FF932E",
            borderRadius: 12,
            padding: 8,
          }}
        >
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: "Comfortaa-Bold",
            fontSize: 18,
            color: "#232B3A",
          }}
        >
          Timesheet Details
        </Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        style={{ flex: 1, padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Card */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
            borderWidth: 1,
            borderColor: "#E5E7EB",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <View
              style={{
                backgroundColor: getStatusColor(
                  timesheet.isPaid,
                  timesheet.isApproved
                ),
                borderRadius: 8,
                padding: 8,
                marginRight: 12,
              }}
            >
              <Ionicons
                name={
                  getStatusIcon(timesheet.isPaid, timesheet.isApproved) as any
                }
                size={24}
                color="#fff"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: "Comfortaa-Bold",
                  fontSize: 18,
                  color: "#232B3A",
                }}
              >
                {getStatusText(timesheet.isPaid, timesheet.isApproved)}
              </Text>
            </View>
          </View>

          {/* Week Range */}
          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontFamily: "Comfortaa-Bold",
                fontSize: 16,
                color: "#232B3A",
                marginBottom: 8,
              }}
            >
              Week Period
            </Text>
            <Text
              style={{
                fontFamily: "Comfortaa-Regular",
                fontSize: 14,
                color: "#6B7280",
              }}
            >
              {formatWeekRange(timesheet.weekStart, timesheet.weekEnd)}
            </Text>
          </View>

          {/* Stats Grid */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <View style={{ alignItems: "center", flex: 1 }}>
              <MaterialIcons name="access-time" size={24} color="#3B82F6" />
              <Text
                style={{
                  fontFamily: "Comfortaa-Bold",
                  fontSize: 16,
                  color: "#232B3A",
                  marginTop: 4,
                }}
              >
                {timesheet.totalHours.toFixed(2)}h
              </Text>
              <Text
                style={{
                  fontFamily: "Comfortaa-Regular",
                  fontSize: 12,
                  color: "#6B7280",
                }}
              >
                Total Hours
              </Text>
            </View>
            <View style={{ alignItems: "center", flex: 1 }}>
              <MaterialIcons name="local-taxi" size={24} color="#8B5CF6" />
              <Text
                style={{
                  fontFamily: "Comfortaa-Bold",
                  fontSize: 16,
                  color: "#232B3A",
                  marginTop: 4,
                }}
              >
                {timesheet.totalPickups}
              </Text>
              <Text
                style={{
                  fontFamily: "Comfortaa-Regular",
                  fontSize: 12,
                  color: "#6B7280",
                }}
              >
                Total Pickups
              </Text>
            </View>
            <View style={{ alignItems: "center", flex: 1 }}>
              <MaterialIcons name="attach-money" size={24} color="#22C55E" />
              <Text
                style={{
                  fontFamily: "Comfortaa-Bold",
                  fontSize: 16,
                  color: "#232B3A",
                  marginTop: 4,
                }}
              >
                ${timesheet.totalEarnings.toFixed(2)}
              </Text>
              <Text
                style={{
                  fontFamily: "Comfortaa-Regular",
                  fontSize: 12,
                  color: "#6B7280",
                }}
              >
                Total Earnings
              </Text>
            </View>
          </View>
        </View>

        {/* Buddi Information */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
            borderWidth: 1,
            borderColor: "#E5E7EB",
          }}
        >
          <Text
            style={{
              fontFamily: "Comfortaa-Bold",
              fontSize: 16,
              color: "#232B3A",
              marginBottom: 16,
            }}
          >
            Timesheet Information
          </Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={{
                fontFamily: "Comfortaa-Regular",
                fontSize: 14,
                color: "#6B7280",
              }}
            >
              Full:
            </Text>
            <Text
              style={{
                fontFamily: "Comfortaa-Bold",
                fontSize: 14,
                color: timesheet.isFull ? "#22C55E" : "#EF4444",
              }}
            >
              {timesheet.isFull ? "Yes" : "No"}
            </Text>
          </View>
        </View>

        {/* Available Days */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
            borderWidth: 1,
            borderColor: "#E5E7EB",
          }}
        >
          <Text
            style={{
              fontFamily: "Comfortaa-Bold",
              fontSize: 16,
              color: "#232B3A",
              marginBottom: 12,
            }}
          >
            Available Days
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {timesheet.availableDays.map((day, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: "#FF932E",
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                  marginRight: 8,
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Comfortaa-Medium",
                    fontSize: 12,
                    color: "#fff",
                  }}
                >
                  {day}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Daily Pickups */}
        {timesheet.dailyPickups.length > 0 && (
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 20,
              marginBottom: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
              borderWidth: 1,
              borderColor: "#E5E7EB",
            }}
          >
            <Text
              style={{
                fontFamily: "Comfortaa-Bold",
                fontSize: 16,
                color: "#232B3A",
                marginBottom: 16,
              }}
            >
              Daily Breakdown
            </Text>
            {timesheet.dailyPickups.map((daily) => (
              <View
                key={daily.id}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  backgroundColor: "#F9FAFB",
                  borderRadius: 12,
                  marginBottom: 8,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      backgroundColor: "#FF932E",
                      borderRadius: 8,
                      padding: 6,
                      marginRight: 12,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Comfortaa-Bold",
                        fontSize: 12,
                        color: "#fff",
                      }}
                    >
                      {daily.day}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        fontFamily: "Comfortaa-Bold",
                        fontSize: 14,
                        color: "#232B3A",
                      }}
                    >
                      {daily.pickups} pickup{daily.pickups !== 1 ? "s" : ""}
                    </Text>
                  </View>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text
                    style={{
                      fontFamily: "Comfortaa-Bold",
                      fontSize: 16,
                      color: "#22C55E",
                    }}
                  >
                    ${daily.fare.toFixed(2)}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Comfortaa-Regular",
                      fontSize: 12,
                      color: "#6B7280",
                    }}
                  >
                    Fare
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Timestamps */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
            borderWidth: 1,
            borderColor: "#E5E7EB",
          }}
        >
          <Text
            style={{
              fontFamily: "Comfortaa-Bold",
              fontSize: 16,
              color: "#232B3A",
              marginBottom: 16,
            }}
          >
            Timestamps
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <Text
              style={{
                fontFamily: "Comfortaa-Regular",
                fontSize: 14,
                color: "#6B7280",
              }}
            >
              Created:
            </Text>
            <Text
              style={{
                fontFamily: "Comfortaa-Bold",
                fontSize: 14,
                color: "#232B3A",
              }}
            >
              {formatDate(timesheet.createdAt)}
            </Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={{
                fontFamily: "Comfortaa-Regular",
                fontSize: 14,
                color: "#6B7280",
              }}
            >
              Updated:
            </Text>
            <Text
              style={{
                fontFamily: "Comfortaa-Bold",
                fontSize: 14,
                color: "#232B3A",
              }}
            >
              {formatDate(timesheet.updatedAt)}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={{ marginBottom: 20 }}>
          {/* Flag Timesheet Button - Always visible */}
          <TouchableOpacity
            style={{
              backgroundColor: "#EF4444",
              borderRadius: 16,
              paddingVertical: 16,
              alignItems: "center",
              marginBottom: 12,
              flexDirection: "row",
              justifyContent: "center",
            }}
            onPress={() => setShowFlagModal(true)}
          >
            <Ionicons
              name="flag-outline"
              size={20}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text
              style={{
                fontFamily: "Comfortaa-Bold",
                fontSize: 16,
                color: "#fff",
              }}
            >
              Flag Timesheet
            </Text>
          </TouchableOpacity>
          {/* Show Approve Button if timesheet is full but not approved */}
          {timesheet.isFull && !timesheet.isApproved && (
            <TouchableOpacity
              style={{
                backgroundColor: "#3B82F6",
                borderRadius: 16,
                paddingVertical: 16,
                alignItems: "center",
                marginBottom: 12,
                opacity: approving ? 0.7 : 1,
              }}
              onPress={() => {
                Alert.alert(
                  "Approve Timesheet",
                  "Have you reviewed the timesheet well before approving?",
                  [
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                    {
                      text: "Approve",
                      style: "default",
                      onPress: () => handleApproveTimesheet(timesheet.id),
                    },
                  ]
                );
              }}
              disabled={approving}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {approving && (
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
                  {approving ? "Approving..." : "Approve Timesheet"}
                </Text>
              </View>
            </TouchableOpacity>
          )}

          {/* Show Pay Button if timesheet is full and approved but not paid */}
          {timesheet.isFull && timesheet.isApproved && !timesheet.isPaid && (
            <TouchableOpacity
              style={{
                backgroundColor: "#FF932E",
                borderRadius: 16,
                paddingVertical: 16,
                alignItems: "center",
                marginBottom: 12,
              }}
              onPress={() => setShowPaymentModal(true)}
            >
              <Text
                style={{
                  fontFamily: "Comfortaa-Bold",
                  fontSize: 16,
                  color: "#fff",
                }}
              >
                Process Payment
              </Text>
            </TouchableOpacity>
          )}

          {/* Show status message if already paid */}
          {timesheet.isPaid && (
            <View
              style={{
                backgroundColor: "#22C55E",
                borderRadius: 16,
                paddingVertical: 16,
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  fontFamily: "Comfortaa-Bold",
                  fontSize: 16,
                  color: "#fff",
                }}
              >
                Payment Completed
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Payment Modal */}
      <PaymentModal
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onConfirm={() => setShowPaymentModal(false)}
        timesheetId={timesheet?.id || 0}
      />

      {/* Flag Timesheet Modal */}
      <Modal
        visible={showFlagModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFlagModal(false)}
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
              <Ionicons name="flag" size={48} color="#EF4444" />
              <Text
                style={{
                  fontFamily: "Comfortaa-Bold",
                  fontSize: 18,
                  color: "#232B3A",
                  textAlign: "center",
                  marginTop: 12,
                }}
              >
                Flag Timesheet
              </Text>
            </View>

            <Text
              style={{
                fontFamily: "Comfortaa-Regular",
                fontSize: 15,
                color: "#666",
                textAlign: "center",
                marginBottom: 20,
                lineHeight: 22,
              }}
            >
              Please describe the issue with this timesheet. The buddi will be
              notified and can make corrections.
            </Text>

            <TextInput
              value={flagMessage}
              onChangeText={setFlagMessage}
              placeholder="Describe the issue (e.g., incorrect hours, wrong pickup count...)"
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
              style={{
                borderWidth: 2,
                borderColor: "#E5E7EB",
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 15,
                fontFamily: "Comfortaa-Regular",
                marginBottom: 24,
                minHeight: 100,
              }}
            />

            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                onPress={() => {
                  setShowFlagModal(false);
                  setFlagMessage("");
                }}
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
                onPress={handleFlagTimesheet}
                disabled={isReporting || !flagMessage.trim()}
                style={{
                  flex: 1,
                  backgroundColor:
                    isReporting || !flagMessage.trim() ? "#9CA3AF" : "#EF4444",
                  borderRadius: 12,
                  paddingVertical: 14,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                {isReporting && (
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
                  {isReporting ? "Flagging..." : "Flag Timesheet"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
