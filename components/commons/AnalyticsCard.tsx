// app/components/AnalyticsCard.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface AnalyticsCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle?: string;
  rightIcon?: React.ReactNode;
}

const AnalyticsCard = ({
  icon,
  title,
  value,
  subtitle,
  rightIcon,
}: AnalyticsCardProps) => (
  <View style={styles.card}>
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
    </View>

    <View style={styles.content}>
      <View style={styles.valueContainer}>
        <Text style={styles.value}>{value}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>

    {/* Right corner icon */}
    {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}

    {/* Bottom right icon */}
    <View style={styles.bottomIconContainer}>{icon}</View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    margin: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    position: "relative",
    minHeight: 120,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Comfortaa-Regular",
  },
  content: {
    marginTop: 16,
  },
  valueContainer: {
    flex: 1,
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
    fontFamily: "Comfortaa-Bold",
  },
  subtitle: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
    fontFamily: "Comfortaa-Regular",
  },
  rightIconContainer: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#8B5CF6",
    borderRadius: 20,
    padding: 10,
  },
  bottomIconContainer: {
    position: "absolute",
    bottom: 6,
    right: 8,
  },
});

export default AnalyticsCard;
