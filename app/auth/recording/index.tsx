import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
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

  // Video upload state
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [uploading, setUploading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<{
    name: string;
    size: number;
    type: string;
  } | null>(null);

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

  // Video picker functions
  const processSelectedVideo = async (
    uri: string,
    name: string,
    size: number
  ) => {
    try {
      // Check file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (size > maxSize) {
        Alert.alert(
          "File Too Large",
          "Please select a video file smaller than 5MB."
        );
        return;
      }

      // Set video info without duration check (duration will be validated during upload)
      setVideoDuration(0); // Will be updated during upload if possible
      setVideoUri(uri);
      setVideoInfo({ name, size, type: "video/mp4" });
      setError("");

      // Show reminder about duration requirement
      Alert.alert(
        "Video Selected",
        "Please ensure your video is 60 seconds or shorter. The duration will be verified during upload.",
        [{ text: "OK", style: "default" }]
      );
    } catch (error) {
      console.error("Error processing video:", error);
      Alert.alert(
        "Error",
        "Failed to process the selected video. Please try again."
      );
    }
  };

  // Remove pickVideoFromGallery function since we're not using it anymore

  const pickVideoFromDocuments = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "video/*",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        await processSelectedVideo(asset.uri, asset.name, asset.size || 0);
      }
    } catch (error) {
      console.error("Error picking video from documents:", error);
      Alert.alert(
        "Error",
        "Failed to pick video from documents. Please try again."
      );
    }
  };

  const removeVideo = () => {
    setVideoUri(null);
    setVideoDuration(0);
    setVideoInfo(null);
    setError("");
  };

  const handleSubmit = async () => {
    console.log("=== UPLOAD SCREEN SUBMIT START ===");
    setUploading(true);
    setError("");

    try {
      console.log("[SUBMIT] Checking prerequisites...");
      if (!videoUri || !buddiDetails?.id) {
        console.error("[SUBMIT] Missing prerequisites:");
        console.error("[SUBMIT] - videoUri:", videoUri);
        console.error("[SUBMIT] - buddiDetails?.id:", buddiDetails?.id);
        throw new Error("Missing video or Buddi ID");
      }

      // Note: Duration validation will be handled by the backend
      // We can't reliably check duration on the client side
      console.log("[SUBMIT] Prerequisites check passed");
      console.log("[SUBMIT] Video URI:", videoUri);
      console.log("[SUBMIT] Video duration:", videoDuration);
      console.log("[SUBMIT] Buddi ID:", buddiDetails.id);

      console.log("[SUBMIT] Starting video upload...");
      const uploadStartTime = Date.now();

      // Upload the video
      await uploadBuddiProfileVideo(buddiDetails.id, videoUri);

      const uploadEndTime = Date.now();
      console.log(
        "[SUBMIT] Upload completed in:",
        uploadEndTime - uploadStartTime,
        "ms"
      );
      console.log("[SUBMIT] Video upload successful!");
      console.log("=== UPLOAD SCREEN SUBMIT END ===");

      router.push("/auth/recording/success");
    } catch (e: any) {
      console.error("=== UPLOAD SCREEN SUBMIT ERROR ===");
      console.error("[SUBMIT] Upload error:", e);
      console.error("[SUBMIT] Error message:", e?.message);

      let errorMessage = "Failed to upload video";
      let alertTitle = "Upload Error";

      if (e.message) {
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
        } else if (
          e.message.includes("60 seconds") ||
          e.message.includes("duration")
        ) {
          errorMessage =
            "Video must be 60 seconds or shorter. Please select a shorter video.";
          alertTitle = "Video Too Long";
        } else if (e.message.includes("5MB") || e.message.includes("size")) {
          errorMessage =
            "Video must be smaller than 5MB. Please select a smaller video file.";
          alertTitle = "Video Too Large";
        } else {
          errorMessage = e.message;
          alertTitle = "Upload Error";
        }
      }

      Alert.alert(alertTitle, errorMessage, [
        { text: "OK", style: "default" },
        {
          text: "Retry Upload",
          onPress: () => {
            setError("");
            setTimeout(() => {
              handleSubmit();
            }, 1000);
          },
        },
      ]);

      setError(errorMessage);
    } finally {
      setUploading(false);
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
              Upload Your Buddi
            </Text>
            <Text
              style={{
                color: "#fff",
                fontSize: 18,
                textAlign: "center",
                fontFamily: "Comfortaa-Bold",
              }}
            >
              Interview Video
            </Text>
          </View>
          <View style={{ width: 40 }} />
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
          {/* Video Upload Section */}
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
                {/* Video info overlay */}
                <View style={styles.videoInfoOverlay}>
                  <Text style={styles.videoInfoText}>
                    {videoInfo?.name || "Video"}
                  </Text>
                  <Text style={styles.videoInfoText}>
                    {videoDuration > 0
                      ? `${Math.round(videoDuration)}s`
                      : "Duration: Unknown"}{" "}
                    •{" "}
                    {(videoInfo?.size || 0) / (1024 * 1024) < 1
                      ? `${Math.round((videoInfo?.size || 0) / 1024)}KB`
                      : `${
                          Math.round(
                            ((videoInfo?.size || 0) / (1024 * 1024)) * 10
                          ) / 10
                        }MB`}
                  </Text>
                </View>
              </View>
            ) : (
              <View
                style={{
                  width: "100%",
                  maxWidth: 400,
                  aspectRatio: 4 / 3,
                  borderRadius: 16,
                  overflow: "hidden",
                  backgroundColor: "#f8f9fa",
                  borderWidth: 2,
                  borderColor: "#e9ecef",
                  borderStyle: "dashed",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 20,
                }}
              >
                <Ionicons name="videocam-outline" size={64} color="#6c757d" />
                <Text
                  style={{
                    color: "#6c757d",
                    fontSize: 18,
                    fontFamily: "Comfortaa-Bold",
                    textAlign: "center",
                    marginTop: 16,
                    marginBottom: 8,
                  }}
                >
                  Upload Your Video
                </Text>
                <Text
                  style={{
                    color: "#6c757d",
                    fontSize: 14,
                    fontFamily: "Comfortaa-Regular",
                    textAlign: "center",
                    lineHeight: 20,
                  }}
                >
                  Record a 60-second video answering the interview questions
                </Text>
              </View>
            )}

            {/* Upload controls */}
            {!videoUri && (
              <View
                style={{
                  marginTop: 20,
                  width: "100%",
                  maxWidth: 400,
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  style={[styles.uploadBtn, { backgroundColor: PRIMARY_COLOR }]}
                  onPress={pickVideoFromDocuments}
                >
                  <Ionicons name="folder-outline" size={24} color="#fff" />
                  <Text
                    style={{
                      color: "#fff",
                      fontFamily: "Comfortaa-Bold",
                      marginLeft: 8,
                    }}
                  >
                    Upload Video from Files
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {videoUri && (
              <View
                style={{
                  marginTop: 16,
                  width: "100%",
                  maxWidth: 400,
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <TouchableOpacity
                  style={[
                    styles.uploadBtn,
                    {
                      backgroundColor: uploading ? "#ccc" : PRIMARY_COLOR,
                      opacity: uploading ? 0.7 : 1,
                    },
                  ]}
                  onPress={handleSubmit}
                  disabled={uploading}
                >
                  <Ionicons
                    name={uploading ? "hourglass" : "cloud-upload"}
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
                    {uploading ? "Processing & Uploading..." : "Submit Video"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.uploadBtn, { backgroundColor: "#dc3545" }]}
                  onPress={removeVideo}
                  disabled={uploading}
                >
                  <Ionicons name="trash-outline" size={24} color="#fff" />
                  <Text
                    style={{
                      color: "#fff",
                      fontFamily: "Comfortaa-Bold",
                      marginLeft: 8,
                    }}
                  >
                    Remove Video
                  </Text>
                </TouchableOpacity>

                {uploading && (
                  <Text
                    style={{
                      color: "#fff",
                      fontFamily: "Comfortaa-Regular",
                      fontSize: 12,
                      textAlign: "center",
                      opacity: 0.8,
                      marginTop: 8,
                    }}
                  >
                    Uploading video... Please wait.
                  </Text>
                )}
              </View>
            )}

            {error && (
              <View
                style={{
                  marginTop: 12,
                  width: "100%",
                  maxWidth: 400,
                  alignItems: "center",
                }}
              >
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
                justifyContent: "center",
                marginTop: 8,
                gap: 16,
              }}
            >
              <TouchableOpacity
                onPress={handlePrev}
                disabled={current === 0}
                style={{
                  backgroundColor: "#fff",
                  borderColor: PRIMARY_COLOR,
                  borderWidth: 1,
                  borderRadius: 999,
                  paddingVertical: 12,
                  paddingHorizontal: 24,
                  opacity: current === 0 ? 0.5 : 1,
                  minWidth: 100,
                  alignItems: "center",
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
                disabled={current === questions.length - 1}
                style={{
                  backgroundColor: PRIMARY_COLOR,
                  borderRadius: 999,
                  paddingVertical: 12,
                  paddingHorizontal: 24,
                  opacity: current === questions.length - 1 ? 0.5 : 1,
                  minWidth: 100,
                  alignItems: "center",
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

          {/* Video Requirements Info */}
          {/* <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 24,
              padding: 20,
              marginTop: 16,
              alignItems: "center",
              shadowColor: "#000",
              shadowOpacity: 0.08,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Ionicons
              name="information-circle-outline"
              size={32}
              color={PRIMARY_COLOR}
            />
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Comfortaa-Bold",
                color: "#333",
                textAlign: "center",
                marginTop: 12,
                marginBottom: 8,
              }}
            >
              Video Requirements
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Comfortaa-Regular",
                color: "#666",
                textAlign: "center",
                lineHeight: 20,
              }}
            >
              • Maximum duration: 60 seconds{"\n"}• Format: MP4, MOV, or AVI
              {"\n"}• Maximum size: 5MB{"\n"}• Record in a quiet, well-lit
              environment{"\n"}• Answer the interview questions clearly{"\n"}•
              Ensure your face is clearly visible and centered
            </Text>
          </View> */}
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
  videoInfoOverlay: {
    position: "absolute",
    top: 12,
    left: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 8,
    padding: 8,
  },
  videoInfoText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Comfortaa-Regular",
    textAlign: "center",
  },
  uploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: "100%",
    minHeight: 56,
  },
  requirementsCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    marginTop: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  requirementsTitle: {
    fontSize: 16,
    fontFamily: "Comfortaa-Bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  requirementsText: {
    fontSize: 14,
    fontFamily: "Comfortaa-Regular",
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
});
