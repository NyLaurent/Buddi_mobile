import PageHeader from "@/components/commons/PageHeader";
import CallUpReviewCard from "@/components/parent/CallUpReviewCard";
import RecommendedBuddiesCard from "@/components/parent/RecommendedBuddiesCard";
import React from "react";
import { ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const demoBuddies = [
  {
    name: "Brian Ford",
    email: "brianford@lok.com",
    avatar: undefined, // or provide a URL
    available: true,
    rank: "No1",
  },
  // You can add more buddies here
];

const callupReview = () => {
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
      <ScrollView
        className="flex-1 bg-white"
        contentContainerStyle={{
          paddingBottom: 20,
        }}
      >
        <PageHeader title="My Buddi" />
        <Text className="text-lg font-comfortaa-bold px-2">
          Call Up Preview
        </Text>
        <View className="px-2">
          <CallUpReviewCard
            name="Brian Ford"
            email="brianford@lok.com"
            school="School, Name"
            requestedAgo="2 Days ago"
            description="Fill in the details below to invite Buddis to apply."
            schoolName="School Name"
            home="Senen"
            assignedKids={[{ name: "Bryan Smith" }, { name: "Bryan Smith" }]}
            onRemove={() => {
              /* handle remove */
            }}
            onApplicants={() => {
              /* handle applicants */
            }}
          />
          {/* Show with buddies: */}
          <RecommendedBuddiesCard buddies={[]} />
          {/* Show with no buddies: */}
          {/* <RecommendedBuddiesCard buddies={[]} /> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default callupReview;
