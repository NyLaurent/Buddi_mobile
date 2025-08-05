import AnalyticsCard from "@/components/commons/AnalyticsCard";
import PageHeader from "@/components/commons/PageHeader";
import KidPickupCard from "@/components/parent/KidPickupCard";
import { useAuth } from "@/context/AuthContext";
import BuddiService from "@/services/api/buddi.service";
import ChildrenService from "@/services/api/children.service";
import ParentService from "@/services/api/parent.service";
import SocketService from "@/services/socket";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const pickupData = [
  {
    name: "Bryan Smith",
    time: "2:23:04",
    days: "$25 per hour",
    school: "School Nome",
    home: "Senen",
  },
  {
    name: "Emma Johnson",
    time: "3:15:30",
    days: "$22 per hour",
    school: "Lincoln Elementary",
    home: "Downtown",
  },
  {
    name: "Michael Davis",
    time: "8:45:12",
    days: "$28 per hour",
    school: "Oak High School",
    home: "Westside",
  },
];

const coverageRequestsData = [
  {
    studentName: "Liam Brown",
    time: "1:45:00",
    hourlyRate: "$27 per hour",
    school: "Maple Elementary",
    home: "Greenfield",
    requesterName: "Olivia Lee",
    requesterEmail: "olivia.lee@email.com",
    requesterAvatar: undefined,
  },
  {
    studentName: "Sophia Miller",
    time: "2:30:00",
    hourlyRate: "$26 per hour",
    school: "Cedar Middle School",
    home: "Northside",
    requesterName: "Noah Kim",
    requesterEmail: "noah.kim@email.com",
    requesterAvatar: undefined,
  },
  {
    studentName: "Ava Smith",
    time: "4:10:00",
    hourlyRate: "$25 per hour",
    school: "Pine Middle School",
    home: "Eastside",
    requesterName: "Mason Lee",
    requesterEmail: "mason.lee@email.com",
    requesterAvatar: undefined,
  },
];

