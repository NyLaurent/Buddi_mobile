import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface TimesheetSummaryCardProps {
  weekLabel: string;
  weekRange: string;
  shifts: number;
  pending: number;
  isFull: boolean;
  isPaid: boolean;
  onPress?: () => void;
}

const TimesheetSummaryCard: React.FC<TimesheetSummaryCardProps> = ({
  weekLabel,
  weekRange,
  shifts,
  pending,
  isFull,
  isPaid,
  onPress,
}) => {
  // Determine color variant
  let cardColor = "#FF932E"; // chocolate/orange
  let badgeBg = "#FFF4E5";
  let badgeText = "#FF932E";
  if (isPaid) {
    cardColor = "#16A34A"; // green
    badgeBg = "#E6FCEB";
    badgeText = "#16A34A";
  } else if (isFull) {
    cardColor = "#2563EB"; // blue
    badgeBg = "#E6F0FF";
    badgeText = "#2563EB";
  }

  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 18,
        marginBottom: 18,
        shadowColor: "#FFD9B3",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
      }}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={{ marginRight: 16 }}>
        <View
          style={{
            backgroundColor: cardColor,
            borderRadius: 8,
            width: 36,
            height: 36,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="list" size={22} color="#fff" />
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: "Comfortaa-Bold",
            fontSize: 17,
            color: "#232B3A",
            marginBottom: 2,
          }}
        >
          {weekLabel}
        </Text>
        <Text
          style={{
            fontFamily: "Comfortaa-Regular",
            fontSize: 14,
            color: "#6B7280",
            marginBottom: 10,
          }}
        >
          {weekRange}
        </Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <View
            style={{
              backgroundColor: badgeBg,
              borderRadius: 16,
              paddingHorizontal: 16,
              paddingVertical: 6,
              marginRight: 8,
            }}
          >
            <Text
              style={{
                color: badgeText,
                fontFamily: "Comfortaa-Bold",
                fontSize: 15,
              }}
            >
              Shifts: {shifts}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: badgeBg,
              borderRadius: 16,
              paddingHorizontal: 16,
              paddingVertical: 6,
            }}
          >
            <Text
              style={{
                color: badgeText,
                fontFamily: "Comfortaa-Bold",
                fontSize: 15,
              }}
            >
              Pending: ${(pending || 0).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
      <Ionicons
        name="chevron-forward"
        size={24}
        color="#A3A3A3"
        style={{ marginLeft: 8 }}
      />
    </TouchableOpacity>
  );
};

export default TimesheetSummaryCard;
