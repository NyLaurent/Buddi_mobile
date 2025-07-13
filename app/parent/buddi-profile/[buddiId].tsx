import { Ionicons } from "@expo/vector-icons";
import { useEvent } from "expo";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";

interface BuddiProfileData {
  id: number;
  currentSchool: string;
  AreaOfStudy: string;
  Gpa: string;
  status: string;
  teacherEmail: string;
  dob: string;
  gender: string;
  teacherPhoneNumber: string;
  customReferral: string;
  referralOccupation: string;
  resume: string;
  profilePicture: string | null;
  rating: number | null;
  isInterviewVideoSubmitted: boolean;
  totalEarnings: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  User?: {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    homeAddress: string;
  };
}

export default function ParentBuddiProfilePage() {
  const { buddiId, data } = useLocalSearchParams<{
    buddiId: string;
    data?: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = Dimensions.get("window");
  const [activeTab, setActiveTab] = useState("General");
  const [buddiData, setBuddiData] = useState<BuddiProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock video source - in real app, this would come from the buddi's interview video
  const videoSource = require("../../../assets/videos/intro.mp4");
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  const cardWidth = Math.min(width * 0.85, 320);

  useEffect(() => {
    const loadBuddiData = async () => {
      setIsLoading(true);
      try {
        console.log("loadBuddiData - buddiId:", buddiId);
        console.log("loadBuddiData - buddiDataParam:", data);
        console.log("loadBuddiData - all params:", { buddiId, data });

        if (data) {
          // Parse the buddi data from navigation params
          const parsedBuddiData: BuddiProfileData = JSON.parse(data);
          console.log("loadBuddiData - parsed data:", parsedBuddiData);
          setBuddiData(parsedBuddiData);
        } else {
          // Fallback: if no data passed, show error
          console.error("No buddi data provided in navigation params");
          console.error("Available params:", { buddiId, data });
        }
      } catch (error) {
        console.error("Error parsing buddi data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (buddiId) {
      loadBuddiData();
    }
  }, [buddiId, data]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#FF932E" />
        <Text
          style={{
            marginTop: 16,
            fontFamily: "Comfortaa-Regular",
            color: "#6B7280",
          }}
        >
          Loading profile...
        </Text>
      </View>
    );
  }

  if (!buddiData) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 32,
        }}
      >
        <View style={{ alignItems: "center", marginBottom: 24 }}>
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: "#F4F7FE",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <FontAwesome5 name="user-circle" size={48} color="#9CA3AF" />
          </View>
          <Text
            style={{
              fontFamily: "Comfortaa-Bold",
              fontSize: 20,
              color: "#1F2937",
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            Profile Not Found
          </Text>
          <Text
            style={{
              fontFamily: "Comfortaa-Regular",
              fontSize: 16,
              color: "#6B7280",
              textAlign: "center",
              lineHeight: 24,
            }}
          >
            Unable to load the buddi profile. Please go back and try again.
          </Text>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: "#FF932E",
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
          }}
          onPress={() => router.back()}
        >
          <Text
            style={{
              fontFamily: "Comfortaa-Bold",
              fontSize: 16,
              color: "#fff",
            }}
          >
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Get profile data with fallbacks
  const profileImage =
    buddiData.profilePicture ||
    "https://randomuser.me/api/portraits/men/32.jpg";
  const fullName = buddiData.User
    ? `${buddiData.User.firstName} ${buddiData.User.lastName}`
    : "John Doe Smith";
  const email = buddiData.User?.email || "johndoe@gmail.com";
  const phone = buddiData.User?.phoneNumber || "+250781234567";
  const schoolInfo = `${buddiData.currentSchool} – ${buddiData.AreaOfStudy}`;
  const rating = buddiData.rating || 0;
  const hasResume = !!buddiData.resume;

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
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
        {/* Custom Header for Parent View */}
        <View style={{ backgroundColor: "#FF932E", paddingTop: insets.top }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginRight: 12 }}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text
              style={{
                fontFamily: "Comfortaa-Bold",
                fontSize: 18,
                color: "#fff",
                flex: 1,
              }}
            >
              Buddi Profile
            </Text>
          </View>

          {/* Profile Header */}
          <View style={{ alignItems: "center", paddingBottom: 20 }}>
            <Image
              source={{ uri: profileImage }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                borderWidth: 4,
                borderColor: "#fff",
                marginBottom: 12,
              }}
              resizeMode="cover"
            />
            <Text
              style={{
                fontFamily: "Comfortaa-Bold",
                fontSize: 20,
                color: "#fff",
                marginBottom: 4,
              }}
            >
              {fullName}
            </Text>
            <Text
              style={{
                fontFamily: "Comfortaa-Regular",
                fontSize: 14,
                color: "#fff",
                opacity: 0.9,
                marginBottom: 8,
              }}
            >
              {email}
            </Text>
            {rating > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "rgba(255,255,255,0.2)",
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                }}
              >
                {[...Array(Math.floor(rating))].map((_, i) => (
                  <Ionicons
                    key={i}
                    name="star"
                    size={16}
                    color="#fff"
                    style={{ marginRight: 2 }}
                  />
                ))}
                {rating % 1 !== 0 && (
                  <Ionicons
                    name="star-half"
                    size={16}
                    color="#fff"
                    style={{ marginRight: 2 }}
                  />
                )}
                <Text
                  style={{
                    fontFamily: "Comfortaa-Bold",
                    fontSize: 14,
                    color: "#fff",
                    marginLeft: 4,
                  }}
                >
                  {rating.toFixed(1)}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Tabs */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#F8F9FE",
            margin: 16,
            borderRadius: 16,
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: "center",
              paddingVertical: 12,
              borderRadius: 16,
              backgroundColor: activeTab === "General" ? "#fff" : "transparent",
            }}
            onPress={() => setActiveTab("General")}
          >
            <Text
              style={{
                fontFamily: "Comfortaa-Bold",
                color: activeTab === "General" ? "#FF932E" : "#9CA3AF",
              }}
            >
              General
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: "center",
              paddingVertical: 12,
              borderRadius: 16,
              backgroundColor:
                activeTab === "Documents" ? "#fff" : "transparent",
            }}
            onPress={() => setActiveTab("Documents")}
          >
            <Text
              style={{
                fontFamily: "Comfortaa-Bold",
                color: activeTab === "Documents" ? "#FF932E" : "#9CA3AF",
              }}
            >
              Documents
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "General" && (
          <View style={{ paddingHorizontal: 16 }}>
            {/* Personal Details */}
            <View style={{ marginBottom: 24 }}>
              <Text
                style={{
                  fontFamily: "Comfortaa-Bold",
                  fontSize: 18,
                  color: "#1F2937",
                  marginBottom: 16,
                }}
              >
                Personal Details
              </Text>
              <View
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: "#E6E6E6",
                  padding: 16,
                }}
              >
                <View style={{ marginBottom: 16 }}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#BDBDBD",
                      fontFamily: "Comfortaa-Regular",
                    }}
                  >
                    Full Names
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Comfortaa-Bold",
                      fontSize: 16,
                      color: "#222",
                      marginTop: 4,
                    }}
                  >
                    {fullName}
                  </Text>
                </View>
                <View style={{ marginBottom: 16 }}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#BDBDBD",
                      fontFamily: "Comfortaa-Regular",
                    }}
                  >
                    Phone
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Comfortaa-Bold",
                      fontSize: 16,
                      color: "#222",
                      marginTop: 4,
                    }}
                  >
                    {phone}
                  </Text>
                </View>
                <View style={{ marginBottom: 16 }}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#BDBDBD",
                      fontFamily: "Comfortaa-Regular",
                    }}
                  >
                    Email
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Comfortaa-Bold",
                      fontSize: 16,
                      color: "#222",
                      marginTop: 4,
                    }}
                  >
                    {email}
                  </Text>
                </View>
                <View style={{ marginBottom: 16 }}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#BDBDBD",
                      fontFamily: "Comfortaa-Regular",
                    }}
                  >
                    School & Study Area
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Comfortaa-Bold",
                      fontSize: 16,
                      color: "#222",
                      marginTop: 4,
                    }}
                  >
                    {schoolInfo}
                  </Text>
                </View>
                <View style={{ marginBottom: 16 }}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#BDBDBD",
                      fontFamily: "Comfortaa-Regular",
                    }}
                  >
                    GPA
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Comfortaa-Bold",
                      fontSize: 16,
                      color: "#222",
                      marginTop: 4,
                    }}
                  >
                    {buddiData.Gpa}
                  </Text>
                </View>
                <View style={{ marginBottom: 16 }}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#BDBDBD",
                      fontFamily: "Comfortaa-Regular",
                    }}
                  >
                    Gender
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Comfortaa-Bold",
                      fontSize: 16,
                      color: "#222",
                      marginTop: 4,
                    }}
                  >
                    {buddiData.gender === "MALE"
                      ? "Male"
                      : buddiData.gender === "FEMALE"
                      ? "Female"
                      : buddiData.gender}
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#BDBDBD",
                      fontFamily: "Comfortaa-Regular",
                    }}
                  >
                    Address
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Comfortaa-Bold",
                      fontSize: 16,
                      color: "#222",
                      marginTop: 4,
                    }}
                  >
                    {buddiData.User?.homeAddress || "Not provided"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Interview Video */}
            {buddiData.isInterviewVideoSubmitted && (
              <View style={{ marginBottom: 24 }}>
                <Text
                  style={{
                    fontFamily: "Comfortaa-Bold",
                    fontSize: 18,
                    color: "#1F2937",
                    marginBottom: 16,
                  }}
                >
                  Interview Video
                </Text>
                <View
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 18,
                    overflow: "hidden",
                    borderWidth: 1,
                    borderColor: "#E6E6E6",
                  }}
                >
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
                  <View
                    style={{
                      backgroundColor: "#F8F9FE",
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                    }}
                  >
                    <Text
                      style={{ fontFamily: "Comfortaa-Bold", fontSize: 16 }}
                    >
                      {fullName}
                    </Text>
                    <Text
                      style={{ color: "#9CA3AF", fontSize: 12, marginTop: 4 }}
                    >
                      Interview submitted on{" "}
                      {new Date(buddiData.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Teacher Reference */}
            <View style={{ marginBottom: 24 }}>
              <Text
                style={{
                  fontFamily: "Comfortaa-Bold",
                  fontSize: 18,
                  color: "#1F2937",
                  marginBottom: 16,
                }}
              >
                Teacher Reference
              </Text>
              <View
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: "#E6E6E6",
                  padding: 16,
                }}
              >
                <View style={{ marginBottom: 12 }}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#BDBDBD",
                      fontFamily: "Comfortaa-Regular",
                    }}
                  >
                    Teacher Email
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Comfortaa-Bold",
                      fontSize: 16,
                      color: "#222",
                      marginTop: 4,
                    }}
                  >
                    {buddiData.teacherEmail}
                  </Text>
                </View>
                <View style={{ marginBottom: 12 }}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#BDBDBD",
                      fontFamily: "Comfortaa-Regular",
                    }}
                  >
                    Teacher Phone
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Comfortaa-Bold",
                      fontSize: 16,
                      color: "#222",
                      marginTop: 4,
                    }}
                  >
                    {buddiData.teacherPhoneNumber}
                  </Text>
                </View>
                <View style={{ marginBottom: 12 }}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#BDBDBD",
                      fontFamily: "Comfortaa-Regular",
                    }}
                  >
                    Occupation
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Comfortaa-Bold",
                      fontSize: 16,
                      color: "#222",
                      marginTop: 4,
                    }}
                  >
                    {buddiData.referralOccupation}
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#BDBDBD",
                      fontFamily: "Comfortaa-Regular",
                    }}
                  >
                    Reference Note
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Comfortaa-Regular",
                      fontSize: 16,
                      color: "#222",
                      marginTop: 4,
                      lineHeight: 24,
                    }}
                  >
                    {buddiData.customReferral}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {activeTab === "Documents" && (
          <View style={{ paddingHorizontal: 16 }}>
            <Text
              style={{
                fontFamily: "Comfortaa-Bold",
                fontSize: 18,
                color: "#1F2937",
                marginBottom: 16,
              }}
            >
              Documents
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              {/* Document Card */}
              <View
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 16,
                  flex: 1,
                  padding: 16,
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "#E6E6E6",
                }}
              >
                <Image
                  source={require("../../../assets/images/buddi/pdf-icon.png")}
                  style={{ width: "100%", height: 112, borderRadius: 12 }}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    fontFamily: "Comfortaa-Bold",
                    fontSize: 16,
                    marginTop: 16,
                  }}
                >
                  Resume
                </Text>
                <Text style={{ color: "#9CA3AF", fontSize: 12, marginTop: 4 }}>
                  {hasResume ? "PDF • Available" : "PDF • Not uploaded"}
                </Text>
                {hasResume && (
                  <Text
                    style={{
                      color: "#6B7280",
                      fontSize: 10,
                      marginTop: 4,
                      textAlign: "center",
                    }}
                  >
                    {buddiData.resume.split("/").pop() || "resume.pdf"}
                  </Text>
                )}
              </View>

              {/* Action Buttons */}
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: 16,
                  gap: 16,
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: "#F8FAFC",
                    borderRadius: 24,
                    width: 48,
                    height: 48,
                    borderWidth: 1,
                    borderColor: "#EAEBF0",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => {
                    if (hasResume) {
                      // TODO: Open resume in browser or PDF viewer
                      console.log("View resume:", buddiData.resume);
                    }
                  }}
                  disabled={!hasResume}
                >
                  <Ionicons
                    name="eye-outline"
                    size={24}
                    color={hasResume ? "#6B7280" : "#BDBDBD"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: hasResume ? "#FF932E" : "#E5E7EB",
                    borderRadius: 24,
                    width: 48,
                    height: 48,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => {
                    if (hasResume) {
                      // TODO: Download resume
                      console.log("Download resume:", buddiData.resume);
                    }
                  }}
                  disabled={!hasResume}
                >
                  <Ionicons
                    name="download-outline"
                    size={24}
                    color={hasResume ? "white" : "#9CA3AF"}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
