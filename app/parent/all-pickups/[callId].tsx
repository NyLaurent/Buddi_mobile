import KidPickupCard from "@/components/parent/KidPickupCard";
import { useAuth } from "@/context/AuthContext";
import BuddiService from "@/services/api/buddi.service";
import ChildrenService from "@/services/api/children.service";
import ParentService from "@/services/api/parent.service";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function AllPickupsPage() {
  const params = useLocalSearchParams<{ callId: string }>();
  const callId = params.callId;
  const { parentDetails } = useAuth();
  const router = useRouter();
  const [pickup, setPickup] = React.useState<any>(null);
  const [child, setChild] = React.useState<any>(null);
  const [buddi, setBuddi] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchDetails = async () => {
      if (!callId || !parentDetails?.id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await ParentService.getParentRequestDetails(Number(callId));
        const pickupData = res.data;
        setPickup(pickupData);
        // Fetch child
        const childrenRes = await ChildrenService.getChildrenByParent(
          parentDetails.id.toString()
        );
        const childrenArr = Array.isArray(childrenRes) ? childrenRes : [];
        const childObj = childrenArr.find(
          (c: any) => c.id === pickupData.childId
        );
        setChild(childObj);
        // Fetch buddi
        if (pickupData.matchedBuddiId) {
          try {
            const buddiRes = await BuddiService.getBuddiInfo(
              pickupData.matchedBuddiId.toString()
            );
            setBuddi(buddiRes.data);
          } catch (e) {
            setBuddi({ id: pickupData.matchedBuddiId });
          }
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch pickup details.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [callId, parentDetails?.id]);

  let buddiName = buddi ? `Buddi ${pickup?.matchedBuddiId}` : "Buddi";
  let buddiEmail = buddi?.User?.email || buddi?.email || "buddi@email.com";
  let buddiAvatar =
    buddi?.profilePicture || "https://randomuser.me/api/portraits/men/2.jpg";
  let buddiStatus = pickup?.status === "matched" ? "Available" : "Pending";

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
          All Pickups
        </Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {loading ? (
          <Text style={{ fontFamily: "Comfortaa-Regular", color: "#6B7280" }}>
            Loading pickups...
          </Text>
        ) : error ? (
          <Text style={{ color: "red", fontFamily: "Comfortaa-Regular" }}>
            {error}
          </Text>
        ) : !pickup ? (
          <Text style={{ color: "#888", fontFamily: "Comfortaa-Regular" }}>
            No pickup found.
          </Text>
        ) : !pickup.availableDays || pickup.availableDays.length === 0 ? (
          <Text style={{ color: "#888", fontFamily: "Comfortaa-Regular" }}>
            No scheduled days for this pickup.
          </Text>
        ) : (
          pickup.availableDays.map((day: string, idx: number) => (
            <KidPickupCard
              key={`${pickup.id}-${day}`}
              childName={child?.name || "Child"}
              remaining={pickup.pickupTime || "-"}
              schedule={day}
              buddiName={buddiName}
              buddiEmail={buddiEmail}
              buddiAvatar={buddiAvatar}
              buddiStatus={buddiStatus}
              schoolName={child?.school || pickup.fromZone || "School"}
              destination={pickup.toZone || "Home"}
              mainAction={
                pickup.status === "matched" ? "Trip Not Yet Started" : "Pending"
              }
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
