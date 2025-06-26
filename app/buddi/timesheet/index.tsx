import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TimeSheetCard from "../../../components/commons/TimeSheetCard";
import TimesheetStatusCard from "../../../components/commons/TimesheetStatusCard";

const submittedTimeSheets = [
  {
    id: "1",
    childName: "Bryan Smith",
    date: "Jan 16, 2024",
    checkInTime: "8:45:08 AM",
    checkOutTime: "3:23:08 PM",
    duration: "6h 38m",
    status: "Submitted",
  },
  {
    id: "2",
    childName: "Emma Johnson",
    date: "Jan 15, 2024",
    checkInTime: "7:30:00 AM",
    checkOutTime: "2:45:30 PM",
    duration: "7h 15m",
    status: "Submitted",
  },
  {
    id: "3",
    childName: "Michael Davis",
    date: "Jan 14, 2024",
    checkInTime: "8:15:12 AM",
    checkOutTime: "3:45:45 PM",
    duration: "7h 30m",
    status: "Submitted",
  },
  {
    id: "4",
    childName: "Sarah Wilson",
    date: "Jan 13, 2024",
    checkInTime: "8:00:00 AM",
    checkOutTime: "3:00:00 PM",
    duration: "7h 0m",
    status: "Submitted",
  },
];

const flaggedTimeSheets = [
  {
    id: "1",
    childName: "Olivia Brown",
    date: "Jan 16, 2024",
    checkInTime: "8:45:08 AM",
    checkOutTime: "--:--:-- --",
    duration: "Incomplete",
    status: "Flagged",
    reason: "Missing checkout time",
  },
  {
    id: "2",
    childName: "Liam Miller",
    date: "Jan 15, 2024",
    checkInTime: "7:30:00 AM",
    checkOutTime: "1:45:30 PM",
    duration: "6h 15m",
    status: "Flagged",
    reason: "Early checkout",
  },
];

export default function TimesheetPage() {
  const [activeTab, setActiveTab] = useState<"submitted" | "flagged">(
    "submitted"
  );
  const router = useRouter();

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
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          className="flex-1 bg-transparent"
          contentContainerStyle={{
            paddingBottom: Platform.OS === "ios" ? 100 : 80,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between px-2 mb-6 pt-6">
            <TouchableOpacity
              className="w-10 h-10 bg-primary rounded-xl items-center justify-center"
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={20} color="white" />
            </TouchableOpacity>
            <Text className="text-xl font-comfortaa-bold">
              Timesheet Viewer
            </Text>
            <TouchableOpacity className="w-10 h-10 bg-primary rounded-xl items-center justify-center">
              <Ionicons name="ellipsis-horizontal" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Analytics Cards */}
          <View className="flex-row gap-3 mx-4 mb-6">
            <View className="bg-white rounded-xl p-4 flex-1 border border-gray-100 shadow-sm">
              <View className="flex-row items-center mb-1">
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <Text className="ml-2 font-comfortaa-bold text-lg">
                  {submittedTimeSheets.length}
                </Text>
              </View>
              <Text className="font-comfortaa text-gray-500 text-sm">
                Submitted
              </Text>
            </View>
            <View className="bg-white rounded-xl p-4 flex-1 border border-gray-100 shadow-sm">
              <View className="flex-row items-center mb-1">
                <Ionicons name="flag" size={20} color="#EF4444" />
                <Text className="ml-2 font-comfortaa-bold text-lg">
                  {flaggedTimeSheets.length}
                </Text>
              </View>
              <Text className="font-comfortaa text-gray-500 text-sm">
                Flagged
              </Text>
            </View>
          </View>

          {/* Tab Navigator */}
          <View className="mx-4 mb-6">
            <View className="flex-row bg-[#F8F9FE] rounded-lg">
              <TouchableOpacity
                className={`flex-1 items-center py-3 rounded-lg ${
                  activeTab === "submitted" ? "bg-white mx-1" : ""
                }`}
                onPress={() => setActiveTab("submitted")}
              >
                <Text
                  className={`font-comfortaa-bold text-base ${
                    activeTab === "submitted" ? "text-black" : "text-gray-400"
                  }`}
                >
                  Submitted ({submittedTimeSheets.length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 items-center py-3 rounded-lg ${
                  activeTab === "flagged" ? "bg-white mx-1" : ""
                }`}
                onPress={() => setActiveTab("flagged")}
              >
                <Text
                  className={`font-comfortaa-bold text-base ${
                    activeTab === "flagged" ? "text-black" : "text-gray-400"
                  }`}
                >
                  Flagged ({flaggedTimeSheets.length})
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Content */}
          <View className="mx-4">
            {activeTab === "submitted" ? (
              <FlatList
                data={submittedTimeSheets}
                renderItem={({ item }) => (
                  <TimeSheetCard
                    key={item.id}
                    icon={
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#10B981"
                      />
                    }
                    value={item.duration}
                    title={`${item.childName} - ${item.date}`}
                  />
                )}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View className="h-3" />}
              />
            ) : (
              <FlatList
                data={flaggedTimeSheets}
                renderItem={({ item }) => (
                  <TimesheetStatusCard
                    key={item.id}
                    status={item.status.toLowerCase()}
                    week={item.childName}
                    date={item.date}
                    shifts={1}
                    amount={0}
                  />
                )}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View className="h-3" />}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
