import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FullScreenLoader } from "../../../components/commons/FullScreenLoader";
import { useAuth } from "../../../context/AuthContext";

const PRIMARY_COLOR = "#FF932E";

const VideoGuidelinesScreen = () => {
  const router = useRouter();
  const { user, buddiDetails } = useAuth();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  type GuidelineKey = "guideline1" | "guideline2" | "guideline3" | "guideline4";

  const [guidelinesRead, setGuidelinesRead] = useState({
    guideline1: false,
    guideline2: false,
    guideline3: false,
    guideline4: false,
  });

  const allGuidelinesRead = Object.values(guidelinesRead).every(
    (value) => value
  );

  // Add access control
  useEffect(() => {
    const checkAccess = async () => {
      // Check if user should be on this screen
      if (!user || user.role !== "buddi") {
        setIsTransitioning(true);
        await router.replace("/auth/login" as any);
        return;
      }

      if (!buddiDetails) return; // Wait for buddiDetails to load

      // Allow both Registered and submissionApproved status for guidelines
      if (
        buddiDetails.status !== "Registered" &&
        buddiDetails.status !== "submissionApproved"
      ) {
        setIsTransitioning(true);
        await router.replace("/auth/waitlist" as any);
        return;
      }
    };

    checkAccess();
  }, [user, buddiDetails]);

  const toggleGuideline = (key: GuidelineKey) => {
    setGuidelinesRead((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleStartPress = () => {
    setShowConfirmModal(true);
  };

  return (
    <View style={{ flex: 1 }}>
      {isTransitioning && <FullScreenLoader />}
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
                  <Text className="text-xl font-comfortaa-bold text-black">
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
              {/* <View
                className="mb-6 border border-blue-200 rounded-2xl p-4"
                style={{ backgroundColor: "#F5FAFF" }}
              >
                <Text className="font-comfortaa text-[#71727A] mb-2">
                  Your interview details
                </Text>

                <View className="flex-row items-center">
                  <View className="h-12 w-12 rounded-full bg-gray-100 mr-4" />

                  <View className="flex-1">
                    <Text className="text-lg font-comfortaa-bold text-black">
                      30 Questions
                    </Text>
                    <Text className="text-xs font-comfortaa text-[#71727A]">
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
              </View> */}

              {/* Guidelines */}
              <View className="mb-6">
                <Text className="font-comfortaa-bold text-[#71727A] mb-3">
                  Please read and acknowledge each guideline carefully:
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
                    <Text className="font-comfortaa-bold text-black">
                      Camera Position & Lighting
                    </Text>
                    <Text className="font-comfortaa text-xs text-[#71727A] mb-1">
                      Ensure you are well-lit and facing the camera directly.
                      Your face should be clearly visible and centered in the
                      frame.
                    </Text>
                  </View>
                  <TouchableOpacity
                    className={`border rounded h-5 w-5 mt-1 ${
                      guidelinesRead.guideline1
                        ? "bg-[#0066FF] border-[#0066FF]"
                        : "border-gray-300"
                    }`}
                    onPress={() => toggleGuideline("guideline1")}
                  />
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
                    <Text className="font-comfortaa-bold text-black">
                      No External Assistance
                    </Text>
                    <Text className="font-comfortaa text-xs text-[#71727A] mb-1">
                      Do not use AI tools, chat assistants, or any external help
                      during the interview. Your answers must be genuine and
                      original.
                    </Text>
                  </View>
                  <TouchableOpacity
                    className={`border rounded h-5 w-5 mt-1 ${
                      guidelinesRead.guideline2
                        ? "bg-[#0066FF] border-[#0066FF]"
                        : "border-gray-300"
                    }`}
                    onPress={() => toggleGuideline("guideline2")}
                  />
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
                    <Text className="font-comfortaa-bold text-black">
                      Clear Communication
                    </Text>
                    <Text className="font-comfortaa text-xs text-[#71727A] mb-1">
                      Speak clearly and maintain a professional demeanor. Take
                      your time to think before answering each question.
                    </Text>
                  </View>
                  <TouchableOpacity
                    className={`border rounded h-5 w-5 mt-1 ${
                      guidelinesRead.guideline3
                        ? "bg-[#0066FF] border-[#0066FF]"
                        : "border-gray-300"
                    }`}
                    onPress={() => toggleGuideline("guideline3")}
                  />
                </View>

                {/* Guideline Item 4 */}
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
                    <Text className="font-comfortaa-bold text-black">
                      Quiet Environment
                    </Text>
                    <Text className="font-comfortaa text-xs text-[#71727A] mb-1">
                      Find a quiet space with minimal background noise. Ensure
                      you won&apos;t be interrupted during the interview
                      session.
                    </Text>
                  </View>
                  <TouchableOpacity
                    className={`border rounded h-5 w-5 mt-1 ${
                      guidelinesRead.guideline4
                        ? "bg-[#0066FF] border-[#0066FF]"
                        : "border-gray-300"
                    }`}
                    onPress={() => toggleGuideline("guideline4")}
                  />
                </View>
              </View>
            </View>

            {/* Start Button */}
            <View className="px-2 my-4">
              <TouchableOpacity
                className="py-3 rounded-full w-full flex-row justify-center items-center bg-[#FF932E]"
                onPress={handleStartPress}
              >
                <Text className="font-comfortaa-bold text-white text-base mr-2">
                  Start Interview
                </Text>
                <Ionicons name="videocam" size={18} color="white" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>

      {/* Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showConfirmModal}
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-3xl p-6 m-4 w-[90%] max-w-[400px]">
            <Text className="text-xl font-comfortaa-bold text-black mb-4 text-center">
              Ready to Begin?
            </Text>
            <Text className="font-comfortaa text-[#71727A] mb-6 text-center">
              Please confirm that you have read and understood all the interview
              guidelines. Once you start, you cannot pause the interview.
            </Text>
            <View className="flex-row justify-center space-x-4">
              <TouchableOpacity
                className="bg-gray-200 py-3 px-6 rounded-full"
                onPress={() => setShowConfirmModal(false)}
              >
                <Text className="font-comfortaa-bold text-[#71727A]">
                  Re-read Guidelines
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-[#FF932E] py-3 px-6 rounded-full"
                style={{ backgroundColor: PRIMARY_COLOR }}
                onPress={() => {
                  setShowConfirmModal(false);
                  router.push("/auth/recording");
                }}
              >
                <Text className="font-comfortaa-bold text-white">Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default VideoGuidelinesScreen;
