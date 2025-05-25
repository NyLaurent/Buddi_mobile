// app/components/AnalyticsCard.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface AnalyticsCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle?: string;
}

const AnalyticsCard = ({
  icon,
  title,
  value,
  subtitle,
}: AnalyticsCardProps) => (
  <View style={styles.card}>
    <Text style={styles.title}>{title}</Text>
    <View style={styles.content}>
      <Text style={styles.value}>{value}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
    <View style={styles.iconContainer}>{icon}</View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    position: "relative",
    height: 160,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  title: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Comfortaa-Regular",
  },
  content: {
    marginTop: "auto",
    marginBottom: 16,
  },
  value: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1E1E1E",
    fontFamily: "Comfortaa-Bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Comfortaa-Regular",
  },
  iconContainer: {
    position: "absolute",
    bottom: 16,
    right: 16,
  },
});

export default AnalyticsCard;
