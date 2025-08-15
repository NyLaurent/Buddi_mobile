import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AvailableCall } from "../../services/api/buddi.service";

interface AvailableCallCardProps {
  call: AvailableCall;
  onApplyPress: (callId: number) => void;
  onViewDetails?: (callId: number) => void;
}

export default function AvailableCallCard({
  call,
  onApplyPress,
  onViewDetails,
}: AvailableCallCardProps) {
  const formatTime = (time: string | null) => {
    if (!time) return "Not set";

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

  const formatDays = (days: string[]) => {
    if (!days || !Array.isArray(days)) return "Not set";
    return days.join(", ");
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

  const formatDate = (dateString: string) => {
    // Format the date for display
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <View style={styles.card}>
      {/* Top Half - Gray Background with Date and Illustration */}
      <View style={styles.topHalf}>
        {/* Date Badge */}
        <View style={styles.dateBadge}>
          <Text style={styles.dateText}>{formatDate(call.createdAt)}</Text>
        </View>

        {/* Type Badge */}
        <View
          style={[
            styles.typeBadge,
            { backgroundColor: getTypeColor(call.type) + "20" },
          ]}
        >
          <Text style={[styles.typeText, { color: getTypeColor(call.type) }]}>
            {getTypeDisplayText(call.type)}
          </Text>
        </View>

        {/* Service Illustration */}
        <View style={styles.illustrationContainer}>
          <Image
            source={require("../../assets/images/admin/parent-request.png")}
            style={styles.illustrationImage}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Bottom Half - White Background with Content */}
      <View style={styles.bottomHalf}>
        {/* Service Info */}
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceType}>Pickup Service #{call.id}</Text>
          <Text style={styles.duration}>
            {call.kidsCount} kids • {call.availableDays.length} days
          </Text>
        </View>

        {/* Details */}
        <View style={styles.detailsContainer}>
          {/* Time */}
          {/* <View style={styles.timeContainer}>
            <View style={styles.timeItem}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.timeLabel}>Pickup:</Text>
              <Text style={styles.timeValue}>
                {formatTime(call.callPickupTime)}
              </Text>
            </View>
            <View style={styles.timeItem}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.timeLabel}>Drop-off:</Text>
              <Text style={styles.timeValue}>
                {formatTime(call.callDropTime)}
              </Text>
            </View>
          </View> */}

          {/* Location */}
          {/* <View style={styles.detailItem}>
            <FontAwesome5 name="map-marker-alt" size={14} color="#666" />
            <Text style={styles.detailText}>
              {call.fromZone} → {call.toZone}
            </Text>
          </View> */}

          {/* Available Days */}
          <View style={styles.daysContainer}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.daysLabel}>Available Days:</Text>
            <Text style={styles.daysValue}>
              {formatDays(call.availableDays)}
            </Text>
          </View>

          {/* Date Range for Varying Type */}
          {call.type === "varying" && call.startDate && call.endDate && (
            <View style={styles.dateRangeContainer}>
              <Ionicons name="calendar" size={16} color="#666" />
              <Text style={styles.dateRangeLabel}>Date Range:</Text>
              <Text style={styles.dateRangeValue}>
                {formatDate(call.startDate)} - {formatDate(call.endDate)}
              </Text>
            </View>
          )}

          {/* Slots Section - Show if available */}
          {call.slots && call.slots.length > 0 && (
            <View style={styles.slotsContainer}>
              <View style={styles.slotsHeader}>
                <FontAwesome5 name="route" size={14} color="#FF932E" />
                <Text style={styles.slotsTitle}>
                  Pickup Slots ({call.slots.length})
                </Text>
              </View>

              {call.slots.slice(0, 2).map((slot, index) => (
                <View key={slot.id} style={styles.slotItem}>
                  <View style={styles.slotRoute}>
                    <Text style={styles.slotLocation}>
                      {slot.fromLocation} → {slot.toLocation}
                    </Text>
                  </View>
                  <View style={styles.slotTime}>
                    <Text style={styles.slotTimeText}>
                      {formatTime(slot.slotStartTime)} -{" "}
                      {formatTime(slot.slotEndTime)}
                    </Text>
                  </View>
                </View>
              ))}

              {call.slots.length > 2 && (
                <Text style={styles.moreSlotsText}>
                  +{call.slots.length - 2} more slots
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Buttons Row */}
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[
              styles.applyButton,
              call.status === "matched" && styles.applyButtonDisabled,
            ]}
            onPress={() => call.status !== "matched" && onApplyPress(call.id)}
            activeOpacity={call.status === "matched" ? 1 : 0.8}
            disabled={call.status === "matched"}
          >
            <FontAwesome5
              name={
                call.status === "matched"
                  ? "check-circle"
                  : "hand-holding-heart"
              }
              size={16}
              color="#fff"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.applyButtonText}>
              {call.status === "matched" ? "Matched" : "Apply Now"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => onViewDetails?.(call.id)}
            activeOpacity={0.8}
          >
            <FontAwesome5
              name="eye"
              size={16}
              color="#FF932E"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.detailsButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 0,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#F2F2F2",
    overflow: "hidden",
  },
  topHalf: {
    backgroundColor: "#F8F9FE",
    padding: 20,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    height: 160,
  },
  dateBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#FFE8D6",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  dateText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FF932E",
    fontFamily: "Comfortaa-Regular",
  },

  typeBadge: {
    position: "absolute",
    top: 16,
    left: 16, // Position it on the left since we removed status badge
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  typeText: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Comfortaa-Regular",
  },
  illustrationContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  illustrationImage: {
    width: 120,
    height: 120,
  },
  bottomHalf: {
    padding: 20,
  },
  serviceInfo: {
    marginBottom: 20,
  },
  serviceType: {
    fontSize: 18,
    fontWeight: "600",
    color: "#23272F",
    marginBottom: 4,
    fontFamily: "Comfortaa-Regular",
  },
  duration: {
    fontSize: 14,
    color: "#8A8A8A",
    fontFamily: "Comfortaa-Regular",
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    fontFamily: "Comfortaa-Regular",
  },
  daysContainer: {
    marginTop: 12,
  },
  daysLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#23272F",
    marginBottom: 8,
    fontFamily: "Comfortaa-Regular",
  },
  daysValue: {
    fontSize: 14,
    color: "#8A8A8A",
    fontFamily: "Comfortaa-Regular",
  },
  dateRangeContainer: {
    marginTop: 12,
  },
  dateRangeLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#23272F",
    marginBottom: 8,
    fontFamily: "Comfortaa-Regular",
  },
  dateRangeValue: {
    fontSize: 14,
    color: "#8A8A8A",
    fontFamily: "Comfortaa-Regular",
  },
  // Slots Section Styles
  slotsContainer: {
    marginTop: 16,
    backgroundColor: "#FFF7ED",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#FF932E",
  },
  slotsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  slotsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF932E",
    marginLeft: 8,
    fontFamily: "Comfortaa-Bold",
  },
  slotItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#FF932E",
  },
  slotRoute: {
    marginBottom: 4,
  },
  slotLocation: {
    fontSize: 13,
    color: "#1F2937",
    fontFamily: "Comfortaa-Bold",
  },
  slotTime: {
    flexDirection: "row",
    alignItems: "center",
  },
  slotTimeText: {
    fontSize: 12,
    color: "#92400E",
    fontFamily: "Comfortaa-Regular",
  },
  moreSlotsText: {
    fontSize: 12,
    color: "#FF932E",
    fontFamily: "Comfortaa-Regular",
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 4,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  applyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF932E",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flex: 1,
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Comfortaa-Regular",
  },
  applyButtonDisabled: {
    backgroundColor: "#34C759",
    opacity: 0.8,
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#FF932E",
    flex: 1,
  },
  detailsButtonText: {
    color: "#FF932E",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Comfortaa-Regular",
  },
  timeContainer: {
    flexDirection: "column",
    marginBottom: 12,
  },
  timeItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  timeLabel: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    fontFamily: "Comfortaa-Regular",
  },
  timeValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#23272F",
    fontFamily: "Comfortaa-Regular",
  },
});
