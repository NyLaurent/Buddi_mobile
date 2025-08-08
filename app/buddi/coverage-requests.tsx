import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import PageHeader from "../../components/commons/PageHeader";
import CoverageRequestModal from "../../components/modals/CoverageRequestModal";
import CoverageRequestCard from "../../components/parent/CoverageRequestCard";
import { useAuth } from "../../context/AuthContext";
import BuddiService from "../../services/api/buddi.service";
import CoverageService from "../../services/api/coverage.service";

export default function CoverageRequestsPage() {
  const insets = useSafeAreaInsets();
  const { buddiDetails } = useAuth();
  const [coverageRequests, setCoverageRequests] = React.useState<any[]>([]);
  const [coverageLoading, setCoverageLoading] = React.useState(false);
  const [coverageError, setCoverageError] = React.useState<string | null>(null);
  const [coveragePagination, setCoveragePagination] = React.useState<any>(null);
  const [showCoverageModal, setShowCoverageModal] = React.useState(false);
  const [selectedPickup, setSelectedPickup] = React.useState<any>(null);
  const [pickupRequests, setPickupRequests] = React.useState<any[]>([]);

  const fetchCoverageRequests = async (page: number = 1) => {
    if (!buddiDetails?.id) return;

    setCoverageLoading(true);
    setCoverageError(null);
    try {
      const res = await CoverageService.getBuddiCoverageRequests(
        buddiDetails.id.toString(),
        page,
        10
      );
      if (page === 1) {
        setCoverageRequests(res.data || []);
      } else {
        setCoverageRequests((prev) => [...prev, ...(res.data || [])]);
      }
      setCoveragePagination({
        total: res.pagination.totalItems,
        page: res.pagination.currentPage,
        limit: res.pagination.perPage,
        totalPages: res.pagination.totalPages,
        hasNextPage: res.pagination.hasNextPage,
      });
    } catch (err: any) {
      console.error(
        "[BUDDI COVERAGE REQUESTS] Error fetching coverage requests:",
        err
      );
      setCoverageError(err.message || "Failed to fetch coverage requests");
      if (page === 1) {
        setCoverageRequests([]);
      }
    } finally {
      setCoverageLoading(false);
    }
  };

  // Fetch pickup requests to get parent IDs for coverage requests
  const fetchPickupRequests = async () => {
    if (!buddiDetails?.id) return;

    try {
      const res = await BuddiService.getMatchedRequests(buddiDetails.id);
      setPickupRequests(res.data || []);
    } catch (err: any) {
      console.error(
        "[BUDDI COVERAGE REQUESTS] Error fetching pickup requests:",
        err
      );
    }
  };

  const openCoverageRequestModal = (pickup: any) => {
    setSelectedPickup(pickup);
    setShowCoverageModal(true);
  };

  React.useEffect(() => {
    fetchCoverageRequests();
    fetchPickupRequests();
  }, [buddiDetails?.id]);

  const handleLoadMore = () => {
    if (coveragePagination?.hasNextPage && !coverageLoading) {
      fetchCoverageRequests(coveragePagination.page + 1);
    }
  };

  // Handle creating a coverage request
  const handleCreateCoverageRequest = async (reason: string) => {
    if (!buddiDetails?.id || !selectedPickup?.parentId) {
      Alert.alert(
        "Error",
        "Missing required information for coverage request."
      );
      return;
    }

    try {
      await CoverageService.createBuddiCoverageRequest({
        parentId: selectedPickup.parentId,
        buddiId: buddiDetails.id.toString(),
        reason: reason,
      });

      Alert.alert(
        "Success",
        "Coverage request sent successfully! The parent will be notified.",
        [
          {
            text: "OK",
            onPress: () => {
              setShowCoverageModal(false);
              setSelectedPickup(null);
              fetchCoverageRequests(1); // Refresh the list
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
        className="flex-1 bg-gray-50"
        contentContainerStyle={{
          paddingBottom: Platform.select({
            ios: 120 + insets.bottom,
            android: 110 + insets.bottom,
          }),
        }}
        showsVerticalScrollIndicator={false}
      >
        <PageHeader title="Coverage Requests" showBackButton={true} />

        {/* Total Count */}
        <View className="px-4 mb-4">
          <Text className="text-gray-600 font-comfortaa">
            Total: {coveragePagination?.total || 0} requests
          </Text>
        </View>

        {/* Create Coverage Request Button */}
        <View className="px-4 mb-6">
          <TouchableOpacity
            className="bg-[#FF932E] rounded-lg py-3 px-4 flex-row items-center justify-center"
            onPress={() => {
              // Find the first matched pickup to get parent ID
              const matchedPickup = pickupRequests.find(
                (pickup) => pickup.matchedBuddiId && pickup.parentId
              );
              if (matchedPickup?.parentId) {
                openCoverageRequestModal({
                  parentId: matchedPickup.parentId,
                  description: "Coverage Request",
                });
              } else {
                Alert.alert(
                  "No Active Pickups",
                  "You need to have active pickup requests to create coverage requests."
                );
              }
            }}
          >
            <Ionicons name="add" size={20} color="white" />
            <Text className="text-white font-comfortaa-bold text-base ml-2">
              Create Coverage Request
            </Text>
          </TouchableOpacity>
        </View>

        {/* Coverage Requests List */}
        <View className="px-4">
          {coverageLoading && coverageRequests.length === 0 ? (
            <View className="items-center justify-center py-8">
              <ActivityIndicator size="large" color="#FF932E" />
              <Text className="text-gray-500 mt-2 font-comfortaa">
                Loading coverage requests...
              </Text>
            </View>
          ) : coverageError ? (
            <View className="items-center justify-center py-8">
              <Text className="text-red-500 font-comfortaa">
                {coverageError}
              </Text>
            </View>
          ) : coverageRequests.length > 0 ? (
            <View className="gap-4">
              {coverageRequests.map((request, index) => (
                <CoverageRequestCard
                  key={request.id || index}
                  coverage={request}
                />
              ))}

              {/* Load More Button */}
              {coveragePagination?.hasNextPage && (
                <TouchableOpacity
                  className="bg-gray-200 rounded-lg py-3 px-4 items-center mt-4"
                  onPress={handleLoadMore}
                  disabled={coverageLoading}
                >
                  {coverageLoading ? (
                    <ActivityIndicator size="small" color="#666" />
                  ) : (
                    <Text className="text-gray-700 font-comfortaa-bold">
                      Load More
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
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
                No Coverage Requests Available
              </Text>
              <Text
                style={{
                  fontFamily: "Comfortaa-Regular",
                  fontSize: 14,
                  color: "#6B7280",
                  textAlign: "center",
                }}
              >
                When parents request coverage for their children, you&apos;ll
                see those requests here.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <CoverageRequestModal
        visible={showCoverageModal}
        onClose={() => setShowCoverageModal(false)}
        onSubmit={handleCreateCoverageRequest}
        buddiName="Parent"
      />
    </SafeAreaView>
  );
}
