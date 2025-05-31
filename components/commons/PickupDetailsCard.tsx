import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export type PickupDetailsVariant = "request" | "active" | "paid";

interface PickupDetailsCardProps {
  variant: PickupDetailsVariant;
  studentName: string;
  time: string;
  hourlyRate: string;
  school: string;
  home: string;
  parentName: string;
  parentEmail: string;
  parentAvatar?: string;
  onViewDetails?: () => void;
  onClockIn?: () => void;
  onClockOut?: () => void;
  onRequestCoverage?: () => void;
  onReportIssue?: () => void;
  isClockedIn?: boolean;
  timesheetTime?: string;
}

const variantConfig = {
  request: {
    timeBg: "#FF932E",
    timeColor: "#fff",
    actionText: "Request Coverage",
    actionColor: "#FF932E",
    actionIcon: "send",
    actionTextColor: "#FF932E",
    button1: null,
    button2: {
      text: "Clock in",
      bg: "#FF932E",
      color: "#fff",
      border: false,
      icon: "sync",
      onPress: "onClockIn",
      disabled: false,
    },
  },
  active: {
    timeBg: "#3CB4FF",
    timeColor: "#fff",
    actionText: "Report issue",
    actionColor: "#22C55E",
    actionIcon: "send",
    actionTextColor: "#22C55E",
    button1: {
      text: "Clock out",
      bg: "#3CB4FF",
      color: "#fff",
      border: false,
      icon: "sync",
      onPress: "onClockOut",
      disabled: false,
    },
    button2: {
      text: "Clock in",
      bg: "#F5F5F5",
      color: "#B0B0B0",
      border: false,
      icon: "sync",
      onPress: undefined,
      disabled: true,
    },
  },
  paid: {
    timeBg: "#22C55E",
    timeColor: "#fff",
    actionText: "Paid",
    actionColor: "#22C55E",
    actionIcon: "checkmark",
    actionTextColor: "#22C55E",
    button1: {
      text: "View in Timesheet",
      bg: "#22C55E",
      color: "#fff",
      border: false,
      icon: "arrow-forward",
      onPress: "onViewDetails",
      disabled: false,
    },
    button2: null,
  },
};

