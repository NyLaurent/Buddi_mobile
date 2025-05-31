import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AnalyticsCard from "../../../../components/commons/AnalyticsCard";
import Map from "../../../../components/commons/Map";
import PickupDetailsCard from "../../../../components/commons/PickupDetailsCard";

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
        <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
          <AnalyticsCard
            icon={
              <View
                style={{
                  backgroundColor: "#A259FF",
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="flash" size={28} color="#fff" />
              </View>
            }
            title="Total Hours"
            value={`${data.hours} hrs`}
            subtitle={`In ${data.shifts} shifts`}
          />
        </View>
        {/* Payment/User Info Row */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginHorizontal: 16,
            marginBottom: 16,
          }}
        >
          {/* Left: Info */}
          <View style={{ flex: 1 }}>
            {/* Paid Badge */}
            <View
              style={{
                backgroundColor: "#22C55E",
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 6,
                alignSelf: "flex-start",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Ionicons
                name="time-outline"
                size={18}
                color="#fff"
                style={{ marginRight: 6 }}
              />
              <Text
                style={{
                  color: "#fff",
                  fontFamily: "Comfortaa-Bold",
                  fontSize: 15,
                }}
              >
                Paid on {data.paidDate}
              </Text>
            </View>
            {/* Card Info */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <View
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "#E8E8E8",
                  paddingHorizontal: 18,
                  paddingVertical: 10,
                  marginRight: 12,
                  shadowColor: "#000",
                  shadowOpacity: 0.04,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Comfortaa-Bold",
                    color: "#1E1E1E",
                    fontSize: 18,
                  }}
                >
                  VISA
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: "Comfortaa-Regular",
                  fontSize: 18,
                  color: "#222",
                }}
              >
                {data.card}
              </Text>
            </View>
            {/* User Info */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <Image
                source={{
                  uri:
                    data.user.avatar ||
                    "https://randomuser.me/api/portraits/men/32.jpg",
                }}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  marginRight: 14,
                }}
              />
              <View>
                <Text
                  style={{
                    fontFamily: "Comfortaa-Bold",
                    fontSize: 20,
                    color: "#222",
                  }}
                >
                  {data.user.name}
                </Text>
                <Text
                  style={{
                    fontFamily: "Comfortaa-Regular",
                    fontSize: 16,
                    color: "#888",
                  }}
                >
                  {data.user.email}
                </Text>
              </View>
            </View>
          </View>
          {/* Right: Celebration Image (now Wallet Icon) */}
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: "#22C55E",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: 12,
              marginTop: 2,
            }}
          >
            <Ionicons name="wallet" size={32} color="#fff" />
          </View>
        </View>
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
            variant="paid"
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
              latitude: -33.8688, // Example coordinates - replace with actual trip coordinates
              longitude: 151.2093,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
