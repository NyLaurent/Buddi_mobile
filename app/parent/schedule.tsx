import AnalyticsCard from "@/components/commons/AnalyticsCard";
import KidPickupCard from "@/components/parent/KidPickupCard";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const pickupData = [
  {
    name: "Bryan Smith",
    time: "2:23:04",
    days: "$25 per hour",
    school: "School Nome",
    home: "Senen",
  },
  // Add more pickup objects as needed
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
  // Add more coverage request objects as needed
];

const SchedulePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState("pickups");

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{
        paddingTop: 40,
        paddingBottom: Platform.select({
          ios: 120,
          android: 110,
        }),
      }}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-row items-center justify-between px-4 mb-6">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 bg-primary rounded-xl items-center justify-center"
        >
          <Ionicons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
        <Text className="text-xl font-comfortaa-bold">Pickup Schedule</Text>
        <TouchableOpacity className="w-10 h-10 bg-primary rounded-xl items-center justify-center">
          <Ionicons name="ellipsis-horizontal" size={20} color="white" />
        </TouchableOpacity>
      </View>

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
      <View className="px-4 mb-6">
        <TouchableOpacity
          className="bg-primary rounded-full py-4 items-center"
          onPress={() => router.push("/parent")}
        >
          <View className="flex-row items-center gap-2">
            <Text className="text-white font-comfortaa-bold text-lg">
              View Buddis&apos;s Timesheets
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
                  activeTab === "pickups" ? "text-black" : "text-gray-400"
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
                  activeTab === "coverage" ? "text-black" : "text-gray-400"
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
                <TouchableOpacity className="flex-row items-center gap-1">
                  <Text className="text-primary font-comfortaa">View All</Text>
                  <Ionicons name="arrow-forward" size={16} color="#FF932E" />
                </TouchableOpacity>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 16 }}
              >
                {pickupData.map((pickup, index) => (
                  <View key={index} className="mr-4" style={{ width: 280 }}>
                    <KidPickupCard
                      childName={pickup.name}
                      remaining={pickup.time}
                      schedule={pickup.days}
                      buddiName={"-"}
                      buddiEmail={"-"}
                      buddiAvatar={
                        "https://randomuser.me/api/portraits/men/2.jpg"
                      }
                      buddiStatus={"Available"}
                      schoolName={pickup.school}
                      destination={pickup.home}
                      mainAction={"Trip Not Yet Started"}
                      variant="default"
                    />
                  </View>
                ))}
              </ScrollView>
            </>
          ) : (
            <>
              <View className="flex-row items-center justify-between mb-4">
                <Text className="font-comfortaa-bold text-xl">
                  Coverage Requests
                </Text>
                <TouchableOpacity className="flex-row items-center gap-1">
                  <Text className="text-primary font-comfortaa">View All</Text>
                  <Ionicons name="arrow-forward" size={16} color="#FF932E" />
                </TouchableOpacity>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 16 }}
              >
                {coverageRequestsData.map((request, index) => (
                  <View key={index} className="mr-4" style={{ width: 280 }}>
                    <KidPickupCard
                      childName={request.studentName}
                      remaining={request.time}
                      schedule={request.hourlyRate}
                      buddiName={request.requesterName}
                      buddiEmail={request.requesterEmail}
                      buddiAvatar={
                        request.requesterAvatar ||
                        "https://randomuser.me/api/portraits/men/4.jpg"
                      }
                      buddiStatus={"Pending"}
                      schoolName={request.school}
                      destination={request.home}
                      mainAction={"Request Coverage"}
                      variant="coverage"
                    />
                  </View>
                ))}
              </ScrollView>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default SchedulePage;
