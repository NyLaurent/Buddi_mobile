import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import BuddiRecommendationCard from "../../../components/parent/BuddiRecommendationCard";
import { useAuth } from "../../../context/AuthContext";
import ParentService, {
  BuddiRecommendation,
} from "../../../services/api/parent.service";

export default function BuddiRecommendationsPage() {
  const { callId } = useLocalSearchParams<{ callId: string }>();
  const { parentDetails } = useAuth();
  const router = useRouter();
  const [recommendations, setRecommendations] = React.useState<
    BuddiRecommendation[]
  >([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchRecommendations = async () => {
      if (!parentDetails?.id || !callId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await ParentService.getBuddiRecommendations(
          parentDetails.id.toString(),
          parseInt(callId)
        );
        setRecommendations(res.data || []);
      } catch (err: any) {
        setError(err.message || "Failed to fetch buddi recommendations.");
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, [parentDetails?.id, callId]);

  const handleSelectBuddy = (buddiId: number) => {
    // TODO: Implement buddy selection logic
    console.log("Selected buddy:", buddiId);
  };

  const handleViewProfile = (buddiId: number) => {
    // TODO: Navigate to buddi profile page
    console.log("View profile for buddy:", buddiId);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: 40 }}>
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
          Recommended Buddies
        </Text>
      </View>

      {loading ? (
        <Text style={{ textAlign: "center", marginTop: 40 }}>
          Loading recommendations...
        </Text>
      ) : error ? (
        <Text style={{ color: "red", textAlign: "center", marginTop: 40 }}>
          {error}
        </Text>
      ) : recommendations.length === 0 ? (
        <View
          style={{
            flex: 1,
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
              <FontAwesome5 name="users" size={48} color="#9CA3AF" />
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
              No Buddies Recommended Yet
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
              Admins haven&apos;t recommended any buddies for this call yet.
              Check back later or contact support if you need assistance.
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
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          {recommendations.map((recommendation) => (
            <View key={recommendation.id} style={{ marginBottom: 24 }}>
              {/* Recommendation Header */}
              <View
                style={{
                  backgroundColor: "#F4F7FE",
                  padding: 16,
                  borderRadius: 12,
                  marginBottom: 16,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Comfortaa-Bold",
                    fontSize: 16,
                    color: "#3B82F6",
                    marginBottom: 8,
                  }}
                >
                  Admin Recommendation
                </Text>
                <Text
                  style={{
                    fontFamily: "Comfortaa-Regular",
                    fontSize: 14,
                    color: "#6B7280",
                  }}
                >
                  {recommendation.reason}
                </Text>
                <Text
                  style={{
                    fontFamily: "Comfortaa-Regular",
                    fontSize: 12,
                    color: "#9CA3AF",
                    marginTop: 8,
                  }}
                >
                  Recommended on{" "}
                  {new Date(recommendation.createdAt).toLocaleDateString()}
                </Text>
              </View>

              {/* Buddies List */}
              {recommendation.buddis.map((buddi) => (
                <BuddiRecommendationCard
                  key={buddi.id}
                  buddi={buddi}
                  onSelectBuddy={handleSelectBuddy}
                  onViewProfile={handleViewProfile}
                />
              ))}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
