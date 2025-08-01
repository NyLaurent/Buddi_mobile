import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import BuddiService from "../../services/api/buddi.service";

interface AvailableCallsCardProps {
  onApplyPress: () => void;
  availableCalls?: number;
  matchedCall?: any;
  onViewMatchedCall?: (callId: number) => void;
}

export default function AvailableCallsCard({
  onApplyPress,
  availableCalls = 8,
  matchedCall = null,
  onViewMatchedCall,
}: AvailableCallsCardProps) {
  const [analytics, setAnalytics] = useState({
    totalCalls: 0,
    availableCalls: 0,
    matchedCalls: 0,
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await BuddiService.getAvailableCalls(1, 5);
        const calls = response.data;
        setAnalytics({
          totalCalls: response.totalRecords,
          availableCalls: calls.filter((call) => call.status === "pending")
            .length,
          matchedCalls: calls.filter((call) => call.status === "matched")
            .length,
        });
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <View
      style={{
        borderRadius: 18,
        marginTop: 18,
        marginBottom: 10,
        marginHorizontal: 16,
        overflow: "hidden",
        shadowColor: "#FF932E",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 4,
      }}
    >
      <LinearGradient
        colors={["#FF932E", "#FFB86C"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 20, borderRadius: 18 }}
      >
        {matchedCall ? (
          <>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <FontAwesome5
                name="check-circle"
                size={28}
                color="#fff"
                style={{ marginRight: 12 }}
              />
              <Text
                style={{
                  color: "#fff",
                  fontFamily: "Comfortaa-Bold",
                  fontSize: 18,
                  flex: 1,
                }}
              >
                You have a matched call!
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 20,
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                borderRadius: 12,
                padding: 16,
              }}
            >
              <View style={{ alignItems: "center", flex: 1 }}>
                <FontAwesome5 name="check-circle" size={16} color="#fff" />
                <Text
                  style={{
                    color: "#fff",
                    fontFamily: "Comfortaa-Bold",
                    fontSize: 20,
                    marginTop: 4,
                  }}
                >
                  {matchedCall.availableDays?.length || 0}
                </Text>
                <Text
                  style={{
                    color: "#fff",
                    fontFamily: "Comfortaa-Regular",
                    fontSize: 11,
                    opacity: 0.9,
                  }}
                >
                  Days
                </Text>
              </View>
              <View
                style={{
                  width: 1,
                  height: 40,
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                }}
              />
              <View style={{ alignItems: "center", flex: 1 }}>
                <FontAwesome5 name="child" size={16} color="#fff" />
                <Text
                  style={{
                    color: "#fff",
                    fontFamily: "Comfortaa-Bold",
                    fontSize: 20,
                    marginTop: 4,
                  }}
                >
                  {matchedCall.kidsCount || 0}
                </Text>
                <Text
                  style={{
                    color: "#fff",
                    fontFamily: "Comfortaa-Regular",
                    fontSize: 11,
                    opacity: 0.9,
                  }}
                >
                  Kids
                </Text>
              </View>
            </View>
            <Text
              style={{
                color: "#fff",
                fontFamily: "Comfortaa-Regular",
                fontSize: 15,
                marginBottom: 18,
              }}
            >
              You&apos;ve been matched to a pickup request. View details and get
              ready!
            </Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 999,
                  paddingVertical: 7,
                  paddingHorizontal: 14,
                  flexDirection: "row",
                  alignItems: "center",
                  shadowColor: "#FF932E",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.12,
                  shadowRadius: 6,
                  elevation: 2,
                  marginRight: 4,
                  flex: 1,
                }}
                onPress={() => onViewMatchedCall?.(matchedCall.id)}
                activeOpacity={0.85}
              >
                <FontAwesome5
                  name="eye"
                  size={14}
                  color="#FF932E"
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={{
                    color: "#FF932E",
                    fontFamily: "Comfortaa-Bold",
                    fontSize: 12,
                  }}
                >
                  View Call Details
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: matchedCall ? "#f2f2f2" : "#fff",
                  borderRadius: 999,
                  paddingVertical: 7,
                  paddingHorizontal: 14,
                  flexDirection: "row",
                  alignItems: "center",
                  shadowColor: matchedCall ? undefined : "#FF932E",
                  shadowOffset: matchedCall
                    ? undefined
                    : { width: 0, height: 2 },
                  shadowOpacity: matchedCall ? undefined : 0.12,
                  shadowRadius: matchedCall ? undefined : 6,
                  elevation: matchedCall ? 0 : 2,
                  flex: 1,
                  opacity: matchedCall ? 0.5 : 1,
                }}
                onPress={matchedCall ? undefined : onApplyPress}
                activeOpacity={matchedCall ? 1 : 0.85}
                disabled={!!matchedCall}
              >
                <FontAwesome5
                  name="search"
                  size={14}
                  color="#FF932E"
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={{
                    color: "#FF932E",
                    fontFamily: "Comfortaa-Bold",
                    fontSize: 12,
                  }}
                >
                  Apply Now
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <FontAwesome5
                name="hand-holding-heart"
                size={28}
                color="#fff"
                style={{ marginRight: 12 }}
              />
              <Text
                style={{
                  color: "#fff",
                  fontFamily: "Comfortaa-Bold",
                  fontSize: 18,
                  flex: 1,
                }}
              >
                New Pickups Requests Available!
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 20,
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                borderRadius: 12,
                padding: 16,
              }}
            >
              <View style={{ alignItems: "center", flex: 1 }}>
                <FontAwesome5
                  name="hand-holding-heart"
                  size={16}
                  color="#fff"
                />
                <Text
                  style={{
                    color: "#fff",
                    fontFamily: "Comfortaa-Bold",
                    fontSize: 20,
                    marginTop: 4,
                  }}
                >
                  {analytics.totalCalls}
                </Text>
                <Text
                  style={{
                    color: "#fff",
                    fontFamily: "Comfortaa-Regular",
                    fontSize: 11,
                    opacity: 0.9,
                  }}
                >
                  Total Calls
                </Text>
              </View>
              <View
                style={{
                  width: 1,
                  height: 40,
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                }}
              />
              <View style={{ alignItems: "center", flex: 1 }}>
                <FontAwesome5 name="clock" size={16} color="#fff" />
                <Text
                  style={{
                    color: "#fff",
                    fontFamily: "Comfortaa-Bold",
                    fontSize: 20,
                    marginTop: 4,
                  }}
                >
                  {analytics.availableCalls}
                </Text>
                <Text
                  style={{
                    color: "#fff",
                    fontFamily: "Comfortaa-Regular",
                    fontSize: 11,
                    opacity: 0.9,
                  }}
                >
                  Available
                </Text>
              </View>
              <View
                style={{
                  width: 1,
                  height: 40,
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                }}
              />
              <View style={{ alignItems: "center", flex: 1 }}>
                <FontAwesome5 name="check-circle" size={16} color="#fff" />
                <Text
                  style={{
                    color: "#fff",
                    fontFamily: "Comfortaa-Bold",
                    fontSize: 20,
                    marginTop: 4,
                  }}
                >
                  {analytics.matchedCalls}
                </Text>
                <Text
                  style={{
                    color: "#fff",
                    fontFamily: "Comfortaa-Regular",
                    fontSize: 11,
                    opacity: 0.9,
                  }}
                >
                  Matched
                </Text>
              </View>
            </View>

            <Text
              style={{
                color: "#fff",
                fontFamily: "Comfortaa-Regular",
                fontSize: 15,
                marginBottom: 18,
              }}
            >
              {analytics.availableCalls} pickup requests are waiting for you.
              Apply now to start earning!
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "#fff",
                borderRadius: 999,
                paddingVertical: 7,
                paddingHorizontal: 14,
                alignSelf: "flex-start",
                flexDirection: "row",
                alignItems: "center",
                shadowColor: "#FF932E",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.12,
                shadowRadius: 6,
                elevation: 2,
              }}
              onPress={onApplyPress}
              activeOpacity={0.85}
            >
              <FontAwesome5
                name="search"
                size={14}
                color="#FF932E"
                style={{ marginRight: 6 }}
              />
              <Text
                style={{
                  color: "#FF932E",
                  fontFamily: "Comfortaa-Bold",
                  fontSize: 12,
                }}
              >
                Apply Now
              </Text>
            </TouchableOpacity>
          </>
        )}
      </LinearGradient>
    </View>
  );
}
