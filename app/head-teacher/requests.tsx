import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CoverageAlertCard from "../../components/admin/CoverageAlertCard";
import PageHeader from "../../components/commons/PageHeader";
import ReferencedStudentProfileCard from "../../components/head-teacher/ReferencedStudentProfileCard";
import StatCard from "../../components/head-teacher/StatCard";

const RequestPage = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ height: 24 }} />
      <PageHeader title="Pending References Requests" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 32,
        }}
      >
        <StatCard
          title="Pending"
          value="12"
          subtitle="2 Schools"
          icon={<Ionicons name="flash-outline" size={24} color="#fff" />}
          accentColor="#2EC8FF"
          iconBgColor="#A259FF"
        />
        <CoverageAlertCard
          title="School, Name"
          subtitle="Your school has student buddis working the after school pickups for young brothers and sisters"
          description=""
          primaryButton={{
            label: "View All Buddis from your school",
            icon: (
              <Ionicons
                name="sync-outline"
                size={20}
                color="#fff"
                style={{ marginLeft: 6 }}
              />
            ),
            onPress: () => {},
          }}
        />
        {/* Reference Requests Section */}
        <View style={{ marginTop: 16 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Comfortaa-Bold",
                color: "#23272F",
              }}
            >
              Reference Requests
            </Text>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Text
                style={{
                  color: "#FF9100",
                  fontSize: 15,
                  fontFamily: "Comfortaa-Bold",
                  marginRight: 4,
                }}
              >
                View All
              </Text>
              <Ionicons
                name="arrow-forward-outline"
                size={16}
                color="#FF9100"
              />
            </TouchableOpacity>
          </View>
          {/* Search and Filter Row */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
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
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 8 }}
          >
            <View style={{ flexDirection: "column" }}>
              {/* First row */}
              <View style={{ flexDirection: "row" }}>
                {[1, 2, 3].map((i) => (
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
                      buttonLabel="Provide Review"
                      buttonIcon={
                        <Ionicons
                          name="create-outline"
                          size={20}
                          color="#fff"
                          style={{ marginRight: 8 }}
                        />
                      }
                    />
                  </View>
                ))}
              </View>
              {/* Second row */}
              <View style={{ flexDirection: "row", marginTop: 8 }}>
                {[4, 5, 6].map((i) => (
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
                      buttonLabel="Provide Review"
                      buttonIcon={
                        <Ionicons
                          name="create-outline"
                          size={20}
                          color="#fff"
                          style={{ marginRight: 8 }}
                        />
                      }
                    />
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RequestPage;
