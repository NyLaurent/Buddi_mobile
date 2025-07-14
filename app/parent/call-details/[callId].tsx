import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../../context/AuthContext";
import { ChildrenService } from "../../../services/api";
import ParentService, {
  ParentPickupRequest,
} from "../../../services/api/parent.service";

export default function CallDetailsPage() {
  const params = useLocalSearchParams<{ callId: string }>();
  const callId = params.callId;
  const { parentDetails } = useAuth();
  const router = useRouter();
  const [callDetails, setCallDetails] =
    React.useState<ParentPickupRequest | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [childDetails, setChildDetails] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchCallDetails = async () => {
      if (!callId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await ParentService.getParentRequestDetails(
          parseInt(callId as string)
        );
        setCallDetails(res.data);

        // Fetch child details if we have childId
        if (res.data.childId) {
          try {
            const childRes = await ChildrenService.getChildrenByParent(
              parentDetails?.id?.toString() || ""
            );
            const child = Array.isArray(childRes)
              ? childRes.find((c) => c.id === res.data.childId)
              : null;
            setChildDetails(child);
          } catch (err) {
            console.log("Could not fetch child details:", err);
          }
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch call details.");
      } finally {
        setLoading(false);
      }
    };
    fetchCallDetails();
  }, [callId, parentDetails?.id]);

  // Helper to calculate how long ago a date was
  function getRequestedAgo(dateString: string) {
    const now = new Date();
    const created = new Date(dateString);
    const diffMs = now.getTime() - created.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  }

  // Helper for status icon and color
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <FontAwesome5
            name="hourglass-half"
            size={20}
            color="#FF932E"
            style={{ marginRight: 8 }}
          />
        );
      case "matched":
        return (
          <FontAwesome5
            name="user-friends"
            size={20}
            color="#22C55E"
            style={{ marginRight: 8 }}
          />
        );
      case "completed":
        return (
          <FontAwesome5
            name="check-circle"
            size={20}
            color="#3B82F6"
            style={{ marginRight: 8 }}
          />
        );
      default:
        return (
          <FontAwesome5
            name="info-circle"
            size={20}
            color="#6B7280"
            style={{ marginRight: 8 }}
          />
        );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#FF932E";
      case "matched":
        return "#22C55E";
      case "completed":
        return "#3B82F6";
      default:
        return "#6B7280";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "matched":
        return "Matched";
      case "completed":
        return "Completed";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontFamily: "Comfortaa-Regular", color: "#6B7280" }}>
          Loading call details...
        </Text>
      </View>
    );
  }

  if (error || !callDetails) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 32,
        }}
      >
        <View style={{ alignItems: "center", marginBottom: 24 }}>
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: "#F4F7FE",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <FontAwesome5
              name="exclamation-triangle"
              size={48}
              color="#9CA3AF"
            />
          </View>
          <Text
            style={{
              fontFamily: "Comfortaa-Bold",
              fontSize: 20,
              color: "#1F2937",
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            Call Not Found
          </Text>
          <Text
            style={{
              fontFamily: "Comfortaa-Regular",
              fontSize: 16,
              color: "#6B7280",
              textAlign: "center",
              lineHeight: 24,
            }}
          >
            {error || "Unable to load call details. Please try again."}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: "#FF932E",
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
          }}
          onPress={() => router.back()}
        >
          <Text
            style={{
              fontFamily: "Comfortaa-Bold",
              fontSize: 16,
              color: "#fff",
            }}
          >
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: 40 }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 16,
          paddingHorizontal: 16,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginRight: 12 }}
        >
          <Ionicons name="arrow-back" size={24} color="#FF932E" />
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: "Comfortaa-Bold",
            fontSize: 22,
            color: "#FF932E",
          }}
        >
          Call Details
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {/* Status Card */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "#E6E6E6",
            padding: 20,
            marginBottom: 16,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            {getStatusIcon(callDetails.status)}
            <Text
              style={{
                fontFamily: "Comfortaa-Bold",
                fontSize: 18,
                color: "#1F2937",
              }}
            >
              Call Status
            </Text>
          </View>
          <View
            style={{
              backgroundColor: `${getStatusColor(callDetails.status)}15`,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 8,
              alignSelf: "flex-start",
            }}
          >
            <Text
              style={{
                fontFamily: "Comfortaa-Bold",
                fontSize: 14,
                color: getStatusColor(callDetails.status),
              }}
            >
              {getStatusText(callDetails.status)}
            </Text>
          </View>
          <Text
            style={{
              fontFamily: "Comfortaa-Regular",
              fontSize: 12,
              color: "#6B7280",
              marginTop: 8,
            }}
          >
            Requested {getRequestedAgo(callDetails.createdAt)}
          </Text>
        </View>

        {/* Child Information */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "#E6E6E6",
            padding: 20,
            marginBottom: 16,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <FontAwesome5
              name="child"
              size={20}
              color="#FF932E"
              style={{ marginRight: 8 }}
            />
            <Text
              style={{
                fontFamily: "Comfortaa-Bold",
                fontSize: 18,
                color: "#1F2937",
              }}
            >
              Child Information
            </Text>
          </View>
          {childDetails ? (
            <View>
              <View style={{ marginBottom: 12 }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#BDBDBD",
                    fontFamily: "Comfortaa-Regular",
                  }}
                >
                  Name
                </Text>
                <Text
                  style={{
                    fontFamily: "Comfortaa-Bold",
                    fontSize: 16,
                    color: "#222",
                    marginTop: 4,
                  }}
                >
                  {childDetails.name}
                </Text>
              </View>
              <View style={{ marginBottom: 12 }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#BDBDBD",
                    fontFamily: "Comfortaa-Regular",
                  }}
                >
                  Age
                </Text>
                <Text
                  style={{
                    fontFamily: "Comfortaa-Bold",
                    fontSize: 16,
                    color: "#222",
                    marginTop: 4,
                  }}
                >
                  {childDetails.age} years old
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#BDBDBD",
                    fontFamily: "Comfortaa-Regular",
                  }}
                >
                  School
                </Text>
                <Text
                  style={{
                    fontFamily: "Comfortaa-Bold",
                    fontSize: 16,
                    color: "#222",
                    marginTop: 4,
                  }}
                >
                  {childDetails.school}
                </Text>
              </View>
            </View>
          ) : (
            <Text
              style={{
                fontFamily: "Comfortaa-Regular",
                fontSize: 14,
                color: "#6B7280",
              }}
            >
              Child information not available
            </Text>
          )}
        </View>

        {/* Request Details */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "#E6E6E6",
            padding: 20,
            marginBottom: 16,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <FontAwesome5
              name="clipboard-list"
              size={20}
              color="#FF932E"
              style={{ marginRight: 8 }}
            />
            <Text
              style={{
                fontFamily: "Comfortaa-Bold",
                fontSize: 18,
                color: "#1F2937",
              }}
            >
              Request Details
            </Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 12,
                color: "#BDBDBD",
                fontFamily: "Comfortaa-Regular",
              }}
            >
              Description
            </Text>
            <Text
              style={{
                fontFamily: "Comfortaa-Regular",
                fontSize: 16,
                color: "#222",
                marginTop: 4,
                lineHeight: 24,
              }}
            >
              {callDetails.description}
            </Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 12,
                color: "#BDBDBD",
                fontFamily: "Comfortaa-Regular",
              }}
            >
              Pickup Time
            </Text>
            <Text
              style={{
                fontFamily: "Comfortaa-Bold",
                fontSize: 16,
                color: "#222",
                marginTop: 4,
              }}
            >
              {callDetails.pickupTime}
            </Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 12,
                color: "#BDBDBD",
                fontFamily: "Comfortaa-Regular",
              }}
            >
              Number of Kids
            </Text>
            <Text
              style={{
                fontFamily: "Comfortaa-Bold",
                fontSize: 16,
                color: "#222",
                marginTop: 4,
              }}
            >
              {callDetails.kidsCount}{" "}
              {callDetails.kidsCount === 1 ? "child" : "children"}
            </Text>
          </View>

          {callDetails.availableDays &&
            callDetails.availableDays.length > 0 && (
              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#BDBDBD",
                    fontFamily: "Comfortaa-Regular",
                  }}
                >
                  Available Days
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    marginTop: 4,
                  }}
                >
                  {callDetails.availableDays.map((day, index) => (
                    <View
                      key={index}
                      style={{
                        backgroundColor: "#F4F7FE",
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        marginRight: 8,
                        marginBottom: 8,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Comfortaa-Bold",
                          fontSize: 12,
                          color: "#3B82F6",
                        }}
                      >
                        {day}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
        </View>

        {/* Location Details */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "#E6E6E6",
            padding: 20,
            marginBottom: 16,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <FontAwesome5
              name="map-marker-alt"
              size={20}
              color="#FF932E"
              style={{ marginRight: 8 }}
            />
            <Text
              style={{
                fontFamily: "Comfortaa-Bold",
                fontSize: 18,
                color: "#1F2937",
              }}
            >
              Location Details
            </Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <Ionicons
                name="school"
                size={18}
                color="#22C55E"
                style={{ marginRight: 8 }}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: "#BDBDBD",
                  fontFamily: "Comfortaa-Regular",
                }}
              >
                Pickup Location (School)
              </Text>
            </View>
            <Text
              style={{
                fontFamily: "Comfortaa-Bold",
                fontSize: 16,
                color: "#222",
                marginLeft: 26,
              }}
            >
              {callDetails.fromZone}
            </Text>
          </View>

          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <FontAwesome5
                name="home"
                size={18}
                color="#FF9100"
                style={{ marginRight: 8 }}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: "#BDBDBD",
                  fontFamily: "Comfortaa-Regular",
                }}
              >
                Drop-off Location (Home)
              </Text>
            </View>
            <Text
              style={{
                fontFamily: "Comfortaa-Bold",
                fontSize: 16,
                color: "#222",
                marginLeft: 26,
              }}
            >
              {callDetails.toZone}
            </Text>
          </View>
        </View>

        {/* Matched Buddi Information */}
        {callDetails.matchedBuddiId && (
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#E6E6E6",
              padding: 20,
              marginBottom: 16,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <FontAwesome5
                name="user-friends"
                size={20}
                color="#22C55E"
                style={{ marginRight: 8 }}
              />
              <Text
                style={{
                  fontFamily: "Comfortaa-Bold",
                  fontSize: 18,
                  color: "#1F2937",
                }}
              >
                Matched Buddi
              </Text>
            </View>
            <View
              style={{
                backgroundColor: "#F0FDF4",
                borderRadius: 12,
                padding: 16,
                borderWidth: 1,
                borderColor: "#22C55E",
              }}
            >
              <Text
                style={{
                  fontFamily: "Comfortaa-Bold",
                  fontSize: 16,
                  color: "#22C55E",
                  marginBottom: 4,
                }}
              >
                Buddi ID: {callDetails.matchedBuddiId}
              </Text>
              <Text
                style={{
                  fontFamily: "Comfortaa-Regular",
                  fontSize: 14,
                  color: "#6B7280",
                  marginBottom: 8,
                }}
              >
                Successfully matched with a buddi for this request.
              </Text>
              <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#22C55E",
                    borderRadius: 8,
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    // TODO: Navigate to buddi profile
                    console.log(
                      "View matched buddi profile:",
                      callDetails.matchedBuddiId
                    );
                  }}
                >
                  <FontAwesome5
                    name="user"
                    size={12}
                    color="#fff"
                    style={{ marginRight: 4 }}
                  />
                  <Text
                    style={{
                      fontFamily: "Comfortaa-Bold",
                      fontSize: 14,
                      color: "#fff",
                    }}
                  >
                    View Profile
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    backgroundColor: "#3B82F6",
                    borderRadius: 8,
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    // Navigate to chat with buddi
                    const chatRoomId = `${callDetails.parentId}-${callDetails.matchedBuddiId}`;
                    router.push({
                      pathname: "/parent/chat/[roomId]",
                      params: {
                        roomId: chatRoomId,
                        buddiName: "Buddi", // You can get this from API if needed
                        buddiAvatar:
                          "https://randomuser.me/api/portraits/men/32.jpg",
                      },
                    });
                  }}
                >
                  <FontAwesome5
                    name="comments"
                    size={12}
                    color="#fff"
                    style={{ marginRight: 4 }}
                  />
                  <Text
                    style={{
                      fontFamily: "Comfortaa-Bold",
                      fontSize: 14,
                      color: "#fff",
                    }}
                  >
                    Message Buddi
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={{ flexDirection: "row", gap: 12, marginTop: 24 }}>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "#fff",
              borderRadius: 12,
              paddingVertical: 14,
              paddingHorizontal: 20,
              alignItems: "center",
              borderWidth: 1.5,
              borderColor: "#E5E7EB",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            }}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="arrow-back"
                size={16}
                color="#6B7280"
                style={{ marginRight: 6 }}
              />
              <Text
                style={{
                  fontFamily: "Comfortaa-Bold",
                  fontSize: 14,
                  color: "#6B7280",
                }}
              >
                Back to Calls
              </Text>
            </View>
          </TouchableOpacity>

          {callDetails.status === "matched" && (
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "#FF932E",
                borderRadius: 12,
                paddingVertical: 14,
                paddingHorizontal: 20,
                alignItems: "center",
                shadowColor: "#FF932E",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 4,
              }}
              onPress={() => {
                router.push({
                  pathname: "/parent/buddi-recommendations/[callId]",
                  params: { callId: callDetails.id.toString() },
                });
              }}
              activeOpacity={0.85}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FontAwesome5
                  name="users"
                  size={14}
                  color="#fff"
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={{
                    fontFamily: "Comfortaa-Bold",
                    fontSize: 14,
                    color: "#fff",
                  }}
                >
                  View Recommendations
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
