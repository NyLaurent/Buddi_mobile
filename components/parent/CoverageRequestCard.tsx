import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";

interface CoverageRequestCardProps {
  coverage: {
    id: number;
    parentId: string;
    buddiId: number;
    reason: string;
    coveredBy: string | number | null;
    status: string;
    coverageType: string;
    createdAt: string;
    updatedAt: string;
  };
  onStartTrip?: (coverageId: number) => void;
  showStartButton?: boolean;
}

const CoverageRequestCard: React.FC<CoverageRequestCardProps> = ({
  coverage,
  onStartTrip,
  showStartButton = false,
}) => {
  // Only allow: pending, approved, denied
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "#FF932E";
      case "approved":
        return "#4CAF50";
      case "denied":
        return "#F44336";
      default:
        return "#9E9E9E";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "time-outline";
      case "approved":
        return "checkmark-circle-outline";
      case "denied":
        return "close-circle-outline";
      default:
        return "help-circle-outline";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "Pending";
      case "approved":
        return "Approved";
      case "denied":
        return "Denied";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleStartTrip = () => {
    if (onStartTrip) {
      Alert.alert(
        "Start Coverage Trip",
        `Are you ready to start this coverage trip?\n\nReason: ${coverage.reason || "No reason provided"}`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Yes, Start Trip",
            style: "default",
            onPress: () => onStartTrip(coverage.id),
          },
        ]
      );
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.statusContainer}>
          <Ionicons
            name={getStatusIcon(coverage.status) as any}
            size={20}
            color={getStatusColor(coverage.status)}
          />
          <Text
            style={[styles.status, { color: getStatusColor(coverage.status) }]}
          >
            {getStatusText(coverage.status)}
          </Text>
        </View>
        <Text style={styles.date}>{formatDate(coverage.createdAt)}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.reasonLabel}>Reason:</Text>
        <Text style={styles.reason}>{coverage.reason}</Text>
      </View>

      {coverage.coveredBy && (
        <View style={styles.coveredBy}>
          <Text style={styles.coveredByLabel}>Covered by:</Text>
          <Text style={styles.coveredByText}>Buddi {coverage.coveredBy}</Text>
        </View>
      )}

      {/* Show Start Trip button when coveredBy has an ID and showStartButton is true */}
      {coverage.coveredBy && showStartButton && (
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartTrip}
        >
          <Ionicons name="play-circle" size={18} color="white" style={{ marginRight: 8 }} />
          <Text style={styles.startButtonText}>Start Coverage Trip</Text>
        </TouchableOpacity>
      )}

      <View style={styles.footer}>
        <Text style={styles.id}>Request #{coverage.id}</Text>
        <Text style={styles.buddiName}>Buddi {coverage.buddiId}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E6E6E6",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  status: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 14,
    marginLeft: 6,
  },
  date: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 12,
    color: "#666",
  },
  content: {
    marginBottom: 12,
  },
  reasonLabel: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  reason: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  coveredBy: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  coveredByLabel: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 12,
    color: "#666",
    marginRight: 4,
  },
  coveredByText: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 12,
    color: "#4CAF50",
  },
  startButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  startButtonText: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 14,
    color: "white",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  id: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 12,
    color: "#999",
  },
  buddiName: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 12,
    color: "#999",
  },
});

export default CoverageRequestCard;
