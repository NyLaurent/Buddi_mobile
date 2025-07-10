import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AvailableCall } from "../../services/api/buddi.service";

interface AvailableCallCardProps {
  call: AvailableCall;
  onApplyPress: (callId: number) => void;
}

export default function AvailableCallCard({
  call,
  onApplyPress,
}: AvailableCallCardProps) {
  const formatTime = (time: string) => {
    // Handle time format like "07:30" or "2566" (invalid format)
    if (time.includes(":")) {
      return time;
    }
    // For invalid formats, return as is
    return time;
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

        {/* Status Badge */}
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(call.status) + "20" },
          ]}
        >
          <Text
            style={[styles.statusText, { color: getStatusColor(call.status) }]}
          >
            {getStatusText(call.status)}
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
          <View style={styles.detailItem}>
            <FontAwesome5 name="clock" size={14} color="#666" />
            <Text style={styles.detailText}>{formatTime(call.pickupTime)}</Text>
          </View>

          {/* Location */}
          <View style={styles.detailItem}>
            <FontAwesome5 name="map-marker-alt" size={14} color="#666" />
            <Text style={styles.detailText}>
              {call.fromZone} → {call.toZone}
            </Text>
          </View>

          {/* Available Days */}
          <View style={styles.daysContainer}>
            <Text style={styles.daysLabel}>Available Days:</Text>
            <View style={styles.daysList}>
              {call.availableDays.slice(0, 3).map((day, index) => (
                <View key={index} style={styles.dayTag}>
                  <Text style={styles.dayText}>{day.slice(0, 3)}</Text>
                </View>
              ))}
              {call.availableDays.length > 3 && (
                <View style={styles.dayTag}>
                  <Text style={styles.dayText}>
                    +{call.availableDays.length - 3}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Buttons Row */}
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={styles.applyButton}
            onPress={() => onApplyPress(call.id)}
            activeOpacity={0.8}
          >
            <FontAwesome5
              name="hand-holding-heart"
              size={16}
              color="#fff"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.applyButtonText}>Apply Now</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => onApplyPress(call.id)}
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
    shadowColor: "#23272F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
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
  statusBadge: {
    position: "absolute",
    top: 16,
    left: 16,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusText: {
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
  daysList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayTag: {
    backgroundColor: "#FF932E",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  dayText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#fff",
    fontFamily: "Comfortaa-Regular",
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
});
