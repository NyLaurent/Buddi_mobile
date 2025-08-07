import PageHeader from "@/components/commons/PageHeader";
import CoverageRequestModal from "@/components/modals/CoverageRequestModal";
import CoverageRequestCard from "@/components/parent/CoverageRequestCard";
import { useAuth } from "@/context/AuthContext";
import BuddiService from "@/services/api/buddi.service";
import ParentService from "@/services/api/parent.service";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CoverageRequestsPage = () => {
  const router = useRouter();
  const { parentDetails } = useAuth();

  // State for coverage requests
  const [coverageRequests, setCoverageRequests] = React.useState<any[]>([]);
  const [coverageLoading, setCoverageLoading] = React.useState(false);
  const [coverageError, setCoverageError] = React.useState<string | null>(null);
  const [coveragePagination, setCoveragePagination] = React.useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  // State for pickup requests (to check if we can create coverage requests)
  const [pickupRequests, setPickupRequests] = React.useState<any[]>([]);
  const [buddiDetailsMap, setBuddiDetailsMap] = React.useState<
    Record<string, any>
  >({});

  // State for coverage request modal
  const [showCoverageModal, setShowCoverageModal] = React.useState(false);
  const [selectedBuddiId, setSelectedBuddiId] = React.useState<string | null>(
    null
  );
  const [selectedBuddiName, setSelectedBuddiName] = React.useState<string>("");

  // Function to fetch coverage requests
  const fetchCoverageRequests = async (page: number = 1) => {
    if (!parentDetails?.id) return;

    setCoverageLoading(true);
    setCoverageError(null);

    try {
      const response = await ParentService.getCoverageRequests(
        parentDetails.id.toString(),
        page,
        10
      );

      if (page === 1) {
        setCoverageRequests(response.data);
      } else {
        setCoverageRequests((prev) => [...prev, ...response.data]);
      }

      setCoveragePagination(response.pagination);
    } catch (err: any) {
      setCoverageError(err.message || "Failed to fetch coverage requests.");
    } finally {
      setCoverageLoading(false);
    }
  };

  // Function to fetch pickup requests to check for matched buddis
  const fetchPickupRequests = async () => {
    if (!parentDetails?.id) return;

    try {
      const res = await ParentService.getMyPickupRequests(
        parentDetails.id.toString()
      );
      const requests = res.data || [];
      setPickupRequests(requests);

      // Fetch buddi details for each matchedBuddiId
      const buddiIds = Array.from(
        new Set(requests.map((r: any) => r.matchedBuddiId).filter(Boolean))
      );
      const buddiMap: Record<string, any> = {};
      for (const buddiId of buddiIds) {
        try {
          const buddiRes = await BuddiService.getBuddiInfo(buddiId.toString());
          buddiMap[buddiId] = buddiRes.data;
        } catch (e) {
          buddiMap[buddiId] = { id: buddiId };
        }
      }
      setBuddiDetailsMap(buddiMap);
    } catch (err: any) {
      console.error("Failed to fetch pickup requests:", err);
    }
  };

  // Function to handle coverage request creation
  const handleCreateCoverageRequest = async (reason: string) => {
    if (!parentDetails?.id || !selectedBuddiId) {
      Alert.alert(
        "Error",
        "Missing required information for coverage request."
      );
      return;
    }

    try {
      await ParentService.createCoverageRequest({
        parentId: parentDetails.id.toString(),
        buddiId: selectedBuddiId,
        reason: reason,
      });

      Alert.alert(
        "Success",
        "Coverage request sent successfully! Your Buddi will be notified.",
        [
          {
            text: "OK",
            onPress: () => {
              setShowCoverageModal(false);
              setSelectedBuddiId(null);
              setSelectedBuddiName("");
              // Refresh coverage requests list
              fetchCoverageRequests(1);
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Failed to create coverage request."
      );
    }
  };

  // Function to open coverage request modal
  const openCoverageRequestModal = (
    buddiId: string | number,
    buddiName: string
  ) => {
    setSelectedBuddiId(buddiId.toString());
    setSelectedBuddiName(buddiName);
    setShowCoverageModal(true);
  };

  // Load data on component mount
  React.useEffect(() => {
    if (parentDetails?.id) {
      fetchCoverageRequests(1);
      fetchPickupRequests();
    }
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
          paddingBottom: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="pt-12">
          <PageHeader
            title="Coverage Requests"
            onMenuPress={() => router.back()}
          />
        </View>

        <View className="px-4 pb-5">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="font-comfortaa-bold text-xl">
              All Coverage Requests
            </Text>
            <Text className="text-gray-500 font-comfortaa">
              {coveragePagination.total} total
            </Text>
          </View>

          {/* Create Coverage Request Button - Always visible when there are matched pickups */}
          {pickupRequests.length > 0 &&
            pickupRequests.some((pickup) => pickup.matchedBuddiId) && (
              <TouchableOpacity
                style={{
                  backgroundColor: "#FF932E",
                  borderRadius: 12,
                  paddingVertical: 14,
                  paddingHorizontal: 20,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
                onPress={() => {
                  // Find the first matched buddi to request coverage from
                  const matchedPickup = pickupRequests.find(
                    (pickup) => pickup.matchedBuddiId
                  );
                  if (matchedPickup && matchedPickup.matchedBuddiId) {
                    const buddiName = buddiDetailsMap[
                      matchedPickup.matchedBuddiId
                    ]?.User?.firstName
                      ? `${
                          buddiDetailsMap[matchedPickup.matchedBuddiId].User
                            .firstName
                        }`
                      : `Buddi ${matchedPickup.matchedBuddiId}`;
                    openCoverageRequestModal(
                      matchedPickup.matchedBuddiId,
                      buddiName
                    );
                  }
                }}
              >
                <Ionicons
                  name="add-circle-outline"
                  size={20}
                  color="white"
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={{
                    fontFamily: "Comfortaa-Bold",
                    fontSize: 16,
                    color: "white",
                  }}
                >
                  Create Coverage Request
                </Text>
              </TouchableOpacity>
            )}

          <View className="gap-4">
            {coverageLoading && coverageRequests.length === 0 ? (
              <View style={{ alignItems: "center", padding: 40 }}>
                <ActivityIndicator size="large" color="#FF932E" />
                <Text
                  style={{
                    fontFamily: "Comfortaa-Regular",
                    fontSize: 14,
                    color: "#6B7280",
                    marginTop: 12,
                  }}
                >
                  Loading coverage requests...
                </Text>
              </View>
            ) : coverageError ? (
              <View
                style={{
                  backgroundColor: "#FEF2F2",
                  borderRadius: 16,
                  padding: 24,
                  alignItems: "center",
                }}
              >
                <Ionicons
                  name="alert-circle-outline"
                  size={40}
                  color="#F44336"
                />
                <Text
                  style={{
                    fontFamily: "Comfortaa-Bold",
                    fontSize: 16,
                    color: "#F44336",
                    marginTop: 12,
                    textAlign: "center",
                  }}
                >
                  {coverageError}
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#FF932E",
                    borderRadius: 12,
                    paddingVertical: 12,
                    paddingHorizontal: 20,
                    marginTop: 16,
                  }}
                  onPress={() => fetchCoverageRequests(1)}
                >
                  <Text
                    style={{
                      fontFamily: "Comfortaa-Bold",
                      fontSize: 14,
                      color: "white",
                    }}
                  >
                    Try Again
                  </Text>
                </TouchableOpacity>
              </View>
            ) : coverageRequests.length > 0 ? (
              <>
                {coverageRequests.map((coverage, index) => (
                  <CoverageRequestCard key={coverage.id} coverage={coverage} />
                ))}

                {/* Load More Button */}
                {coveragePagination.page < coveragePagination.totalPages && (
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#F4F7FE",
                      borderRadius: 12,
                      paddingVertical: 12,
                      paddingHorizontal: 20,
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: "#E6E6E6",
                      marginTop: 16,
                    }}
                    onPress={() =>
                      fetchCoverageRequests(coveragePagination.page + 1)
                    }
                    disabled={coverageLoading}
                  >
                    {coverageLoading ? (
                      <ActivityIndicator size="small" color="#FF932E" />
                    ) : (
                      <Text
                        style={{
                          fontFamily: "Comfortaa-Bold",
                          fontSize: 14,
                          color: "#FF932E",
                        }}
                      >
                        Load More
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <View
                style={{
                  backgroundColor: "#F4F7FE",
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: "#E6E6E6",
                  padding: 24,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 16,
                }}
              >
                <Ionicons
                  name="shield-outline"
                  size={40}
                  color="#FF932E"
                  style={{ marginBottom: 12 }}
                />
                <Text
                  style={{
                    fontFamily: "Comfortaa-Bold",
                    fontSize: 18,
                    color: "#FF932E",
                    marginBottom: 6,
                  }}
                >
                  No Coverage Requests
                </Text>
                <Text
                  style={{
                    fontFamily: "Comfortaa-Regular",
                    fontSize: 14,
                    color: "#6B7280",
                    textAlign: "center",
                  }}
                >
                  You haven't made any coverage requests yet.
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Coverage Request Modal */}
      <CoverageRequestModal
        visible={showCoverageModal}
        onClose={() => setShowCoverageModal(false)}
        onSubmit={handleCreateCoverageRequest}
        buddiName={selectedBuddiName}
      />
    </SafeAreaView>
  );
};

export default CoverageRequestsPage;
