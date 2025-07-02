import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY_COLOR = "#FF932E";

const WaitlistScreen = () => {
  const router = useRouter();

  // Handler to navigate to approved page
  const handleNavigateToApproved = () => {
    router.replace("../approved");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar
        style="dark"
        backgroundColor={PRIMARY_COLOR}
        translucent={false}
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}>
        {/* Header with profile */}
        <View
          style={{
            backgroundColor: PRIMARY_COLOR,
            paddingVertical: 32,
            paddingHorizontal: 16,
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
            alignItems: "center",
          }}
        >
          <View className="items-center mb-2">
            <View className="w-24 h-24 rounded-full overflow-hidden border-2 border-white mb-2">
              <Image
                source={require("../../../assets/images/onboarding/onboarding_1.png")}
                className="w-full h-full"
                resizeMode="cover"
                defaultSource={require("../../../assets/images/onboarding/onboarding_1.png")}
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

        {/* Registration Status Card with Blur Container */}
        <View className="mx-4 -mt-6">
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
            }}
          >
            {/* Card with blue border */}
            <View
              className="bg-white rounded-3xl overflow-hidden mb-4"
              style={{
                borderWidth: 1.5,
                borderColor: "#007AFF",
              }}
            >
              <View className="p-6">
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-lg font-comfortaa-bold text-gray-800">
                    Registration Status
                  </Text>
                  <View
                    style={{
                      backgroundColor: "#e6f7ff",
                      borderRadius: 16,
                      width: 32,
                      height: 32,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="time-outline" size={20} color="#0099ff" />
                  </View>
                </View>

                <Text className="font-comfortaa text-base text-gray-600 mb-4">
                  Under Review - 2 Days Remaining
                </Text>

                {/* Progress Bar */}
                <View className="items-center mb-4">
                  <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <View
                      className="h-full"
                      style={{ width: "65%", backgroundColor: PRIMARY_COLOR }}
                    />
                  </View>
                  <Text className="mt-2 font-comfortaa text-sm text-gray-500">
                    We&apos;re reviewing your application. You&apos;ll be
                    notified once approved. Thank you for your patience!
                  </Text>
                </View>
              </View>
            </View>

            {/* Buttons - outside inner card but inside blur container */}
            <View className="flex-row items-center justify-between px-2 mt-1">
              <TouchableOpacity
                className="flex-row items-center justify-center py-3 px-5 rounded-full mr-3"
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: "#EAEBF0",
                  backgroundColor: "#fff",
                }}
                onPress={handleNavigateToApproved}
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
                  Contact us
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

        {/* Terms and Privacy Section */}
        <View className="mt-8 mx-4 mb-12">
          <View
            className="bg-white rounded-3xl p-4 overflow-hidden relative"
            style={{
              borderWidth: 1,
              borderColor: "#EAEBF0",
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 5,
              elevation: 1,
            }}
          >
            {/* Terms & Conditions */}
            <TouchableOpacity className="flex-row items-center py-3">
              <View
                style={{
                  backgroundColor: "#e6f7ff",
                  borderRadius: 12,
                  width: 36,
                  height: 36,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Text
                  style={{ color: "#0099ff", fontSize: 18, fontWeight: "bold" }}
                >
                  ℹ️
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text className="font-comfortaa-bold text-gray-800 text-base mb-0.5">
                  Terms & Conditions
                </Text>
                <Text className="font-comfortaa text-xs text-gray-500 leading-4">
                  Please review the terms below to understand your
                  responsibilities and rights while using Pickup Buddi.
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#A0A0A0" />
            </TouchableOpacity>

            <View className="h-px bg-gray-200 my-1 mx-2" />

            {/* Privacy */}
            <TouchableOpacity className="flex-row items-center py-3">
              <View
                style={{
                  backgroundColor: "#f7e6ff",
                  borderRadius: 12,
                  width: 36,
                  height: 36,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Text
                  style={{ color: "#9966cc", fontSize: 18, fontWeight: "bold" }}
                >
                  🔒
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text className="font-comfortaa-bold text-gray-800 text-base mb-0.5">
                  Privacy
                </Text>
                <Text className="font-comfortaa text-xs text-gray-500 leading-4">
                  Please review the terms below to understand your
                  responsibilities and rights while using Pickup Buddi.
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#A0A0A0" />
            </TouchableOpacity>

            {/* Read More Button */}
            <View className="items-center mt-3 mb-1">
              <TouchableOpacity
                className="py-2.5 px-5 rounded-full w-full"
                style={{ backgroundColor: PRIMARY_COLOR }}
              >
                <View className="flex-row items-center justify-center">
                  <Text className="font-comfortaa-bold text-white text-center text-base">
                    Read More
                  </Text>
                  <Text style={{ color: "white", fontSize: 16, marginLeft: 4 }}>
                    ✨
                  </Text>
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

export default WaitlistScreen;
