import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface TimesheetStatusCardProps {
  status: string;
  week: string;
  date: string;
  shifts: number;
  amount: number;
  isLast?: boolean;
  chevron?: React.ReactNode;
}

const getStatusConfig = (status: string) => {
  if (status === "ongoing") {
    return {
      color: "#FF932E",
      icon: "list",
      shiftsBg: "#FFF3E6",
      shiftsText: "#FF932E",
      amountBg: "#FFF3E6",
      amountText: "#FF932E",
      amountLabel: "Ongoing",
      rightIcon: null,
      showCheck: false,
      showAmount: false,
    };
  }
  if (status === "pending") {
    return {
      color: "#3CB4FF",
      icon: "list",
      shiftsBg: "#E6F4FF",
      shiftsText: "#3CB4FF",
      amountBg: "#E6F4FF",
      amountText: "#3CB4FF",
      amountLabel: "Pending: $",
      rightIcon: null,
      showCheck: false,
      showAmount: true,
    };
  }
  if (status === "completed") {
    return {
      color: "#22C55E",
      icon: "grid",
      shiftsBg: "#E6FCEB",
      shiftsText: "#22C55E",
      amountBg: "#E6FCEB",
      amountText: "#22C55E",
      amountLabel: "Paid: $",
      rightIcon: (
        <Ionicons
          name="sparkles"
          size={18}
          color="#22C55E"
          style={{ marginLeft: 4 }}
        />
      ),
      showCheck: true,
      showAmount: true,
    };
  }
  if (status === "flagged") {
    return {
      color: "#FF5A5F",
      icon: "alert-circle",
      shiftsBg: "#F4F4F4",
      shiftsText: "#FF5A5F",
      amountBg: "#F4F4F4",
      amountText: "#FF5A5F",
      amountLabel: "Flagged",
      rightIcon: (
        <Ionicons
          name="alert"
          size={18}
          color="#FF5A5F"
          style={{ marginLeft: 4 }}
        />
      ),
      showCheck: false,
      showAmount: false,
    };
  }
  // Default fallback
  return {
    color: "#888",
    icon: "list",
    shiftsBg: "#EEE",
    shiftsText: "#888",
    amountBg: "#EEE",
    amountText: "#888",
    amountLabel: "Pending: $",
    rightIcon: null,
    showCheck: false,
    showAmount: true,
  };
};

const TimesheetStatusCard = ({
  status,
  week,
  date,
  shifts,
  amount,
  isLast = false,
  chevron,
}: TimesheetStatusCardProps) => {
  const config = getStatusConfig(status);
  return (
    <View style={[styles.card, !isLast && styles.cardWithBorder]}>
      <Ionicons
        name={config.icon as any}
        size={28}
        color={config.color}
        style={{ marginRight: 16 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.week}>{week}</Text>
        <Text style={styles.date}>{date}</Text>
        <View style={styles.row}>
          <View style={[styles.badge, { backgroundColor: config.shiftsBg }]}>
            <Text style={[styles.badgeText, { color: config.shiftsText }]}>
              Shifts: {shifts}
            </Text>
          </View>
          <View style={[styles.badge, { backgroundColor: config.amountBg }]}>
            <Text style={[styles.badgeText, { color: config.amountText }]}>
              {config.showCheck && (
                <Ionicons
                  name="checkmark"
                  size={14}
                  color={config.amountText}
                />
              )}
              {config.amountLabel}
              {config.showAmount ? amount : null}
            </Text>
          </View>
          {config.rightIcon}
        </View>
      </View>
      {chevron ?? <Ionicons name="chevron-forward" size={22} color="#B0B0B0" />}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  cardWithBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  week: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 16,
    marginBottom: 2,
    color: "#222",
  },
  date: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 13,
    color: "#888",
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  badgeText: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 13,
  },
});

export default TimesheetStatusCard;
