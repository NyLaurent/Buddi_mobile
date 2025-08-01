import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface PendingTimesheetCardProps {
  week: string;
  dateRange: string;
  shifts: number;
  pendingAmount: string;
  onPress?: () => void;
  onGoToPayment?: () => void;
  variant?: "pending" | "approved" | "paid";
}

const PendingTimesheetCard: React.FC<PendingTimesheetCardProps> = ({
  week,
  dateRange,
  shifts,
  pendingAmount,
  onPress,
  onGoToPayment,
  variant = "pending",
}) => (
  <View
    style={{
      backgroundColor: "#fff",
      borderRadius: 16,
      padding: 18,
      marginBottom: 18,
      shadowColor: "#000",
      shadowOpacity: 0.03,
      shadowRadius: 6,
      borderWidth: 1,
      borderColor: "#F2F2F2",
    }}
  >
    <TouchableOpacity
      style={{ flexDirection: "row", alignItems: "center" }}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View
        style={{
          backgroundColor:
            variant === "paid"
              ? "#22C55E"
              : variant === "approved"
              ? "#3B82F6"
              : "#2563EB",
          borderRadius: 8,
          padding: 8,
          marginRight: 14,
        }}
      >
        <FontAwesome5 name="list-alt" size={24} color="#fff" />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: "Comfortaa-Bold",
            fontSize: 16,
            color: "#232B3A",
          }}
        >
          {week}
        </Text>
        <Text
          style={{
            fontFamily: "Comfortaa-Regular",
            fontSize: 13,
            color: "#71727A",
            marginTop: 2,
          }}
        >
          {dateRange}
        </Text>
        <View style={{ flexDirection: "row", marginTop: 8, gap: 8 }}>
          <View
            style={{
              backgroundColor:
                variant === "paid"
                  ? "#D1FADF"
                  : variant === "approved"
                  ? "#DBEAFE"
                  : "#E0EDFF",
              borderRadius: 999,
              paddingVertical: 4,
              paddingHorizontal: 12,
              marginRight: 8,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color:
                  variant === "paid"
                    ? "#22C55E"
                    : variant === "approved"
                    ? "#3B82F6"
                    : "#2563EB",
                fontFamily: "Comfortaa-Bold",
                fontSize: 13,
              }}
            >
              Shifts: {shifts}
            </Text>
          </View>
          <View
            style={{
              backgroundColor:
                variant === "paid"
                  ? "#D1FADF"
                  : variant === "approved"
                  ? "#DBEAFE"
                  : "#E0EDFF",
              borderRadius: 999,
              paddingVertical: 4,
              paddingHorizontal: 12,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {variant === "paid" && (
              <Ionicons
                name="checkmark-done"
                size={14}
                color="#22C55E"
                style={{ marginRight: 4 }}
              />
            )}
            {variant === "approved" && (
              <Ionicons
                name="time"
                size={14}
                color="#3B82F6"
                style={{ marginRight: 4 }}
              />
            )}
            <Text
              style={{
                color:
                  variant === "paid"
                    ? "#22C55E"
                    : variant === "approved"
                    ? "#3B82F6"
                    : "#2563EB",
                fontFamily: "Comfortaa-Bold",
                fontSize: 13,
              }}
            >
              {variant === "paid"
                ? "Paid"
                : variant === "approved"
                ? "Approved"
                : "Pending"}
              : {pendingAmount}
            </Text>
          </View>
        </View>
      </View>
      {variant === "paid" ? (
        <Text style={{ fontSize: 22, marginLeft: 8 }}>🎉</Text>
      ) : (
        <Ionicons
          name="chevron-forward"
          size={22}
          color="#BDBDBD"
          style={{ marginLeft: 8 }}
        />
      )}
    </TouchableOpacity>
    {variant === "pending" && (
      <TouchableOpacity
        style={{
          marginTop: 18,
          borderRadius: 999,
          borderWidth: 1.2,
          borderColor: "#E0E0E0",
          paddingVertical: 12,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
          gap: 8,
        }}
        activeOpacity={0.85}
        onPress={onGoToPayment}
      >
        <Ionicons name="card-outline" size={20} color="#232B3A" />
        <Text
          style={{
            fontFamily: "Comfortaa-Bold",
            fontSize: 16,
            color: "#232B3A",
            marginRight: 6,
          }}
        >
          Pay Now
        </Text>
        <Ionicons name="arrow-forward" size={20} color="#232B3A" />
      </TouchableOpacity>
    )}
  </View>
);

export default PendingTimesheetCard;
