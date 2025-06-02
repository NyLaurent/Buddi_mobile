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
  const [activeTab, setActiveTab] = React.useState("pickups");
  const [pickupIndex, setPickupIndex] = React.useState(0);

  return (
    <>
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: Platform.OS === "android" ? 32 : 0,
          backgroundColor: "white",
          zIndex: 10,
        }}
      />
      <ScrollView
        className="flex-1 bg-white"
        contentContainerStyle={{
          paddingTop: Platform.OS === "android" ? 32 : 0,
          paddingBottom: 2,
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
                    Scheduled Pickups
                  </Text>
                  <TouchableOpacity className="flex-row items-center gap-1">
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
                  onScroll={(e) => {
                    const x = e.nativeEvent.contentOffset.x;
                    setPickupIndex(Math.round(x / 338)); // 338 = card width
                  }}
                  scrollEventThrottle={16}
                >
                  {pickupData.map((pickup, index) => (
                    <View key={index} className="mr-4" style={{ width: 338 }}>
                      <KidPickupCard
                        childName={pickup.name}
                        remaining={pickup.time}
                        schedule={pickup.days}
                        buddiName={"Brian Foday"}
                        buddiEmail={"brianfoday@gmail.com"}
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
                <View className="flex-row justify-center items-center mt-2 mb-2">
                  {pickupData.map((_, i) => (
                    <View
                      key={i}
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        marginHorizontal: 4,
                        backgroundColor:
                          pickupIndex === i ? "#FF9100" : "#E0E0E0",
                      }}
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
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingRight: 16 }}
                >
                  {coverageRequestsData.map((request, index) => (
                    <View key={index} className="mr-4" style={{ width: 338 }}>
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
    </>
  );
};

export default SchedulePage;
