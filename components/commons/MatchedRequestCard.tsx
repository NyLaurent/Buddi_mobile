import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface MatchedRequestCardProps {
  request: {
    id: number;
    description: string;
    availableDays: string[];
    kidsCount: number;
    status: string;
    type: string;
    startDate?: string;
    endDate?: string;
    slots: {
      fromLocation: string;
      toLocation: string;
      slotStartTime: string;
      slotEndTime: string;
    }[];
  };
  isToday: boolean;
  onViewDetails: () => void;
}

export default function MatchedRequestCard({
  request,
  isToday,
  onViewDetails,
}: MatchedRequestCardProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Helper to get request type display text
  const getRequestTypeDisplayText = (type?: string) => {
    if (!type) return "One-time";
    return type === "repetitive" ? "Ongoing" : "One-time";
  };

  const getStatusColor = () => {
    switch (request.status) {
      case "matched":
        return "#10B981"; // Green
      case "pending":
        return "#FF932E"; // Orange
      default:
        return "#6B7280"; // Gray
    }
  };

  const getStatusText = () => {
    switch (request.status) {
      case "matched":
        return "Matched";
      case "pending":
        return "Pending";
      default:
        return request.status;
    }
  };

  const getTypeIcon = () => {
    switch (request.type) {
      case "repetitive":
        return "repeat";
      case "varying":
        return "calendar";
      default:
        return "car";
    }
  };

  const getTypeColor = () => {
    switch (request.type) {
      case "repetitive":
        return "#8B5CF6"; // Purple
      case "varying":
        return "#F59E0B"; // Amber
      default:
        return "#6B7280"; // Gray
    }
  };

  return (
    <View
      style={{
        width: "100%",
        backgroundColor: "white",
        borderRadius: 16,
        padding: 20,
        borderWidth: 2,
        borderColor: isToday ? "#3B82F6" : "#E5E7EB",
        marginBottom: 16,
      }}
    >
      {/* Header */}
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-1">
          <Text className="font-comfortaa-bold text-lg text-gray-900 mb-2">
            {request.description}
          </Text>
          <View className="flex-row items-center gap-2">
            <View
              style={{
                backgroundColor: getStatusColor(),
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 12,
                  fontFamily: "Comfortaa-Medium",
                }}
              >
                {getStatusText()}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: getTypeColor(),
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Ionicons
                name={getTypeIcon()}
                size={12}
                color="white"
                style={{ marginRight: 4 }}
              />
              <Text
                style={{
                  color: "white",
                  fontSize: 12,
                  fontFamily: "Comfortaa-Medium",
                }}
              >
                {getRequestTypeDisplayText(request.type)}
              </Text>
            </View>
          </View>
        </View>
        <View className="items-end">
          <View className="bg-blue-100 rounded-full p-2 mb-2">
            <Ionicons name="car" size={20} color="#3B82F6" />
          </View>
          {isToday && (
            <Text className="text-xs text-blue-600 font-comfortaa-bold">
              TODAY
            </Text>
          )}
        </View>
      </View>

      {/* Available Days */}
      <View className="mb-4">
        <Text className="text-xs text-black font-comfortaa mb-2">
          AVAILABLE DAYS
        </Text>
        <View className="flex-row flex-wrap gap-1">
          {request.availableDays.map((day, index) => (
            <View
              key={index}
              style={{
                backgroundColor:
                  isToday &&
                  day.toLowerCase() ===
                    new Date()
                      .toLocaleDateString("en-US", { weekday: "long" })
                      .toLowerCase()
                    ? "#3B82F6"
                    : "#F3F4F6",
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Comfortaa-Medium",
                  color:
                    isToday &&
                    day.toLowerCase() ===
                      new Date()
                        .toLocaleDateString("en-US", { weekday: "long" })
                        .toLowerCase()
                      ? "white"
                      : "black",
                }}
              >
                {day.slice(0, 3)}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Pickup Slots */}
      <View className="mb-4">
        <Text className="text-xs text-black font-comfortaa mb-3">
          PICKUP SLOTS ({request.slots.length})
        </Text>
        <View className="space-y-3">
          {request.slots.map((slot, index) => {
            const formatTime = (timeString: string) => {
              try {
                const date = new Date(timeString);
                return date.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                });
              } catch {
                return timeString;
              }
            };

            return (
              <View
                key={index}
                style={{
                  backgroundColor: "#F9FAFB",
                  borderRadius: 12,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                }}
              >
                <Text className="text-xs text-black font-comfortaa mb-2">
                  SLOT {index + 1}
                </Text>

                {/* From Location */}
                <View className="flex-row items-center mb-2">
                  <View className="w-3 h-3 bg-green-500 rounded-full mr-3" />
                  <View className="flex-1">
                    <Text className="text-xs text-black font-comfortaa">
                      FROM
                    </Text>
                    <Text className="font-comfortaa-medium text-gray-900">
                      {slot.fromLocation}
                    </Text>
                  </View>
                  <Text className="text-xs text-black font-comfortaa">
                    {formatTime(slot.slotStartTime)}
                  </Text>
                </View>

                {/* Arrow */}
                <View className="flex-row items-center justify-center mb-2">
                  <View className="flex-1 h-0.5 bg-gray-300" />
                  <View className="mx-2">
                    <Ionicons name="arrow-down" size={16} color="#9CA3AF" />
                  </View>
                  <View className="flex-1 h-0.5 bg-gray-300" />
                </View>

                {/* To Location */}
                <View className="flex-row items-center">
                  <View className="w-3 h-3 bg-red-500 rounded-full mr-3" />
                  <View className="flex-1">
                    <Text className="text-xs text-black font-comfortaa">
                      TO
                    </Text>
                    <Text className="font-comfortaa-medium text-gray-900">
                      {slot.toLocation}
                    </Text>
                  </View>
                  <Text className="text-xs text-black font-comfortaa">
                    {formatTime(slot.slotEndTime)}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Date Range */}
      {request.startDate && request.endDate && (
        <View className="mb-4">
          <Text className="text-xs text-black font-comfortaa mb-1">
            DURATION
          </Text>
          <Text className="font-comfortaa-medium text-gray-700">
            {formatDate(request.startDate)} - {formatDate(request.endDate)}
          </Text>
        </View>
      )}

      {/* Bottom Section */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Ionicons name="people" size={16} color="#6B7280" />
          <Text className="text-black font-comfortaa ml-2">
            {request.kidsCount} {request.kidsCount === 1 ? "Kid" : "Kids"}
          </Text>
        </View>

        {/* View Details Button */}
        <TouchableOpacity
          onPress={onViewDetails}
          style={{
            backgroundColor: "#3B82F6",
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 12,
            flexDirection: "row",
            alignItems: "center",
          }}
          activeOpacity={0.8}
        >
          <Ionicons
            name="eye"
            size={14}
            color="white"
            style={{ marginRight: 4 }}
          />
          <Text
            style={{
              color: "white",
              fontSize: 14,
              fontFamily: "Comfortaa-Medium",
            }}
          >
            View Details
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
