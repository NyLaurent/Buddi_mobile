import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AdminProfileReviewCardProps {
  image: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  status?: "Active" | "Inactive";
  onReview: () => void;
}

const AdminProfileReviewCard: React.FC<AdminProfileReviewCardProps> = ({
  image,
  name,
  email,
  phone,
  date,
  time,
  status = "Active",
  onReview,
}) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.avatar} />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.email}>{email}</Text>
      <View style={styles.phoneRow}>
        <Ionicons
          name="call"
          size={20}
          color="#23272F"
          style={{ marginRight: 6 }}
        />
        <Text style={styles.phone}>{phone}</Text>
      </View>

      {/* Status Badge */}
      <View
        style={[
          styles.statusBadge,
          { backgroundColor: status === "Active" ? "#4CAF50" : "#9E9E9E" },
        ]}
      >
        <Text style={styles.statusText}>{status}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoText}>{date}</Text>
        <Text style={styles.infoText}>{time}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={onReview}>
        <Ionicons
          name="person-outline"
          size={22}
          color="#fff"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.buttonText}>Go To Review</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F2F2F2",
    margin: 12,
    width: 280,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 16,
    backgroundColor: "#eee",
  },
  name: {
    fontSize: 22,
    fontWeight: "600",
    color: "#23272F",
    marginBottom: 4,
    fontFamily: "Comfortaa-Regular",
    textAlign: "center",
  },
  email: {
    fontSize: 15,
    color: "#8A8A8A",
    marginBottom: 12,
    fontFamily: "Comfortaa-Regular",
    textAlign: "center",
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  phone: {
    fontSize: 15,
    color: "#23272F",
    fontFamily: "Comfortaa-Regular",
  },
  statusBadge: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 16,
  },
  statusText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Comfortaa-Regular",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 18,
    paddingHorizontal: 8,
  },
  infoText: {
    fontSize: 15,
    color: "#23272F",
    fontFamily: "Comfortaa-Regular",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF932E",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 8,
    width: "100%",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
    fontFamily: "Comfortaa-Regular",
  },
});

export default AdminProfileReviewCard;
