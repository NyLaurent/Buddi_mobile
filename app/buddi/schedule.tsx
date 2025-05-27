import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AnalyticsCard from "../../components/commons/AnalyticsCard";
import PickupCard from "../../components/commons/PickupCard";

export default function SchedulePage() {
  const [activeTab, setActiveTab] = useState<"pickups" | "coverage">("pickups");
  // const insets = useSafeAreaInsets();

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
    {
      name: "Sarah Wilson",
      time: "4:30:00",
      days: "$24 per hour",
      school: "Pine Middle School",
      home: "Eastside",
    },
  ];

  const coverageData = [
    {
      studentName: "Bryan Smith",
      time: "2:23:04",
      hourlyRate: "$25 per hour",
      school: "School Name",
      home: "Senen",
      requesterName: "Brian Ford",
      requesterEmail: "brianford@lok.com",
    },
    {
      studentName: "Lisa Anderson",
      time: "1:45:30",
      hourlyRate: "$30 per hour",
      school: "Maple Elementary",
      home: "Northside",
      requesterName: "Jennifer Miller",
      requesterEmail: "jennifer.m@school.edu",
    },
    {
      studentName: "David Brown",
      time: "3:20:15",
      hourlyRate: "$26 per hour",
      school: "Cedar High School",
      home: "Southside",
      requesterName: "Robert Taylor",
      requesterEmail: "r.taylor@education.net",
    },
  ];

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerStyle={{
        paddingTop: 40,
        paddingBottom: Platform.select({
          ios: 120,
          android: 110,
        }),
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 mb-6">
        <TouchableOpacity className="w-10 h-10 bg-primary rounded-xl items-center justify-center">
          <Ionicons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
        <Text className="text-xl font-comfortaa-bold">My Schedule</Text>
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
        <TouchableOpacity className="bg-primary rounded-full py-4 items-center">
          <View className="flex-row items-center gap-2">
            <Text className="text-white font-comfortaa-bold text-lg">
              View Timesheet
            </Text>
            <Ionicons name="arrow-forward" size={18} color="white" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View className="px-2 mb-6">
        <View className="flex-row items-center bg-[#F8F9FE] rounded-2xl p-1">
          <TouchableOpacity
            className={`flex-1 py-3 rounded-xl items-center ${
              activeTab === "pickups" ? "bg-white shadow-sm" : ""
            }`}
            onPress={() => setActiveTab("pickups")}
          >
            <Text
              className={`font-comfortaa-bold text-lg ${
                activeTab === "pickups" ? "text-black" : "text-gray-400"
              }`}
            >
              Your Pickups
            </Text>
          </TouchableOpacity>

          <View className="w-0.5 h-6 bg-gray-200" />

          <TouchableOpacity
            className={`flex-1 py-3 rounded-xl items-center ${
              activeTab === "coverage" ? "bg-white shadow-sm" : ""
            }`}
            onPress={() => setActiveTab("coverage")}
          >
            <Text
              className={`font-comfortaa-bold text-lg ${
                activeTab === "coverage" ? "text-black" : "text-gray-400"
              }`}
            >
              Coverage requests
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Section */}
      <View className="px-4">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="font-comfortaa-bold text-xl">
            {activeTab === "pickups" ? "Pickups" : "Coverage Requests"}
          </Text>
          <TouchableOpacity className="flex-row items-center gap-1">
            <Text className="text-primary font-comfortaa">View All</Text>
            <Ionicons name="arrow-forward" size={16} color="#FF932E" />
          </TouchableOpacity>
        </View>

        {/* Conditional Content */}
        {activeTab === "pickups" ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {pickupData.map((pickup, index) => (
              <View key={index} className="mr-4">
                <PickupCard
                  name={pickup.name}
                  time={pickup.time}
                  days={pickup.days}
                  school={pickup.school}
                  home={pickup.home}
                  onViewDetails={() =>
                    console.log(`View details for ${pickup.name}`)
                  }
                  onButtonPress={() =>
                    console.log(`Clock in for ${pickup.name}`)
                  }
                />
              </View>
            ))}
          </ScrollView>
        ) : (
          <View className="p-4">
            <Text className="text-gray-600 font-comfortaa text-center">
              Coverage requests will be displayed here
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
