import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY_COLOR = "#FF932E";

const VideoGuidelinesScreen = () => {
  const router = useRouter();

  const handleStartRecording = () => {
    // Navigate to recording screen
    router.push("/auth/recording" as any);
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <ImageBackground
        source={require("../../../assets/images/auth/video_bg.jpg")}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <SafeAreaView
          style={{
            flex: 1,
            paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
          }}
          edges={["right", "left"]}
        >
          {/* Header */}
          <View className="flex-row justify-between items-center px-4 py-2 mt-2">
            <TouchableOpacity
              className="bg-white rounded-full p-2"
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={24} color="#555" />
            </TouchableOpacity>

            <View className="items-center">
              <Text className="text-white text-lg font-comfortaa-bold text-center">
                Record Your Buddi
              </Text>
              <Text className="text-white text-lg font-comfortaa-bold text-center">
                Interview
              </Text>
            </View>

            <TouchableOpacity className="bg-white rounded-full p-2">
              <Ionicons name="ellipsis-vertical" size={20} color="#555" />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: 16,
              paddingBottom: 20,
              paddingTop: 10,
            }}
            showsVerticalScrollIndicator={false}
          >
            {/* Main Card */}
            <View
              className="bg-white rounded-3xl p-5 my-4"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 5,
                elevation: 3,
              }}
            >
              {/* Get Ready Section */}
              <View className="mb-6">
                <View className="flex-row items-center mb-1">
                  <Text className="text-xl font-comfortaa-bold text-gray-800">
                    Get Ready for the interview!
                  </Text>
                  <Image
                    source={require("../../../assets/images/auth/confetti.png")}
                    style={{ width: 24, height: 24, marginLeft: 5 }}
                    resizeMode="contain"
                  />
                </View>
              </View>

              {/* Score Board */}
              <View
                className="mb-6 border border-blue-200 rounded-2xl p-4"
                style={{ backgroundColor: "#F5FAFF" }}
              >
                <Text className="font-comfortaa text-gray-700 mb-2">
                  You score board
                </Text>

                <View className="flex-row items-center">
                  <View className="h-12 w-12 rounded-full bg-gray-100 mr-4" />

                  <View className="flex-1">
                    <Text className="text-lg font-comfortaa-bold text-gray-800">
                      30 Questions
                    </Text>
                    <Text className="text-xs font-comfortaa text-gray-500">
                      Up to 30 mins
                    </Text>
                  </View>

                  <View
                    className="bg-purple-500 rounded-full p-2"
                    style={{ backgroundColor: "#8A56FF" }}
                  >
                    <Ionicons name="flash" size={18} color="white" />
                  </View>

                  <Image
                    source={require("../../../assets/images/auth/confetti.png")}
                    style={{ width: 20, height: 20, marginLeft: 5 }}
                    resizeMode="contain"
                  />
                </View>
              </View>

              {/* Guidelines */}
              <View className="mb-6">
                <Text className="font-comfortaa-bold text-gray-700 mb-3">
                  Checkout the Guidelines for the Interview Session:
                </Text>

                {/* Guideline Item 1 */}
                <View className="flex-row mb-4">
                  <View
                    className="mr-3 mt-1"
                    style={{
                      backgroundColor: "#0066FF",
                      borderRadius: 10,
                      height: 16,
                      width: 4,
                    }}
                  />
                  <View className="flex-1">
                    <Text className="font-comfortaa-bold text-gray-800">
                      Title
                    </Text>
                    <Text className="font-comfortaa text-xs text-gray-500 mb-1">
                      Description. Lorem ipsum dolor sit amet consectetur
                      adipiscing elit, sed do
                    </Text>
                  </View>
                  <TouchableOpacity className="border border-gray-300 rounded h-5 w-5 mt-1" />
                </View>

                {/* Guideline Item 2 */}
                <View className="flex-row mb-4">
                  <View
                    className="mr-3 mt-1"
                    style={{
                      backgroundColor: "#0066FF",
                      borderRadius: 10,
                      height: 16,
                      width: 4,
                    }}
                  />
                  <View className="flex-1">
                    <Text className="font-comfortaa-bold text-gray-800">
                      Title
                    </Text>
                    <Text className="font-comfortaa text-xs text-gray-500 mb-1">
                      Description. Lorem ipsum dolor sit amet consectetur
                      adipiscing elit, sed do
                    </Text>
                  </View>
                  <TouchableOpacity className="border border-gray-300 rounded h-5 w-5 mt-1" />
                </View>

                {/* Guideline Item 3 */}
                <View className="flex-row mb-4">
                  <View
                    className="mr-3 mt-1"
                    style={{
                      backgroundColor: "#0066FF",
                      borderRadius: 10,
                      height: 16,
                      width: 4,
                    }}
                  />
                  <View className="flex-1">
                    <Text className="font-comfortaa-bold text-gray-800">
                      Title
                    </Text>
                    <Text className="font-comfortaa text-xs text-gray-500 mb-1">
                      Description. Lorem ipsum dolor sit amet consectetur
                      adipiscing elit, sed do
                    </Text>
                  </View>
                  <TouchableOpacity className="border border-gray-300 rounded h-5 w-5 mt-1" />
                </View>
              </View>
            </View>

            {/* Start Button */}
            <View className="px-2 my-4">
              <TouchableOpacity
                className="bg-[#FF932E] py-3 rounded-full w-full flex-row justify-center items-center"
                style={{ backgroundColor: PRIMARY_COLOR }}
                onPress={handleStartRecording}
              >
                <Text className="font-comfortaa-bold text-white text-base mr-2">
                  Start
                </Text>
                <Ionicons name="videocam" size={18} color="white" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

export default VideoGuidelinesScreen;
