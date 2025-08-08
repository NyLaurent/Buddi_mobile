import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
import CoverageRequestCard from "../../components/commons/CoverageRequestCard";
import PageHeader from "../../components/commons/PageHeader";
import CoverageRequestModal from "../../components/modals/CoverageRequestModal";
import { useAuth } from "../../context/AuthContext";
import BuddiService from "../../services/api/buddi.service";

export default function CoverageRequestsPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { buddiDetails } = useAuth();
  const [coverageRequests, setCoverageRequests] = React.useState<any[]>([]);
  const [coverageLoading, setCoverageLoading] = React.useState(false);
  const [coverageError, setCoverageError] = React.useState<string | null>(null);
  const [coveragePagination, setCoveragePagination] = React.useState<any>(null);
  const [showCoverageModal, setShowCoverageModal] = React.useState(false);
  const [selectedPickup, setSelectedPickup] = React.useState<any>(null);

  const fetchCoverageRequests = async (page: number = 1) => {
    if (!buddiDetails?.id) return;
    
    setCoverageLoading(true);
    setCoverageError(null);
    try {
      const res = await BuddiService.getCoverageRequests(buddiDetails.id.toString(), page, 10);
      if (page === 1) {
        setCoverageRequests(res.data || []);
      } else {
        setCoverageRequests(prev => [...prev, ...(res.data || [])]);
      }
      setCoveragePagination(res.pagination || {});
    } catch (err: any) {
      console.error("[BUDDI COVERAGE REQUESTS] Error fetching coverage requests:", err);
      setCoverageError(err.message || "Failed to fetch coverage requests");
      if (page === 1) {
        setCoverageRequests([]);
      }
    } finally {
      setCoverageLoading(false);
    }
  };

  const openCoverageRequestModal = (pickup: any) => {
    setSelectedPickup(pickup);
    setShowCoverageModal(true);
  };

  React.useEffect(() => {
    fetchCoverageRequests();
  }, [buddiDetails?.id]);

  const handleLoadMore = () => {
    if (coveragePagination?.hasNextPage && !coverageLoading) {
      fetchCoverageRequests(coveragePagination.currentPage + 1);
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
            Total: {coveragePagination?.totalItems || 0} requests
          </Text>
        </View>

        {/* Create Coverage Request Button */}
        <View className="px-4 mb-6">
          <TouchableOpacity
            className="bg-[#FF932E] rounded-lg py-3 px-4 flex-row items-center justify-center"
            onPress={() => {
              // For now, we'll create a dummy pickup object
              const dummyPickup = {
                parentId: "dummy-parent-id",
                description: "Coverage Request"
              };
              openCoverageRequestModal(dummyPickup);
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
              <Text className="text-gray-500 mt-2 font-comfortaa">Loading coverage requests...</Text>
            </View>
          ) : coverageError ? (
            <View className="items-center justify-center py-8">
              <Text className="text-red-500 font-comfortaa">{coverageError}</Text>
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
                When parents request coverage for their children,
                you&apos;ll see those requests here.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <CoverageRequestModal
        visible={showCoverageModal}
        onClose={() => setShowCoverageModal(false)}
        onSuccess={() => {
          setShowCoverageModal(false);
          setSelectedPickup(null);
          fetchCoverageRequests(); // Refresh the list
        }}
        parentId={selectedPickup?.parentId}
        buddiId={buddiDetails?.id?.toString()}
        userType="buddi"
      />
    </SafeAreaView>
  );
} 