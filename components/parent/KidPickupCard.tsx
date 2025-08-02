import {
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

// Helper function to generate initials from name
const getInitials = (name?: string): string => {
  if (!name) return "B";

  const nameParts = name.trim().split(" ");
  if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase();
  }

  return (
    nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)
  ).toUpperCase();
};

// Helper function to generate a consistent color based on name
const getAvatarColor = (name?: string): string => {
  if (!name) return "#3B82F6";

  const colors = [
    "#3B82F6",
    "#8B5CF6",
    "#EF4444",
    "#F59E0B",
    "#10B981",
    "#F97316",
    "#EC4899",
    "#06B6D4",
    "#84CC16",
    "#6366F1",
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};

// Avatar component that displays initials
const AvatarWithInitials = ({
  name,
  size = 28,
  style = {},
}: {
  name?: string;
  size?: number;
  style?: any;
}) => {
  const initials = getInitials(name);
  const backgroundColor = getAvatarColor(name);

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      <Text
        style={{
          color: "#FFFFFF",
          fontFamily: "Comfortaa-Bold",
          fontSize: size * 0.4,
        }}
      >
        {initials}
      </Text>
    </View>
  );
};

interface BuddiInfo {
  name: string;
  email: string;
  avatar?: string;
  status: string;
  statusColor: string;
  onMessage?: () => void;
  subLabel?: string;
}

interface KidPickupCardProps {
  childName: string;
  onReportIssue?: () => void;
  remaining: string;
  schedule: string;
  buddiName?: string;
  buddiEmail?: string;
  buddiAvatar?: string;
  buddiStatus?: string;
  onMessageBuddi?: () => void;
  schoolName: string;
  destination: string;
  mainAction: string;
  onMainAction?: () => void;
  variant?: "default" | "coverage" | "detailed";
  badgeColor?: string;
  statusColor?: string;
  mainActionColor?: string;
  defaultBuddi?: BuddiInfo;
  coverageBuddi?: BuddiInfo;
  disabled?: boolean;
}

