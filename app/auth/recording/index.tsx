import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  ImageBackground,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
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
  {
    id: 4,
    question:
      "What safety measures would you take when picking up and dropping off a child?",
  },
  {
    id: 5,
    question:
      "What activities would you do with children during your time with them?",
  },
];

interface AnsweredQuestions {
  [key: number]: string;
}

// Define camera types directly
const CAMERA_TYPE = {
  front: "front",
  back: "back",
};

const RecordingPage = () => {
  const router = useRouter();
  const videoPlayer = useRef(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [type, setType] = useState(CAMERA_TYPE.front);
  const [isRecording, setIsRecording] = useState(false);
  const [currentVideoUri, setCurrentVideoUri] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [completedQuestions, setCompletedQuestions] = useState<number[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestions>(
    {}
  );

  const slideTransition = useSharedValue(0);

  useEffect(() => {
    // Simulating permission request
    const timer = setTimeout(() => {
      setHasPermission(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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

  const startRecording = () => {
    if (!isRecording) {
      setIsRecording(true);

      // Simulate recording for demo purposes
      setTimeout(() => {
        setIsRecording(false);
        // Mock video URL
        const mockVideoUri = "https://example.com/mock-video.mp4";
        setCurrentVideoUri(mockVideoUri);

        const updatedAnsweredQuestions = {
          ...answeredQuestions,
          [currentQuestionIndex]: mockVideoUri,
        };
        setAnsweredQuestions(updatedAnsweredQuestions);

        if (!completedQuestions.includes(currentQuestionIndex)) {
          setCompletedQuestions([...completedQuestions, currentQuestionIndex]);
        }
      }, 3000);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
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
                "Thank you for completing your interview!"
              );
              router.back();
            },
          },
        ]
      );
    } else {
      Alert.alert(
        "Interview Submitted",
        "Thank you for completing your interview!"
      );
      router.back();
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

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting permissions...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No access to camera or microphone</Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
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

          <ScrollView
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Score Board */}
            <View className="mb-4 border border-blue-200 rounded-2xl p-4 bg-white bg-opacity-90">
              <Text className="font-comfortaa text-gray-700 mb-2">
                You score board
              </Text>

              <View className="flex-row items-center">
                <View className="h-12 w-12 rounded-full bg-gray-100 mr-4 justify-center items-center">
                  <Ionicons name="videocam" size={24} color="#8A56FF" />
                </View>

                <View className="flex-1">
                  <Text className="text-lg font-comfortaa-bold text-gray-800">
                    {`${completedQuestions.length}/${INTERVIEW_QUESTIONS.length}`}{" "}
                    Questions
                  </Text>
                  <Text className="text-xs font-comfortaa text-gray-500">
                    {`${Math.min(
                      completedQuestions.length,
                      INTERVIEW_QUESTIONS.length
                    )} of ${INTERVIEW_QUESTIONS.length} completed`}
                  </Text>
                </View>

                <View
                  className="bg-purple-500 rounded-full p-2"
                  style={{ backgroundColor: "#8A56FF" }}
                >
                  <Ionicons name="flash" size={18} color="white" />
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
                <View style={styles.mockCamera}>
                  {isRecording ? (
                    <View style={styles.recordingIndicator}>
                      <View style={styles.redDot} />
                      <Text style={styles.recordingText}>Recording...</Text>
                    </View>
                  ) : (
                    <View style={styles.cameraPlaceholder}>
                      <Ionicons name="videocam" size={60} color="white" />
                      <Text style={styles.cameraPlaceholderText}>
                        Camera Preview
                      </Text>
                    </View>
                  )}

                  <TouchableOpacity
                    style={styles.flipCameraButton}
                    onPress={() => {
                      setType(
                        type === CAMERA_TYPE.back
                          ? CAMERA_TYPE.front
                          : CAMERA_TYPE.back
                      );
                    }}
                  >
                    <Ionicons name="camera-reverse" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Question and Navigation */}
            <View style={styles.questionCard}>
              <View style={styles.brandSection}>
                <Text style={styles.brandText}>Pickup Buddi</Text>
              </View>

              <View style={styles.questionContainer}>
                <Animated.View style={[styles.questionSlide, animatedStyle]}>
                  <View style={styles.questionHeader}>
                    <Text style={styles.questionTitle}>
                      Question {currentQuestionIndex + 1}
                    </Text>
                    <Text style={styles.questionCount}>{questionProgress}</Text>
                  </View>

                  <Text style={styles.questionText}>
                    {currentQuestion.question}
                  </Text>
                </Animated.View>
              </View>

              <View style={styles.controlsContainer}>
                <TouchableOpacity
                  disabled={isFirstQuestion}
                  style={[
                    styles.navButton,
                    isFirstQuestion && styles.disabledButton,
                  ]}
                  onPress={() => handleSlideQuestion("prev")}
                >
                  <Ionicons
                    name="arrow-back"
                    size={20}
                    color={isFirstQuestion ? "#ccc" : "#555"}
                  />
                  <Text
                    style={[
                      styles.navButtonText,
                      isFirstQuestion && styles.disabledText,
                    ]}
                  >
                    Previous
                  </Text>
                </TouchableOpacity>

                {renderRecordButton()}

                {isLastQuestion ? (
                  <TouchableOpacity
                    style={[styles.navButton, styles.submitButton]}
                    onPress={handleSubmit}
                  >
                    <Text style={[styles.navButtonText, { color: "white" }]}>
                      Submit
                    </Text>
                    <Ionicons name="checkmark-circle" size={20} color="white" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => handleSlideQuestion("next")}
                  >
                    <Text style={styles.navButtonText}>Next</Text>
                    <Ionicons name="arrow-forward" size={20} color="#555" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </ScrollView>

          {/* Progress Bar */}
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${
                    (completedQuestions.length / INTERVIEW_QUESTIONS.length) *
                    100
                  }%`,
                },
              ]}
            />
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
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 10,
  },
  cameraContainer: {
    height: height * 0.4,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
  },
  mockCamera: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  cameraPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
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
  questionCard: {
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 10,
  },
  brandSection: {
    padding: 12,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  brandText: {
    fontFamily: "Comfortaa-Bold",
    color: PRIMARY_COLOR,
    fontSize: 16,
  },
  questionContainer: {
    padding: 16,
    overflow: "hidden",
  },
  questionSlide: {
    width: "100%",
  },
  questionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  questionTitle: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 18,
    color: "#333",
  },
  questionCount: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 14,
    color: "#888",
  },
  questionText: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 16,
    lineHeight: 24,
    color: "#555",
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  submitButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  navButtonText: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 14,
    color: "#555",
    marginHorizontal: 4,
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    color: "#ccc",
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
  progressBar: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
    width: "100%",
  },
  progressFill: {
    height: 4,
    backgroundColor: PRIMARY_COLOR,
  },
});

export default RecordingPage;
