import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import BuddiRecommendationCard from "../../../components/parent/BuddiRecommendationCard";
import { useAuth } from "../../../context/AuthContext";
import CoverageService from "../../../services/api/coverage.service";
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
  const [rankings, setRankings] = React.useState<{ [buddiId: number]: number }>(
    {}
  );
  const [rankingDates, setRankingDates] = React.useState<{
    [buddiId: number]: string;
  }>({});
  const [rankingLoading, setRankingLoading] = React.useState<{
    [buddiId: number]: boolean;
  }>({});
  const [isRankingMode, setIsRankingMode] = React.useState(false);
  const [topRankedBuddi, setTopRankedBuddi] = React.useState<any>(null);
  const [loadingTopRanked, setLoadingTopRanked] = React.useState(false);
  const [isMatching, setIsMatching] = React.useState(false);

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

  // Fetch existing rankings for this specific request when recommendations are loaded
  React.useEffect(() => {
    const fetchRankings = async () => {
      if (!parentDetails?.id || !callId || recommendations.length === 0) return;

      try {
        const res = await ParentService.getBuddiRankings(
          parentDetails.id.toString(),
          parseInt(callId)
        );

        // Convert the rankings array to the format we use in state
        // Handle duplicates by taking the most recent ranking for each buddi
        // Note: Now rankings are specific to this buddiRequestId
        const rankingsMap: { [buddiId: number]: number } = {};
        const datesMap: { [buddiId: number]: string } = {};
        if (res.data && Array.isArray(res.data)) {
          // Sort by createdAt to get the most recent rankings first
          const sortedRankings = res.data.sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          // Take the first (most recent) ranking for each buddi
          sortedRankings.forEach((ranking: any) => {
            if (!rankingsMap[ranking.buddiId]) {
              rankingsMap[ranking.buddiId] = ranking.rating;
              datesMap[ranking.buddiId] = ranking.createdAt;
            }
          });
        }
        setRankings(rankingsMap);
        setRankingDates(datesMap);
      } catch (err: any) {
        // Silently fail for rankings fetch - it's not critical
        console.log("Could not fetch existing rankings:", err.message);
      }
    };

    fetchRankings();
  }, [parentDetails?.id, callId, recommendations.length]);

  // Get top-ranked buddy from existing rankings for this specific request
  React.useEffect(() => {
    if (Object.keys(rankings).length > 0) {
      // Find the buddy with rating 1 (top ranked) for this specific request
      const topRankedId = Object.keys(rankings).find(
        (buddiId) => rankings[parseInt(buddiId)] === 1
      );

      if (topRankedId) {
        // Find the buddy in recommendations
        const topRankedBuddi = recommendations
          .flatMap((rec) => rec.buddis)
          .find((b) => b.id === parseInt(topRankedId));

        setTopRankedBuddi(topRankedBuddi || null);
      }
    } else {
      setTopRankedBuddi(null);
    }
  }, [rankings, recommendations]);

  const handleSelectBuddy = (buddiId: number) => {
    // TODO: Implement buddy selection logic
    console.log("Selected buddy:", buddiId);
  };

  const handleViewProfile = (buddiId: number) => {
    // Find the buddi data from recommendations
    const allBuddis = recommendations.flatMap((rec) => rec.buddis);
    const buddiData = allBuddis.find((b) => b.id === buddiId);

    console.log("handleViewProfile - buddiId:", buddiId);
    console.log("handleViewProfile - allBuddis count:", allBuddis.length);
    console.log("handleViewProfile - found buddiData:", buddiData);

    if (buddiData) {
      // Try a simpler approach with query parameters
      const encodedData = encodeURIComponent(JSON.stringify(buddiData));
      const url = `/parent/buddi-profile/${buddiId}?data=${encodedData}`;
      console.log("handleViewProfile - navigating to:", url);

      router.push(url as any);
    } else {
      console.error("Buddi data not found for ID:", buddiId);
      console.error(
        "Available buddi IDs:",
        allBuddis.map((b) => b.id)
      );
    }
  };

  const handleRankBuddi = async (
    buddiId: number,
    rating: number,
    comment: string
  ) => {
    if (!parentDetails?.id || !callId) return;

    // Check if this rank is already taken by another buddy for this specific request
    // Since each request has its own rankings, this prevents duplicate rankings within the same request
    const existingRank = rankings[buddiId];
    const isRankTaken =
      Object.values(rankings).includes(rating) && existingRank !== rating;

    if (isRankTaken) {
      alert(
        `Rank ${rating} is already assigned to another buddy. Please choose a different rank.`
      );
      return;
    }

    setRankingLoading((prev) => ({ ...prev, [buddiId]: true }));

    try {
      await ParentService.rankBuddi(
        parentDetails.id.toString(),
        buddiId,
        rating,
        comment,
        parseInt(callId) // Pass the callId as buddiRequestId
      );

      setRankings((prev) => ({ ...prev, [buddiId]: rating }));
      setRankingDates((prev) => ({
        ...prev,
        [buddiId]: new Date().toISOString(),
      }));

      // Check if we have ranked all 3 buddies
      const allBuddis = recommendations.flatMap((rec) => rec.buddis);
      const rankedCount = Object.keys(rankings).length + 1; // +1 for current ranking

      if (rankedCount >= 3) {
        // All buddies ranked, show success message and exit ranking mode
        alert(
          "All buddies have been ranked for this request! The 1st ranked buddy will be automatically assigned to your call."
        );
        setIsRankingMode(false); // Exit ranking mode automatically
      }
    } catch (err: any) {
      alert(err.message || "Failed to rank buddy. Please try again.");
    } finally {
      setRankingLoading((prev) => ({ ...prev, [buddiId]: false }));
    }
  };

  const toggleRankingMode = () => {
    setIsRankingMode(!isRankingMode);
  };

  const handleMatchBuddi = async () => {
    if (!topRankedBuddi || !callId) {
      Alert.alert("Error", "Unable to match buddy. Please try again.");
      return;
    }

    const buddiName = `${topRankedBuddi.User?.firstName} ${topRankedBuddi.User?.lastName}`;

    // Show confirmation alert
    Alert.alert(
      "Confirm Matching",
      `Are you sure you want to match with ${buddiName}?\n\nPlease confirm that you have:\n• Reviewed their profile thoroughly\n• Checked their ratings and experience\n• Read their teacher reference\n• Watched their interview video (if available)\n\nThis action will finalize your selection and cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes, Match Now",
          style: "default",
          onPress: async () => {
            try {
              setIsMatching(true);

              // Call the API to match the buddi
              const response = await CoverageService.matchBuddi({
                requestId: parseInt(callId),
                buddiId: topRankedBuddi.id,
              });

              // Show success message
              Alert.alert(
                "Success! 🎉",
                `You have been successfully matched with ${buddiName}!\n\n${
                  (response as any)?.data?.message ||
                  "Your request has been processed and the buddi has been notified."
                }\n\nYou will receive a confirmation email shortly with next steps.`,
                [
                  {
                    text: "View Updated Requests",
                    onPress: () => {
                      // Navigate back to buddi-requests page and trigger refresh
                      router.push("/parent/buddi-requests");
                    },
                  },
                ]
              );
            } catch (error: any) {
              // Show error message
              Alert.alert(
                "Matching Failed",
                error.message ||
                  "Failed to match with the selected buddy. Please try again.",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      // Optionally refresh the page or show retry option
                    },
                  },
                ]
              );
            } finally {
              setIsMatching(false);
            }
          },
        },
      ]
    );
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

      {/* Top Ranked Buddy CTA Card */}
      {topRankedBuddi && (
        <View
          style={{
            marginHorizontal: 16,
            marginBottom: 20,
            borderRadius: 18,
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
            {/* Header with Icon */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <View
                style={{
                  backgroundColor: "rgba(255,255,255,0.18)",
                  borderRadius: 999,
                  padding: 12,
                  marginRight: 12,
                  borderWidth: 2,
                  borderColor: "#fff",
                }}
              >
                <FontAwesome5 name="crown" size={24} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: "#fff",
                    fontFamily: "Comfortaa-Bold",
                    fontSize: 18,
                    marginBottom: 2,
                  }}
                >
                  {Object.keys(rankings).length >= 3
                    ? "All Buddies Ranked!"
                    : "Your Top Choice"}
                </Text>
                <View
                  style={{
                    backgroundColor: "#fff",
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 20,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <Text
                    style={{
                      color: "#FF932E",
                      fontFamily: "Comfortaa-Bold",
                      fontSize: 16,
                    }}
                  >
                    {topRankedBuddi?.User?.firstName}{" "}
                    {topRankedBuddi?.User?.lastName}
                  </Text>
                </View>
              </View>
            </View>

            {/* Description */}
            <Text
              style={{
                color: "#fff",
                fontFamily: "Comfortaa-Regular",
                fontSize: 15,
                marginBottom: 16,
                lineHeight: 22,
              }}
            >
              {Object.keys(rankings).length >= 3
                ? "Ready to match with your 1st ranked buddy! Review all recommendations first, then proceed with matching."
                : "First analyze all buddies proposed, then rank them before matching your top choice."}
            </Text>

            {/* Action Buttons */}
            <View style={{ flexDirection: "row", gap: 12 }}>
              {Object.keys(rankings).length >= 3 ? (
                <TouchableOpacity
                  style={{
                    backgroundColor: isMatching ? "#E5E7EB" : "#fff",
                    borderRadius: 999,
                    paddingVertical: 12,
                    paddingHorizontal: 24,
                    flexDirection: "row",
                    alignItems: "center",
                    shadowColor: "#FF932E",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.12,
                    shadowRadius: 6,
                    elevation: 2,
                  }}
                  onPress={handleMatchBuddi}
                  activeOpacity={0.85}
                  disabled={isMatching}
                >
                  {isMatching ? (
                    <FontAwesome5
                      name="spinner"
                      size={16}
                      color="#9CA3AF"
                      style={{ marginRight: 8 }}
                    />
                  ) : (
                    <FontAwesome5
                      name="handshake"
                      size={16}
                      color="#FF932E"
                      style={{ marginRight: 8 }}
                    />
                  )}
                  <Text
                    style={{
                      color: isMatching ? "#9CA3AF" : "#FF932E",
                      fontFamily: "Comfortaa-Bold",
                      fontSize: 14,
                    }}
                  >
                    {isMatching ? "Matching..." : "Match Him"}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 999,
                    paddingVertical: 12,
                    paddingHorizontal: 24,
                    flexDirection: "row",
                    alignItems: "center",
                    shadowColor: "#FF932E",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.12,
                    shadowRadius: 6,
                    elevation: 2,
                  }}
                  onPress={toggleRankingMode}
                  activeOpacity={0.85}
                >
                  <FontAwesome5
                    name="star"
                    size={16}
                    color="#FF932E"
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={{
                      color: "#FF932E",
                      fontFamily: "Comfortaa-Bold",
                      fontSize: 14,
                    }}
                  >
                    {isRankingMode ? "Exit Ranking" : "View Rankings"}
                  </Text>
                </TouchableOpacity>
              )}

              {/* View All Buddies Button */}
              {/* <TouchableOpacity
                style={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  borderRadius: 999,
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.3)",
                }}
                onPress={() => {
                  // Scroll to recommendations
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontFamily: "Comfortaa-Bold",
                    fontSize: 14,
                  }}
                >
                  View All
                </Text>
              </TouchableOpacity> */}
            </View>
          </LinearGradient>
        </View>
      )}

      {/* Ranking Mode Toggle (only show when not all ranked) */}
      {recommendations.length > 0 && Object.keys(rankings).length < 3 && (
        <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
          {(() => {
            const rankedCount = Object.keys(rankings).length;

            // If 2 are ranked, show "Rank the last one"
            if (rankedCount === 2) {
              return (
                <>
                  <TouchableOpacity
                    style={{
                      backgroundColor: isRankingMode ? "#22C55E" : "#FF932E",
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 8,
                      alignItems: "center",
                    }}
                    onPress={toggleRankingMode}
                  >
                    <Text
                      style={{
                        fontFamily: "Comfortaa-Bold",
                        fontSize: 14,
                        color: "#fff",
                      }}
                    >
                      {isRankingMode
                        ? "Exit Ranking Mode"
                        : "Rank the Last Buddy"}
                    </Text>
                  </TouchableOpacity>
                  {isRankingMode && (
                    <Text
                      style={{
                        fontFamily: "Comfortaa-Regular",
                        fontSize: 12,
                        color: "#6B7280",
                        textAlign: "center",
                        marginTop: 8,
                      }}
                    >
                      Rank the last buddy to complete your selection.
                    </Text>
                  )}
                </>
              );
            }

            // If 1 is ranked, show "Rank the other 2"
            if (rankedCount === 1) {
              return (
                <>
                  <TouchableOpacity
                    style={{
                      backgroundColor: isRankingMode ? "#22C55E" : "#FF932E",
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 8,
                      alignItems: "center",
                    }}
                    onPress={toggleRankingMode}
                  >
                    <Text
                      style={{
                        fontFamily: "Comfortaa-Bold",
                        fontSize: 14,
                        color: "#fff",
                      }}
                    >
                      {isRankingMode
                        ? "Exit Ranking Mode"
                        : "Rank the Other 2 Buddies"}
                    </Text>
                  </TouchableOpacity>
                  {isRankingMode && (
                    <Text
                      style={{
                        fontFamily: "Comfortaa-Regular",
                        fontSize: 12,
                        color: "#6B7280",
                        textAlign: "center",
                        marginTop: 8,
                      }}
                    >
                      Rank the remaining 2 buddies to complete your selection.
                    </Text>
                  )}
                </>
              );
            }

            // If 0 are ranked, show "Start Ranking Buddies"
            return (
              <>
                <TouchableOpacity
                  style={{
                    backgroundColor: isRankingMode ? "#22C55E" : "#FF932E",
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 8,
                    alignItems: "center",
                  }}
                  onPress={toggleRankingMode}
                >
                  <Text
                    style={{
                      fontFamily: "Comfortaa-Bold",
                      fontSize: 14,
                      color: "#fff",
                    }}
                  >
                    {isRankingMode
                      ? "Exit Ranking Mode"
                      : "Start Ranking Buddies"}
                  </Text>
                </TouchableOpacity>
                {isRankingMode && (
                  <Text
                    style={{
                      fontFamily: "Comfortaa-Regular",
                      fontSize: 12,
                      color: "#6B7280",
                      textAlign: "center",
                      marginTop: 8,
                    }}
                  >
                    Rank your top 3 choices. The 1st ranked buddy will be
                    automatically assigned.
                  </Text>
                )}
              </>
            );
          })()}
        </View>
      )}

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
                  onRankBuddi={handleRankBuddi}
                  currentRank={rankings[buddi.id]}
                  isRanking={isRankingMode}
                  rankingDate={rankingDates[buddi.id]}
                  isTopRanked={topRankedBuddi?.id === buddi.id}
                />
              ))}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
