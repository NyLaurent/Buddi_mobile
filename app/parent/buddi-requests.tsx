import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BuddiRequestCard from "../../components/parent/BuddiRequestCard";
import { useAuth } from "../../context/AuthContext";
import { BuddiRequestsService } from "../../services/api";
import type { BuddiRequest } from "../../services/api/buddi-requests.service";

export default function BuddiRequestsPage() {
  const router = useRouter();
  const { parentDetails, user } = useAuth();
  const [buddiRequests, setBuddiRequests] = useState<BuddiRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBuddiRequests = async () => {
    if (!parentDetails?.id && !user?.userId) return;

    setLoading(true);
    setError(null);
    try {
      const parentId = parentDetails?.id || user?.userId;
      if (!parentId) {
        console.log("[BUDDI REQUESTS] No parent ID available");
        return;
      }

      console.log(
        "[BUDDI REQUESTS] Fetching requests for parent ID:",
        parentId
      );
      const data = await BuddiRequestsService.getMyRequests(parentId);
      console.log("[BUDDI REQUESTS] Requests fetched successfully:", data);
      setBuddiRequests(data.data);
    } catch (error: any) {
      console.error("Error fetching buddi requests:", error.message);
      setError(error.message || "Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuddiRequests();
  }, [parentDetails?.id, user?.userId]);

  // Refresh data when page comes into focus (e.g., after matching)
  useFocusEffect(
    useCallback(() => {
      console.log("[BUDDI REQUESTS] Page focused, refreshing data...");
      fetchBuddiRequests();
    }, [parentDetails?.id, user?.userId])
  );

  const handleRefresh = () => {
    fetchBuddiRequests();
  };

  const handleBackPress = () => {
    router.back();
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent={true}
        />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#FF932E" />
          <Text
            style={{
              marginTop: 16,
              fontFamily: "Comfortaa-Regular",
              color: "#6B7280",
            }}
          >
            Loading your requests...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />

      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#E5E7EB",
        }}
      >
        <TouchableOpacity
          onPress={handleBackPress}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "#FFF7ED",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 16,
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={24} color="#FF932E" />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: "Comfortaa-Bold",
              fontSize: 24,
              color: "#1F2937",
            }}
          >
            My Buddi Requests
          </Text>
          <Text
            style={{
              fontFamily: "Comfortaa-Regular",
              fontSize: 14,
              color: "#6B7280",
              marginTop: 2,
            }}
          >
            {buddiRequests.length} request
            {buddiRequests.length !== 1 ? "s" : ""} found
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleRefresh}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "#FFF7ED",
            alignItems: "center",
            justifyContent: "center",
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="refresh" size={20} color="#FF932E" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {error ? (
          <View
            style={{
              backgroundColor: "#FEF2F2",
              borderRadius: 12,
              padding: 20,
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Ionicons name="alert-circle" size={32} color="#DC2626" />
            <Text
              style={{
                fontFamily: "Comfortaa-Bold",
                fontSize: 16,
                color: "#DC2626",
                marginTop: 12,
                textAlign: "center",
              }}
            >
              Error Loading Requests
            </Text>
            <Text
              style={{
                fontFamily: "Comfortaa-Regular",
                fontSize: 14,
                color: "#DC2626",
                marginTop: 8,
                textAlign: "center",
              }}
            >
              {error}
            </Text>
            <TouchableOpacity
              onPress={handleRefresh}
              style={{
                backgroundColor: "#DC2626",
                borderRadius: 8,
                paddingHorizontal: 16,
                paddingVertical: 8,
                marginTop: 12,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontFamily: "Comfortaa-Bold",
                  fontSize: 14,
                }}
              >
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        ) : buddiRequests.length === 0 ? (
          <View
            style={{
              backgroundColor: "#F9FAFB",
              borderRadius: 16,
              padding: 40,
              alignItems: "center",
              marginTop: 40,
            }}
          >
            <Ionicons name="document-text-outline" size={64} color="#9CA3AF" />
            <Text
              style={{
                fontFamily: "Comfortaa-Bold",
                fontSize: 18,
                color: "#374151",
                marginTop: 16,
                textAlign: "center",
              }}
            >
              No Buddi Requests Yet
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
              You haven &apos; t created any pickup requests yet. Start by
              creating your first request to find amazing Buddis!
            </Text>

            <TouchableOpacity
              onPress={() => router.push("/parent/call-page")}
              style={{
                backgroundColor: "#FF932E",
                borderRadius: 12,
                paddingHorizontal: 24,
                paddingVertical: 12,
                marginTop: 20,
              }}
              activeOpacity={0.8}
            >
              <Text
                style={{
                  color: "#fff",
                  fontFamily: "Comfortaa-Bold",
                  fontSize: 16,
                }}
              >
                Create First Request
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ gap: 16 }}>
            {buddiRequests.map((request) => (
              <BuddiRequestCard key={request.id} request={request} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
