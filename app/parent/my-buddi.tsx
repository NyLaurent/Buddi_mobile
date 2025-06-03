import AnalyticsCard from "@/components/commons/AnalyticsCard";
import PageHeader from "@/components/commons/PageHeader";
import AvailableBuddie from "@/components/parent/AvailableBuddie";
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

const MyBuddyPage = () => {
  const router = useRouter();
  // Example: render 5 buddie cards
  const buddieCards = Array.from({ length: 5 });

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
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="pt-5">
          <PageHeader title="My Buddi" />
          <View className="flex-row gap-3 px-3">
            <AnalyticsCard
              icon={<Ionicons name="flash" size={20} color="#8B5CF6" />}
              title="Today's Pickups"
              value="12"
              subtitle="2 Schools"
            />
            <AnalyticsCard
              icon={<Ionicons name="send" size={20} color="#FF932E" />}
              title="This Week's Trips"
              value="12"
              subtitle="2 Schools"
            />
          </View>
          <View className="px-4 mt-6">
            <TouchableOpacity
              className="bg-primary rounded-full py-4 items-center flex-row justify-center"
              activeOpacity={0.8}
            >
              <Text className="text-white font-comfortaa-bold text-lg mr-2">
                View Timesheets
              </Text>
              <Ionicons name="arrow-forward" size={22} color="white" />
            </TouchableOpacity>
          </View>
          <View className="px-2 mt-6">
            <Text className="text-lg font-comfortaa-bold mb-3">
              Available Buddies
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-4">
                {buddieCards.map((_, idx) => (
                  <View key={idx} style={{ width: 340, maxWidth: 420 }}>
                    <AvailableBuddie />
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default MyBuddyPage;
