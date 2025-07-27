import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../context/AuthContext";
import ParentService, { Timesheet } from "../../../services/api/parent.service";

export default function TimesheetDetailsPage() {
  const { id } = useLocalSearchParams();
  const [timesheet, setTimesheet] = useState<Timesheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { parentDetails } = useAuth();

  const fetchTimesheetDetails = async () => {
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
  };

  useEffect(() => {
    fetchTimesheetDetails();
  }, [parentDetails?.id, id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
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

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F6F7FB" }}>
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
              Is Full:
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
        {!timesheet.isPaid && (
          <View style={{ marginBottom: 20 }}>
            <TouchableOpacity
              style={{
                backgroundColor: "#FF932E",
                borderRadius: 16,
                paddingVertical: 16,
                alignItems: "center",
                marginBottom: 12,
              }}
              onPress={() => {
                // Handle payment action
                console.log("Process payment for timesheet:", timesheet.id);
              }}
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
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
