import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import CallUpReviewCard from "../../components/parent/CallUpReviewCard";
import { useAuth } from "../../context/AuthContext";
import { ChildrenService } from "../../services/api";
import ParentService, {
  ParentPickupRequest,
} from "../../services/api/parent.service";

export default function MyCallsPage() {
  const { user, parentDetails } = useAuth();
  const router = useRouter();
  const [pickupRequests, setPickupRequests] = React.useState<
    ParentPickupRequest[]
  >([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [kids, setKids] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchRequests = async () => {
      if (!parentDetails?.id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await ParentService.getMyPickupRequests(
          parentDetails.id.toString()
        );
        setPickupRequests(res.data || []);
      } catch (err: any) {
        setError(err.message || "Failed to fetch pickup requests.");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [parentDetails?.id]);

  React.useEffect(() => {
    const fetchKids = async () => {
      if (!parentDetails?.id) return;
      try {
        const result = await ChildrenService.getChildrenByParent(
          parentDetails.id.toString()
        );
        setKids(Array.isArray(result) ? result : []);
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchKids();
  }, [parentDetails?.id]);

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
          My Calls
        </Text>
      </View>
      {loading ? (
        <Text style={{ textAlign: "center", marginTop: 40 }}>
          Loading your calls...
        </Text>
      ) : error ? (
        <Text style={{ color: "red", textAlign: "center", marginTop: 40 }}>
          {error}
        </Text>
      ) : pickupRequests.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 40 }}>
          You have not created any calls yet.
        </Text>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          {pickupRequests.slice(0, 5).map((req) => (
            <CallUpReviewCard
              key={req.id}
              name={
                user
                  ? [user.firstName, user.lastName].filter(Boolean).join(" ")
                  : "Unknown"
              }
              email={user?.email || "Unknown"}
              school={req.fromZone}
              requestedAgo={getRequestedAgo(req.createdAt)}
              description={req.description}
              schoolName={req.fromZone}
              home={req.toZone}
              status={req.status}
              assignedKids={(() => {
                const kid = kids.find((k) => k.id === req.childId);
                return kid ? [{ name: kid.name }] : [];
              })()}
              onViewDetails={() => {
                router.push({
                  pathname: "/parent/call-details/[callId]",
                  params: { callId: req.id.toString() },
                });
              }}
              onApplicants={() => {
                router.push({
                  pathname: "/parent/buddi-recommendations/[callId]",
                  params: { callId: req.id.toString() },
                });
              }}
              onChat={() => {
                if (req.status === "matched" && req.matchedBuddiId) {
                  const chatRoomId = `${req.parentId}-${req.matchedBuddiId}`;
                  router.push({
                    pathname: "/parent/chat/[roomId]",
                    params: {
                      roomId: chatRoomId,
                      buddiName: "Buddi",
                      buddiAvatar:
                        "https://randomuser.me/api/portraits/men/32.jpg",
                    },
                  });
                }
              }}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
