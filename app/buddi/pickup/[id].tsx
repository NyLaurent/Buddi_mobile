import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AnalyticsCard from "../../../components/commons/AnalyticsCard";
import Map from "../../../components/commons/Map";
import PickupDetailsCard from "../../../components/commons/PickupDetailsCard";

// Mock data (should be replaced with real data source)
const timesheetData = [
  {
    status: "completed",
    week: "Week 1",
    date: "23-29/5/2025",
    shifts: 10,
    amount: 12,
    hours: 12,
    paidDate: "5 May 2025",
    card: "Visa 1234",
    user: {
      name: "Brian Ford",
      email: "brianford@glok.com",
      avatar: undefined,
    },
  },
  // ...other mock entries
];

const statusColors = {
  completed: { bg: "#E6FCEB", text: "#22C55E", badge: "Paid on" },
  ongoing: { bg: "#FFF3E6", text: "#FF932E", badge: "Ongoing" },
  pending: { bg: "#E6F4FF", text: "#3CB4FF", badge: "Pending" },
  flagged: { bg: "#F4F4F4", text: "#FF5A5F", badge: "Flagged" },
};

const coverageRequests = [
  {
    name: "Bryan Smith",
    time: "1:30 Pm-2:30 Pm",
    paid: true,
    duration: "2:23:04",
    rate: "$25 per hour",
    school: "School Name",
    home: "Senen",
    parent: {
      name: "Brian Ford",
      email: "brianford@glok.com",
      avatar: undefined,
    },
  },
];

export default function TimesheetDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const idx = Number(id);
  const data = timesheetData[0]; // For demo, always show the first
  const color =
    statusColors[data.status as keyof typeof statusColors] ||
    statusColors.completed;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView style={{ flex: 1, backgroundColor: "" }}>
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
            style={{
              backgroundColor: "#FF932E",
              borderRadius: 12,
              padding: 8,
            }}
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={{ fontFamily: "Comfortaa-Bold", fontSize: 16 }}>
            Timesheet at {data.date}
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: "#FF932E",
              borderRadius: 12,
              padding: 8,
            }}
          >
            <Ionicons name="ellipsis-horizontal" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        {/* Analytics Card Row */}
      
        {/* Coverage Requests */}
        <View style={{ marginHorizontal: 10, marginBottom: 16 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <Text style={{ fontFamily: "Comfortaa-Bold", fontSize: 16 }}>
              Coverage Requests
            </Text>
            <Text style={{ color: color.text, fontFamily: "Comfortaa-Bold" }}>
              View All
            </Text>
          </View>
          {/* PickupDetailsCard (paid variant) */}

          
          <PickupDetailsCard
            variant="request"
            studentName={coverageRequests[0].name}
            time={coverageRequests[0].time}
            hourlyRate={coverageRequests[0].rate}
            school={coverageRequests[0].school}
            home={coverageRequests[0].home}
            parentName={coverageRequests[0].parent.name}
            parentEmail={coverageRequests[0].parent.email}
            parentAvatar={coverageRequests[0].parent.avatar}
            onViewDetails={() => {}}
          />
        </View>
        {/* Trip Map */}
        <View style={{ marginHorizontal: 16, marginBottom: 32 }}>
          <Text
            style={{
              fontFamily: "Comfortaa-Bold",
              fontSize: 16,
              marginBottom: 8,
            }}
          >
            Trip Map
          </Text>
          <Map
            initialRegion={{
              latitude: 40.7128, // NYC coordinates
              longitude: -74.006,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
