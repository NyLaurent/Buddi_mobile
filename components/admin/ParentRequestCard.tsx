import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ParentRequestCardProps {
  date: string;
  serviceType: string;
  duration: string;
  parentName: string;
  parentEmail: string;
  parentAvatar?: string;
  onProposeBuddis: () => void;
}

const ParentRequestCard: React.FC<ParentRequestCardProps> = ({
  date,
  serviceType,
  duration,
  parentName,
  parentEmail,
  parentAvatar,
  onProposeBuddis,
}) => {
  return (
    <View style={styles.card}>
      {/* Top Half - Gray Background with Date and Illustration */}
      <View style={styles.topHalf}>
        {/* Date Badge */}
        <View style={styles.dateBadge}>
          <Text style={styles.dateText}>{date}</Text>
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
          <Text style={styles.serviceType}>{serviceType}</Text>
          <Text style={styles.duration}>{duration}</Text>
        </View>

        {/* Parent Info */}
        <View style={styles.parentInfo}>
          <View style={styles.parentDetails}>
            {parentAvatar ? (
              <Image source={{ uri: parentAvatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={20} color="#8A8A8A" />
              </View>
            )}
            <View style={styles.parentText}>
              <Text style={styles.parentName}>{parentName}</Text>
              <Text style={styles.parentEmail}>{parentEmail}</Text>
            </View>
          </View>
        </View>

        {/* Propose Buddis Button */}
        <TouchableOpacity
          style={styles.proposeButton}
          onPress={onProposeBuddis}
        >
          <Ionicons
            name="person-add"
            size={20}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.proposeButtonText}>Propose Buddis</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 0,
    marginHorizontal: 8,
    marginVertical: 8,
    width: 280,
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
  parentInfo: {
    marginBottom: 20,
  },
  parentDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F2F2F2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  parentText: {
    flex: 1,
  },
  parentName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#23272F",
    marginBottom: 2,
    fontFamily: "Comfortaa-Regular",
  },
  parentEmail: {
    fontSize: 14,
    color: "#8A8A8A",
    fontFamily: "Comfortaa-Regular",
  },
  proposeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF932E",
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  proposeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Comfortaa-Regular",
  },
});

export default ParentRequestCard;
