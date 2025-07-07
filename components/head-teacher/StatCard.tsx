import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  accentColor?: string;
  iconBgColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  accentColor = "#2EC8FF",
  iconBgColor = "#A259FF",
}) => {
  return (
    <View style={[styles.card, { borderLeftColor: accentColor }]}> 
      {/* Left: Title */}
      <View style={styles.leftCol}>
        <Text style={styles.title}>{title}</Text>
      </View>
      {/* Center: Value and Subtitle */}
      <View style={styles.centerCol}>
        <Text style={styles.value}>{value}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {/* Right: Icon */}
      <View style={[styles.iconCircle, { backgroundColor: iconBgColor }]}> 
        {icon}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderLeftWidth: 4,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginVertical: 8,
    minHeight: 70,
  },
  leftCol: {
    flex: 2,
    justifyContent: "center",
  },
  centerCol: {
    flex: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 15,
    color: "#23272F",
    fontFamily: "Comfortaa-Regular",
    marginBottom: 2,
  },
  value: {
    fontSize: 22,
    fontWeight: "700",
    color: "#23272F",
    fontFamily: "Comfortaa-Bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#8A8A8A",
    fontFamily: "Comfortaa-Regular",
    marginTop: 2,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 16,
  },
});

export default StatCard;
