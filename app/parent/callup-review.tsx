import PageHeader from "@/components/commons/PageHeader";
import CallUpReviewCard from "@/components/parent/CallUpReviewCard";
import RecommendedBuddiesCard from "@/components/parent/RecommendedBuddiesCard";
import React from "react";
import { Platform, ScrollView, Text, View } from "react-native";

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
          minHeight: "100%",
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
    </>
  );
};

export default callupReview;
