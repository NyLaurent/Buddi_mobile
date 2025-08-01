import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../context/AuthContext";
import {
  getRandomInterviewQuestions,
  uploadBuddiProfileVideo,
} from "../../../services/api/buddi.service";

type InterviewQuestion = { id: string; questionDescription: string };

const PRIMARY_COLOR = "#FF932E";

export default function BuddiRecordingScreen() {
  const router = useRouter();
  const { buddiDetails } = useAuth();

  // Redirect if interview video already submitted
  useEffect(() => {
    if (buddiDetails?.isInterviewVideoSubmitted) {
      router.replace("/auth/recording/success");
    }
  }, [buddiDetails]);

  // Interview questions state
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [current, setCurrent] = useState(0);

  // Camera state
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [recording, setRecording] = useState(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [facing, setFacing] = useState<CameraType>("front");
  const [submitting, setSubmitting] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getRandomInterviewQuestions()
      .then((qs) => {
        if (mounted) {
          setQuestions(qs);
          setLoading(false);
        }
      })
      .catch((e) => {
        setError("Failed to load questions");
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Progress bar based on question navigation
  const progress = questions.length > 0 ? (current + 1) / questions.length : 0;
  const question: InterviewQuestion = questions[current] || {
    id: "",
    questionDescription: "",
  };

  // Navigation handlers
  const handlePrev = () => setCurrent((c) => Math.max(0, c - 1));
  const handleNext = () =>
    setCurrent((c) => Math.min(questions.length - 1, c + 1));

  // Camera logic
  if (!permission) return null;
  if (!permission.granted) {
    return (
      <View style={styles.centeredContainer}>
        <Text
          style={{
            textAlign: "center",
            fontFamily: "Comfortaa-Regular",
            marginBottom: 20,
            color: "#000",
          }}
        >
          Camera permission is required to record your interview video
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: PRIMARY_COLOR,
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 8,
          }}
          onPress={requestPermission}
        >
          <Text
            style={{
              color: "#fff",
              fontFamily: "Comfortaa-Bold",
              textAlign: "center",
            }}
          >
            Grant Camera Permission
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const startRecording = async () => {
    console.log("startRecording called");

    if (!cameraRef.current) {
      console.error("Camera ref is null");
      setError("Camera not ready");
      return;
    }

    if (!permission?.granted) {
      console.error("Camera permission not granted");
      setError("Camera permission required");
      return;
    }

    setVideoUri(null);
    setError("");
    setRecording(true);

    try {
      console.log("Starting recording...");

      // Try different recording approaches for production compatibility
      let video: any;

      try {
        // First attempt: recordAsync with options and timeout
        const recordingPromise = cameraRef.current.recordAsync({
          maxDuration: 300, // 5 minutes max
        });

        // Add a timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Recording timeout")), 10000); // 10 second timeout
        });

        video = await Promise.race([recordingPromise, timeoutPromise]);
        console.log("Method 1 (recordAsync with options) succeeded");
      } catch (method1Error) {
        console.log("Method 1 failed, trying method 2:", method1Error);

        try {
          // Second attempt: recordAsync without options
          video = await cameraRef.current.recordAsync();
          console.log("Method 2 (recordAsync without options) succeeded");
        } catch (method2Error) {
          console.log("Method 2 failed:", method2Error);
          throw method2Error; // Re-throw the last error
        }
      }

      console.log("Recording completed, video object:", video);

      if (video && video.uri) {
        setVideoUri(video.uri);
        console.log("Recording successful:", video.uri);
      } else {
        console.error("No video URI in response:", video);
        throw new Error("No video URI returned");
      }
    } catch (e: any) {
      console.error("Recording error details:", e);
      console.error("Error message:", e?.message);
      console.error("Error stack:", e?.stack);
      setError(`Failed to record video: ${e?.message || "Unknown error"}`);
    } finally {
      setRecording(false);
    }
  };

  const stopRecording = () => {
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
    }
    setRecording(false);
  };

  const testCamera = async () => {
    console.log("Testing camera functionality...");
    console.log("Camera ref exists:", !!cameraRef.current);
    console.log("Permission granted:", permission?.granted);
    console.log("Camera ready:", cameraReady);

    if (cameraRef.current) {
      try {
        // Test if camera methods are available
        console.log("Camera methods available:", {
          hasRecordAsync: typeof cameraRef.current.recordAsync === "function",
          hasStopRecording:
            typeof cameraRef.current.stopRecording === "function",
        });
      } catch (e) {
        console.error("Camera test error:", e);
      }
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (!videoUri || !buddiDetails?.id)
        throw new Error("Missing video or Buddi ID");
      // Log the file object
      const fileObj = {
        uri: videoUri,
        name: "profile-video.mp4",
        type: "video/mp4",
      };
      console.log("Uploading video file object:", fileObj);
      // Build FormData and log its contents (entries() is not available in React Native)
      const formData = new FormData();
      formData.append("video", fileObj as any);
      console.log("FormData object:", formData);
      // Actually upload using the service (which will rebuild FormData, but this logs what would be sent)
      await uploadBuddiProfileVideo(buddiDetails.id, videoUri);
      router.push("/auth/recording/success");
    } catch (e: any) {
      setError("Failed to upload video");
      if (e.response) {
        console.log("Upload error response:", e.response.data);
      } else {
        console.log("Upload error:", e);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // UI rendering
  return (
    <ImageBackground
      source={require("../../../assets/images/auth/video_bg.jpg")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1, paddingTop: 16 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingTop: 8,
          }}
        >
          <TouchableOpacity
            style={{ backgroundColor: "#fff", borderRadius: 999, padding: 8 }}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#555" />
          </TouchableOpacity>
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                color: "#fff",
                fontSize: 18,
                textAlign: "center",
                fontFamily: "Comfortaa-Bold",
              }}
            >
              Record Your Buddi
            </Text>
            <Text
              style={{
                color: "#fff",
                fontSize: 18,
                textAlign: "center",
                fontFamily: "Comfortaa-Bold",
              }}
            >
              Interview
            </Text>
          </View>
          <TouchableOpacity
            style={{ backgroundColor: "#fff", borderRadius: 999, padding: 8 }}
          >
            <Ionicons name="ellipsis-vertical" size={20} color="#555" />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 20,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Video Preview/Camera */}
          <View style={{ alignItems: "center", marginBottom: 24 }}>
            {videoUri ? (
              <View
                style={{
                  width: "100%",
                  maxWidth: 400,
                  aspectRatio: 4 / 3,
                  borderRadius: 16,
                  overflow: "hidden",
                  backgroundColor: "#eee",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <Video
                  source={{ uri: videoUri }}
                  style={{ width: "100%", height: "100%" }}
                  useNativeControls
                  resizeMode={ResizeMode.COVER}
                  isLooping
                />
              </View>
            ) : (
              <View
                style={{
                  width: "100%",
                  maxWidth: 400,
                  aspectRatio: 4 / 3,
                  borderRadius: 16,
                  overflow: "hidden",
                  backgroundColor: "#eee",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <CameraView
                  ref={cameraRef}
                  style={{ width: "100%", height: "100%" }}
                  facing={facing}
                  mode="video"
                  mute={false}
                  onCameraReady={() => setCameraReady(true)}
                >
                  {/* Camera controls overlay */}
                  <View style={styles.cameraOverlay}>
                    <TouchableOpacity
                      onPress={() =>
                        setFacing(facing === "front" ? "back" : "front")
                      }
                      style={{
                        backgroundColor: "#fff",
                        borderRadius: 999,
                        padding: 6,
                      }}
                    >
                      <Ionicons
                        name="camera-reverse"
                        size={20}
                        color={PRIMARY_COLOR}
                      />
                    </TouchableOpacity>
                  </View>
                </CameraView>
              </View>
            )}
            {/* Recording controls */}
            {!recording && !videoUri && !cameraReady && (
              <View style={[styles.recordBtn, { backgroundColor: "#ccc" }]}>
                <Ionicons name="camera" size={24} color="#666" />
                <Text
                  style={{
                    color: "#666",
                    fontFamily: "Comfortaa-Bold",
                    marginLeft: 8,
                  }}
                >
                  Camera Loading...
                </Text>
              </View>
            )}
            {!recording && !videoUri && cameraReady && (
              <View style={{ gap: 8 }}>
                <TouchableOpacity
                  style={styles.recordBtn}
                  onPress={startRecording}
                >
                  <Ionicons name="videocam" size={24} color="#fff" />
                  <Text
                    style={{
                      color: "#fff",
                      fontFamily: "Comfortaa-Bold",
                      marginLeft: 8,
                    }}
                  >
                    Start Recording
                  </Text>
                </TouchableOpacity>

                {/* Debug button for testing */}
                <TouchableOpacity
                  style={[styles.recordBtn, { backgroundColor: "#666" }]}
                  onPress={testCamera}
                >
                  <Ionicons name="bug" size={20} color="#fff" />
                  <Text
                    style={{
                      color: "#fff",
                      fontFamily: "Comfortaa-Regular",
                      marginLeft: 8,
                      fontSize: 12,
                    }}
                  >
                    Debug Camera
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {recording && (
              <TouchableOpacity
                style={[styles.recordBtn, { backgroundColor: "#d32f2f" }]}
                onPress={
                  current === questions.length - 1 ? stopRecording : handleNext
                }
              >
                <Ionicons name="stop" size={24} color="#fff" />
                <Text
                  style={{
                    color: "#fff",
                    fontFamily: "Comfortaa-Bold",
                    marginLeft: 8,
                  }}
                >
                  {current === questions.length - 1
                    ? "Stop Recording & Submit"
                    : "Next Question"}
                </Text>
              </TouchableOpacity>
            )}
            {videoUri && (
              <TouchableOpacity
                style={[styles.recordBtn, { backgroundColor: PRIMARY_COLOR }]}
                onPress={handleSubmit}
                disabled={submitting}
              >
                <Ionicons name="cloud-upload" size={24} color="#fff" />
                <Text
                  style={{
                    color: "#fff",
                    fontFamily: "Comfortaa-Bold",
                    marginLeft: 8,
                  }}
                >
                  {submitting ? "Submitting..." : "Submit Video"}
                </Text>
              </TouchableOpacity>
            )}
            {error && (
              <Text
                style={{
                  color: "#d32f2f",
                  textAlign: "center",
                  marginTop: 12,
                  fontFamily: "Comfortaa-Regular",
                  fontSize: 14,
                }}
              >
                {error}
              </Text>
            )}
          </View>

          {/* Question Card */}
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 32,
              padding: 24,
              marginTop: 8,
              alignItems: "center",
              shadowColor: "#000",
              shadowOpacity: 0.08,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Image
              source={require("../../../assets/images/logo.png")}
              style={{ width: 68, height: 48, marginBottom: 8 }}
            />
            <Text
              style={{
                fontSize: 18,
                marginBottom: 8,
                fontFamily: "Comfortaa-Bold",
              }}
            >
              Question {current + 1}
            </Text>
            {loading ? (
              <Text
                style={{
                  color: PRIMARY_COLOR,
                  fontFamily: "Comfortaa-Regular",
                  marginBottom: 24,
                }}
              >
                Loading questions...
              </Text>
            ) : error ? (
              <Text
                style={{
                  color: "red",
                  fontFamily: "Comfortaa-Regular",
                  marginBottom: 24,
                }}
              >
                {error}
              </Text>
            ) : (
              <Text
                style={{
                  color: "#71727A",
                  fontSize: 16,
                  textAlign: "center",
                  marginBottom: 24,
                  fontFamily: "Comfortaa-Regular",
                }}
              >
                {question.questionDescription}
              </Text>
            )}
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
                marginTop: 8,
              }}
            >
              <TouchableOpacity
                onPress={handlePrev}
                disabled={current === 0 || recording}
                style={{
                  backgroundColor: "#fff",
                  borderColor: PRIMARY_COLOR,
                  borderWidth: 1,
                  borderRadius: 999,
                  paddingVertical: 10,
                  paddingHorizontal: 24,
                  opacity: current === 0 || recording ? 0.5 : 1,
                }}
              >
                <Text
                  style={{
                    color: PRIMARY_COLOR,
                    fontFamily: "Comfortaa-Bold",
                  }}
                >
                  Previous
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleNext}
                disabled={current === questions.length - 1 || recording}
                style={{
                  backgroundColor: PRIMARY_COLOR,
                  borderRadius: 999,
                  paddingVertical: 10,
                  paddingHorizontal: 32,
                  opacity:
                    current === questions.length - 1 || recording ? 0.5 : 1,
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontFamily: "Comfortaa-Bold",
                  }}
                >
                  Next
                </Text>
              </TouchableOpacity>
            </View>
            {/* Progress Bar */}
            <View
              style={{
                height: 6,
                backgroundColor: "#E5E7EB",
                borderRadius: 3,
                width: "100%",
                marginTop: 24,
              }}
            >
              <View
                style={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: PRIMARY_COLOR,
                  width: `${progress * 100}%`,
                }}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraOverlay: {
    position: "absolute",
    bottom: 16,
    left: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  recordBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 16,
  },
});
