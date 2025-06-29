import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface BackupRequestCardProps {
  id: string;
  name: string;
  timeRemaining: string;
  daysPerWeek: string;
  buddyName: string;
  buddyEmail: string;
  buddyAvatar: any;
  buddyStatus: "available" | "unavailable";
  schoolName: string;
  location: string;
  notificationCount: number;
  status: "pending" | "resolved";
  onViewDetails: () => void;
  onFindBackup: () => void;
}

const BackupRequestCard: React.FC<BackupRequestCardProps> = ({
  name,
  timeRemaining,
  daysPerWeek,
  buddyName,
  buddyEmail,
  buddyAvatar,
  buddyStatus,
  schoolName,
  location,
  notificationCount,
  status,
  onViewDetails,
  onFindBackup,
}) => {
  return (
    <View style={styles.card}>
      {/* Top Section */}
      <View style={styles.topSection}>
        <View style={styles.leftSection}>
          <View style={styles.nameContainer}>
            <Ionicons name="person" size={20} color="#23272F" />
            <Text style={styles.nameText}>{name}</Text>
          </View>
          <View style={styles.timeRemainingBadge}>
            <Ionicons name="time" size={12} color="#fff" />
            <Text style={styles.timeRemainingText}>
              {timeRemaining} Remaining
            </Text>
          </View>
        </View>
        <Text style={styles.daysPerWeekText}>{daysPerWeek}</Text>
      </View>

      {/* Middle Section */}
      <View style={styles.middleSection}>
        <View style={styles.buddySection}>
          <Text style={styles.buddyLabel}>Buddi</Text>
          <View style={styles.buddyInfo}>
            <Image source={buddyAvatar} style={styles.buddyAvatar} />
            <View style={styles.buddyDetails}>
              <Text style={styles.buddyName}>{buddyName}</Text>
              <Text style={styles.buddyEmail}>{buddyEmail}</Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                buddyStatus === "unavailable" && styles.unavailableBadge,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  buddyStatus === "unavailable" && styles.unavailableText,
                ]}
              >
                {buddyStatus === "unavailable" ? "Unavailable" : "Available"}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.notificationBadge}>
          <Text style={styles.notificationText}>{notificationCount}</Text>
        </View>
      </View>

      {/* Bottom Info Section */}
      <View style={styles.infoSection}>
        <View style={styles.infoItem}>
          <View style={styles.schoolIndicator}>
            <Text style={styles.schoolIndicatorText}>S</Text>
          </View>
          <Text style={styles.infoText}>School Name</Text>
          <TouchableOpacity style={styles.playButton}>
            <Ionicons name="play" size={12} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoItem}>
          <View style={styles.homeIndicator}>
            <Ionicons name="home" size={12} color="#fff" />
          </View>
          <View>
            <Text style={styles.homeLabel}>Home</Text>
            <Text style={styles.locationText}>{location}</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.viewDetailsButton}
          onPress={onViewDetails}
        >
          <Text style={styles.viewDetailsText}>View Details</Text>
          <Ionicons name="arrow-forward" size={14} color="#8A8A8A" />
        </TouchableOpacity>

        {status === "pending" ? (
          <TouchableOpacity
            style={styles.findBackupButton}
            onPress={onFindBackup}
          >
            <Text style={styles.findBackupText}>Find backup</Text>
            <Ionicons name="wifi" size={14} color="#fff" />
          </TouchableOpacity>
        ) : (
          <View style={styles.resolvedButton}>
            <Text style={styles.resolvedText}>Resolved</Text>
            <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F2F2F2",
    marginBottom: 16,
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  leftSection: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  nameText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#23272F",
    fontFamily: "Comfortaa-Regular",
  },
  timeRemainingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF932E",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
    gap: 4,
  },
  timeRemainingText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "500",
    fontFamily: "Comfortaa-Regular",
  },
  daysPerWeekText: {
    fontSize: 12,
    color: "#8A8A8A",
    fontFamily: "Comfortaa-Regular",
  },
  middleSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  buddySection: {
    flex: 1,
  },
  buddyLabel: {
    fontSize: 12,
    color: "#8A8A8A",
    fontFamily: "Comfortaa-Regular",
    marginBottom: 8,
  },
  buddyInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  buddyAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  buddyDetails: {
    flex: 1,
  },
  buddyName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#23272F",
    fontFamily: "Comfortaa-Regular",
  },
  buddyEmail: {
    fontSize: 12,
    color: "#8A8A8A",
    fontFamily: "Comfortaa-Regular",
  },
  statusBadge: {
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  unavailableBadge: {
    backgroundColor: "#FF4444",
  },
  statusText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "500",
    fontFamily: "Comfortaa-Regular",
  },
  unavailableText: {
    color: "#fff",
  },
  notificationBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FF932E",
    alignItems: "center",
    justifyContent: "center",
  },
  notificationText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
    fontFamily: "Comfortaa-Regular",
  },
  infoSection: {
    marginBottom: 16,
    gap: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  schoolIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
  },
  schoolIndicatorText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "600",
    fontFamily: "Comfortaa-Regular",
  },
  infoText: {
    fontSize: 12,
    color: "#23272F",
    fontFamily: "Comfortaa-Regular",
    flex: 1,
  },
  playButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#2196F3",
    alignItems: "center",
    justifyContent: "center",
  },
  homeIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FF932E",
    alignItems: "center",
    justifyContent: "center",
  },
  homeLabel: {
    fontSize: 10,
    color: "#8A8A8A",
    fontFamily: "Comfortaa-Regular",
  },
  locationText: {
    fontSize: 12,
    color: "#23272F",
    fontWeight: "500",
    fontFamily: "Comfortaa-Regular",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  viewDetailsButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
  },
  viewDetailsText: {
    fontSize: 10,
    color: "#8A8A8A",
    fontWeight: "500",
    fontFamily: "Comfortaa-Regular",
  },
  findBackupButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF932E",
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
  },
  findBackupText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "500",
    fontFamily: "Comfortaa-Regular",
  },
  resolvedButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E8F5E8",
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
  },
  resolvedText: {
    fontSize: 10,
    color: "#4CAF50",
    fontWeight: "500",
    fontFamily: "Comfortaa-Regular",
  },
});

export default BackupRequestCard;
