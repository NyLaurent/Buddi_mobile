import { Ionicons } from "@expo/vector-icons";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  ImageBackground,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY_COLOR = "#FF932E";
const { width, height } = Dimensions.get("window");

// Sample interview questions
const INTERVIEW_QUESTIONS = [
  {
    id: 1,
    question: "Tell us a little about yourself and why you want to be a Buddi.",
  },
  {
    id: 2,
    question: "What experience do you have working with children?",
  },
  {
    id: 3,
    question:
      "How would you handle a situation where a child is upset or misbehaving?",
  },
];

interface AnsweredQuestions {
  [key: number]: string;
}

const RecordingPage = () => {
  const router = useRouter();
  const videoPlayer = useRef(null);
  const [type, setType] = useState<CameraType>("front");
  const [isRecording, setIsRecording] = useState(false);
  const [currentVideoUri, setCurrentVideoUri] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [completedQuestions, setCompletedQuestions] = useState<number[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestions>(
    {}
  );
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false);
  const cameraRef = useRef<any>(null);

  const slideTransition = useSharedValue(0);

  useEffect(() => {
    // Request camera permissions if not granted
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: slideTransition.value }],
    };
  });

  const handleSlideQuestion = (direction: "next" | "prev") => {
    if (
      direction === "next" &&
      currentQuestionIndex < INTERVIEW_QUESTIONS.length - 1
    ) {
      slideTransition.value = withTiming(-width, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });

      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        slideTransition.value = width;
        slideTransition.value = withTiming(0, {
          duration: 300,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
      }, 300);
    } else if (direction === "prev" && currentQuestionIndex > 0) {
      slideTransition.value = withTiming(width, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });

      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
        slideTransition.value = -width;
        slideTransition.value = withTiming(0, {
          duration: 300,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
      }, 300);
    }
  };

  const startRecording = async () => {
    if (!isRecording && cameraRef.current && cameraReady) {
      setIsRecording(true);
      try {
        const video = await cameraRef.current.recordAsync({
          maxDuration: 30,
          quality: "720p",
          mute: false,
        });
        setCurrentVideoUri(video.uri);

        const updatedAnsweredQuestions = {
          ...answeredQuestions,
          [currentQuestionIndex]: video.uri,
        };
        setAnsweredQuestions(updatedAnsweredQuestions);

        if (!completedQuestions.includes(currentQuestionIndex)) {
          setCompletedQuestions([...completedQuestions, currentQuestionIndex]);
        }
      } catch (error) {
        console.error("Failed to record", error);
      } finally {
        setIsRecording(false);
      }
    }
  };

  const stopRecording = async () => {
    if (isRecording && cameraRef.current) {
      await cameraRef.current.stopRecording();
      setIsRecording(false);
    }
  };

  const handleSubmit = () => {
    if (completedQuestions.length < INTERVIEW_QUESTIONS.length) {
      Alert.alert(
        "Incomplete Interview",
        `You've completed ${completedQuestions.length} out of ${INTERVIEW_QUESTIONS.length} questions. Are you sure you want to submit?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Submit Anyway",
            onPress: () => {
              Alert.alert(
                "Interview Submitted",
                "Thank you for completing your interview!",
                [
                  {
                    text: "OK",
                    onPress: () => router.replace("/buddi" as any),
                  },
                ]
              );
            },
          },
        ]
      );
    } else {
      Alert.alert(
        "Interview Submitted",
        "Thank you for completing your interview!",
        [
          {
            text: "OK",
            onPress: () => router.replace("/buddi" as any),
          },
        ]
      );
    }
  };

  const renderRecordButton = () => {
    if (isRecording) {
      return (
        <TouchableOpacity
          style={styles.stopRecordButton}
          onPress={stopRecording}
        >
          <View style={styles.stopButton} />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity style={styles.recordButton} onPress={startRecording}>
          <View style={styles.recordDot} />
        </TouchableOpacity>
      );
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permissions...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No access to camera or microphone</Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentQuestion = INTERVIEW_QUESTIONS[currentQuestionIndex];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion =
    currentQuestionIndex === INTERVIEW_QUESTIONS.length - 1;
  const questionProgress = `${currentQuestionIndex + 1}/${
    INTERVIEW_QUESTIONS.length
  }`;
  const hasAnsweredCurrent = completedQuestions.includes(currentQuestionIndex);

  return (
      <View style={styles.container}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />
        <ImageBackground
          source={require("../../../assets/images/auth/video_bg.jpg")}
          style={styles.backgroundImage}
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

            {/* Main Content */}
            <View style={styles.contentContainer}>
              {/* Score Board and Camera in a row */}
              <View style={styles.topRow}>
                {/* Score Board */}
                <View className="bg-white rounded-3xl w-[40%] p-5 shadow-sm overflow-hidden relative">
                  <View className="flex-row justify-between items-start">
                    <Text className="font-comfortaa text-gray-800 text-sm">
                      You score board
                    </Text>
                  </View>

                  <View className="flex-row items-center mt-4">
                    <View className="flex-1">
                      <Text className="font-comfortaa-bold text-gray-800 text-xl">
                        24/30
                      </Text>
                      <Text className="font-comfortaa text-gray-400 text-xs">
                        Point
                      </Text>
                    </View>
                  </View>

                  {/* Sparkle icon at bottom right */}
                  <View className="absolute bottom-1.5 right-2">
                    <Ionicons name="sparkles" size={20} color="#3CDFFF" />
                  </View>

                  {/* Lightning circle - positioned absolutely */}
                  <View className="absolute top-3 right-3">
                    <View className="bg-purple-500 h-10 w-10 rounded-full justify-center items-center shadow-sm">
                      <Ionicons name="flash" size={22} color="white" />
                    </View>
                  </View>
                </View>

                {/* Camera Preview / Recording */}
                <View style={styles.cameraContainer}>
                  {currentVideoUri &&
                  answeredQuestions[currentQuestionIndex] === currentVideoUri ? (
                    <View style={styles.videoPreviewContainer}>
                      <View style={styles.mockVideoPreview}>
                        <Text style={styles.mockVideoText}>Video Preview</Text>
                        <Ionicons name="play-circle" size={50} color="white" />
                      </View>
                      <TouchableOpacity
                        style={styles.retakeButton}
                        onPress={() => setCurrentVideoUri(null)}
                      >
                        <Ionicons name="refresh" size={20} color="#fff" />
                        <Text style={styles.retakeText}>Retake</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.cameraWrapper}>
                      <CameraView
                        ref={cameraRef}
                        style={styles.camera}
                        facing={type}
                        onCameraReady={() => setCameraReady(true)}
                        onMountError={(error) => {
                          console.error("Camera mount error:", error);
                        }}
                        flash="off"
                        mirror={true}
                      >
                        {isRecording && (
                          <View style={styles.recordingIndicator}>
                            <View style={styles.redDot} />
                            <Text style={styles.recordingText}>Recording...</Text>
                          </View>
                        )}

                        {/* Audio icon */}
                        <TouchableOpacity style={styles.audioButton}>
                          <Ionicons name="mic" size={22} color="white" />
                        </TouchableOpacity>

                        {!isRecording && (
                          <View style={styles.recordIconContainer}>
                            <Ionicons name="videocam" size={24} color="white" />
                          </View>
                        )}
                      </CameraView>

                      <TouchableOpacity
                        style={styles.flipCameraButton}
                        onPress={() => {
                          setType(type === "back" ? "front" : "back");
                        }}
                      >
                        <Ionicons name="camera-reverse" size={24} color="white" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>

              {/* Question and Navigation */}
              <View
                className="bg-white rounded-3xl shadow-md mt-8 overflow-hidden relative"
                style={{ height: height * 0.38 }}
              >
                <View className="py-2 items-center justify-center h-10">
                  <ImageBackground
                    source={require("../../../assets/images/logo.png")}
                    className="w-24 h-8"
                    resizeMode="contain"
                  />
                </View>

                <View className="items-center py-3 mb-2">
                  <Text className="font-comfortaa-bold text-lg text-gray-800">
                    Question {currentQuestionIndex + 1}
                  </Text>
                </View>

                <View className="px-4 pb-5">
                  <View className="flex-row items-start">
                    <View className="w-7 h-7 bg-gray-100 rounded-full items-center justify-center mr-3 mt-0.5">
                      <Text className="font-comfortaa-bold text-sm text-gray-800">
                        {currentQuestionIndex + 1}
                      </Text>
                    </View>
                    <Text className="font-comfortaa text-base text-gray-800 flex-1 leading-6">
                      {currentQuestion.question}
                    </Text>
                  </View>
                </View>

                <View className="flex-row justify-between items-center px-4 py-4 mt-2">
                  <TouchableOpacity
                    disabled={isFirstQuestion}
                    className="flex-row items-center bg-white rounded-full py-2.5 px-4 shadow-sm"
                    onPress={() => handleSlideQuestion("prev")}
                  >
                    <Ionicons name="arrow-back" size={18} color="#555" />
                    <Text className="font-comfortaa text-sm text-gray-700 ml-1.5">
                      Previous
                    </Text>
                  </TouchableOpacity>

                  {isLastQuestion ? (
                    <TouchableOpacity
                      className="flex-row items-center bg-[#FF932E] rounded-full py-3 px-7 shadow-sm"
                      onPress={handleSubmit}
                    >
                      <Text className="font-comfortaa-bold text-white text-base mr-1.5">
                        Submit
                      </Text>
                      <Ionicons name="checkmark" size={18} color="white" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      className="flex-row items-center bg-[#FF932E] rounded-full py-3 px-7 shadow-sm"
                      onPress={() => handleSlideQuestion("next")}
                    >
                      <Text className="font-comfortaa-bold text-white text-base mr-1.5">
                        Next
                      </Text>
                      <Ionicons name="arrow-forward" size={18} color="white" />
                    </TouchableOpacity>
                  )}
                </View>

                <View className="h-1.5 w-full bg-gray-100 absolute bottom-0">
                  <View
                    className="h-1.5 bg-blue-600"
                    style={{
                      width: `${
                        ((currentQuestionIndex + 1) /
                          INTERVIEW_QUESTIONS.length) *
                        100
                      }%`,
                    }}
                  />
                </View>
              </View>

              {/* Add space at the bottom */}
              <View style={{ height: height * 0.1 }} />
            </View>
          </SafeAreaView>
        </ImageBackground>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 10,
    justifyContent: "flex-start",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    height: height * 0.22,
  },
  cameraContainer: {
    width: "55%",
    borderRadius: 20,
    overflow: "hidden",
  },
  cameraWrapper: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
  },
  camera: {
    flex: 1,
    borderRadius: 20,
  },
  cameraPlaceholder: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    paddingRight: 20,
    paddingBottom: 20,
  },
  cameraPlaceholderText: {
    color: "white",
    fontFamily: "Comfortaa-Regular",
    marginTop: 10,
  },
  mockVideoPreview: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  mockVideoText: {
    color: "white",
    fontFamily: "Comfortaa-Bold",
    fontSize: 18,
    marginBottom: 10,
  },
  videoPreviewContainer: {
    flex: 1,
    position: "relative",
  },
  videoPreview: {
    flex: 1,
    borderRadius: 20,
  },
  retakeButton: {
    position: "absolute",
    right: 12,
    top: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 20,
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  retakeText: {
    color: "#fff",
    marginLeft: 4,
    fontFamily: "Comfortaa-Regular",
  },
  flipCameraButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
  recordingIndicator: {
    position: "absolute",
    top: 16,
    left: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 16,
    padding: 8,
    zIndex: 10,
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "red",
    marginRight: 8,
  },
  recordingText: {
    color: "white",
    fontFamily: "Comfortaa-Regular",
  },
  speechBubbleContainer: {
    position: "absolute",
    bottom: 60,
    right: 16,
    zIndex: 10,
  },
  speechBubble: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 8,
  },
  speechBubbleText: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 14,
    color: "#333",
  },
  recordIconContainer: {
    position: "absolute",
    bottom: 20,
    right: 16,
    backgroundColor: "#FF5722",
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
  errorText: {
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Comfortaa-Regular",
    fontSize: 16,
    color: "#555",
  },
  permissionButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  buttonText: {
    color: "white",
    fontFamily: "Comfortaa-Bold",
    fontSize: 16,
  },
  recordButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  recordDot: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "red",
  },
  stopRecordButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  stopButton: {
    width: 28,
    height: 28,
    backgroundColor: "red",
    borderRadius: 4,
  },
  audioButton: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
});

export default RecordingPage;
