import AnalyticsCard from "@/components/commons/AnalyticsCard";
import PageHeader from "@/components/commons/PageHeader";
import { useAuth } from "@/context/AuthContext";
import ParentService from "@/services/api/parent.service";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MyBuddyPage = () => {
  const router = useRouter();
  const { parentDetails } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for analytics data
  const [pickupRequests, setPickupRequests] = useState<any[]>([]);
  const [coverageRequests, setCoverageRequests] = useState<any[]>([]);
  const [coveragePagination, setCoveragePagination] = useState({
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 1,
  });

  // Function to fetch coverage requests
  const fetchCoverageRequests = async () => {
    if (!parentDetails?.id) return;
    try {
      const response = await ParentService.getCoverageRequests(
        parentDetails.id.toString(),
        1,
        5
      );
      setCoverageRequests(response.data || []);
      setCoveragePagination(
        response.pagination || {
          total: 0,
          page: 1,
          limit: 5,
          totalPages: 1,
        }
      );
    } catch (err: any) {
      console.error("Failed to fetch coverage requests:", err);
    }
  };

  useEffect(() => {
    const fetchBuddies = async () => {
      if (!parentDetails?.id) return;
      setLoading(true);
      setError(null);
      try {
        // Get all pickup requests for this parent
        const requestsRes = await ParentService.getMyPickupRequests(
          parentDetails.id.toString()
        );
        const requests = requestsRes.data || [];
        setPickupRequests(requests);

        // Fetch coverage requests
        await fetchCoverageRequests();
      } catch (err: any) {
        setError(err.message || "Failed to fetch buddies");
      } finally {
        setLoading(false);
      }
    };
    fetchBuddies();
  }, [parentDetails?.id]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff" }}
      edges={["top", "left", "right"]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <ScrollView
        className="flex-1 bg-white"
        contentContainerStyle={{
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="pt-12">
          <PageHeader title="My Buddi" />
          <View className="px-4 mb-6">
            <View className="flex-row gap-3">
              {/* Today's Pickups */}
              <View className="w-[48%]">
                <AnalyticsCard
                  icon={<Ionicons name="calendar" size={20} color="#FF932E" />}
                  title="Today's Pickups"
                  value={pickupRequests
                    .filter((p) => p.status === "matched")
                    .length.toString()}
                  subtitle="Scheduled"
                />
              </View>

              {/* Coverage Requests */}
              <View className="w-[48%]">
                <AnalyticsCard
                  icon={
                    <Ionicons name="shield-outline" size={20} color="#3B82F6" />
                  }
                  title="Coverage Requests"
                  value={coveragePagination.total.toString()}
                  subtitle={`${
                    coverageRequests.filter((cr) => cr.status === "pending")
                      .length
                  } Active`}
                />
              </View>
            </View>
          </View>
          <View className="px-4 mt-6">
            <TouchableOpacity
              className="bg-primary rounded-full py-4 items-center flex-row justify-center"
              activeOpacity={0.8}
              onPress={() => router.push("/parent/timesheets" as any)}
            >
              <Text className="text-white font-comfortaa-bold text-lg mr-2">
                View Timesheets
              </Text>
              <Ionicons name="arrow-forward" size={22} color="white" />
            </TouchableOpacity>
          </View>
          <View className="px-4 mt-6">
            <Text className="text-lg font-comfortaa-bold mb-3">
              My Requests & Buddies
            </Text>
            {loading ? (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  paddingVertical: 40,
                }}
              >
                <ActivityIndicator size="large" color="#FF932E" />
                <Text
                  style={{
                    marginTop: 12,
                    color: "#666",
                    fontFamily: "Comfortaa-Regular",
                    fontSize: 16,
                  }}
                >
                  Loading your requests...
                </Text>
              </View>
            ) : error ? (
              <Text style={{ color: "red" }}>{error}</Text>
            ) : pickupRequests.length === 0 ? (
              <View
                style={{
                  backgroundColor: "#F9FAFB",
                  borderRadius: 16,
                  padding: 40,
                  alignItems: "center",
                }}
              >
                <Ionicons
                  name="document-text-outline"
                  size={48}
                  color="#9CA3AF"
                />
                <Text
                  style={{
                    fontFamily: "Comfortaa-Bold",
                    fontSize: 16,
                    color: "#374151",
                    marginTop: 12,
                    textAlign: "center",
                  }}
                >
                  No Requests Yet
                </Text>
                <Text
                  style={{
                    fontFamily: "Comfortaa-Regular",
                    fontSize: 14,
                    color: "#6B7280",
                    marginTop: 8,
                    textAlign: "center",
                    lineHeight: 20,
                  }}
                >
                  You haven&apos;t created any pickup requests yet.
                </Text>
              </View>
            ) : (
              <View style={{ gap: 16 }}>
                {pickupRequests.map((request) => (
                  <View
                    key={request.id}
                    style={{
                      backgroundColor: "#F9FAFB",
                      borderRadius: 16,
                      padding: 16,
                      borderWidth: 1,
                      borderColor:
                        request.status === "matched" ? "#10B981" : "#E5E7EB",
                    }}
                  >
                    {/* Request Header */}
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 12,
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontFamily: "Comfortaa-Bold",
                            fontSize: 16,
                            color: "#1F2937",
                            marginBottom: 4,
                          }}
                        >
                          {request.description}
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <View
                            style={{
                              backgroundColor:
                                request.status === "matched"
                                  ? "#D1FAE5"
                                  : request.status === "pending"
                                  ? "#FEF3C7"
                                  : "#FEE2E2",
                              paddingHorizontal: 8,
                              paddingVertical: 4,
                              borderRadius: 12,
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: "Comfortaa-Bold",
                                fontSize: 12,
                                color:
                                  request.status === "matched"
                                    ? "#065F46"
                                    : request.status === "pending"
                                    ? "#92400E"
                                    : "#991B1B",
                                textTransform: "capitalize",
                              }}
                            >
                              {request.status}
                            </Text>
                          </View>
                          <Text
                            style={{
                              fontFamily: "Comfortaa-Regular",
                              fontSize: 12,
                              color: "#6B7280",
                            }}
                          >
                            {request.type}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        onPress={() =>
                          router.push(
                            `/parent/buddi-recommendations/${request.id}`
                          )
                        }
                        style={{
                          backgroundColor: "#FF932E",
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          borderRadius: 8,
                        }}
                      >
                        <Text
                          style={{
                            color: "#fff",
                            fontFamily: "Comfortaa-Bold",
                            fontSize: 12,
                          }}
                        >
                          {request.status === "matched"
                            ? "View Details"
                            : "View Recommendations"}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Request Details */}
                    <View style={{ marginBottom: 12 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginBottom: 4,
                        }}
                      >
                        <Ionicons name="calendar" size={14} color="#6B7280" />
                        <Text
                          style={{
                            fontFamily: "Comfortaa-Regular",
                            fontSize: 12,
                            color: "#6B7280",
                            marginLeft: 6,
                          }}
                        >
                          {request.availableDays.join(", ")}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginBottom: 4,
                        }}
                      >
                        <Ionicons name="people" size={14} color="#6B7280" />
                        <Text
                          style={{
                            fontFamily: "Comfortaa-Regular",
                            fontSize: 12,
                            color: "#6B7280",
                            marginLeft: 6,
                          }}
                        >
                          {request.kidsCount} kid
                          {request.kidsCount !== 1 ? "s" : ""}
                        </Text>
                      </View>
                      {request.startDate && request.endDate && (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <Ionicons name="time" size={14} color="#6B7280" />
                          <Text
                            style={{
                              fontFamily: "Comfortaa-Regular",
                              fontSize: 12,
                              color: "#6B7280",
                              marginLeft: 6,
                            }}
                          >
                            {new Date(request.startDate).toLocaleDateString()} -{" "}
                            {new Date(request.endDate).toLocaleDateString()}
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Matched Buddi Section */}
                    {request.status === "matched" && request.matchedBuddiId ? (
                      <View
                        style={{
                          backgroundColor: "#F0FDF4",
                          borderRadius: 12,
                          padding: 12,
                          borderWidth: 1,
                          borderColor: "#D1FAE5",
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: 8,
                          }}
                        >
                          <Ionicons
                            name="checkmark-circle"
                            size={16}
                            color="#10B981"
                          />
                          <Text
                            style={{
                              fontFamily: "Comfortaa-Bold",
                              fontSize: 14,
                              color: "#065F46",
                              marginLeft: 6,
                            }}
                          >
                            Matched Buddi
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <View style={{ flex: 1 }}>
                            <Text
                              style={{
                                fontFamily: "Comfortaa-Bold",
                                fontSize: 14,
                                color: "#1F2937",
                                marginBottom: 2,
                              }}
                            >
                              Buddi #{request.matchedBuddiId}
                            </Text>
                            <Text
                              style={{
                                fontFamily: "Comfortaa-Regular",
                                fontSize: 12,
                                color: "#6B7280",
                              }}
                            >
                              Successfully matched
                            </Text>
                          </View>
                          <TouchableOpacity
                            onPress={() =>
                              router.push(
                                `/parent/buddi-profile/${request.matchedBuddiId}`
                              )
                            }
                            style={{
                              backgroundColor: "#10B981",
                              paddingHorizontal: 12,
                              paddingVertical: 6,
                              borderRadius: 8,
                            }}
                          >
                            <Text
                              style={{
                                color: "#fff",
                                fontFamily: "Comfortaa-Bold",
                                fontSize: 12,
                              }}
                            >
                              View Profile
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : request.status === "pending" ? (
                      <View
                        style={{
                          backgroundColor: "#FEF3C7",
                          borderRadius: 12,
                          padding: 12,
                          borderWidth: 1,
                          borderColor: "#FDE68A",
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: 8,
                          }}
                        >
                          <Ionicons name="time" size={16} color="#F59E0B" />
                          <Text
                            style={{
                              fontFamily: "Comfortaa-Bold",
                              fontSize: 14,
                              color: "#92400E",
                              marginLeft: 6,
                            }}
                          >
                            Waiting for Recommendations
                          </Text>
                        </View>
                        <Text
                          style={{
                            fontFamily: "Comfortaa-Regular",
                            fontSize: 12,
                            color: "#92400E",
                          }}
                        >
                          Admins are reviewing your request and will recommend
                          suitable buddis soon.
                        </Text>
                      </View>
                    ) : null}

                    {/* Slots Information */}
                    {request.slots && request.slots.length > 0 && (
                      <View style={{ marginTop: 12 }}>
                        <Text
                          style={{
                            fontFamily: "Comfortaa-Bold",
                            fontSize: 12,
                            color: "#6B7280",
                            marginBottom: 8,
                          }}
                        >
                          Pickup Schedule
                        </Text>
                        {request.slots.slice(0, 2).map((slot: any) => (
                          <View
                            key={slot.id}
                            style={{
                              backgroundColor: "#fff",
                              borderRadius: 8,
                              padding: 8,
                              marginBottom: 6,
                              borderWidth: 1,
                              borderColor: "#E5E7EB",
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: "Comfortaa-Regular",
                                fontSize: 11,
                                color: "#374151",
                                marginBottom: 2,
                              }}
                            >
                              {slot.fromLocation} → {slot.toLocation}
                            </Text>
                            <Text
                              style={{
                                fontFamily: "Comfortaa-Regular",
                                fontSize: 10,
                                color: "#6B7280",
                              }}
                            >
                              {new Date(
                                slot.slotStartTime
                              ).toLocaleTimeString()}{" "}
                              -{" "}
                              {new Date(slot.slotEndTime).toLocaleTimeString()}
                            </Text>
                          </View>
                        ))}
                        {request.slots.length > 2 && (
                          <Text
                            style={{
                              fontFamily: "Comfortaa-Regular",
                              fontSize: 10,
                              color: "#6B7280",
                              textAlign: "center",
                              fontStyle: "italic",
                            }}
                          >
                            +{request.slots.length - 2} more slots
                          </Text>
                        )}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyBuddyPage;
