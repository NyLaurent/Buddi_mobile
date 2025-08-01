import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
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

  // Cleanup camera when component unmounts
  useEffect(() => {
    return () => {
      // Ensure recording is stopped when component unmounts
      if (recording && cameraRef.current) {
        try {
          cameraRef.current.stopRecording();
        } catch (error) {
          console.log("Error stopping recording on unmount:", error);
        }
      }
    };
  }, [recording]);

  // Add timeout for camera ready state
  useEffect(() => {
    if (!cameraReady && permission?.granted) {
      const timeout = setTimeout(() => {
        console.log("Camera ready timeout - forcing ready state");
        setCameraReady(true);
      }, 10000); // 10 second timeout

      return () => clearTimeout(timeout);
    }
  }, [cameraReady, permission?.granted]);

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
      <ImageBackground
        source={require("../../../assets/images/auth/video_bg.jpg")}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.centeredContainer}>
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 24,
                padding: 32,
                margin: 20,
                alignItems: "center",
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowRadius: 10,
                elevation: 5,
              }}
            >
              <Ionicons
                name="camera"
                size={64}
                color={PRIMARY_COLOR}
                style={{ marginBottom: 16 }}
              />
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "Comfortaa-Bold",
                  color: "#333",
                  textAlign: "center",
                  marginBottom: 12,
                }}
              >
                Camera Access Required
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Comfortaa-Regular",
                  color: "#666",
                  textAlign: "center",
                  marginBottom: 24,
                  lineHeight: 22,
                }}
              >
                To record your interview video, we need access to your camera.
                This helps us capture your responses for the interview process.
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: PRIMARY_COLOR,
                  paddingVertical: 16,
                  paddingHorizontal: 32,
                  borderRadius: 12,
                  width: "100%",
                  alignItems: "center",
                }}
                onPress={requestPermission}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontFamily: "Comfortaa-Bold",
                    fontSize: 16,
                    textAlign: "center",
                  }}
                >
                  Grant Camera Permission
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 24,
                  marginTop: 12,
                }}
                onPress={() => {
                  Alert.alert(
                    "Camera Permission Required",
                    "Camera access is essential for recording your interview video. Please grant permission to continue.",
                    [
                      { text: "Cancel", style: "cancel" },
                      { text: "Grant Permission", onPress: requestPermission },
                    ]
                  );
                }}
              >
                <Text
                  style={{
                    color: PRIMARY_COLOR,
                    fontFamily: "Comfortaa-Regular",
                    fontSize: 14,
                    textAlign: "center",
                  }}
                >
                  Why do we need this?
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  const startRecording = async () => {
    console.log("=== START RECORDING ===");
    console.log("Camera ref exists:", !!cameraRef.current);
    console.log("Permission granted:", permission?.granted);
    console.log("Camera ready:", cameraReady);
    console.log("Currently recording:", recording);

    // Validate prerequisites
    if (!cameraRef.current) {
      console.error("Camera ref is null");
      Alert.alert(
        "Camera Not Ready",
        "Camera is not ready. Please wait for camera to initialize.",
        [{ text: "OK", style: "default" }]
      );
      setError("Camera not ready. Please wait for camera to initialize.");
      return;
    }

    if (!permission?.granted) {
      console.error("Camera permission not granted");
      Alert.alert(
        "Camera Permission Required",
        "Camera permission is required to record video. Please grant camera access in settings.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Grant Permission", onPress: requestPermission },
        ]
      );
      setError("Camera permission required. Please grant camera access.");
      return;
    }

    if (!cameraReady) {
      console.error("Camera not ready");
      Alert.alert(
        "Camera Initializing",
        "Camera is still initializing. Please wait a moment and try again.",
        [{ text: "OK", style: "default" }]
      );
      setError("Camera is still initializing. Please wait a moment.");
      return;
    }

    // Prevent multiple recordings
    if (recording) {
      console.log("Recording already in progress, ignoring start request");
      return;
    }

    setVideoUri(null);
    setError("");
    setRecording(true);

    try {
      console.log("Starting recording process...");

      // Wait for camera to be fully ready
      await new Promise((resolve) => setTimeout(resolve, 1000));

      let video: any;
      let recordingAttempts = 0;
      const maxAttempts = 3;

      while (recordingAttempts < maxAttempts) {
        try {
          console.log(
            `Recording attempt ${recordingAttempts + 1}/${maxAttempts}`
          );

          // Ensure camera ref is still valid
          if (!cameraRef.current) {
            throw new Error("Camera reference lost during recording");
          }

          // Start recording with minimal options for better compatibility
          video = await cameraRef.current.recordAsync({
            maxDuration: 300, // 5 minutes max
          });

          console.log(
            "Recording completed successfully on attempt",
            recordingAttempts + 1
          );
          break; // Success, exit the retry loop
        } catch (recordingError: any) {
          recordingAttempts++;
          console.log(
            `Recording attempt ${recordingAttempts} failed:`,
            recordingError
          );
          console.log("Error message:", recordingError?.message);
          console.log("Error code:", recordingError?.code);

          // If it's the last attempt, throw the error
          if (recordingAttempts >= maxAttempts) {
            throw recordingError;
          }

          // If it's a "recording already in progress" error, try to stop and restart
          if (
            recordingError.message &&
            (recordingError.message.includes("already in progress") ||
              recordingError.message.includes("recording"))
          ) {
            console.log("Attempting to stop existing recording and restart...");

            try {
              // Try to stop any existing recording
              if (cameraRef.current) {
                await cameraRef.current.stopRecording();
              }

              // Wait longer for camera to reset
              await new Promise((resolve) => setTimeout(resolve, 2000));
            } catch (stopError) {
              console.log("Error stopping recording:", stopError);
              // Continue to next attempt anyway
            }
          } else {
            // For other errors, wait a bit before retrying
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }
      }

      console.log("Recording process completed, video object:", video);

      if (video && video.uri) {
        setVideoUri(video.uri);
        console.log("Recording successful:", video.uri);
        console.log("Video duration:", video.duration);
        console.log("Video size:", video.size);
      } else {
        console.error("No video URI in response:", video);
        throw new Error("No video URI returned from recording");
      }
    } catch (e: any) {
      console.error("=== RECORDING ERROR ===");
      console.error("Recording error details:", e);
      console.error("Error message:", e?.message);
      console.error("Error code:", e?.code);
      console.error("Error stack:", e?.stack);

      // Provide more specific error messages
      let errorMessage = "Failed to record video";
      let alertTitle = "Recording Error";

      if (e?.message) {
        if (e.message.includes("permission")) {
          errorMessage =
            "Camera permission denied. Please grant camera access in settings.";
          alertTitle = "Camera Permission Required";
        } else if (e.message.includes("already in progress")) {
          errorMessage = "Recording is already in progress. Please wait.";
          alertTitle = "Recording in Progress";
        } else if (
          e.message.includes("not ready") ||
          e.message.includes("initializing")
        ) {
          errorMessage =
            "Camera is not ready. Please wait for camera to initialize.";
          alertTitle = "Camera Not Ready";
        } else if (e.message.includes("timeout")) {
          errorMessage = "Recording timed out. Please try again.";
          alertTitle = "Recording Timeout";
        } else {
          errorMessage = `Recording failed: ${e.message}`;
          alertTitle = "Recording Failed";
        }
      }

      // Show alert to user
      Alert.alert(alertTitle, errorMessage, [
        { text: "OK", style: "default" },
        {
          text: "Try Again",
          onPress: () => {
            setError("");
            // Retry recording after a short delay
            setTimeout(() => {
              startRecording();
            }, 1000);
          },
        },
      ]);

      setError(errorMessage);
    } finally {
      setRecording(false);
      console.log("=== RECORDING END ===");
    }
  };

  const stopRecording = async () => {
    console.log("stopRecording called");

    if (!cameraRef.current) {
      console.log("Camera ref is null, cannot stop recording");
      setRecording(false);
      return;
    }

    try {
      console.log("Stopping recording...");
      await cameraRef.current.stopRecording();
      console.log("Recording stopped successfully");
    } catch (error) {
      console.error("Error stopping recording:", error);
    } finally {
      setRecording(false);
    }
  };

  const handleSubmit = async () => {
    console.log("=== RECORDING SCREEN SUBMIT START ===");
    setSubmitting(true);
    setError(""); // Clear any previous errors

    try {
      console.log("[SUBMIT] Checking prerequisites...");
      if (!videoUri || !buddiDetails?.id) {
        console.error("[SUBMIT] Missing prerequisites:");
        console.error("[SUBMIT] - videoUri:", videoUri);
        console.error("[SUBMIT] - buddiDetails?.id:", buddiDetails?.id);
        throw new Error("Missing video or Buddi ID");
      }

      console.log("[SUBMIT] Prerequisites check passed");
      console.log("[SUBMIT] Video URI:", videoUri);
      console.log("[SUBMIT] Video URI type:", typeof videoUri);
      console.log("[SUBMIT] Video URI length:", videoUri.length);
      console.log("[SUBMIT] Buddi ID:", buddiDetails.id);
      console.log("[SUBMIT] Buddi ID type:", typeof buddiDetails.id);

      console.log("[SUBMIT] Starting video upload...");
      const uploadStartTime = Date.now();

      // Upload the video (no compression in Expo Go)
      await uploadBuddiProfileVideo(buddiDetails.id, videoUri);

      const uploadEndTime = Date.now();
      console.log(
        "[SUBMIT] Upload completed in:",
        uploadEndTime - uploadStartTime,
        "ms"
      );
      console.log("[SUBMIT] Video upload successful!");
      console.log("=== RECORDING SCREEN SUBMIT END ===");

      router.push("/auth/recording/success");
    } catch (e: any) {
      console.error("=== RECORDING SCREEN SUBMIT ERROR ===");
      console.error("[SUBMIT] Upload error:", e);
      console.error("[SUBMIT] Error type:", typeof e);
      console.error("[SUBMIT] Error message:", e?.message);
      console.error("[SUBMIT] Error stack:", e?.stack);

      // Set user-friendly error message
      console.log("[SUBMIT] Processing error for user display...");
      let errorMessage = "Failed to upload video";
      let alertTitle = "Upload Error";

      if (e.message) {
        console.log("[SUBMIT] Error message:", e.message);
        if (e.message.includes("Network error")) {
          errorMessage =
            "Network error. Please check your connection and try again.";
          alertTitle = "Network Error";
        } else if (e.message.includes("timeout")) {
          errorMessage = "Upload timed out. Please try again.";
          alertTitle = "Upload Timeout";
        } else if (e.message.includes("Upload failed:")) {
          errorMessage = e.message.replace("Upload failed: ", "");
          alertTitle = "Upload Failed";
        } else if (e.message.includes("video")) {
          errorMessage = "Video upload failed. Please try again.";
          alertTitle = "Video Upload Error";
        } else {
          errorMessage = e.message;
          alertTitle = "Upload Error";
        }
      } else {
        console.log("[SUBMIT] No error message found, using default");
      }

      console.log("[SUBMIT] Final error message for user:", errorMessage);

      // Show alert to user
      Alert.alert(alertTitle, errorMessage, [
        { text: "OK", style: "default" },
        {
          text: "Retry Upload",
          onPress: () => {
            setError("");
            // Retry upload after a short delay
            setTimeout(() => {
              handleSubmit();
            }, 1000);
          },
        },
      ]);

      setError(errorMessage);

      // Log detailed error information
      console.log("[SUBMIT] Detailed error analysis:");
      if (e.response) {
        console.log("[SUBMIT] - Response error:");
        console.log("[SUBMIT]   - Status:", e.response.status);
        console.log("[SUBMIT]   - Data:", e.response.data);
        console.log("[SUBMIT]   - Headers:", e.response.headers);
      } else if (e.request) {
        console.log("[SUBMIT] - Request error:");
        console.log("[SUBMIT]   - Request:", e.request);
        console.log("[SUBMIT]   - ReadyState:", e.request?.readyState);
        console.log("[SUBMIT]   - Status:", e.request?.status);
      } else {
        console.log("[SUBMIT] - Other error:");
        console.log("[SUBMIT]   - Error object:", e);
      }
      console.error("=== RECORDING SCREEN SUBMIT ERROR END ===");
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
                  onCameraReady={() => {
                    console.log("Camera ready callback triggered");
                    setCameraReady(true);
                  }}
                  onMountError={(error) => {
                    console.error("Camera mount error:", error);
                    Alert.alert(
                      "Camera Error",
                      "Failed to initialize camera. Please restart the app and try again.",
                      [
                        { text: "OK", style: "default" },
                        {
                          text: "Restart App",
                          onPress: () => {
                            // This would typically restart the app, but for now just clear error
                            setError("");
                          },
                        },
                      ]
                    );
                    setError(
                      "Failed to initialize camera. Please restart the app."
                    );
                  }}
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
              <View style={{ gap: 8 }}>
                <TouchableOpacity
                  style={[
                    styles.recordBtn,
                    {
                      backgroundColor: submitting ? "#ccc" : PRIMARY_COLOR,
                      opacity: submitting ? 0.7 : 1,
                    },
                  ]}
                  onPress={handleSubmit}
                  disabled={submitting}
                >
                  <Ionicons
                    name={submitting ? "hourglass" : "cloud-upload"}
                    size={24}
                    color="#fff"
                  />
                  <Text
                    style={{
                      color: "#fff",
                      fontFamily: "Comfortaa-Bold",
                      marginLeft: 8,
                    }}
                  >
                    {submitting ? "Processing & Uploading..." : "Submit Video"}
                  </Text>
                </TouchableOpacity>

                {submitting && (
                  <Text
                    style={{
                      color: "#fff",
                      fontFamily: "Comfortaa-Regular",
                      fontSize: 12,
                      textAlign: "center",
                      opacity: 0.8,
                    }}
                  >
                    Uploading video... Please wait.
                  </Text>
                )}
              </View>
            )}
            {error && (
              <View style={{ gap: 8, marginTop: 12 }}>
                <Text
                  style={{
                    color: "#d32f2f",
                    textAlign: "center",
                    fontFamily: "Comfortaa-Regular",
                    fontSize: 14,
                  }}
                >
                  {error}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.recordBtn,
                    {
                      backgroundColor: "#d32f2f",
                      marginTop: 8,
                    },
                  ]}
                  onPress={handleSubmit}
                  disabled={submitting}
                >
                  <Ionicons name="refresh" size={20} color="#fff" />
                  <Text
                    style={{
                      color: "#fff",
                      fontFamily: "Comfortaa-Bold",
                      marginLeft: 8,
                    }}
                  >
                    Retry Upload
                  </Text>
                </TouchableOpacity>
              </View>
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
