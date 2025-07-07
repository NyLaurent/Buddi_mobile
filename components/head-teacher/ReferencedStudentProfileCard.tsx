import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ReferencedStudentProfileCardProps {
  image: any;
  name: string;
  email: string;
  phone: string;
  status: "Active" | "Inactive";
  date: string;
  time: string;
  onViewProfile: () => void;
  buttonLabel?: string;
  buttonIcon?: React.ReactNode;
}

const ReferencedStudentProfileCard: React.FC<ReferencedStudentProfileCardProps> = ({
  image,
  name,
  email,
  phone,
  status,
  date,
  time,
  onViewProfile,
  buttonLabel,
  buttonIcon,
}) => {
  return (
    <View style={styles.card}>
      <Image source={image} style={styles.avatar} />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.email}>{email}</Text>
      <View style={styles.row}>
        <Ionicons name="call-outline" size={18} color="#666" style={{ marginRight: 6 }} />
        <Text style={styles.phone}>{phone}</Text>
      </View>
      <View style={styles.statusRow}>
        <View style={[styles.statusDot, { backgroundColor: status === "Active" ? "#22C55E" : "#ccc" }]} />
        <Text style={styles.statusText}>{status}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.date}>{date}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={onViewProfile}>
        {buttonIcon ?? <Ionicons name="person-outline" size={20} color="#fff" style={{ marginRight: 8 }} />}
        <Text style={styles.buttonText}>{buttonLabel ?? "View Profile"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    padding: 20,
    alignItems: "center",
    margin: 12,
    
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    color: "#23272F",
    fontFamily: "Comfortaa-Bold",
    marginBottom: 2,
  },
  email: {
    fontSize: 14,
    color: "#8A8A8A",
    fontFamily: "Comfortaa-Regular",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    justifyContent: "center",
    gap: 8,
  },
  phone: {
    fontSize: 15,
    color: "#666",
    fontFamily: "Comfortaa-Regular",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#22C55E20",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 10,
    marginTop: 2,
    alignSelf: "center",
  },
  statusDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 8,
  },
  statusText: {
    fontSize: 15,
    color: "#22C55E",
    fontFamily: "Comfortaa-Bold",
  },
  date: {
    fontSize: 14,
    color: "#888",
    fontFamily: "Comfortaa-Regular",
    marginRight: 12,
  },
  time: {
    fontSize: 14,
    color: "#888",
    fontFamily: "Comfortaa-Regular",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF9100",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 18,
    alignSelf: "stretch",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Comfortaa-Bold",
  },
});

export default ReferencedStudentProfileCard; 