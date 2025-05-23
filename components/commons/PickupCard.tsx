// app/components/PickupCard.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PickupCardProps {
  name: string;
  time: string;
  days: string;
  school: string;
  home: string;
  onViewDetails: () => void;
  onButtonPress: () => void;
}

const PickupCard = ({
  name,
  time,
  days,
  school,
  home,
  onViewDetails,
  onButtonPress,
}: PickupCardProps) => (
  <View style={styles.card}>
    <View style={styles.header}>
      <Text style={styles.name}>{name}</Text>
      <TouchableOpacity style={styles.coverageButton}>
        <Text style={styles.coverage}>Request Coverage</Text>
        <Ionicons name="chevron-forward" size={16} color="#FF932E" />
      </TouchableOpacity>
    </View>

    <View style={styles.timeContainer}>
      <Text style={styles.time}>{time}</Text>
      <View style={styles.daysContainer}>
        <Text style={styles.days}>{days}</Text>
      </View>
    </View>

    <View style={styles.locationContainer}>
      <View style={styles.locationItem}>
        <Ionicons name="school" size={16} color="#666" />
        <Text style={styles.locationText}>{school}</Text>
      </View>
      <View style={styles.locationItem}>
        <Ionicons name="home" size={16} color="#666" />
        <Text style={styles.locationText}>{home}</Text>
      </View>
    </View>

    <View style={styles.actions}>
      <TouchableOpacity style={styles.detailsBtn} onPress={onViewDetails}>
        <Text style={styles.detailsText}>View Details</Text>
        <Ionicons name="chevron-forward" size={16} color="#666" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.mainButton} onPress={onButtonPress}>
        <Text style={styles.buttonText}>Button</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
    fontFamily: "Comfortaa-Bold",
  },
  coverageButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  coverage: {
    color: "#FF932E",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 4,
    fontFamily: "Comfortaa-SemiBold",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  time: {
    color: "#FF932E",
    fontSize: 15,
    fontWeight: "bold",
    marginRight: 12,
    fontFamily: "Comfortaa-Bold",
  },
  daysContainer: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  days: {
    color: "#666",
    fontSize: 13,
    fontFamily: "Comfortaa-Regular",
  },
  locationContainer: {
    marginBottom: 16,
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  locationText: {
    marginLeft: 8,
    color: "#666",
    fontSize: 14,
    fontFamily: "Comfortaa-Regular",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailsBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  detailsText: {
    color: "#666",
    marginRight: 4,
    fontSize: 14,
    fontFamily: "Comfortaa-Regular",
  },
  mainButton: {
    backgroundColor: "#FF932E",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Comfortaa-SemiBold",
  },
});

export default PickupCard;
