import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageHeader from "../../components/commons/PageHeader";
import ReferencedStudentProfileCard from "../../components/head-teacher/ReferencedStudentProfileCard";
import StatCard from "../../components/head-teacher/StatCard";

const CARD_GAP = 12;
const CARD_WIDTH = (Dimensions.get("window").width - 16 * 2 - CARD_GAP) / 2;

const StudentPage = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ height: 24 }} />
      <PageHeader title="Student Buddis" />
      <View style={{ paddingHorizontal: 16, marginTop: 32 }}>
        <StatCard
          title="Total Approved Student"
          value="12"
          subtitle="2 Schools"
          icon={<Ionicons name="flash-outline" size={24} color="#fff" />}
          accentColor="#2EC8FF"
          iconBgColor="#A259FF"
        />
      </View>
      {/* Student References Section */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 32 }}
      >
        <Text
          style={{
            fontSize: 18,
            fontFamily: "Comfortaa-Bold",
            color: "#23272F",
            marginLeft: 8,
            marginTop: 8,
            marginBottom: 8,
          }}
        >
          Student References
        </Text>
        {/* Search and Filter Row */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
            paddingHorizontal: 4,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#F6F6F6",
              borderRadius: 20,
              paddingHorizontal: 12,
              height: 40,
            }}
          >
            <Ionicons
              name="search"
              size={18}
              color="#888"
              style={{ marginRight: 6 }}
            />
            <TextInput
              placeholder="Search"
              placeholderTextColor="#888"
              style={{
                flex: 1,
                fontFamily: "Comfortaa-Regular",
                fontSize: 15,
                color: "#23272F",
              }}
            />
          </View>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#F6F6F6",
              borderRadius: 20,
              paddingHorizontal: 16,
              height: 40,
              marginLeft: 8,
            }}
          >
            <Ionicons
              name="filter"
              size={18}
              color="#888"
              style={{ marginRight: 4 }}
            />
            <Text
              style={{
                fontFamily: "Comfortaa-Regular",
                color: "#23272F",
                fontSize: 15,
              }}
            >
              Filter
            </Text>
          </TouchableOpacity>
        </View>
        {/* 2-row, 3-column horizontally scrollable grid of cards */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 8 }}>
          <View style={{ flexDirection: 'column' }}>
            {/* First row */}
            <View style={{ flexDirection: 'row' }}>
              {[1,2,3].map((i) => (
                <View key={i} style={{ marginRight: 12 }}>
                  <ReferencedStudentProfileCard
                    image={require("../../assets/images/parent/no-buddi.png")}
                    name="Brian Ford"
                    email="brianford@lok.com"
                    phone="1-212-1234567"
                    status="Active"
                    date="23, May, 2025"
                    time="2:01 pm"
                    onViewProfile={() => {}}
                  />
                </View>
              ))}
            </View>
            {/* Second row */}
            <View style={{ flexDirection: 'row', marginTop: 8 }}>
              {[4,5,6].map((i) => (
                <View key={i} style={{ marginRight: 12 }}>
                  <ReferencedStudentProfileCard
                    image={require("../../assets/images/parent/no-buddi.png")}
                    name="Brian Ford"
                    email="brianford@lok.com"
                    phone="1-212-1234567"
                    status="Active"
                    date="23, May, 2025"
                    time="2:01 pm"
                    onViewProfile={() => {}}
                  />
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StudentPage;
