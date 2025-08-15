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
  type: string; // "repetitive" or "varying"
  startDate: string | null; // Only for "varying" type
  endDate: string | null; // Only for "varying" type
  createdAt: string;
  updatedAt: string;
  slots?: {
    id: number;
    buddiRequestId: number;
    fromLocation: string;
    toLocation: string;
    slotStartTime: string;
    slotEndTime: string;
    createdAt: string;
    updatedAt: string;
  }[];
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
        type: response.data.type || "repetitive",
        startDate: response.data.startDate || null,
        endDate: response.data.endDate || null,
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

    try {
      // Handle ISO 8601 timestamp with timezone
      if (time.includes("T") && time.includes("Z")) {
        const date = new Date(time);
        return date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
          timeZoneName: "short",
        });
      }

      // Handle HH:mm format
      if (typeof time === "string" && time.includes(":")) {
        const [hours, minutes] = time.split(":").map(Number);
        const period = hours >= 12 ? "PM" : "AM";
        const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
        const displayMinutes = minutes.toString().padStart(2, "0");
        return `${displayHours}:${displayMinutes} ${period}`;
      }

      return time;
    } catch (error) {
      console.error("Error formatting time:", error);
      return time;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZoneName: "short",
      });
    } catch (error) {
      console.error("Error formatting date time:", error);
      return dateString;
    }
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

  const getTypeDisplayText = (type: string) => {
    switch (type) {
      case "repetitive":
        return "Ongoing";
      case "varying":
        return "One-time";
      default:
        return type || "Not specified";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "repetitive":
        return "#4f46e5"; // Indigo
      case "varying":
        return "#10b981"; // Emerald
      default:
        return "#6b7280"; // Gray
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
              <View style={styles.badgesContainer}>
                <View
                  style={[
                    styles.typeBadge,
                    {
                      backgroundColor: getTypeColor(callDetails.type) + "20",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.typeText,
                      { color: getTypeColor(callDetails.type) },
                    ]}
                  >
                    {getTypeDisplayText(callDetails.type)}
                  </Text>
                </View>
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
          {/* Kids Count */}
          <View style={styles.detailCard}>
            <FontAwesome5 name="child" size={24} color="#FF932E" />
            <View style={styles.detailContent}>
              <Text style={styles.detailValue}>{callDetails.kidsCount}</Text>
              <Text style={styles.detailLabel}>Kids</Text>
            </View>
          </View>

          {/* Days */}
          <View style={styles.detailCard}>
            <FontAwesome5 name="calendar-alt" size={24} color="#FF932E" />
            <View style={styles.detailContent}>
              <Text style={styles.detailValue}>
                {callDetails.availableDays.length}
              </Text>
              <Text style={styles.detailLabel}>Days</Text>
            </View>
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

        {/* Slots Card - Show if available */}
        {callDetails.slots && callDetails.slots.length > 0 && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <FontAwesome5 name="route" size={20} color="#FF932E" />
              <Text style={styles.cardTitle}>
                Pickup Slots ({callDetails.slots.length})
              </Text>
            </View>
            <View style={styles.slotsContainer}>
              {callDetails.slots.map((slot, index) => (
                <View key={slot.id} style={styles.slotItem}>
                  <View style={styles.slotHeader}>
                    <Text style={styles.slotNumber}>Slot {index + 1}</Text>
                  </View>
                  <View style={styles.slotRoute}>
                    <View style={styles.slotLocationItem}>
                      <FontAwesome5 name="arrow-up" size={14} color="#FF932E" />
                      <Text style={styles.slotLocationLabel}>From:</Text>
                      <Text style={styles.slotLocationText}>
                        {slot.fromLocation}
                      </Text>
                    </View>
                    <View style={styles.slotLocationItem}>
                      <FontAwesome5
                        name="arrow-down"
                        size={14}
                        color="#34C759"
                      />
                      <Text style={styles.slotLocationLabel}>To:</Text>
                      <Text style={styles.slotLocationText}>
                        {slot.toLocation}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.slotTimeContainer}>
                    <View style={styles.slotTimeItem}>
                      <FontAwesome5 name="clock" size={14} color="#92400E" />
                      <Text style={styles.slotTimeLabel}>Start:</Text>
                      <Text style={styles.slotTimeText}>
                        {formatTime(slot.slotStartTime)}
                      </Text>
                    </View>
                    <View style={styles.slotTimeItem}>
                      <FontAwesome5 name="clock" size={14} color="#065F46" />
                      <Text style={styles.slotTimeLabel}>End:</Text>
                      <Text style={styles.slotTimeText}>
                        {formatTime(slot.slotEndTime)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

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

        {/* Date Range Card - Only for Varying Type */}
        {callDetails.type === "varying" &&
          callDetails.startDate &&
          callDetails.endDate && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <FontAwesome5 name="calendar-alt" size={20} color="#10b981" />
                <Text style={styles.cardTitle}>Date Range</Text>
              </View>
              <View style={styles.dateRangeContainer}>
                <View style={styles.dateRangeItem}>
                  <FontAwesome5 name="play" size={16} color="#10b981" />
                  <Text style={styles.dateRangeLabel}>Start Date:</Text>
                  <Text style={styles.dateRangeValue}>
                    {formatDate(callDetails.startDate)}
                  </Text>
                </View>
                <View style={styles.dateRangeItem}>
                  <FontAwesome5 name="stop" size={16} color="#ef4444" />
                  <Text style={styles.dateRangeLabel}>End Date:</Text>
                  <Text style={styles.dateRangeValue}>
                    {formatDate(callDetails.endDate)}
                  </Text>
                </View>
              </View>
            </View>
          )}

        {/* Created Date Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <FontAwesome5 name="calendar-plus" size={20} color="#FF932E" />
            <Text style={styles.cardTitle}>Request Details</Text>
          </View>
          <View style={styles.dateContainer}>
            <Text style={styles.dateLabel}>Created:</Text>
            <Text style={styles.dateText}>
              {formatDateTime(callDetails.createdAt)}
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
  badgesContainer: {
    flexDirection: "row" as const,
    gap: 12,
    justifyContent: "center" as const,
    alignItems: "center" as const,
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
  typeBadge: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  typeText: {
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
    gap: 16,
    marginBottom: 16,
  },
  detailCard: {
    flexDirection: "row" as const,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center" as const,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    flex: 1,
  },
  detailContent: {
    flex: 1,
    marginLeft: 12,
  },
  detailValue: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 18,
    color: "#333",
  },
  detailLabel: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 14,
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
    flexDirection: "column" as const,
    gap: 8,
  },
  dayTag: {
    backgroundColor: "#FF932E",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    alignSelf: "flex-start" as const,
  },
  dayText: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 12,
    color: "#fff",
  },
  dateContainer: {
    flexDirection: "column" as const,
    gap: 8,
  },
  dateLabel: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 14,
    color: "#666",
  },
  dateText: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 14,
    color: "#333",
  },
  dateRangeContainer: {
    gap: 16,
  },
  dateRangeItem: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
  },
  dateRangeLabel: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 14,
    color: "#666",
    minWidth: 80,
  },
  dateRangeValue: {
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
  // Slots Section Styles
  slotsContainer: {
    gap: 12,
  },
  slotItem: {
    backgroundColor: "#FFF7ED",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FF932E",
  },
  slotHeader: {
    marginBottom: 12,
  },
  slotNumber: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 16,
    color: "#FF932E",
  },
  slotRoute: {
    gap: 8,
    marginBottom: 12,
  },
  slotLocationItem: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
  },
  slotLocationLabel: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    marginRight: 8,
    minWidth: 40,
  },
  slotLocationText: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  slotTimeContainer: {
    flexDirection: "column" as const,
    gap: 8,
  },
  slotTimeItem: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
  },
  slotTimeLabel: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 14,
    color: "#666",
  },
  slotTimeText: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 14,
    color: "#333",
  },
};
