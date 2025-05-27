import CongratulationsCard from "@/components/commons/CongratulationsCard";
import { Ionicons } from "@expo/vector-icons";
import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const BuddiProfile = () => {
  const [activeTab, setActiveTab] = useState("General");
  const insets = useSafeAreaInsets();
  const { width } = Dimensions.get("window");

  const videoSource = require("../../assets/videos/intro.mp4");
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  const cardWidth = Math.min(width * 0.85, 320);

  return (
    <View className="flex-1 bg-white">
      <StatusBar backgroundColor="#FF932E" barStyle="light-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.select({
            ios: 90 + insets.bottom,
            android: 80 + insets.bottom,
          }),
        }}
      >
        {/* Header (now scrollable) */}
        <View className="bg-[#FF932E] rounded-b-3xl" style={{ minHeight: 120 }}>
          <SafeAreaView edges={["top", "left", "right"]}>
            <View className="flex-row justify-end items-center px-4 pt-2">
              <TouchableOpacity className="bg-white rounded-full p-2">
                <Ionicons name="settings-outline" size={22} color="#FF932E" />
              </TouchableOpacity>
            </View>
            <View className="items-center mt-1 mb-2">
              <Image
                source={{
                  uri: "https://randomuser.me/api/portraits/men/32.jpg",
                }}
                className="w-20 h-20 rounded-full border-4 border-white"
                resizeMode="cover"
              />
              <Text className="text-white text-lg font-comfortaa-bold mt-1">
                John Doe Smith
              </Text>
              <Text className="text-white font-comfortaa mt-0.5">
                johndoe@gmail.com
              </Text>
              <View className="flex-row items-center bg-white rounded-xl px-3 py-0.5 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Ionicons key={i} name="star" size={16} color="#FF932E" />
                ))}
              </View>
            </View>
          </SafeAreaView>
        </View>
        {/* Toggler Tabs */}
        <View
          className="flex-row bg-[#F8F9FE] rounded-2xl mx-4 mt-4 z-10"
          style={{ position: "relative" }}
        >
          <TouchableOpacity
            className={`flex-1 items-center py-2 rounded-2xl ${
              activeTab === "General" ? "bg-white" : ""
            }`}
            onPress={() => setActiveTab("General")}
          >
            <Text
              className={`font-comfortaa-bold ${
                activeTab === "General" ? "text-[#FF932E]" : "text-gray-400"
              }`}
            >
              General
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 items-center py-2 rounded-2xl ${
              activeTab === "Documents" ? "bg-white" : ""
            }`}
            onPress={() => setActiveTab("Documents")}
          >
            <Text
              className={`font-comfortaa-bold ${
                activeTab === "Documents" ? "text-[#FF932E]" : "text-gray-400"
              }`}
            >
              Documents
            </Text>
          </TouchableOpacity>
        </View>
        {activeTab === "General" && (
          <View>
            <CongratulationsCard />
            <View className="px-4 pt-4">
              {/* Personal Details */}
              <View className="flex-row justify-between items-center mb-2">
                <Text className="font-comfortaa-bold text-base">
                  Personal Details
                </Text>
                <TouchableOpacity className="bg-[#FF932E] px-4 py-2 rounded-xl flex-row items-center gap-2">
                  <Text className="text-white font-comfortaa-bold">
                    Edit Profile
                  </Text>
                  <Ionicons name="pencil" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
              <View className="bg-white rounded-2xl border border-[#E6E6E6] p-4">
                <View className="mb-4">
                  <Text className="text-xs text-[#BDBDBD] font-comfortaa">
                    Full Names
                  </Text>
                  <Text className="font-comfortaa-bold text-base text-[#222] mt-1">
                    John Doe
                  </Text>
                </View>
                <View className="mb-4">
                  <Text className="text-xs text-[#BDBDBD] font-comfortaa">
                    Tel
                  </Text>
                  <Text className="font-comfortaa-bold text-base text-[#222] mt-1">
                    +250-786-564-922
                  </Text>
                </View>
                <View className="mb-4">
                  <Text className="text-xs text-[#BDBDBD] font-comfortaa">
                    Email
                  </Text>
                  <Text className="font-comfortaa-bold text-base text-[#222] mt-1">
                    johndoe@example.com
                  </Text>
                </View>
                <View>
                  <Text className="text-xs text-[#BDBDBD] font-comfortaa">
                    School
                  </Text>
                  <Text className="font-comfortaa-bold text-base text-[#222] mt-1">
                    NYU – Year 2, Child Psychology
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
        {activeTab === "Documents" && (
          <View className="px-4 pt-4">
            {/* Profile Video Card */}
            <Text className="font-comfortaa-bold text-base mb-2">
              Your Profile Video
            </Text>
            <View
              style={{
                width: cardWidth,
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              {/* Video Card */}
              <View
                style={{
                  flex: 1,
                  backgroundColor: "white",
                  borderRadius: 18,
                  shadowColor: "#000",
                  shadowOpacity: 0.08,
                  shadowRadius: 6,

                  overflow: "hidden",
                  marginRight: 12,
                }}
              >
                {/* Video Thumbnail Area */}
                <View
                  style={{
                    position: "relative",
                    width: "100%",
                    height: cardWidth * 0.56,
                    backgroundColor: "#000",
                  }}
                >
                  <VideoView
                    style={{ width: "100%", height: "100%" }}
                    player={player}
                    allowsFullscreen
                    allowsPictureInPicture
                  />
                  {/* Play button overlay */}

                  {/* Reviewed badge */}
                  <View
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      zIndex: 3,
                      backgroundColor: "#34C759",
                      borderRadius: 12,
                      paddingHorizontal: 10,
                      paddingVertical: 2,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: 12,
                      }}
                    >
                      REVIEWED
                    </Text>
                  </View>
                </View>
                {/* Title and Date on light background */}
                <View
                  style={{
                    backgroundColor: "#F8F9FE",
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderBottomLeftRadius: 18,
                    borderBottomRightRadius: 18,
                  }}
                >
                  <Text className="font-comfortaa-bold text-base">
                    Maroon 5
                  </Text>
                  <Text className="text-gray-400 text-xs mt-1">
                    23 May 2025
                  </Text>
                </View>
              </View>
              {/* Action Buttons (outside the card) */}
              <View className="justify-center items-center space-y-4 ml-4 gap-5">
                <TouchableOpacity className="bg-[#F8F9FE] rounded-full w-12 h-12 items-center justify-center">
                  <Ionicons name="create-outline" size={24} color="#BDBDBD" />
                </TouchableOpacity>
                <TouchableOpacity className="bg-[#FFB84C] rounded-full w-12 h-12 items-center justify-center">
                  <Ionicons name="download-outline" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity className="bg-[#FF5C5C] rounded-full w-12 h-12 items-center justify-center">
                  <Ionicons name="trash-outline" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Resume Card */}
            <Text className="font-comfortaa-bold text-base mb-2">Resume</Text>
            <View
              className="flex-row items-center mb-6"
              style={{ width: cardWidth }}
            >
              {/* Document Card */}
              <View className="bg-white rounded-2xl flex-1 px-4 py-5 justify-center items-center border border-[#E6E6E6]">
                <Image
                  source={require("../../assets/images/buddi/pdf-icon.png")}
                  className="w-full h-28 rounded-xl"
                  resizeMode="contain"
                />
                <Text className="font-comfortaa-bold text-base mt-4">
                  Resume
                </Text>
                <Text className="text-gray-400 text-xs mt-1">PDF • 2.4 MB</Text>
              </View>
              {/* Action Buttons */}
              <View className="justify-center items-center space-y-4 ml-4 gap-5">
                <TouchableOpacity className="bg-[#F8F9FE] rounded-full w-12 h-12 items-center justify-center">
                  <Ionicons name="create-outline" size={24} color="#BDBDBD" />
                </TouchableOpacity>
                <TouchableOpacity className="bg-[#FFB84C] rounded-full w-12 h-12 items-center justify-center">
                  <Ionicons name="download-outline" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity className="bg-[#FF5C5C] rounded-full w-12 h-12 items-center justify-center">
                  <Ionicons name="trash-outline" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default BuddiProfile;
