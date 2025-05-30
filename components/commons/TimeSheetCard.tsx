import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface TimeSheetCardProps {
  icon: React.ReactNode;
  value: string;
  title: string;
}

const TimeSheetCard = ({ icon, value, title }: TimeSheetCardProps) => (
  <View style={styles.card}>
    <View style={styles.topRow}>
      <View style={styles.iconContainer}>{icon}</View>
      <Text style={styles.value}>{value}</Text>
    </View>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    paddingVertical: 18,
    paddingHorizontal: 20,
    minWidth: 165,
    minHeight: 80,
    margin: 4,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  value: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1E1E1E",
    fontFamily: "Comfortaa-Bold",
  },
  title: {
    fontSize: 13,
    color: "#222",
    fontFamily: "Comfortaa-Regular",
    width: "100%",
  },
});

export default TimeSheetCard;
