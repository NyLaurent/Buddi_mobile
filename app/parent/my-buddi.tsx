import AnalyticsCard from "@/components/commons/AnalyticsCard";
import PageHeader from "@/components/commons/PageHeader";
import AvailableBuddie from "@/components/parent/AvailableBuddie";
import { useAuth } from "@/context/AuthContext";
import ParentService, {
  BuddiRecommendation,
} from "@/services/api/parent.service";
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
  const [buddies, setBuddies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matchedBuddiId, setMatchedBuddiId] = useState<number | null>(null);

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

        // Find the latest call/request
        const latestRequest = requests.length > 0 ? requests[0] : null;
        if (!latestRequest) {
          setBuddies([]);
          setMatchedBuddiId(null);
          setLoading(false);
          return;
        }
        setMatchedBuddiId(
          latestRequest.matchedBuddiId
            ? Number(latestRequest.matchedBuddiId)
            : null
        );
        // Fetch recommendations for the latest call
        const recRes = await ParentService.getBuddiRecommendations(
          parentDetails.id.toString(),
          latestRequest.id
        );
        const recommendations: BuddiRecommendation[] = recRes.data || [];
        // Flatten all buddis from all recommendations (should be 3)
        const buddis = recommendations.flatMap((rec) => rec.buddis);
        setBuddies(buddis);

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
              Proposed Buddies
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-4">
                {loading ? (
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      width: 340,
                      height: 220,
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
                      Loading buddies...
                    </Text>
                  </View>
                ) : error ? (
                  <Text style={{ color: "red" }}>{error}</Text>
                ) : buddies.length === 0 ? (
                  <Text>No buddies available.</Text>
                ) : (
                  buddies.map((buddi, idx) => (
                    <View
                      key={buddi.id || idx}
                      style={{ width: 340, maxWidth: 420 }}
                    >
                      <AvailableBuddie
                        buddi={buddi}
                        matched={matchedBuddiId === buddi.id}
                        ranking={idx + 1}
                      />
                    </View>
                  ))
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyBuddyPage;