const SchedulePage = () => {
  const router = useRouter();
  const { parentDetails } = useAuth();
  const [activeTab, setActiveTab] = React.useState("pickups");
  const [pickupIndex, setPickupIndex] = React.useState(0);

  // State for real pickup requests and details
  const [pickupRequests, setPickupRequests] = React.useState<any[]>([]);
  const [childDetailsMap, setChildDetailsMap] = React.useState<
    Record<string, any>
  >({});
  const [buddiDetailsMap, setBuddiDetailsMap] = React.useState<
    Record<string, any>
  >({});
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // State for tracking pickup statuses (copied from parent index)
  const [pickupStatuses, setPickupStatuses] = React.useState<
    Record<number, string>
  >({});
  const [startingTripId, setStartingTripId] = React.useState<number | null>(
    null
  );

  React.useEffect(() => {
    const fetchDetailsForRequests = async () => {
      if (!parentDetails?.id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await ParentService.getMyPickupRequests(
          parentDetails.id.toString()
        );
        const requests = res.data || [];
        setPickupRequests(requests);
        // Fetch all children for this parent once
        const childrenRes = await ChildrenService.getChildrenByParent(
          parentDetails.id.toString()
        );
        const childrenArr = Array.isArray(childrenRes) ? childrenRes : [];
        // Map childId to child details
        const childMap: Record<string, any> = {};
        childrenArr.forEach((child: any) => {
          childMap[child.id] = child;
        });
        setChildDetailsMap(childMap);
        // Fetch buddi details for each matchedBuddiId
        const buddiIds = Array.from(
          new Set(requests.map((r: any) => r.matchedBuddiId).filter(Boolean))
        );
        const buddiMap: Record<string, any> = {};
        for (const buddiId of buddiIds) {
          try {
            const buddiRes = await BuddiService.getBuddiInfo(
              buddiId.toString()
            );
            buddiMap[buddiId] = buddiRes.data;
          } catch (e) {
            buddiMap[buddiId] = { id: buddiId };
          }
        }
        setBuddiDetailsMap(buddiMap);
      } catch (err: any) {
        setError(err.message || "Failed to fetch pickup requests.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetailsForRequests();
  }, [parentDetails?.id]);

  // Socket event listeners for real-time pickup status updates (copied from parent index)
  React.useEffect(() => {
    // Enhanced socket event listeners for real-time updates
    SocketService.on("pickup-started", (pickupData: any) => {
      console.log("[SCHEDULE] Received pickup-started event:", pickupData);
      // Update pickup status in real-time
      setPickupStatuses((prev) => ({
        ...prev,
        [pickupData.id]: "enRoute",
      }));
    });

    SocketService.on("child-picked-up", (pickupData: any) => {
      console.log("[SCHEDULE] Received child-picked-up event:", pickupData);
      // Update pickup status in real-time
      setPickupStatuses((prev) => ({
        ...prev,
        [pickupData.id]: "pickedUp",
      }));
    });

    SocketService.on("trip-completed", (pickupData: any) => {
      console.log("[SCHEDULE] Received trip-completed event:", pickupData);
      // Update pickup status in real-time
      setPickupStatuses((prev) => ({
        ...prev,
        [pickupData.id]: "completed",
      }));
    });

    SocketService.on("trip-cancelled", (pickupData: any) => {
      console.log("[SCHEDULE] Received trip-cancelled event:", pickupData);
      // Update pickup status in real-time
      setPickupStatuses((prev) => ({
        ...prev,
        [pickupData.id]: "cancelled",
      }));
    });

    // Cleanup listeners on unmount
    return () => {
      SocketService.off("pickup-started");
      SocketService.off("child-picked-up");
      SocketService.off("trip-completed");
      SocketService.off("trip-cancelled");
    };
  }, []);

  // Helper function to get pickup status (copied from parent index)
  const getPickupStatus = (buddiRequestId: number) => {
    return pickupStatuses[buddiRequestId] || null;
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
        className="flex-1 bg-white"
        contentContainerStyle={{
          paddingBottom: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="pt-12">
          <PageHeader
            title="Pickup Schedule"
            onMenuPress={() => {
              // Add your menu press handler here
            }}
          />
        </View>

        <View className="px-4 mb-6">
          <View className="flex-row gap-3 mb-3">
            {/* Today's Pickups */}
            <AnalyticsCard
              icon={<Ionicons name="flash" size={20} color="#8B5CF6" />}
              title="Today's Pickups"
              value="0"
              subtitle="0 Schools"
            />

            {/* This Week's Trips */}
            <AnalyticsCard
              icon={<Ionicons name="flash" size={20} color="#8B5CF6" />}
              title="This Week's Trips"
              value="0"
              subtitle="0 Schools"
            />
          </View>

          <View className="flex-row gap-3">
            {/* Coverage Requests */}
            <AnalyticsCard
              icon={<Ionicons name="flash" size={20} color="#8B5CF6" />}
              title="Coverage Requests"
              value="0"
              subtitle="0 Schools"
            />

            {/* Total Earnings */}
            <AnalyticsCard
              icon={
                <View className="w-6 h-6 bg-teal-500 rounded-full items-center justify-center">
                  <Text className="text-white font-bold text-sm">$</Text>
                </View>
              }
              title="Total Earnings"
              value="$0"
              subtitle="All time"
            />
          </View>
        </View>
        <View className="px-4 mb-6">
          <TouchableOpacity
            className="bg-primary rounded-full py-4 items-center"
            onPress={() => router.push("/parent/timesheets")}
          >
            <View className="flex-row items-center gap-2">
              <Text className="text-white font-comfortaa-bold text-lg">
                View Your Buddis&apos;s Timesheets
              </Text>
              <Ionicons name="arrow-forward" size={18} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        <View className="px-4 pb-5">
          <Text className="text-xl font-comfortaa-bold">Pickup Schedule</Text>
        </View>
        <View className="px-4 pb-5">
          {/* Tab Navigator */}
          <View>
            <View className="flex-row bg-[#F8F9FE] rounded-lg mb-6 items-center justify-between w-full min-h-[56px]">
              <TouchableOpacity
                className={`flex-1 items-center rounded-lg ${
                  activeTab === "pickups" ? "bg-white mx-1 py-3" : "py-2"
                }`}
                onPress={() => setActiveTab("pickups")}
              >
                <Text
                  className={`font-comfortaa-bold text-base ${
                    activeTab === "pickups" ? "text-black" : "text-[#71727A]"
                  }`}
                >
                  Your Pickups
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 items-center rounded-lg ${
                  activeTab === "coverage" ? "bg-white mx-1 py-3" : "py-2"
                }`}
                onPress={() => setActiveTab("coverage")}
              >
                <Text
                  className={`font-comfortaa-bold text-base ${
                    activeTab === "coverage" ? "text-black" : "text-[#71727A]"
                  }`}
                >
                  Coverage requests
                </Text>
              </TouchableOpacity>
            </View>
            {activeTab === "pickups" ? (
              <>
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="font-comfortaa-bold text-xl">
                    Scheduled Pickups
                  </Text>
                </View>
                {loading ? (
                  <Text
                    style={{
                      color: "#888",
                      fontFamily: "Comfortaa-Regular",
                      marginTop: 10,
                    }}
                  >
                    Loading pickups...
                  </Text>
                ) : error ? (
                  <Text
                    style={{
                      color: "red",
                      fontFamily: "Comfortaa-Regular",
                      marginTop: 10,
                    }}
                  >
                    {error}
                  </Text>
                ) : pickupRequests.length === 0 ? (
                  <Text
                    style={{
                      color: "#888",
                      fontFamily: "Comfortaa-Regular",
                      marginTop: 10,
                    }}
                  >
                    No pickups scheduled yet.
                  </Text>
                ) : (
                  pickupRequests.map((pickup) => {
                    console.log("Processing pickup request:", pickup.id);
                    console.log("Pickup request data:", pickup);

                    const child = childDetailsMap[pickup.childId];
                    console.log("Child details:", child);

                    // If not matched with a Buddi, show waiting card
                    console.log("Matched buddi ID:", pickup.matchedBuddiId);
                    if (!pickup.matchedBuddiId) {
                      console.log("No matched buddi, showing waiting card");
                      return (
                        <View
                          key={`waiting-${pickup.id}`}
                          style={{
                            backgroundColor: "#FFF7ED",
                            borderRadius: 16,
                            borderWidth: 1.2,
                            borderColor: "#FFD9B3",
                            padding: 18,
                            marginVertical: 6,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: "Comfortaa-Bold",
                              fontSize: 16,
                              color: "#FF932E",
                              marginBottom: 6,
                            }}
                          >
                            Waiting for a matched Buddi
                          </Text>
                          <Text
                            style={{
                              fontFamily: "Comfortaa-Regular",
                              fontSize: 13,
                              color: "#A3A3A3",
                              textAlign: "center",
                            }}
                          >
                            Once a Buddi is matched to your request, you&apos;ll
                            see your pickups here.
                          </Text>
                        </View>
                      );
                    }
                    let buddiName = undefined;
                    let buddiEmail = undefined;
                    let buddiAvatar = undefined;
                    if (
                      pickup.matchedBuddiId &&
                      buddiDetailsMap[pickup.matchedBuddiId]
                    ) {
                      const buddi = buddiDetailsMap[pickup.matchedBuddiId];
                      buddiName = `Buddi ${pickup.matchedBuddiId}`;
                      buddiEmail =
                        buddi.User?.email || buddi.email || "buddi@email.com";
                      buddiAvatar =
                        buddi.profilePicture ||
                        "https://randomuser.me/api/portraits/men/2.jpg";
                    } else {
                      buddiName = pickup.matchedBuddiId
                        ? `Buddi ${pickup.matchedBuddiId}`
                        : "Buddi";
                      buddiEmail = "buddi@email.com";
                      buddiAvatar =
                        "https://randomuser.me/api/portraits/men/2.jpg";
                    }
                    const buddiStatus =
                      pickup.status === "matched" ? "Available" : "Pending";

                    // Get current pickup status for this request
                    const currentPickupStatus = getPickupStatus(pickup.id);

                    // Parse the available days string and show up to 3 cards
                    let days: string[] = [];
                    if (
                      pickup.availableDays &&
                      pickup.availableDays.length > 0
                    ) {
                      // Parse the comma-separated available days string
                      const availableDaysString = pickup.availableDays[0];
                      const availableDays = availableDaysString
                        .split(",")
                        .map((day: string) => day.trim());

                      console.log(
                        "Available days string:",
                        availableDaysString
                      );
                      console.log("Parsed available days:", availableDays);

                      // Take up to 3 days
                      days = availableDays.slice(0, 3);
                      console.log("Days to display:", days);
                    }
                    return (
                      <View key={pickup.id} style={{ marginBottom: 18 }}>
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={{ paddingRight: 16 }}
                        >
                          {days.map((day: string, idx: number) => (
                            <View
                              key={`${pickup.id}-${day}`}
                              style={{ width: 338, marginRight: 12 }}
                            >
                              <KidPickupCard
                                childName={child?.name || "Child"}
                                remaining={pickup.pickupTime || "-"}
                                schedule={day}
                                buddiName={buddiName}
                                buddiEmail={buddiEmail}
                                buddiAvatar={buddiAvatar}
                                buddiStatus={buddiStatus}
                                schoolName={
                                  child?.school || pickup.fromZone || "School"
                                }
                                destination={pickup.toZone || "Home"}
                                mainAction={
                                  startingTripId === pickup.id
                                    ? "Starting Trip..."
                                    : currentPickupStatus === "pending"
                                    ? "Trip Started"
                                    : currentPickupStatus === "enRoute"
                                    ? "En Route"
                                    : currentPickupStatus === "pickedUp"
                                    ? "Child Picked Up"
                                    : currentPickupStatus === "completed"
                                    ? "Trip Completed"
                                    : pickup.status === "matched"
                                    ? parentDetails?.approvalStage === "pending"
                                      ? "Background Check Required"
                                      : "Trip Not Yet Started"
                                    : "Pending"
                                }
                                mainActionColor={
                                  currentPickupStatus === "pending"
                                    ? "#FF932E"
                                    : currentPickupStatus === "enRoute"
                                    ? "#3B82F6"
                                    : currentPickupStatus === "pickedUp"
                                    ? "#7C3AED"
                                    : currentPickupStatus === "completed"
                                    ? "#16A34A"
                                    : pickup.status === "matched" &&
                                      parentDetails?.approvalStage === "pending"
                                    ? "#EF4444"
                                    : undefined
                                }
                                disabled={
                                  currentPickupStatus === "pending" ||
                                  currentPickupStatus === "enRoute" ||
                                  currentPickupStatus === "pickedUp" ||
                                  currentPickupStatus === "completed" ||
                                  startingTripId === pickup.id ||
                                  (pickup.status === "matched" &&
                                    parentDetails?.approvalStage === "pending")
                                }
                              />
                            </View>
                          ))}
                        </ScrollView>
                        {/* Show View All if more than 3 days */}
                        {pickup.availableDays &&
                          pickup.availableDays.length > 3 && (
                            <TouchableOpacity
                              style={{
                                marginTop: 8,
                                alignSelf: "flex-end",
                                backgroundColor: "#FF932E",
                                borderRadius: 999,
                                paddingVertical: 8,
                                paddingHorizontal: 22,
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                              onPress={() => {
                                router.push({
                                  pathname: "/parent/all-pickups/[callId]",
                                  params: { callId: pickup.id.toString() },
                                });
                              }}
                            >
                              <Text
                                style={{
                                  color: "#fff",
                                  fontFamily: "Comfortaa-Bold",
                                  fontSize: 15,
                                  marginRight: 8,
                                }}
                              >
                                View All
                              </Text>
                              <Ionicons
                                name="arrow-forward"
                                size={18}
                                color="#fff"
                              />
                            </TouchableOpacity>
                          )}
                      </View>
                    );
                  })
                )}

                {/* Pagination Dots */}
                <View className="flex-row justify-center items-center gap-2 mt-4">
                  {pickupData.map((_, index) => (
                    <View
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === pickupIndex ? "bg-primary" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </View>
              </>
            ) : (
              <>
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="font-comfortaa-bold text-xl">
                    Coverage Requests
                  </Text>
                  <TouchableOpacity className="flex-row items-center gap-1">
                    <Text className="text-primary font-comfortaa">
                      View All
                    </Text>
                    <Ionicons name="arrow-forward" size={16} color="#FF932E" />
                  </TouchableOpacity>
                </View>
                <View className="gap-4">
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
                      No Coverage Requests So Far
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Comfortaa-Regular",
                        fontSize: 14,
                        color: "#6B7280",
                        textAlign: "center",
                      }}
                    >
                      You currently have no coverage requests. When a parent
                      requests coverage, you&apos;ll see it here!
                    </Text>
                  </View>
                  {/*
                  // Future integration: Uncomment and use when coverage requests are available
                  {coverageRequestsData.map((request, index) => (
                    <KidPickupCard
                      key={index}
                      childName={request.studentName}
                      remaining={request.time}
                      schedule={request.hourlyRate}
                      buddiName={request.requesterName}
                      buddiEmail={request.requesterEmail}
                      buddiAvatar={
                        request.requesterAvatar ||
                        `https://randomuser.me/api/portraits/men/${index + 1}.jpg`
                      }
                      buddiStatus={"Requesting Coverage"}
                      schoolName={request.school}
                      destination={request.home}
                      mainAction={"Accept Request"}
                      variant="coverage"
                    />
                  ))}
                  */}
                </View>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SchedulePage;
