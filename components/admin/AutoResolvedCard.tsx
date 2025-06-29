import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AutoResolvedCardProps {
  id: string;
  name: string;
  timeRemaining: string;
  daysPerWeek: string;
  defaultBuddyName: string;
  defaultBuddyEmail: string;
  defaultBuddyAvatar: any;
  coverageBuddyName: string;
  coverageBuddyEmail: string;
  coverageBuddyAvatar: any;
  coverageBuddyRank: string;
  schoolName: string;
  location: string;
  onViewTrip: () => void;
}

const AutoResolvedCard: React.FC<AutoResolvedCardProps> = ({
  name,
  timeRemaining,
  daysPerWeek,
  defaultBuddyName,
  defaultBuddyEmail,
  defaultBuddyAvatar,
  coverageBuddyName,
  coverageBuddyEmail,
  coverageBuddyAvatar,
  coverageBuddyRank,
  schoolName,
  location,
  onViewTrip,
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

      {/* Default Buddi Section */}
      <View style={styles.buddySection}>
        <Text style={styles.sectionLabel}>Default Buddi</Text>
        <View style={styles.buddyInfo}>
          <Image source={defaultBuddyAvatar} style={styles.buddyAvatar} />
          <View style={styles.buddyDetails}>
            <Text style={styles.buddyName}>{defaultBuddyName}</Text>
            <Text style={styles.buddyEmail}>{defaultBuddyEmail}</Text>
          </View>
          <View style={styles.unavailableBadge}>
            <Text style={styles.unavailableText}>Unavailable</Text>
          </View>
        </View>
      </View>

      {/* Coverage Buddi Section */}
      <View style={styles.buddySection}>
        <Text style={styles.sectionLabel}>Coverage Buddi</Text>
        <View style={styles.buddyInfo}>
          <Image source={coverageBuddyAvatar} style={styles.buddyAvatar} />
          <View style={styles.buddyDetails}>
            <Text style={styles.buddyName}>{coverageBuddyName}</Text>
            <Text style={styles.buddyEmail}>{coverageBuddyEmail}</Text>
            <Text style={styles.rankText}>
              {coverageBuddyRank} Ranking Match
            </Text>
          </View>
          <View style={styles.availableBadge}>
            <Text style={styles.availableText}>Available</Text>
          </View>
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

      {/* Action Button */}
      <TouchableOpacity style={styles.viewTripButton} onPress={onViewTrip}>
        <Text style={styles.viewTripText}>View Trip</Text>
        <Ionicons name="arrow-forward" size={14} color="#fff" />
      </TouchableOpacity>
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
  buddySection: {
    marginBottom: 16,
  },
  sectionLabel: {
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
  rankText: {
    fontSize: 10,
    color: "#2196F3",
    fontFamily: "Comfortaa-Regular",
    marginTop: 2,
  },
  availableBadge: {
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  availableText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "500",
    fontFamily: "Comfortaa-Regular",
  },
  unavailableBadge: {
    backgroundColor: "#FF4444",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  unavailableText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "500",
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
  viewTripButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF932E",
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
  },
  viewTripText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "500",
    fontFamily: "Comfortaa-Regular",
  },
});

export default AutoResolvedCard;
