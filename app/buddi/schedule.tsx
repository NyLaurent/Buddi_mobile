import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
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
import AnalyticsCard from "../../components/commons/AnalyticsCard";
import CoverageRequestCard from "../../components/commons/CoverageRequestCard";
import PickupCard from "../../components/commons/PickupCard";
import { useAuth } from "../../context/AuthContext";
import BuddiService from "../../services/api/buddi.service";

export default function SchedulePage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { buddiDetails } = useAuth();
  const [matchedPickups, setMatchedPickups] = React.useState<any[]>([]);
  React.useEffect(() => {
    const fetchMatchedPickups = async () => {
      try {
        const res = await BuddiService.getAvailableCalls(1, 50);
        if (buddiDetails?.id) {
          const matched = (res.data || []).filter(
            (call: any) => call.matchedBuddiId === buddiDetails.id
          );
          setMatchedPickups(matched);
        } else {
          setMatchedPickups([]);
        }
      } catch (err) {
        setMatchedPickups([]);
      }
    };
    fetchMatchedPickups();
  }, [buddiDetails?.id]);

  // Tab state for navigator
  const [activeTab, setActiveTab] = React.useState<"pickups" | "coverage">(
    "pickups"
  );

  // Sample data for coverage requests
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
  ];

  const [showAll, setShowAll] = React.useState(false);
  // Helper to get today's day as a string (e.g., 'Monday')
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  // Filter pickups for today
  const todaysPickups = matchedPickups.filter(
    (pickup) =>
      Array.isArray(pickup.availableDays) &&
      pickup.availableDays
        .map((d: string) => d.trim().toLowerCase())
        .includes(today.toLowerCase())
  );
  const pickupsToShow = showAll ? matchedPickups : todaysPickups;

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
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 mb-6 pt-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 bg-primary rounded-xl items-center justify-center"
          >
            <Ionicons name="arrow-back" size={20} color="white" />
          </TouchableOpacity>
          <Text className="text-xl text-black font-comfortaa-bold">My Schedule</Text>
          <TouchableOpacity className="w-10 h-10 bg-primary rounded-xl items-center justify-center">
            <Ionicons name="ellipsis-horizontal" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View className="px-4 mb-6">
          <View className="flex-row gap-3 mb-3">
            {/* Today's Pickups */}
            <AnalyticsCard
              icon={<Ionicons name="flash" size={20} color="#8B5CF6" />}
              title="Today's Pickups"
              value="12"
              subtitle="2 Schools"
            />

            {/* This Week's Trips */}
            <AnalyticsCard
              icon={<Ionicons name="flash" size={20} color="#8B5CF6" />}
              title="This Week's Trips"
              value="12"
              subtitle="2 Schools"
            />
          </View>

          <View className="flex-row gap-3">
            {/* Coverage Requests */}
            <AnalyticsCard
              icon={<Ionicons name="flash" size={20} color="#8B5CF6" />}
              title="Coverage Requests"
              value="12"
              subtitle="2 Schools"
            />

            {/* Total Earnings */}
            <AnalyticsCard
              icon={
                <View className="w-6 h-6 bg-teal-500 rounded-full items-center justify-center">
                  <Text className="text-white font-bold text-sm">$</Text>
                </View>
              }
              title="Total Earnings"
              value="$1,234"
              subtitle="All time"
            />
          </View>
        </View>

        {/* View Timesheet Button */}
        <View className="px-4 mb-6">
          <TouchableOpacity
            className="bg-primary rounded-full py-4 items-center"
            onPress={() => router.push("/buddi/timesheet")}
          >
            <View className="flex-row items-center gap-2">
              <Text className="text-white font-comfortaa-bold text-lg">
                View Timesheet
              </Text>
              <Ionicons name="arrow-forward" size={18} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Content Section */}
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
                    Your Pickups
                  </Text>
                  <TouchableOpacity
                    className="flex-row items-center gap-1"
                    onPress={() => router.push("/buddi/all-pickups")}
                  >
                    <Text className="text-primary font-comfortaa">
                      View All
                    </Text>
                    <Ionicons name="arrow-forward" size={16} color="#FF932E" />
                  </TouchableOpacity>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingRight: 16 }}
                >
                  {pickupsToShow.length > 0 ? (
                    pickupsToShow.map((pickup, index) => (
                      <View key={pickup.id} className="mr-4">
                        <PickupCard
                          id={pickup.id.toString()}
                          name={"Child"}
                          time={pickup.pickupTime || "-"}
                          days={pickup.availableDays?.join(", ") || "-"}
                          school={pickup.fromZone || "School"}
                          home={pickup.toZone || "Home"}
                          onButtonPress={() => {
                            router.push({
                              pathname: "/buddi/pickup/[id]",
                              params: { id: pickup.id.toString() },
                            });
                          }}
                          cardWidth={340}
                        />
                      </View>
                    ))
                  ) : (
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        width: 340,
                        height: 180,
                        backgroundColor: "#FFF7ED",
                        borderRadius: 16,
                        borderWidth: 1.2,
                        borderColor: "#FFD9B3",
                        marginRight: 12,
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
                        {showAll
                          ? "No pickups assigned yet."
                          : "No pickups for this day."}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Comfortaa-Regular",
                          fontSize: 13,
                          color: "#A3A3A3",
                          textAlign: "center",
                        }}
                      >
                        {showAll
                          ? "Once you are matched to a pickup, you will see it here."
                          : "Once you are matched to a pickup for today, you will see it here."}
                      </Text>
                    </View>
                  )}
                </ScrollView>
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
                  {coverageRequestsData.map((request, index) => (
                    <CoverageRequestCard
                      key={index}
                      studentName={request.studentName}
                      time={request.time}
                      hourlyRate={request.hourlyRate}
                      school={request.school}
                      home={request.home}
                      requesterName={request.requesterName}
                      requesterEmail={request.requesterEmail}
                      requesterAvatar={
                        request.requesterAvatar ||
                        `https://randomuser.me/api/portraits/men/${
                          index + 1
                        }.jpg`
                      }
                      onViewDetails={() => {
                        console.log(
                          "Viewing details for coverage request:",
                          request.studentName
                        );
                      }}
                      onAccept={() => {
                        console.log(
                          "Accepted coverage request for",
                          request.studentName
                        );
                      }}
                    />
                  ))}
                </View>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
