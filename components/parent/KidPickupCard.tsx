import {
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface KidPickupCardProps {
  childName: string;
  onReportIssue?: () => void;
  remaining: string;
  schedule: string;
  buddiName: string;
  buddiEmail: string;
  buddiAvatar?: string;
  buddiStatus?: string;
  onMessageBuddi?: () => void;
  schoolName: string;
  destination: string;
  mainAction: string;
  onMainAction?: () => void;
  variant?: "default" | "coverage";
  badgeColor?: string;
  statusColor?: string;
  mainActionColor?: string;
}

const KidPickupCard = ({
  childName,
  onReportIssue,
  remaining,
  schedule,
  buddiName,
  buddiEmail,
  buddiAvatar = "https://randomuser.me/api/portraits/men/2.jpg",
  buddiStatus = "Available",
  onMessageBuddi,
  schoolName,
  destination,
  mainAction,
  onMainAction,
  variant = "default",
  badgeColor,
  statusColor,
  mainActionColor,
}: KidPickupCardProps) => {
  const badgeBg =
    badgeColor || (variant === "coverage" ? "#3B82F6" : "#FF9100");
  const statusBg =
    statusColor || (variant === "coverage" ? "#F59E0B" : "#22C55E");
  const mainActionBg =
    mainActionColor || (variant === "coverage" ? "#3B82F6" : "#FF932E");

  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
        borderWidth: 1.2,
        borderColor: "#D1D5DB",
        padding: 12,
        marginVertical: 6,
        shadowColor: "#000",
        shadowOpacity: 0.02,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 1 },
        width: 380,
        maxWidth: "98%",
      }}
    >
      {/* Top Row: Child Name & Report Issue */}
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}
      >
        <FontAwesome5
          name="child"
          size={18}
          color="#232B3A"
          style={{ marginRight: 7 }}
        />
        <Text
          style={{
            fontFamily: "Comfortaa-Bold",
            fontSize: 16,
            color: "#232B3A",
            flex: 1,
          }}
        >
          {childName}
        </Text>
        <TouchableOpacity
          onPress={onReportIssue}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Text
            style={{
              fontFamily: "Comfortaa-Regular",
              color: "#F87171",
              fontSize: 12,
              marginRight: 3,
            }}
          >
            Report issue
          </Text>
          <Feather name="send" size={14} color="#F87171" />
        </TouchableOpacity>
      </View>
      {/* Remaining & Schedule */}
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: badgeBg,
            borderRadius: 6,
            paddingHorizontal: 7,
            paddingVertical: 2,
            marginRight: 7,
          }}
        >
          <MaterialIcons
            name="timer"
            size={13}
            color="#fff"
            style={{ marginRight: 3 }}
          />
          <Text
            style={{
              color: "#fff",
              fontFamily: "Comfortaa-Bold",
              fontSize: 11,
            }}
          >
            {remaining}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: "#F3F4F6",
            borderRadius: 6,
            paddingHorizontal: 7,
            paddingVertical: 2,
          }}
        >
          <Text
            style={{
              color: "#6B7280",
              fontFamily: "Comfortaa-Regular",
              fontSize: 11,
            }}
          >
            {schedule}
          </Text>
        </View>
      </View>
      {/* Buddi Label */}
      <Text
        style={{
          color: "#A3A3A3",
          fontFamily: "Comfortaa-Regular",
          fontSize: 11,
          marginBottom: 4,
        }}
      >
        Buddi
      </Text>
      {/* Buddi Info */}
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}
      >
        <Image
          source={{ uri: buddiAvatar }}
          style={{ width: 28, height: 28, borderRadius: 14, marginRight: 7 }}
        />
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: "Comfortaa-Bold",
              color: "#232B3A",
              fontSize: 13,
            }}
          >
            {buddiName}
          </Text>
          <Text
            style={{
              fontFamily: "Comfortaa-Regular",
              color: "#888",
              fontSize: 11,
            }}
          >
            {buddiEmail}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              backgroundColor: statusBg,
              borderRadius: 12,
              paddingHorizontal: 8,
              paddingVertical: 3,
              marginRight: 5,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 7,
                height: 7,
                borderRadius: 3.5,
                backgroundColor: "#fff",
                marginRight: 4,
              }}
            />
            <Text
              style={{
                color: "#fff",
                fontFamily: "Comfortaa-Bold",
                fontSize: 11,
              }}
            >
              {buddiStatus}
            </Text>
          </View>
          <TouchableOpacity
            onPress={onMessageBuddi}
            style={{ backgroundColor: "#FFF7ED", borderRadius: 12, padding: 5 }}
          >
            <Feather name="message-circle" size={14} color="#FF9100" />
          </TouchableOpacity>
        </View>
      </View>
      {/* Route Row */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <View style={{ alignItems: "center", flexDirection: "row" }}>
          <MaterialIcons
            name="location-on"
            size={14}
            color="#22C55E"
            style={{ marginRight: 2 }}
          />
          <View>
            <Text
              style={{
                color: "#A3A3A3",
                fontFamily: "Comfortaa-Regular",
                fontSize: 10,
              }}
            >
              School
            </Text>
            <Text
              style={{
                fontFamily: "Comfortaa-Bold",
                color: "#232B3A",
                fontSize: 12,
              }}
            >
              {schoolName}
            </Text>
          </View>
        </View>
        <View style={{ alignItems: "center", flexDirection: "row" }}>
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: "#E0F2FE",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="play" size={16} color="#3CB4FF" />
          </View>
        </View>
        <View style={{ alignItems: "center", flexDirection: "row" }}>
          <MaterialIcons
            name="home"
            size={14}
            color="#FF9100"
            style={{ marginRight: 2 }}
          />
          <View>
            <Text
              style={{
                color: "#A3A3A3",
                fontFamily: "Comfortaa-Regular",
                fontSize: 10,
              }}
            >
              Home
            </Text>
            <Text
              style={{
                fontFamily: "Comfortaa-Bold",
                color: "#232B3A",
                fontSize: 12,
              }}
            >
              {destination}
            </Text>
          </View>
        </View>
      </View>
      {/* Main Action Button */}
      <TouchableOpacity
        onPress={onMainAction}
        style={{
          backgroundColor: mainActionBg,
          borderRadius: 20,
          paddingVertical: 10,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
        }}
        activeOpacity={0.85}
      >
        <Text
          style={{
            color: "#fff",
            fontFamily: "Comfortaa-Regular",
            fontSize: 15,
            marginRight: 7,
          }}
        >
          {mainAction}
        </Text>
        <MaterialIcons name="history" size={16} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default KidPickupCard;
