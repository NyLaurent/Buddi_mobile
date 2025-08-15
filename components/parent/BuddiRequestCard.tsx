import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import type { BuddiRequest } from "../../services/api/buddi-requests.service";
import notificationService from "../../services/notifications/notification.service";

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

// Helper to format ISO date/time
const formatTime = (iso?: string) => {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (error) {
    return iso;
  }
};

// Helper to format date
const formatDate = (dateString?: string) => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch (error) {
    return dateString;
  }
};

// Helper to get user-friendly call type display
const getTypeDisplayText = (type?: string) => {
  switch (type) {
    case "repetitive":
      return "Ongoing";
    case "varying":
      return "One-time";
    default:
      return type || "Unknown";
  }
};

// Helper to get call type color
const getTypeColor = (type?: string) => {
  switch (type) {
    case "repetitive":
      return "#10B981"; // Green
    case "varying":
      return "#3B82F6"; // Blue
    default:
      return "#6B7280"; // Gray
  }
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

interface BuddiRequestCardProps {
  request: BuddiRequest;
  onViewDetails?: () => void;
}

const BuddiRequestCard = ({
  request,
  onViewDetails,
}: BuddiRequestCardProps) => {
  const router = useRouter();

  // Check for buddi recommendations and send notification every time
  useEffect(() => {
    if (request.isBuddiRecommended && !request.matchedBuddiId) {
      // Send notification about buddi recommendations
      const sendRecommendationNotification = async () => {
        try {
          // Truncate description if too long for notification
          const shortDescription =
            request.description.length > 30
              ? request.description.substring(0, 30) + "..."
              : request.description;

          await notificationService.sendImmediateNotification({
            title: "🎯 Buddi Recommendations Available!",
            body: `You have ${
              request.kidsCount > 1
                ? "buddi recommendations"
                : "a buddi recommendation"
            } for: "${shortDescription}". Tap to view and rank them!`,
            data: {
              type: "buddi_recommendations",
              requestId: request.id,
              requestDescription: request.description,
              navigateTo: "buddi-recommendations",
              kidsCount: request.kidsCount,
            },
            priority: "high",
            sound: "default",
          });
          console.log(
            "🔔 Buddi recommendation notification sent for request:",
            request.id
          );
        } catch (error) {
          console.error(
            "❌ Failed to send buddi recommendation notification:",
            error
          );
        }
      };

      // Send notification every time recommendations are available
      sendRecommendationNotification();
    }
  }, [
    request.isBuddiRecommended,
    request.matchedBuddiId,
    request.id,
    request.description,
    request.kidsCount,
  ]);

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails();
    } else {
      // Navigate to call details page
      router.push(`/parent/call-details/${request.id}`);
    }
  };

  const handleViewApplicants = () => {
    router.push(`/parent/buddi-recommendations/${request.id}`);
  };

  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: "#FF932E",
        padding: 20,
        marginVertical: 8,
        width: "100%",
        maxWidth: 400,
      }}
    >
      {/* Header with Status Badge */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 16,
        }}
      >
        <View style={{ flex: 1, marginRight: 12 }}>
          <Text
            style={{
              fontFamily: "Comfortaa-Bold",
              fontSize: 18,
              color: "#1F2937",
              marginBottom: 4,
            }}
            numberOfLines={2}
          >
            {request.description}
          </Text>

          {/* Call Type Badge */}
          {request.type && (
            <View
              style={{
                alignSelf: "flex-start",
                backgroundColor: getTypeColor(request.type),
                borderRadius: 8,
                paddingHorizontal: 10,
                paddingVertical: 4,
                marginTop: 6,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontFamily: "Comfortaa-Bold",
                  fontSize: 12,
                }}
              >
                {getTypeDisplayText(request.type)}
              </Text>
            </View>
          )}
        </View>

        {/* Status Badge */}
        <View
          style={{
            backgroundColor: request.matchedBuddiId
              ? "#F0FDF4"
              : request.isBuddiRecommended
              ? "#FFF7ED"
              : "#FEF3C7",
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderWidth: 1,
            borderColor: request.matchedBuddiId
              ? "#22C55E"
              : request.isBuddiRecommended
              ? "#FF932E"
              : "#F59E0B",
          }}
        >
          <Text
            style={{
              color: request.matchedBuddiId
                ? "#22C55E"
                : request.isBuddiRecommended
                ? "#FF932E"
                : "#92400E",
              fontFamily: "Comfortaa-Bold",
              fontSize: 12,
            }}
          >
            {request.matchedBuddiId
              ? "Matched"
              : request.isBuddiRecommended
              ? "View Applicants"
              : "Pending"}
          </Text>
        </View>
      </View>

      {/* Request Details */}
      <View style={{ marginBottom: 16 }}>
        {/* Kids Count & Type */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <FontAwesome5
            name="child"
            size={16}
            color="#6B7280"
            style={{ marginRight: 8 }}
          />
          <Text
            style={{
              color: "#6B7280",
              fontFamily: "Comfortaa-Regular",
              fontSize: 14,
            }}
          >
            {request.kidsCount} kid{request.kidsCount > 1 ? "s" : ""} •{" "}
            {request.type === "repetitive" ? "Recurring" : "One-time"}
          </Text>
        </View>

        {/* Date Range for Varying Calls */}
        {request.type === "varying" && request.startDate && request.endDate && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <MaterialIcons
              name="event"
              size={16}
              color="#6B7280"
              style={{ marginRight: 8 }}
            />
            <Text
              style={{
                color: "#6B7280",
                fontFamily: "Comfortaa-Regular",
                fontSize: 14,
              }}
            >
              {formatDate(request.startDate)} - {formatDate(request.endDate)}
            </Text>
          </View>
        )}

        {/* Available Days */}
        {request.availableDays.length > 0 && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <MaterialIcons
              name="schedule"
              size={16}
              color="#6B7280"
              style={{ marginRight: 8 }}
            />
            <Text
              style={{
                color: "#6B7280",
                fontFamily: "Comfortaa-Regular",
                fontSize: 14,
              }}
              numberOfLines={1}
            >
              {request.availableDays.slice(0, 3).join(", ")}
              {request.availableDays.length > 3 &&
                ` +${request.availableDays.length - 3} more`}
            </Text>
          </View>
        )}

        {/* Created Date */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <MaterialIcons
            name="access-time"
            size={16}
            color="#6B7280"
            style={{ marginRight: 8 }}
          />
          <Text
            style={{
              color: "#6B7280",
              fontFamily: "Comfortaa-Regular",
              fontSize: 14,
            }}
          >
            Created {formatDate(request.createdAt)}
          </Text>
        </View>
      </View>

      {/* Slots Section */}
      {request.slots.length > 0 && (
        <View
          style={{
            backgroundColor: "#FFF7ED",
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: "#FF932E",
          }}
        >
          <Text
            style={{
              fontFamily: "Comfortaa-Bold",
              fontSize: 14,
              color: "#FF932E",
              marginBottom: 12,
            }}
          >
            Pickup Slots ({request.slots.length})
          </Text>

          {request.slots.map((slot, index) => (
            <View
              key={slot.id}
              style={{
                backgroundColor: "#fff",
                borderRadius: 8,
                padding: 12,
                marginBottom: index < request.slots.length - 1 ? 8 : 0,
                borderWidth: 1,
                borderColor: "#FF932E",
              }}
            >
              {/* Route */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text
                    style={{
                      color: "#64748B",
                      fontFamily: "Comfortaa-Regular",
                      fontSize: 11,
                      marginBottom: 2,
                    }}
                  >
                    From
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Comfortaa-Bold",
                      color: "#1F2937",
                      fontSize: 13,
                    }}
                    numberOfLines={1}
                  >
                    {slot.fromLocation}
                  </Text>
                </View>

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
                  <Ionicons name="arrow-forward" size={14} color="#0284C7" />
                </View>

                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text
                    style={{
                      color: "#64748B",
                      fontFamily: "Comfortaa-Regular",
                      fontSize: 11,
                      marginBottom: 2,
                    }}
                  >
                    To
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Comfortaa-Bold",
                      color: "#1F2937",
                      fontSize: 13,
                    }}
                    numberOfLines={1}
                  >
                    {slot.toLocation}
                  </Text>
                </View>
              </View>

              {/* Time */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#FEF3C7",
                    borderRadius: 6,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                  }}
                >
                  <MaterialIcons
                    name="schedule"
                    size={14}
                    color="#92400E"
                    style={{ marginRight: 4 }}
                  />
                  <Text
                    style={{
                      color: "#92400E",
                      fontFamily: "Comfortaa-Bold",
                      fontSize: 12,
                    }}
                  >
                    {formatTime(slot.slotStartTime)}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#D1FAE5",
                    borderRadius: 6,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                  }}
                >
                  <MaterialIcons
                    name="home"
                    size={14}
                    color="#065F46"
                    style={{ marginRight: 4 }}
                  />
                  <Text
                    style={{
                      color: "#065F46",
                      fontFamily: "Comfortaa-Bold",
                      fontSize: 12,
                    }}
                  >
                    {formatTime(slot.slotEndTime)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Action Buttons */}
      <View
        style={{
          flexDirection: "row",
          gap: 12,
        }}
      >
        {/* View Details Button */}
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "#F3F4F6",
            borderRadius: 12,
            paddingVertical: 14,
            paddingHorizontal: 16,
            borderWidth: 1,
            borderColor: "#D1D5DB",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
          }}
          onPress={handleViewDetails}
          activeOpacity={0.8}
        >
          <MaterialIcons
            name="visibility"
            size={18}
            color="#6B7280"
            style={{ marginRight: 8 }}
          />
          <Text
            style={{
              color: "#6B7280",
              fontFamily: "Comfortaa-Bold",
              fontSize: 14,
            }}
          >
            View Details
          </Text>
        </TouchableOpacity>

        {/* View Applicants Button (only show if recommended and not matched) */}
        {request.isBuddiRecommended && !request.matchedBuddiId && (
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "#FF932E",
              borderRadius: 12,
              paddingVertical: 14,
              paddingHorizontal: 16,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
            }}
            onPress={handleViewApplicants}
            activeOpacity={0.8}
          >
            <FontAwesome5
              name="users"
              size={16}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text
              style={{
                color: "#fff",
                fontFamily: "Comfortaa-Bold",
                fontSize: 14,
              }}
            >
              View Applicants
            </Text>
          </TouchableOpacity>
        )}

        {/* Matched Button (only show if matched) */}
        {request.matchedBuddiId && (
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "#22C55E",
              borderRadius: 12,
              paddingVertical: 14,
              paddingHorizontal: 16,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
            }}
            onPress={() => {
              // Navigate to matched buddi profile
              router.push(`/parent/buddi-profile/${request.matchedBuddiId}`);
            }}
            activeOpacity={0.8}
          >
            <FontAwesome5
              name="user-friends"
              size={16}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text
              style={{
                color: "#fff",
                fontFamily: "Comfortaa-Bold",
                fontSize: 14,
              }}
            >
              View Profile
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Status Message */}
      {!request.isBuddiRecommended && !request.matchedBuddiId && (
        <View
          style={{
            backgroundColor: "#FEF3C7",
            borderRadius: 8,
            padding: 12,
            marginTop: 12,
            borderWidth: 1,
            borderColor: "#F59E0B",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <MaterialIcons
              name="hourglass-empty"
              size={16}
              color="#92400E"
              style={{ marginRight: 6 }}
            />
            <Text
              style={{
                color: "#92400E",
                fontFamily: "Comfortaa-Regular",
                fontSize: 13,
                textAlign: "center",
              }}
            >
              Waiting for buddi recommendations
            </Text>
          </View>
        </View>
      )}

      {/* Matched Status Message */}
      {request.matchedBuddiId && (
        <View
          style={{
            backgroundColor: "#F0FDF4",
            borderRadius: 8,
            padding: 12,
            marginTop: 12,
            borderWidth: 1,
            borderColor: "#22C55E",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <FontAwesome5
              name="user-friends"
              size={16}
              color="#22C55E"
              style={{ marginRight: 6 }}
            />
            <Text
              style={{
                color: "#22C55E",
                fontFamily: "Comfortaa-Regular",
                fontSize: 13,
                textAlign: "center",
              }}
            >
              Successfully matched with a buddi!
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default BuddiRequestCard;
