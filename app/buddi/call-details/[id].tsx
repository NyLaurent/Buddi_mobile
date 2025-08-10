import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ApplyModal from "../../../components/modals/ApplyModal";
import { useAuth } from "../../../context/AuthContext";
import BuddiService from "../../../services/api/buddi.service";

interface CallDetails {
  id: number;
  parentId: string;
  childId: string;
  description: string;
  availableDays: string[];
  callPickupTime: string | null;
  callDropTime: string | null;
  kidsCount: number;
  fromZone: string;
  toZone: string;
  status: string;
  matchedBuddiId: number | null;
  isBuddiRecommended: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CallDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [callDetails, setCallDetails] = useState<CallDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);

  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    fetchCallDetails();
  }, [id]);

  const fetchCallDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await BuddiService.getCallDetails(Number(id));
      setCallDetails({
        ...response.data,
        callPickupTime:
          response.data.pickupTime ?? response.data.callPickupTime ?? null,
        callDropTime: response.data.callDropTime ?? null,
        isBuddiRecommended: response.data.isBuddiRecommended ?? false,
      });
    } catch (err: any) {
      setError(err.message || "Failed to fetch call details");
      console.error("Error fetching call details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPress = () => {
    setShowApplyModal(true);
  };

  const handleModalClose = () => {
    setShowApplyModal(false);
  };

  const handleApplicationSuccess = () => {
    // Optionally refresh the call details or navigate back
    router.back();
  };

  const handleBackPress = () => {
    router.back();
  };

  const formatTime = (time: string | null) => {
    if (!time) return "-";

    // If time is already in 12-hour format (contains AM/PM), return as is
    if (
      typeof time === "string" &&
      (time.includes("AM") || time.includes("PM"))
    ) {
      return time;
    }

    // Handle 24-hour format conversion
    if (typeof time === "string" && time.includes(":")) {
      try {
        // Split the time into hours and minutes
        const [hours, minutes] = time.split(":").map(Number);

        if (isNaN(hours) || isNaN(minutes)) {
          return time; // Return original if parsing fails
        }

        // Convert to 12-hour format
        let period = "AM";
        let displayHours = hours;

        if (hours >= 12) {
          period = "PM";
          if (hours > 12) {
            displayHours = hours - 12;
          }
        }

        // Handle midnight (00:00)
        if (hours === 0) {
          displayHours = 12;
        }

        // Format with leading zeros for minutes
        const formattedMinutes = minutes.toString().padStart(2, "0");

        return `${displayHours}:${formattedMinutes} ${period}`;
      } catch (error) {
        console.error("Error formatting time:", error);
        return time; // Return original if conversion fails
      }
    }

    return time;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#FF932E";
      case "matched":
        return "#34C759";
      case "completed":
        return "#0A77FF";
      default:
        return "#FF932E";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Available";
      case "matched":
        return "Matched";
      case "completed":
        return "Completed";
      default:
        return "Available";
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Pickup Request Details</Text>
        <Text style={styles.headerSubtitle}>Pickup Request #{id}</Text>
      </View>
      <View style={styles.headerSpacer} />
    </View>
  );

  const renderLoading = () => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color="#FF932E" />
      <Text style={styles.loadingText}>Loading call details...</Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.centerContainer}>
      <FontAwesome5 name="exclamation-triangle" size={48} color="#FF932E" />
      <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={fetchCallDetails}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    if (!callDetails) return null;

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Status Card */}
        <View style={styles.statusCard}>
          <LinearGradient
            colors={["#FF932E", "#FFB86C"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statusGradient}
          >
            <View style={styles.statusContent}>
              <FontAwesome5 name="hand-holding-heart" size={32} color="#fff" />
              <Text style={styles.statusTitle}>Pickup Request</Text>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: getStatusColor(callDetails.status) + "20",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(callDetails.status) },
                  ]}
                >
                  {getStatusText(callDetails.status)}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Description Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <FontAwesome5 name="file-alt" size={20} color="#FF932E" />
            <Text style={styles.cardTitle}>Description</Text>
          </View>
          <Text style={styles.descriptionText}>{callDetails.description}</Text>
        </View>

        {/* Details Grid */}
        <View style={styles.detailsGrid}>
          {/* Pickup Time */}
          <View style={styles.detailCard}>
            <FontAwesome5 name="clock" size={24} color="#FF932E" />
            <Text style={styles.detailValue}>
              {formatTime(callDetails.callPickupTime)}
            </Text>
            <Text style={styles.detailLabel}>Pickup Time</Text>
          </View>

          {/* Drop-off Time */}
          <View style={styles.detailCard}>
            <FontAwesome5 name="clock" size={24} color="#3B82F6" />
            <Text style={styles.detailValue}>
              {formatTime(callDetails.callDropTime)}
            </Text>
            <Text style={styles.detailLabel}>Drop-off Time</Text>
          </View>

          {/* Kids Count */}
          <View style={styles.detailCard}>
            <FontAwesome5 name="child" size={24} color="#FF932E" />
            <Text style={styles.detailValue}>{callDetails.kidsCount}</Text>
            <Text style={styles.detailLabel}>Kids</Text>
          </View>

          {/* Days */}
          <View style={styles.detailCard}>
            <FontAwesome5 name="calendar-alt" size={24} color="#FF932E" />
            <Text style={styles.detailValue}>
              {callDetails.availableDays.length}
            </Text>
            <Text style={styles.detailLabel}>Days</Text>
          </View>
        </View>

        {/* Location Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <FontAwesome5 name="map-marker-alt" size={20} color="#FF932E" />
            <Text style={styles.cardTitle}>Location</Text>
          </View>
          <View style={styles.locationContainer}>
            <View style={styles.locationItem}>
              <FontAwesome5 name="arrow-up" size={16} color="#FF932E" />
              <Text style={styles.locationLabel}>From:</Text>
              <Text style={styles.locationText}>{callDetails.fromZone}</Text>
            </View>
            <View style={styles.locationItem}>
              <FontAwesome5 name="arrow-down" size={16} color="#34C759" />
              <Text style={styles.locationLabel}>To:</Text>
              <Text style={styles.locationText}>{callDetails.toZone}</Text>
            </View>
          </View>
        </View>

        {/* Available Days Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <FontAwesome5 name="calendar-week" size={20} color="#FF932E" />
            <Text style={styles.cardTitle}>Available Days</Text>
          </View>
          <View style={styles.daysContainer}>
            {callDetails.availableDays.map((day, index) => (
              <View key={index} style={styles.dayTag}>
                <Text style={styles.dayText}>{day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Created Date Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <FontAwesome5 name="calendar-plus" size={20} color="#FF932E" />
            <Text style={styles.cardTitle}>Request Details</Text>
          </View>
          <View style={styles.dateContainer}>
            <Text style={styles.dateLabel}>Created:</Text>
            <Text style={styles.dateText}>
              {formatDate(callDetails.createdAt)}
            </Text>
          </View>
        </View>

        {/* Apply Button */}
        <TouchableOpacity
          style={[
            styles.applyButton,
            callDetails.status === "matched" && styles.applyButtonDisabled,
          ]}
          onPress={() => callDetails.status !== "matched" && handleApplyPress()}
          activeOpacity={callDetails.status === "matched" ? 1 : 0.8}
          disabled={callDetails.status === "matched"}
        >
          <FontAwesome5
            name={
              callDetails.status === "matched"
                ? "check-circle"
                : "hand-holding-heart"
            }
            size={20}
            color="#fff"
            style={{ marginRight: 12 }}
          />
          <Text style={styles.applyButtonText}>
            {callDetails.status === "matched" ? "Already Matched" : "Apply Now"}
          </Text>
        </TouchableOpacity>

        {/* Chat Button - Only show for matched calls */}
        {callDetails.status === "matched" && callDetails.matchedBuddiId && (
          <TouchableOpacity
            style={styles.chatButton}
            onPress={() => {
              // Navigate to chat with parent
              const chatRoomId = `${callDetails.parentId}-${callDetails.matchedBuddiId}`;
              router.push({
                pathname: "/buddi/chat/[roomId]",
                params: {
                  roomId: chatRoomId,
                  parentName: "Parent", // You can get this from API if needed
                  parentAvatar:
                    "https://randomuser.me/api/portraits/men/32.jpg",
                },
              });
            }}
          >
            <FontAwesome5
              name="comments"
              size={20}
              color="#fff"
              style={{ marginRight: 12 }}
            />
            <Text style={styles.chatButtonText}>Message Parent</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {renderHeader()}
      {loading ? renderLoading() : error ? renderError() : renderContent()}

      <ApplyModal
        visible={showApplyModal}
        onClose={handleModalClose}
        callId={Number(id)}
        onSuccess={handleApplicationSuccess}
      />
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 20,
    color: "#333",
  },
  headerSubtitle: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  headerSpacer: {
    width: 40,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    paddingHorizontal: 32,
  },
  loadingText: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 16,
    color: "#666",
    marginTop: 16,
  },
  errorTitle: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 20,
    color: "#333",
    marginTop: 16,
    textAlign: "center" as const,
  },
  errorText: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    textAlign: "center" as const,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: "#FF932E",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  retryButtonText: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 14,
    color: "#fff",
  },
  statusCard: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden" as const,
    borderWidth: 1,
    borderColor: "#E6E6E6",
  },
  statusGradient: {
    padding: 24,
  },
  statusContent: {
    alignItems: "center" as const,
  },
  statusTitle: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 24,
    color: "#fff",
    marginTop: 12,
    marginBottom: 16,
  },
  statusBadge: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  statusText: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 14,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E6E6E6",
  },
  cardHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 18,
    color: "#333",
    marginLeft: 12,
  },
  descriptionText: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  detailsGrid: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    marginBottom: 16,
  },
  detailCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center" as const,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#E6E6E6",
  },
  detailValue: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 20,
    color: "#333",
    marginTop: 8,
  },
  detailLabel: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  locationContainer: {
    gap: 12,
  },
  locationItem: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
  },
  locationLabel: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    marginRight: 8,
    minWidth: 40,
  },
  locationText: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  daysContainer: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 8,
  },
  dayTag: {
    backgroundColor: "#FF932E",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  dayText: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 12,
    color: "#fff",
  },
  dateContainer: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
  },
  dateLabel: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 14,
    color: "#666",
    marginRight: 8,
  },
  dateText: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  applyButton: {
    backgroundColor: "#FF932E",
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 8,
    shadowColor: "#FF932E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  applyButtonDisabled: {
    backgroundColor: "#34C759",
    opacity: 0.8,
    shadowColor: "#34C759",
  },
  applyButtonText: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 18,
    color: "#fff",
  },
  chatButton: {
    backgroundColor: "#3B82F6",
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 12,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  chatButtonText: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 18,
    color: "#fff",
  },
};
