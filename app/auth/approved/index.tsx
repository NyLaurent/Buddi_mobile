import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY_COLOR = "#FF932E";

const ApprovedPage = () => {
  const router = useRouter();

  const handleStartInterview = () => {
    router.push("/auth/interview-guidelines");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with profile - styled like waitlist page */}
        <View
          style={{
            backgroundColor: PRIMARY_COLOR,
            paddingVertical: 32,
            paddingHorizontal: 16,
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
          }}
        >
          <View className="items-center mb-2">
            <View className="w-24 h-24 rounded-full overflow-hidden border-2 border-white mb-2">
              <Image
                source={require("../../../assets/images/auth/avatar.png")}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <Text className="text-xl font-comfortaa-bold text-white mb-1">
              John Doe Smith
            </Text>
            <Text className="font-comfortaa text-white opacity-80">
              johndoe@gmail.com
            </Text>
          </View>
        </View>
        {/* Approval Card with Blur Container - updated to match image */}
        <View className="mx-4 -mt-6" style={{ zIndex: 10 }}>
          {/* Blur container */}
          <View
            className="rounded-3xl p-4 overflow-hidden"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 1,
              zIndex: 10,
            }}
          >
            {/* Card with blue border - styled to match image */}
            <View
              className="bg-white rounded-3xl overflow-hidden mb-4 p-5"
              style={{
                borderWidth: 1.5,
                borderColor: "#0099ff",
                borderRadius: 24,
              }}
            >
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-comfortaa-bold text-gray-800">
                  Congratulations!
                </Text>
                <Image
                  source={require("../../../assets/images/auth/confetti.png")}
                  style={{ width: 24, height: 24 }}
                  resizeMode="contain"
                />
              </View>

              <View className="flex-row">
                <View className="mr-6">
                  {/* Success checkmark image */}
                  <Image
                    source={require("../../../assets/images/auth/success.png")}
                    style={{ width: 64, height: 64 }}
                    resizeMode="contain"
                  />
                </View>

                <View style={{ flex: 1, justifyContent: "center" }}>
                  <Text className="font-comfortaa-bold text-lg text-gray-800 mb-1">
                    Your Account was approved!
                  </Text>
                  <Text className="font-comfortaa text-xs text-gray-500">
                    2 hrs ago, 20th, May, 2025
                  </Text>
                </View>
              </View>
            </View>

            {/* Action Buttons - styled like waitlist page */}
            <View className="flex-row items-center justify-between px-2 mt-1">
              <TouchableOpacity
                className="flex-row items-center justify-center py-3 px-5 rounded-full mr-3"
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: "#EAEBF0",
                  backgroundColor: "#fff",
                }}
              >
                <Ionicons
                  name="arrow-back"
                  size={18}
                  color="#666"
                  style={{ marginRight: 8 }}
                />
                <Text className="font-comfortaa-bold text-gray-700 text-base">
                  Update Info
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center justify-center py-3 px-5 rounded-full"
                style={{ backgroundColor: PRIMARY_COLOR, flex: 1 }}
              >
                <Text className="font-comfortaa-bold text-white text-base">
                  View profile
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color="white"
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* Interview Section - updated to match image exactly */}
        <View className="mx-4 mb-12 mt-14">
          <View
            className="bg-[#F9F9F9] rounded-3xl overflow-hidden relative p-5"
            style={{
              borderWidth: 1,
              borderColor: "#F0F0F0",
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 5,
              elevation: 1,
            }}
          >
            {/* Red camera icon */}
            <View className="absolute top-5 left-5">
              <View
                style={{
                  backgroundColor: "#FF3B30",
                  padding: 4,
                  borderRadius: 6,
                }}
              >
                <Ionicons name="videocam" size={20} color="white" />
              </View>
            </View>

            {/* Blue timer badge */}
            <View className="absolute top-5 right-5 bg-blue-600 py-1 px-3 rounded-full">
              <Text className="text-white text-xs font-comfortaa-bold">
                23h : 23m : 21s
              </Text>
            </View>

            {/* Center content */}
            <View className="items-center pt-12 pb-5">
              <Image
                source={require("../../../assets/images/auth/interview.png")}
                style={{ width: 80, height: 80 }}
                resizeMode="contain"
              />

              <Text className="text-gray-800 text-lg font-comfortaa-bold text-center mt-5 mb-2">
                Answer & Record Your Interview
              </Text>

              <Text className="font-comfortaa text-center text-gray-500 mb-6">
                Record your responses to a few questions{"\n"}
                to help us evaluate your fit
              </Text>

              <TouchableOpacity
                className="py-3 rounded-full w-full"
                style={{ backgroundColor: PRIMARY_COLOR }}
                onPress={handleStartInterview}
              >
                <View className="flex-row items-center justify-center">
                  <Text className="font-comfortaa-bold text-white text-center text-base mr-2">
                    Start Interview
                  </Text>
                  <Ionicons name="videocam" size={18} color="white" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* Bottom decoration */}
        <Image
          source={require("../../../assets/images/onboarding/bottom_right.png")}
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 150,
            height: 150,
            opacity: 0.6,
            zIndex: -1,
          }}
          resizeMode="contain"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ApprovedPage;
