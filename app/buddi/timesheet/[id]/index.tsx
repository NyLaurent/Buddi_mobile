import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

// Mock data (should be replaced with real data source)
const timesheetData = [
  {
    status: "flagged",
    week: "Week 1",
    date: "2024-03-01",
    shifts: 4,
    amount: 200,
  },
  {
    status: "flagged",
    week: "Week 2",
    date: "2024-03-08",
    shifts: 5,
    amount: 250,
  },
  {
    status: "flagged",
    week: "Week 3",
    date: "2024-03-15",
    shifts: 3,
    amount: 150,
  },
  {
    status: "flagged",
    week: "Week 4",
    date: "2024-03-22",
    shifts: 6,
    amount: 300,
  },
];

const statusColors = {
  completed: { bg: "#E6FCEB", text: "#22C55E" },
  ongoing: { bg: "#FFF3E6", text: "#FF932E" },
  pending: { bg: "#E6F4FF", text: "#3CB4FF" },
  flagged: { bg: "#F4F4F4", text: "#FF5A5F" },
};

export default function TimesheetDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const idx = Number(id);
  const data = timesheetData[idx] || timesheetData[0];
  const color =
    statusColors[data.status as keyof typeof statusColors] ||
    statusColors.completed;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 16,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ backgroundColor: color.text, borderRadius: 12, padding: 8 }}
        >
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          Timesheet at {data.date}
        </Text>
        <TouchableOpacity
          style={{ backgroundColor: color.text, borderRadius: 12, padding: 8 }}
        >
          <Ionicons name="ellipsis-horizontal" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      {/* Status Badge */}
      <View style={{ alignItems: "flex-end", paddingHorizontal: 16 }}>
        <View
          style={{
            backgroundColor: color.text,
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 4,
            marginBottom: 8,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            {data.status.toUpperCase()}
          </Text>
        </View>
      </View>
      {/* Main Card */}
      <View
        style={{
          backgroundColor: color.bg,
          margin: 16,
          borderRadius: 16,
          padding: 20,
          alignItems: "center",
        }}
      >
        <Ionicons
          name="flash"
          size={32}
          color={color.text}
          style={{ marginBottom: 8 }}
        />
        <Text style={{ fontSize: 24, fontWeight: "bold", color: color.text }}>
          {data.amount} USD
        </Text>
        <Text style={{ color: color.text, marginTop: 4 }}>
          {data.shifts} shifts
        </Text>
      </View>
      {/* Details Section */}
      <View style={{ marginHorizontal: 16, marginBottom: 24 }}>
        <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>
          Details
        </Text>
        <Text>Week: {data.week}</Text>
        <Text>Date: {data.date}</Text>
        <Text>Status: {data.status}</Text>
        <Text>Shifts: {data.shifts}</Text>
        <Text>Amount: {data.amount} USD</Text>
      </View>
      {/* Add more sections as needed, e.g., coverage requests, trip map, etc. */}
    </ScrollView>
  );
}