const KidPickupCard = ({
  childName,
  onReportIssue,
  remaining,
  schedule,
  buddiName,
  buddiEmail,
  buddiAvatar,
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
  defaultBuddi,
  coverageBuddi,
  disabled = false,
}: KidPickupCardProps) => {
  const badgeBg =
    badgeColor || (variant === "coverage" ? "#3B82F6" : "#FF9100");
  const statusBg =
    statusColor || (variant === "coverage" ? "#F59E0B" : "#22C55E");
  const mainActionBg =
    mainActionColor || (variant === "coverage" ? "#3B82F6" : "#FF932E");

  if (variant === "detailed") {
    return (
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          borderWidth: 1.2,
          borderColor: "#D1D5DB",
          padding: 16,
          marginVertical: 6,
          shadowColor: "#000",
          shadowOpacity: 0.02,
          shadowRadius: 2,
          shadowOffset: { width: 0, height: 1 },
          width: 360,
          maxWidth: "98%",
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <FontAwesome5
            name="child"
            size={20}
            color="#232B3A"
            style={{ marginRight: 7 }}
          />
          <Text
            style={{
              fontFamily: "Comfortaa-Bold",
              fontSize: 18,
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
                fontSize: 13,
                marginRight: 3,
              }}
            >
              Report issue
            </Text>
            <Feather name="send" size={16} color="#F87171" />
          </TouchableOpacity>
        </View>
        {/* Timer & Schedule */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#FF9100",
              borderRadius: 6,
              paddingHorizontal: 9,
              paddingVertical: 3,
              marginRight: 7,
            }}
          >
            <MaterialIcons
              name="timer"
              size={15}
              color="#fff"
              style={{ marginRight: 4 }}
            />
            <Text
              style={{
                color: "#fff",
                fontFamily: "Comfortaa-Bold",
                fontSize: 13,
              }}
            >
              {remaining} Remaining
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "#F3F4F6",
              borderRadius: 6,
              paddingHorizontal: 9,
              paddingVertical: 3,
            }}
          >
            <Text
              style={{
                color: "#6B7280",
                fontFamily: "Comfortaa-Regular",
                fontSize: 13,
              }}
            >
              {schedule}
            </Text>
          </View>
        </View>
        {/* Default Buddi */}
        {defaultBuddi && (
          <View style={{ marginBottom: 8 }}>
            <Text
              style={{
                color: "#A3A3A3",
                fontFamily: "Comfortaa-Regular",
                fontSize: 12,
                marginBottom: 2,
              }}
            >
              Default Buddi
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 2,
              }}
            >
              <AvatarWithInitials
                name={defaultBuddi.name}
                size={32}
                style={{ marginRight: 8 }}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: "Comfortaa-Bold",
                    color: "#232B3A",
                    fontSize: 15,
                  }}
                >
                  {defaultBuddi.name}
                </Text>
                <Text
                  style={{
                    fontFamily: "Comfortaa-Regular",
                    color: "#888",
                    fontSize: 12,
                  }}
                >
                  {defaultBuddi.email}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    backgroundColor: defaultBuddi.statusColor,
                    borderRadius: 12,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    marginRight: 6,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "#fff",
                      marginRight: 5,
                    }}
                  />
                  <Text
                    style={{
                      color: "#fff",
                      fontFamily: "Comfortaa-Bold",
                      fontSize: 12,
                    }}
                  >
                    {defaultBuddi.status}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={defaultBuddi.onMessage}
                  style={{
                    backgroundColor: "#FFF7ED",
                    borderRadius: 12,
                    padding: 6,
                  }}
                >
                  <Feather name="message-circle" size={16} color="#FF9100" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        {/* Coverage Buddi */}
        {coverageBuddi && (
          <View style={{ marginBottom: 12 }}>
            <Text
              style={{
                color: "#A3A3A3",
                fontFamily: "Comfortaa-Regular",
                fontSize: 12,
                marginBottom: 2,
              }}
            >
              Coverage Buddi
              {coverageBuddi.subLabel ? ` (${coverageBuddi.subLabel})` : ""}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <AvatarWithInitials
                name={coverageBuddi.name}
                size={32}
                style={{ marginRight: 8 }}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: "Comfortaa-Bold",
                    color: "#232B3A",
                    fontSize: 15,
                  }}
                >
                  {coverageBuddi.name}
                </Text>
                <Text
                  style={{
                    fontFamily: "Comfortaa-Regular",
                    color: "#888",
                    fontSize: 12,
                  }}
                >
                  {coverageBuddi.email}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    backgroundColor: coverageBuddi.statusColor,
                    borderRadius: 12,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    marginRight: 6,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "#fff",
                      marginRight: 5,
                    }}
                  />
                  <Text
                    style={{
                      color: "#fff",
                      fontFamily: "Comfortaa-Bold",
                      fontSize: 12,
                    }}
                  >
                    {coverageBuddi.status}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={coverageBuddi.onMessage}
                  style={{
                    backgroundColor: "#FFF7ED",
                    borderRadius: 12,
                    padding: 6,
                  }}
                >
                  <Feather name="message-circle" size={16} color="#FF9100" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        {/* Route Row */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <View style={{ alignItems: "center", flexDirection: "row" }}>
            <MaterialIcons
              name="location-on"
              size={16}
              color="#22C55E"
              style={{ marginRight: 3 }}
            />
            <View>
              <Text
                style={{
                  color: "#A3A3A3",
                  fontFamily: "Comfortaa-Regular",
                  fontSize: 11,
                }}
              >
                School
              </Text>
              <Text
                style={{
                  fontFamily: "Comfortaa-Bold",
                  color: "#232B3A",
                  fontSize: 13,
                }}
              >
                {schoolName}
              </Text>
            </View>
          </View>
          <View style={{ alignItems: "center", flexDirection: "row" }}>
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: "#E6F4FF",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="play" size={18} color="#0A77FF" />
            </View>
          </View>
          <View style={{ alignItems: "center", flexDirection: "row" }}>
            <MaterialIcons
              name="home"
              size={16}
              color="#FF9100"
              style={{ marginRight: 3 }}
            />
            <View>
              <Text
                style={{
                  color: "#A3A3A3",
                  fontFamily: "Comfortaa-Regular",
                  fontSize: 11,
                }}
              >
                Home
              </Text>
              <Text
                style={{
                  fontFamily: "Comfortaa-Bold",
                  color: "#232B3A",
                  fontSize: 13,
                }}
              >
                {destination}
              </Text>
            </View>
          </View>
        </View>
        {/* Main Action Button */}
        <TouchableOpacity
          onPress={disabled ? undefined : onMainAction}
          style={{
            backgroundColor: disabled
              ? "#A0A0A0"
              : mainAction === "Trip Not Yet Started"
              ? "#FF932E"
              : "#0A77FF",
            borderRadius: 24,
            paddingVertical: 13,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            opacity: disabled ? 0.6 : 1,
          }}
          activeOpacity={disabled ? 1 : 0.85}
          disabled={disabled}
        >
          <Text
            style={{
              color: "#fff",
              fontFamily: "Comfortaa-Bold",
              fontSize: 17,
              marginRight: 10,
            }}
          >
            {mainAction}
          </Text>
          <MaterialIcons name="check-box" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }

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
        <AvatarWithInitials
          name={buddiName}
          size={28}
          style={{ marginRight: 7 }}
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
              backgroundColor: "#E6F4FF",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="play" size={16} color="#0A77FF" />
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
        onPress={disabled ? undefined : onMainAction}
        style={{
          backgroundColor: disabled
            ? "#A0A0A0"
            : mainAction === "Trip Not Yet Started"
            ? "#FF932E"
            : "#0A77FF",
          borderRadius: 20,
          paddingVertical: 10,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
          opacity: disabled ? 0.6 : 1,
        }}
        activeOpacity={disabled ? 1 : 0.85}
        disabled={disabled}
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
