import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TimeSheetCard from "../../../components/commons/TimeSheetCard";
import TimesheetStatusCard from "../../../components/commons/TimesheetStatusCard";

const timesheetData: {
  week: string;
  date: string;
  shifts: number;
  status: "ongoing" | "pending" | "completed" | "flagged";
  amount: number;
}[] = [
  {
    week: "Week 1",
    date: "2-8 th, May, 2025",
    shifts: 23,
    status: "ongoing",
    amount: 40,
  },
  {
    week: "Week 1",
    date: "2-8 th, May, 2025",
    shifts: 23,
    status: "pending",
    amount: 40,
  },
  {
    week: "Week 1",
    date: "2-8 th, May, 2025",
    shifts: 23,
    status: "completed",
    amount: 40,
  },
  {
    week: "Week 1",
    date: "2-8 th, May, 2025",
    shifts: 23,
    status: "completed",
    amount: 40,
  },
  {
    week: "Week 1",
    date: "2-8 th, May, 2025",
    shifts: 23,
    status: "flagged",
    amount: 40,
  },
  {
    week: "Week 2",
    date: "9-15 th, May, 2025",
    shifts: 18,
    status: "flagged",
    amount: 32,
  },
  {
    week: "Week 3",
    date: "16-22 th, May, 2025",
    shifts: 20,
    status: "flagged",
    amount: 36,
  },
];

export default function TimesheetPage() {
  const [activeTab, setActiveTab] = useState<"submitted" | "flagged">(
    "submitted"
  );
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          className="flex-1 bg-white"
          contentContainerStyle={{
            paddingTop: 40,
            paddingBottom: Platform.OS === "ios" ? 100 : 80,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between px-2 mb-6">
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
          <View className="px-1 mb-6">
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              <View style={{ width: "48%" }}>
                <TimeSheetCard
                  icon={
                    <View
                      style={{
                        backgroundColor: "#188CFF",
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons name="flash" size={20} color="white" />
                    </View>
                  }
                  value="12"
                  title="Total Trips"
                />
              </View>
              <View style={{ width: "48%" }}>
                <TimeSheetCard
                  icon={
                    <View
                      style={{
                        backgroundColor: "#3CB4FF",
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons name="timer" size={20} color="white" />
                    </View>
                  }
                  value="12"
                  title="Hours Worked"
                />
              </View>
              <View style={{ width: "48%" }}>
                <TimeSheetCard
                  icon={
                    <View
                      style={{
                        backgroundColor: "#A259FF",
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons name="cash" size={20} color="white" />
                    </View>
                  }
                  value="12"
                  title="Earnings"
                />
              </View>
              <View style={{ width: "48%" }}>
                <TimeSheetCard
                  icon={
                    <View
                      style={{
                        backgroundColor: "#FFB800",
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons name="document-text" size={20} color="white" />
                    </View>
                  }
                  value="12"
                  title="Timesheets"
                />
              </View>
            </View>
          </View>

          {/* Tab Navigator */}
          <View className="px-2">
            <View
              className="flex-row bg-[#F8F9FE] rounded-full mb-6 items-center justify-between min-h-[48px] px-1 mx-2 self-center"
              style={{ maxWidth: 360, width: "100%" }}
            >
              <TouchableOpacity
                className={`flex-1 items-center rounded-full ${
                  activeTab === "submitted" ? "bg-white mx-1 py-2" : "py-2"
                }`}
                onPress={() => setActiveTab("submitted")}
              >
                <Text
                  className={`font-comfortaa-bold text-base ${
                    activeTab === "submitted" ? "text-black" : "text-gray-400"
                  }`}
                >
                  Submitted
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 items-center rounded-full ${
                  activeTab === "flagged" ? "bg-white mx-1 py-2" : "py-2"
                }`}
                onPress={() => setActiveTab("flagged")}
              >
                <Text
                  className={`font-comfortaa-bold text-base ${
                    activeTab === "flagged" ? "text-black" : "text-gray-400"
                  }`}
                >
                  Flagged sheets
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Timesheets Section */}
          <View className="px-3">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="font-comfortaa-bold text-lg">Timesheets</Text>
              <TouchableOpacity className="flex-row items-center gap-1">
                <Text className="text-primary font-comfortaa text-sm">
                  Clear older
                </Text>
                <Ionicons name="trash-outline" size={16} color="#FF5A5F" />
              </TouchableOpacity>
            </View>
            {/* Search and Filter */}
            <View className="flex-row items-center mb-4">
              <View className="flex-1 flex-row items-center bg-[#F8F9FE] rounded-full border border-[#E0E0E0] px-3 py-2 mr-2">
                <Ionicons name="search" size={18} color="#B0B0B0" />
                <TextInput
                  placeholder="Search"
                  className="flex-1 ml-2 text-base font-comfortaa"
                  placeholderTextColor="#B0B0B0"
                />
              </View>
              <TouchableOpacity className="bg-[#F8F9FE] rounded-2xl border border-[#E0E0E0] p-3">
                <Ionicons name="filter" size={18} color="#B0B0B0" />
              </TouchableOpacity>
            </View>
            {/* Timesheet Cards */}
            {timesheetData
              .filter((item) =>
                activeTab === "flagged"
                  ? item.status === "flagged"
                  : item.status !== "flagged"
              )
              .map((item, idx) => (
                <TimesheetStatusCard
                  key={idx}
                  status={item.status}
                  week={item.week}
                  date={item.date}
                  shifts={item.shifts}
                  amount={item.amount}
                  chevron={
                    <TouchableOpacity
                      onPress={() => {
                        router.push(`/buddi/timesheet/${idx}` as any);
                      }}
                    >
                      <Ionicons
                        name="chevron-forward"
                        size={22}
                        color="#B0B0B0"
                      />
                    </TouchableOpacity>
                  }
                />
              ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