const PickupDetailsCard: React.FC<PickupDetailsCardProps> = (props) => {
  const config = variantConfig[props.variant];
  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#E8E8E8",
        padding: 20,
        marginVertical: 10,
        shadowColor: "#000",
        shadowOpacity: 0.03,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        minWidth: 320,
        maxWidth: 500,
        width: "100%",
        alignSelf: "center",
      }}
    >
      {/* Top Row: Student Name & Action */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons
            name="person"
            size={18}
            color="#222"
            style={{ marginRight: 8 }}
          />
          <Text
            style={{
              fontFamily: "Comfortaa-Bold",
              fontSize: 16,
              color: "#222",
            }}
          >
            {props.studentName}
          </Text>
          {props.variant === "paid" && props.timesheetTime && (
            <View
              style={{
                backgroundColor: "#3CB4FF",
                borderRadius: 8,
                paddingHorizontal: 10,
                paddingVertical: 2,
                marginLeft: 8,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontFamily: "Comfortaa-Bold",
                  fontSize: 14,
                }}
              >
                {props.timesheetTime}
              </Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          onPress={
            props.variant === "request"
              ? props.onRequestCoverage
              : props.variant === "active"
              ? props.onReportIssue
              : undefined
          }
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Text
            style={{
              fontFamily: "Comfortaa-Bold",
              color: config.actionTextColor,
              marginRight: 4,
            }}
          >
            {config.actionText}
          </Text>
          <Ionicons
            name={config.actionIcon as any}
            size={18}
            color={config.actionColor}
          />
        </TouchableOpacity>
      </View>
      {/* Time and Rate Row */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: config.timeBg,
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 8,
              marginRight: 8,
            }}
          >
            <Ionicons
              name="time"
              size={16}
              color={config.timeColor}
              style={{ marginRight: 4 }}
            />
            <Text
              style={{
                color: config.timeColor,
                fontFamily: "Comfortaa-Bold",
                fontSize: 14,
              }}
            >
              {props.time}
            </Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: "#F5F5F5",
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              color: "#222",
              fontFamily: "Comfortaa-Regular",
              fontSize: 14,
            }}
          >
            {props.hourlyRate}
          </Text>
        </View>
      </View>
      {/* Route Row */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="location" size={16} color="#34C759" />
          <View style={{ marginLeft: 6 }}>
            <Text
              style={{
                color: "#888",
                fontFamily: "Comfortaa-Regular",
                fontSize: 12,
              }}
            >
              School
            </Text>
            <Text
              style={{
                fontFamily: "Comfortaa-Regular",
                color: "#222",
                fontSize: 14,
              }}
            >
              {props.school}
            </Text>
          </View>
        </View>
        <Ionicons name="play" size={24} color="#3CB4FF" />
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="home" size={16} color="#FF932E" />
          <View style={{ marginLeft: 6 }}>
            <Text
              style={{
                color: "#888",
                fontFamily: "Comfortaa-Regular",
                fontSize: 12,
              }}
            >
              Home
            </Text>
            <Text
              style={{
                fontFamily: "Comfortaa-Bold",
                color: "#222",
                fontSize: 14,
              }}
            >
              {props.home}
            </Text>
          </View>
        </View>
      </View>
      {/* Parent Info */}
      <View style={{ marginTop: 8, marginBottom: 16 }}>
        <Text
          style={{
            fontFamily: "Comfortaa-Regular",
            color: "#888",
            fontSize: 13,
            marginBottom: 6,
          }}
        >
          Parent
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={{
              uri:
                props.parentAvatar ||
                "https://randomuser.me/api/portraits/men/32.jpg",
            }}
            style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
          />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: "Comfortaa-Bold",
                color: "#222",
                fontSize: 15,
              }}
            >
              {props.parentName}
            </Text>
            <Text
              style={{
                fontFamily: "Comfortaa-Regular",
                color: "#888",
                fontSize: 13,
                marginBottom: 2,
              }}
            >
              {props.parentEmail}
            </Text>
          </View>
        </View>
      </View>
      {/* Action Buttons */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent:
            config.button2 && !config.button1
              ? "center"
              : config.button2
              ? "space-between"
              : "center",
          marginTop: 8,
        }}
      >
        {/* Button 1 */}
        {config.button1 && (
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: config.button1.bg,
              borderRadius: 24,
              paddingVertical: 14,
              paddingHorizontal: 24,
              borderWidth: config.button1.border ? 1 : 0,
              borderColor: config.button1.border ? "#E8E8E8" : undefined,
              minWidth: config.button2 ? 140 : undefined,
              maxWidth: config.button2 ? undefined : "100%",
              flex: config.button2 ? undefined : 1,
              width: config.button2 ? undefined : "100%",
              opacity: config.button1.disabled ? 0.5 : 1,
            }}
            onPress={
              props[
                config.button1.onPress as keyof PickupDetailsCardProps
              ] as any
            }
            disabled={!!config.button1.disabled}
          >
            <Text
              style={{
                color: config.button1.color,
                fontFamily: "Comfortaa-Bold",
                fontSize: 16,
                marginRight: 8,
              }}
            >
              {config.button1.text}
            </Text>
            <Ionicons
              name={config.button1.icon as any}
              size={18}
              color={config.button1.color}
            />
          </TouchableOpacity>
        )}
        {/* Button 2 (if present) */}
        {config.button2 && (
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: config.button2.bg,
              borderRadius: 24,
              paddingVertical: 14,
              paddingHorizontal: 24,
              borderWidth: config.button2.border ? 1 : 0,
              borderColor: config.button2.border ? "#E8E8E8" : undefined,
              minWidth: !config.button1 ? undefined : 140,
              maxWidth: !config.button1 ? "100%" : undefined,
              flex: !config.button1 ? 1 : undefined,
              width: !config.button1 ? "100%" : undefined,
              marginLeft: config.button1 ? 8 : 0,
              opacity: config.button2.disabled ? 0.5 : 1,
            }}
            onPress={
              props[
                config.button2.onPress as keyof PickupDetailsCardProps
              ] as any
            }
            disabled={!!config.button2.disabled}
          >
            <Text
              style={{
                color: config.button2.color,
                fontFamily: "Comfortaa-Bold",
                fontSize: 16,
                marginRight: 8,
              }}
            >
              {config.button2.text}
            </Text>
            <Ionicons
              name={config.button2.icon as any}
              size={18}
              color={config.button2.color}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default PickupDetailsCard;
