// app/components/PickupCard.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

interface PickupCardProps {
  id: string;
  name: string;
  time: string;
  days: string;
  school: string;
  home: string;
  onButtonPress: () => void;
  cardWidth?: number;
  status?: "notStarted" | "enRoute" | "pickedUp" | "completed";
  onClockOut?: () => void;
  onPickUp?: () => void;
  pickupTime?: string;
  tripStartTime?: string;
  dropoffTime?: string;
  fare?: number | null;
  kidsCount?: number;
  // New fields from updated API
  callType?: string;
  startDate?: string | null;
  endDate?: string | null;
  fromZone?: string;
  toZone?: string;
}

const PickupCard = ({
  id,
  name,
  time,
  days,
  school,
  home,
  onButtonPress,
  cardWidth = 370,
  status = "notStarted",
  onClockOut,
  onPickUp,
  pickupTime,
  tripStartTime,
  dropoffTime,
  fare,
  kidsCount,
  callType,
  startDate,
  endDate,
  fromZone,
  toZone,
}: PickupCardProps) => {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push({
      pathname: "/buddi/call-details/[id]",
      params: { id },
    });
  };

  // Card color and button logic
  const isEnRoute = status === "enRoute";
  const isPicked = status === "pickedUp";
  const isCompleted = status === "completed";
  const cardBg = "#fff";
  const textColor = "#222";
  const subTextColor = "#71727A";
  let buttonBg = "#FF932E";
  let buttonText = "Clock in";
  let buttonTextColor = "#fff";
  let statusLabel = "";
  if (isEnRoute) {
    buttonBg = "#2563EB";
    buttonText = "Child Picked Up";
    buttonTextColor = "#fff";
    statusLabel = "Trip In Progress";
  } else if (isPicked) {
    buttonBg = "#7C3AED";
    buttonText = "Complete Trip";
    buttonTextColor = "#fff";
    statusLabel = "Child Picked Up";
  } else if (isCompleted) {
    buttonBg = "#16A34A";
    buttonText = "Trip Completed";
    buttonTextColor = "#fff";
    statusLabel = "Trip Completed";
  }

  // Helper to format ISO date/time with timezone
  const formatTime = (iso?: string) => {
    if (!iso) return "-";
    try {
      const d = new Date(iso);
      const timeString = d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      // Get timezone abbreviation
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const timezoneAbbr =
        timezone.split("/").pop()?.substring(0, 3).toUpperCase() || "UTC";

      const dateString = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      return `${timeString} ${timezoneAbbr} • ${dateString}`;
    } catch (error) {
      return iso;
    }
  };

  // Helper to format date range for varying calls
  const formatDateRange = (start?: string | null, end?: string | null) => {
    if (!start || !end) return null;
    try {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const startFormatted = startDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      const endFormatted = endDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      return `${startFormatted} - ${endFormatted}`;
    } catch (error) {
      return `${start} - ${end}`;
    }
  };

  // Helper to get call type display text and color
  const getTypeDisplayText = (type?: string) => {
    if (!type) return "One-time";
    return type === "repetitive" ? "Ongoing" : "One-time";
  };

  const getTypeColor = (type?: string) => {
    if (!type) return "#7C3AED";
    return type === "repetitive" ? "#059669" : "#7C3AED";
  };

  return (
    <View
      className="rounded-2xl p-4 mr-3 border"
      style={{
        width: cardWidth,
        minWidth: cardWidth,
        maxWidth: cardWidth,
        backgroundColor: cardBg,
        borderColor: "#E8E8E8",
      }}
    >
      {/* Header with Call Type Badge */}
      <View className="flex-row justify-between items-start mb-3">
        <Text
          className="text-base font-comfortaa-bold flex-1 mr-3"
          style={{ color: textColor }}
        >
          {name}
        </Text>
        {callType && (
          <View
            className="px-3 py-1 rounded-xl"
            style={{ backgroundColor: getTypeColor(callType) + "20" }}
          >
            <Text
              className="font-comfortaa-bold text-xs"
              style={{ color: getTypeColor(callType) }}
            >
              {getTypeDisplayText(callType)}
            </Text>
          </View>
        )}
      </View>

      {/* Time and Days Section */}
      <View className="mb-4">
        <View className="flex-row items-center mb-2">
          <Ionicons name="time-outline" size={16} color={"#2563EB"} />
          <Text
            className="ml-2 font-comfortaa-bold text-base"
            style={{ color: "#2563EB" }}
          >
            Pickup: {formatTime(time)}
          </Text>
        </View>

        {/* Drop-off time below pickup time */}
        <View className="flex-row items-center mb-3">
          <Ionicons name="time-outline" size={16} color={"#059669"} />
          <Text
            className="ml-2 font-comfortaa text-sm"
            style={{ color: "#059669" }}
          >
            Drop-off: {formatTime(dropoffTime)}
          </Text>
        </View>

        {/* Available Days */}
        <View className="flex-row items-center mb-2">
          <Ionicons name="calendar-outline" size={16} color={"#666"} />
          <Text
            className="ml-2 font-comfortaa-bold text-sm"
            style={{ color: textColor }}
          >
            Available Days:
          </Text>
        </View>
        <View className="flex-row flex-wrap gap-1 mb-3">
          {days.split(",").map((day, index) => (
            <View
              key={index}
              className="px-2 py-1 rounded-lg"
              style={{ backgroundColor: "#E8F4FD" }}
            >
              <Text
                className="font-comfortaa text-xs"
                style={{ color: "#2563EB" }}
              >
                {day.trim()}
              </Text>
            </View>
          ))}
        </View>

        {/* Date Range for Varying Calls */}
        {callType === "varying" && startDate && endDate && (
          <View className="mb-3">
            <View className="flex-row items-center mb-2">
              <Ionicons name="calendar" size={16} color={"#7C3AED"} />
              <Text
                className="ml-2 font-comfortaa-bold text-sm"
                style={{ color: "#7C3AED" }}
              >
                Date Range:
              </Text>
            </View>
            <Text
              className="ml-6 font-comfortaa text-sm"
              style={{ color: "#7C3AED" }}
            >
              {formatDateRange(startDate, endDate)}
            </Text>
          </View>
        )}
      </View>

      {/* Location and Kids Information */}
      <View className="mb-4">
        <View className="flex-row items-center mb-2">
          <Ionicons name="school" size={16} color={"#666"} />
          <Text
            className="ml-2 font-comfortaa text-sm"
            style={{ color: subTextColor }}
          >
            From: {fromZone || school}
          </Text>
        </View>
        <View className="flex-row items-center mb-2">
          <Ionicons name="home" size={16} color={"#666"} />
          <Text
            className="ml-2 font-comfortaa text-sm"
            style={{ color: subTextColor }}
          >
            To: {toZone || home}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="people-outline" size={16} color={"#666"} />
          <Text
            className="ml-2 font-comfortaa text-sm"
            style={{ color: subTextColor }}
          >
            Kids: {kidsCount || 0}
          </Text>
        </View>
      </View>

      {/* Trip Details Section: only show if trip is started */}
      {status !== "notStarted" && (
        <View style={{ marginBottom: 10 }}>
          <Text
            style={{
              fontFamily: "Comfortaa-Bold",
              fontSize: 13,
              color: "#232B3A",
              marginBottom: 2,
            }}
          >
            Trip Details
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            <Text
              style={{
                fontFamily: "Comfortaa-Regular",
                fontSize: 12,
                color: "#71727A",
                marginRight: 12,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>Status:</Text> {statusLabel}
            </Text>
            <Text
              style={{
                fontFamily: "Comfortaa-Regular",
                fontSize: 12,
                color: "#71727A",
                marginRight: 12,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>Pickup Time:</Text>{" "}
              {formatTime(pickupTime)}
            </Text>
            <Text
              style={{
                fontFamily: "Comfortaa-Regular",
                fontSize: 12,
                color: "#71727A",
                marginRight: 12,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>Trip Start:</Text>{" "}
              {formatTime(tripStartTime)}
            </Text>
            <Text
              style={{
                fontFamily: "Comfortaa-Regular",
                fontSize: 12,
                color: "#71727A",
                marginRight: 12,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>Dropoff Time:</Text>{" "}
              {formatTime(dropoffTime)}
            </Text>
            {typeof fare === "number" && (
              <Text
                style={{
                  fontFamily: "Comfortaa-Regular",
                  fontSize: 12,
                  color: "#71727A",
                  marginRight: 12,
                }}
              >
                <Text style={{ fontWeight: "bold" }}>Fare:</Text> {fare}
              </Text>
            )}
          </View>
        </View>
      )}

      {statusLabel ? (
        <View style={{ marginBottom: 12 }}>
          <Text
            className="font-comfortaa-bold text-base"
            style={{ color: isEnRoute ? "#fff" : "#2563EB" }}
          >
            {statusLabel}
          </Text>
        </View>
      ) : null}

      <View className="flex-row justify-between items-center">
        <TouchableOpacity
          className="flex-row items-center bg-[#F5F5F5] py-2 px-3 rounded-xl"
          onPress={handleViewDetails}
        >
          <Text className="text-[#71727A] font-comfortaa text-sm mr-1">
            View Details
          </Text>
          <Ionicons name="chevron-forward" size={16} color="#666" />
        </TouchableOpacity>

        {isEnRoute ? (
          <TouchableOpacity
            className="py-2.5 px-6 rounded-xl flex-row items-center gap-2"
            style={{ backgroundColor: buttonBg }}
            onPress={onPickUp}
          >
            <Ionicons name="walk-outline" size={18} color={buttonTextColor} />
            <Text
              className="font-comfortaa-medium text-sm"
              style={{ color: buttonTextColor }}
            >
              {buttonText}
            </Text>
          </TouchableOpacity>
        ) : isPicked ? (
          <TouchableOpacity
            className="py-2.5 px-6 rounded-xl flex-row items-center gap-2"
            style={{ backgroundColor: buttonBg }}
            onPress={onClockOut}
          >
            <Ionicons
              name="log-out-outline"
              size={18}
              color={buttonTextColor}
            />
            <Text
              className="font-comfortaa-medium text-sm"
              style={{ color: buttonTextColor }}
            >
              {buttonText}
            </Text>
          </TouchableOpacity>
        ) : isCompleted ? (
          <TouchableOpacity
            className="py-2.5 px-6 rounded-xl flex-row items-center gap-2"
            style={{ backgroundColor: buttonBg, opacity: 0.7 }}
            disabled
          >
            <Ionicons
              name="checkmark-done-outline"
              size={18}
              color={buttonTextColor}
            />
            <Text
              className="font-comfortaa-medium text-sm"
              style={{ color: buttonTextColor }}
            >
              {buttonText}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className="py-2.5 px-6 rounded-xl flex-row items-center gap-2"
            style={{ backgroundColor: buttonBg }}
            onPress={onButtonPress}
          >
            <Ionicons name="time-outline" size={18} color={buttonTextColor} />
            <Text
              className="font-comfortaa-medium text-sm"
              style={{ color: buttonTextColor }}
            >
              {buttonText}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default PickupCard;
