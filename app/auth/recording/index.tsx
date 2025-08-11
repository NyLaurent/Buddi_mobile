import { Ionicons } from "@expo/vector-icons";
import { Audio, ResizeMode, Video } from "expo-av";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  Platform,
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
import notificationService from "../../../services/notifications/notification.service";

type InterviewQuestion = { id: string; questionDescription: string };

const PRIMARY_COLOR = "#FF932E";

// Helper function for video size check
async function checkVideoSize(
  videoUri: string
): Promise<{ uri: string; size: number; sizeWarning: boolean }> {
  try {
    const fileInfo = await FileSystem.getInfoAsync(videoUri);

    if (fileInfo.exists && "size" in fileInfo) {
      const sizeInMB = fileInfo.size / (1024 * 1024);
      console.log(`[SIZE_CHECK] Video size: ${sizeInMB.toFixed(2)} MB`);

      return {
        uri: videoUri,
        size: fileInfo.size,
        sizeWarning: sizeInMB > 20, // Warn if larger than 20MB
      };
    }

    return {
      uri: videoUri,
      size: 0,
      sizeWarning: false,
    };
  } catch (error) {
    console.error("[SIZE_CHECK] Error checking video size:", error);
    return {
      uri: videoUri,
      size: 0,
      sizeWarning: false,
    };
  }
}

// Optimized upload function with progress tracking
async function uploadBuddiProfileVideoOptimized(
  buddiId: number,
  videoUri: string,
  onProgress?: (progress: number) => void
) {
  try {
    console.log("=== OPTIMIZED VIDEO UPLOAD START ===");
    console.log("[UPLOAD] Buddi ID:", buddiId);
    console.log("[UPLOAD] Video URI:", videoUri);

    // Check and compress video if needed
    const videoSizeCheck = await checkVideoSize(videoUri);
    console.log("[UPLOAD] Video size check:", videoSizeCheck);

    if (videoSizeCheck.sizeWarning) {
      console.warn(
        "[UPLOAD] Large video file detected, this may take longer to upload"
      );
    }

    // Get video info for debugging
    console.log("[UPLOAD] Getting video info...");
    const fileInfo = await FileSystem.getInfoAsync(videoUri);
    console.log("[UPLOAD] File info:", fileInfo);

    if (!fileInfo.exists) {
      throw new Error("Video file does not exist");
    }

    // Create FormData with optimized settings
    console.log("[UPLOAD] Creating FormData...");
    const formData = new FormData();

    const fileName =
      videoUri.split("/").pop() || `interview-video-${Date.now()}.mp4`;
    console.log("[UPLOAD] Filename:", fileName);

    const fileObj = {
      uri: videoUri,
      name: fileName,
      type: "video/mp4",
    } as any;

    formData.append("file", fileObj);
    console.log("[UPLOAD] FormData created successfully");

    const url = `/buddi/interview/${buddiId}/uploadBuddiInterviewVideo/video`;
    console.log("[UPLOAD] Upload URL:", url);

    // Retry logic with exponential backoff
    const maxRetries = 3;
    let retryCount = 0;
    let lastError: any = null;

    while (retryCount < maxRetries) {
      try {
        console.log(`[UPLOAD] Attempt ${retryCount + 1}/${maxRetries}`);
        const uploadStartTime = Date.now();

        const response = await uploadBuddiProfileVideo(buddiId, videoUri);

        const uploadEndTime = Date.now();
        const uploadDuration = uploadEndTime - uploadStartTime;

        console.log("[UPLOAD] Upload completed successfully!");
        console.log("[UPLOAD] Upload duration:", uploadDuration, "ms");
        console.log("=== OPTIMIZED VIDEO UPLOAD END ===");

        return response;
      } catch (attemptError: any) {
        lastError = attemptError;
        retryCount++;

        console.error(
          `[UPLOAD] Attempt ${retryCount} failed:`,
          attemptError?.message
        );

        // Don't retry on certain errors
        if (
          attemptError.response?.status === 400 ||
          attemptError.response?.status === 401 ||
          attemptError.response?.status === 403 ||
          attemptError.response?.status === 404
        ) {
          console.error("[UPLOAD] Client error, not retrying");
          break;
        }

        // Don't retry if we've reached max attempts
        if (retryCount >= maxRetries) {
          console.error("[UPLOAD] Max retries reached");
          break;
        }

        // Exponential backoff: wait longer between retries
        const backoffDelay = Math.min(
          1000 * Math.pow(2, retryCount - 1),
          10000
        ); // Max 10 seconds
        console.log(
          `[UPLOAD] Waiting ${backoffDelay}ms before retry ${retryCount + 1}`
        );
        await new Promise((resolve) => setTimeout(resolve, backoffDelay));
      }
    }

    // If we get here, all retries failed
    throw lastError;
  } catch (error: any) {
    console.error("=== OPTIMIZED VIDEO UPLOAD ERROR ===");
    console.error("[UPLOAD] Upload failed:", error);

    // Enhanced error handling
    if (error.response) {
      console.error("[UPLOAD] Server error:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      });

      if (error.response.status === 413) {
        throw new Error(
          "Video file is too large. Please record a shorter video or check your connection."
        );
      } else if (
        error.response.status === 408 ||
        error.response.status === 504
      ) {
        throw new Error(
          "Upload timed out. Please check your connection and try again."
        );
      } else {
        throw new Error(
          `Upload failed: ${error.response.data?.message || "Server error"}`
        );
      }
    } else if (error.request) {
      console.error("[UPLOAD] Network error:", error.request);
      throw new Error(
        "Network error. Please check your internet connection and try again."
      );
    } else if (error.code === "ECONNABORTED") {
      throw new Error(
        "Upload timed out. Please check your connection and try again."
      );
    } else {
      console.error("[UPLOAD] Other error:", error.message);
      throw new Error(`Upload failed: ${error.message}`);
    }
  }
}

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
  const [permissionChecked, setPermissionChecked] = useState(false);
  const [audioPermission, setAudioPermission] = useState<boolean>(false);

  // Upload progress states
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");

  // Recording timer state
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    console.log("=== FETCHING QUESTIONS ===");
    getRandomInterviewQuestions()
      .then((qs) => {
        if (mounted) {
          console.log("Questions fetched successfully:", qs);
          console.log("Number of questions:", qs.length);
          setQuestions(qs);
          setLoading(false);
        }
      })
      .catch((e) => {
        console.error("Failed to load questions:", e);
        setError("Failed to load questions");
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Enhanced permission checking
  useEffect(() => {
    const checkPermissionStatus = async () => {
      try {
        console.log("=== PERMISSION CHECK ===");
        console.log("Permission object:", permission);
        console.log("Permission granted:", permission?.granted);
        console.log("Permission canAskAgain:", permission?.canAskAgain);

        // Check and request camera permission
        if (permission) {
          setPermissionChecked(true);

          // If permission is not granted and we can ask again, request it
          if (!permission.granted && permission.canAskAgain) {
            console.log("Requesting camera permission...");
            const result = await requestPermission();
            console.log("Permission request result:", result);
          }
        }

        // Check and request audio permission (for microphone access)
        console.log("Checking audio permission...");
        const audioPermissionStatus = await Audio.getPermissionsAsync();
        setAudioPermission(audioPermissionStatus.granted);

        if (!audioPermissionStatus.granted) {
          console.log("Requesting audio permission...");
          const audioResult = await Audio.requestPermissionsAsync();
          console.log("Audio permission result:", audioResult);
          setAudioPermission(audioResult.granted);
        }
      } catch (error) {
        console.error("Error checking permissions:", error);
        setPermissionChecked(true);
      }
    };

    checkPermissionStatus();
  }, [permission, requestPermission]);

  // Cleanup camera when component unmounts
  useEffect(() => {
    return () => {
      // Clear recording timer
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }

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

  // Add timeout for camera ready state - but don't force it too aggressively
  useEffect(() => {
    if (!cameraReady && permission?.granted) {
      const timeout = setTimeout(() => {
        console.log(
          "Camera ready timeout - forcing ready state after 15 seconds"
        );
        setCameraReady(true);
      }, 15000); // 15 second timeout - give camera more time to initialize

      return () => clearTimeout(timeout);
    }
  }, [cameraReady, permission?.granted]);

  // Force camera re-initialization if needed
  const reinitializeCamera = () => {
    console.log("Reinitializing camera...");
    setCameraReady(false);
    setError("");

    // Force a re-render of the camera component
    setTimeout(() => {
      setCameraReady(true);
    }, 2000);
  };

  // Debug function to check camera status
  const debugCameraStatus = () => {
    console.log("=== CAMERA DEBUG INFO ===");
    console.log("Permission object:", permission);
    console.log("Permission granted:", permission?.granted);
    console.log("Permission canAskAgain:", permission?.canAskAgain);
    console.log("Audio permission:", audioPermission);
    console.log("Camera ref exists:", !!cameraRef.current);
    console.log("Camera ready:", cameraReady);
    console.log("Currently recording:", recording);
    console.log("Video URI:", videoUri);
    console.log("Platform:", Platform.OS);
    console.log("Platform version:", Platform.Version);
    console.log("=== END DEBUG INFO ===");
  };

  // Progress bar based on question navigation
  const progress =
    questions && questions.length > 0 ? (current + 1) / questions.length : 0;
  const question: InterviewQuestion =
    questions && questions[current]
      ? questions[current]
      : {
          id: "",
          questionDescription: "",
        };

  // Debug logging for questions
  useEffect(() => {
    console.log("=== QUESTIONS STATE UPDATE ===");
    console.log("Questions array:", questions);
    console.log("Current question index:", current);
    console.log("Current question:", question);
    console.log("Progress:", progress);

    // Safety check: ensure current index is within bounds
    if (questions && questions.length > 0 && current >= questions.length) {
      console.log("Current index out of bounds, resetting to 0");
      setCurrent(0);
    }
  }, [questions, current, question, progress]);

  // Navigation handlers - Allow navigation anytime
  const handlePrev = () => {
    console.log("=== HANDLE PREV ===");
    console.log("Current:", current);
    console.log("Questions length:", questions.length);
    console.log("Recording:", recording);

    const newCurrent = Math.max(0, current - 1);
    console.log("Setting current to:", newCurrent);
    setCurrent(newCurrent);
  };

  const handleNext = () => {
    console.log("=== HANDLE NEXT ===");
    console.log("Current:", current);
    console.log("Questions length:", questions.length);
    console.log("Recording:", recording);

    const newCurrent = Math.min(questions.length - 1, current + 1);
    console.log("Setting current to:", newCurrent);
    setCurrent(newCurrent);
  };

  // Enhanced permission request with settings redirect
  const handlePermissionRequest = async () => {
    try {
      console.log("Handling permission request...");

      // Request camera permission
      if (permission?.canAskAgain) {
        const result = await requestPermission();
        console.log("Camera permission request result:", result);
      }

      // Request audio permission (for microphone)
      const audioPermissionStatus = await Audio.getPermissionsAsync();
      if (!audioPermissionStatus.granted) {
        const audioResult = await Audio.requestPermissionsAsync();
        console.log("Audio permission result:", audioResult);
        setAudioPermission(audioResult.granted);
      }

      // Check if both permissions are granted
      const currentCameraPermission = await permission;
      const currentAudioPermission = await Audio.getPermissionsAsync();

      // Update state to trigger UI update if permissions are still not granted
      if (
        !currentCameraPermission?.granted ||
        !currentAudioPermission.granted
      ) {
        setAudioPermission(currentAudioPermission.granted);
      }
    } catch (error) {
      console.error("Error requesting permissions:", error);
      Alert.alert(
        "Permission Error",
        "Unable to request permissions. Please check your device settings.",
        [{ text: "OK", style: "default" }]
      );
    }
  };

  // FIXED: Separate start and stop recording functions
  const startRecording = async () => {
    console.log("=== START RECORDING ===");

    if (
      !cameraRef.current ||
      !permission?.granted ||
      !audioPermission ||
      !cameraReady
    ) {
      console.error("Prerequisites not met for recording");
      Alert.alert(
        "Cannot Start Recording",
        "Please ensure camera and microphone permissions are granted and camera is ready.",
        [{ text: "OK" }]
      );
      return;
    }

    if (recording) {
      console.log("Recording already in progress");
      return;
    }

    try {
      console.log("Setting up recording state...");
      setVideoUri(null);
      setError("");
      setRecording(true);
      setRecordingTime(0);

      // Start recording timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      console.log("Starting recording process...");
      console.log("Camera ref exists:", !!cameraRef.current);
      console.log("Recording state set to:", true);

      // OPTIMIZED RECORDING OPTIONS FOR SMALLER FILE SIZE
      const video = await cameraRef.current.recordAsync({
        maxDuration: 300, // 5 minutes max
        maxFileSize: 50 * 1024 * 1024, // 50MB max file size
        // Note: quality, videoBitrate, audioBitrate may not be available in all Expo versions
        // The maxFileSize should help limit the file size
      });

      console.log("Recording completed:", video);

      if (video && video.uri) {
        console.log("Video recorded successfully:", video.uri);
        setVideoUri(video.uri);
        setError("");
      } else {
        console.error("No video URI returned from recording");
        setError("Recording failed - no video file created");
      }
    } catch (error) {
      console.error("Error during recording:", error);
      setError(
        `Recording failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      // Always stop recording state and clear timer
      console.log("Cleaning up recording state...");
      setRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    }
  };

  const stopRecording = async () => {
    console.log("=== STOP RECORDING ===");
    console.log("Current recording state:", recording);
    console.log("Camera ref exists:", !!cameraRef.current);

    if (!recording) {
      console.log("Not currently recording");
      return;
    }

    if (!cameraRef.current) {
      console.log("No camera ref - forcing recording state to false");
      setRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
      return;
    }

    try {
      console.log("Stopping recording...");
      await cameraRef.current.stopRecording();
      console.log("Recording stopped successfully");
    } catch (error) {
      console.error("Error stopping recording:", error);
      setError(
        `Failed to stop recording: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      // Always stop recording state and clear timer
      console.log("Cleaning up recording state after stop...");
      setRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    }
  };

  const handleRecordingAction = async () => {
    console.log("=== RECORDING ACTION ===");
    console.log("Current recording state:", recording);
    console.log("Camera ready:", cameraReady);
    console.log("Permission granted:", permission?.granted);
    console.log("Audio permission:", audioPermission);

    if (recording) {
      // If currently recording, stop it
      console.log("Stopping recording...");
      await stopRecording();
      // Force recording state to false after stopping
      setRecording(false);
      // Small delay to ensure state update
      await new Promise((resolve) => setTimeout(resolve, 100));
    } else {
      // If not recording, start it
      console.log("Starting recording...");
      await startRecording();
    }
  };

  const handleSubmit = async () => {
    console.log("=== SUBMIT VIDEO ===");
    setSubmitting(true);
    setError("");
    setUploadProgress(0);
    setUploadStatus("uploading");

    try {
      if (!videoUri || !buddiDetails?.id) {
        throw new Error("Missing video or Buddi ID");
      }

      console.log("Starting video upload...");

      // Use the optimized upload function with progress tracking
      await uploadBuddiProfileVideoOptimized(
        buddiDetails.id,
        videoUri,
        (progress) => {
          setUploadProgress(progress);
          console.log(`[SUBMIT] Upload progress: ${progress}%`);
        }
      );

      console.log("Upload successful!");
      setUploadStatus("success");
      setUploadProgress(100);

      // Send system notification for successful recording submission
      try {
        await notificationService.sendRecordingSubmittedNotification(
          buddiDetails?.firstName || "Buddi"
        );
      } catch (error) {
        console.log("Failed to send notification:", error);
      }

      setTimeout(() => {
        router.push("/auth/recording/success");
      }, 1000);
    } catch (e: any) {
      console.error("Upload error:", e);
      setUploadStatus("error");
      setUploadProgress(0);

      let errorMessage = "Failed to upload video";
      if (e.message?.includes("timeout")) {
        errorMessage =
          "Upload timed out. Please check your connection and try again.";
      } else if (e.message?.includes("Network")) {
        errorMessage = "Network error. Please check your connection.";
      } else if (e.message) {
        errorMessage = e.message;
      }

      Alert.alert("Upload Error", errorMessage, [
        { text: "Cancel", style: "cancel" },
        {
          text: "Retry",
          onPress: () => {
            setError("");
            setUploadStatus("idle");
            setTimeout(handleSubmit, 1000);
          },
        },
      ]);

      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const retakeVideo = () => {
    setVideoUri(null);
    setError("");
    setUploadStatus("idle");
    setUploadProgress(0);
  };

  // Format recording time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Camera logic
  if (!permissionChecked) {
    return (
      <ImageBackground
        source={require("../../../assets/images/auth/video_bg.jpg")}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.centeredContainer}>
            <View style={styles.permissionCard}>
              <Ionicons
                name="hourglass"
                size={64}
                color={PRIMARY_COLOR}
                style={{ marginBottom: 16 }}
              />
              <Text style={styles.permissionTitle}>
                Checking Permissions...
              </Text>
              <Text style={styles.permissionText}>
                Please wait while we check camera permissions.
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  if (!permission?.granted || !audioPermission) {
    return (
      <ImageBackground
        source={require("../../../assets/images/auth/video_bg.jpg")}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.centeredContainer}>
            <View style={styles.permissionCard}>
              <Ionicons
                name="camera"
                size={64}
                color={PRIMARY_COLOR}
                style={{ marginBottom: 16 }}
              />
              <Text style={styles.permissionTitle}>
                Camera & Microphone Access Required
              </Text>
              <Text style={styles.permissionText}>
                To record your interview video, we need access to your camera
                and microphone. This helps us capture your responses for the
                interview process.
              </Text>
              <TouchableOpacity
                style={styles.permissionButton}
                onPress={handlePermissionRequest}
              >
                <Text style={styles.permissionButtonText}>
                  {permission?.canAskAgain
                    ? "Grant Permissions"
                    : "Open Settings"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 24,
                }}
                onPress={() => {
                  Alert.alert(
                    "Permissions Required",
                    "Camera and microphone access are essential for recording your interview video. Please grant permissions to continue.",
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Grant Permissions",
                        onPress: handlePermissionRequest,
                      },
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

  // Main UI
  return (
    <ImageBackground
      source={require("../../../assets/images/auth/video_bg.jpg")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1, paddingTop: 16 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#555" />
          </TouchableOpacity>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.headerTitle}>Record Your Buddi</Text>
            <Text style={styles.headerTitle}>Interview</Text>
          </View>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={debugCameraStatus}
          >
            <Ionicons name="ellipsis-vertical" size={20} color="#555" />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Video Preview/Camera Section */}
          <View style={{ alignItems: "center", marginBottom: 24 }}>
            <View style={styles.cameraContainer}>
              {videoUri ? (
                // Video Preview
                <Video
                  source={{ uri: videoUri }}
                  style={{ width: "100%", height: "100%" }}
                  useNativeControls
                  resizeMode={ResizeMode.COVER}
                  isLooping
                />
              ) : (
                // Live Camera
                <CameraView
                  ref={cameraRef}
                  style={{ width: "100%", height: "100%" }}
                  facing={facing}
                  mode="video"
                  mute={false}
                  onCameraReady={() => {
                    console.log("Camera ready!");
                    setCameraReady(true);
                  }}
                  onMountError={(error) => {
                    console.error("Camera mount error:", error);
                    setError(
                      "Camera failed to initialize. Please restart the app."
                    );
                  }}
                >
                  {/* Camera overlay controls */}
                  <View style={styles.cameraOverlay}>
                    {!recording && (
                      <TouchableOpacity
                        onPress={() =>
                          setFacing(facing === "front" ? "back" : "front")
                        }
                        style={styles.cameraFlipButton}
                      >
                        <Ionicons
                          name="camera-reverse"
                          size={20}
                          color={PRIMARY_COLOR}
                        />
                      </TouchableOpacity>
                    )}

                    {/* Recording indicator */}
                    {recording && (
                      <View style={styles.recordingIndicator}>
                        <View style={styles.recordingDot} />
                        <Text style={styles.recordingText}>
                          REC {formatTime(recordingTime)}
                        </Text>
                      </View>
                    )}
                  </View>
                </CameraView>
              )}
            </View>

            {/* Recording Controls */}
            <View style={{ gap: 12, marginTop: 16, width: "100%" }}>
              {!videoUri && (
                <>
                  {/* Recording button */}
                  <TouchableOpacity
                    style={[
                      styles.recordBtn,
                      {
                        backgroundColor: recording
                          ? "#d32f2f"
                          : cameraReady
                          ? PRIMARY_COLOR
                          : "#ccc",
                      },
                    ]}
                    onPress={() => {
                      console.log("=== RECORDING BUTTON PRESSED ===");
                      console.log("Camera ready:", cameraReady);
                      console.log("Permission granted:", permission?.granted);
                      console.log("Audio permission:", audioPermission);
                      console.log("Current recording state:", recording);
                      handleRecordingAction();
                    }}
                    disabled={!cameraReady}
                  >
                    <Ionicons
                      name={
                        recording ? "stop" : cameraReady ? "videocam" : "camera"
                      }
                      size={24}
                      color="#fff"
                    />
                    <Text style={styles.recordBtnText}>
                      {recording
                        ? "Stop Recording"
                        : cameraReady
                        ? "Start Recording"
                        : "Camera Loading..."}
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              {videoUri && (
                // Video recorded - show submit and retake options
                <View style={{ gap: 8 }}>
                  <TouchableOpacity
                    style={[
                      styles.recordBtn,
                      {
                        backgroundColor: submitting ? "#ccc" : "#4CAF50",
                        opacity: submitting ? 0.7 : 1,
                      },
                    ]}
                    onPress={handleSubmit}
                    disabled={submitting}
                  >
                    <Ionicons
                      name={submitting ? "cloud-upload" : "checkmark-circle"}
                      size={24}
                      color="#fff"
                    />
                    <Text style={styles.recordBtnText}>
                      {submitting ? "Uploading..." : "Submit Video"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.recordBtn, { backgroundColor: "#666" }]}
                    onPress={retakeVideo}
                    disabled={submitting}
                  >
                    <Ionicons name="refresh" size={24} color="#fff" />
                    <Text style={styles.recordBtnText}>Retake Video</Text>
                  </TouchableOpacity>

                  {/* Upload Progress Bar */}
                  {submitting && uploadStatus === "uploading" && (
                    <View style={{ gap: 4 }}>
                      <View style={styles.progressBarContainer}>
                        <View
                          style={[
                            styles.progressBar,
                            { width: `${uploadProgress}%` },
                          ]}
                        />
                      </View>
                      <Text style={styles.progressText}>
                        Uploading: {uploadProgress}% - Please keep the app open
                      </Text>
                    </View>
                  )}

                  {/* Upload Status Messages */}
                  {uploadStatus === "success" && (
                    <Text style={styles.successText}>
                      Upload completed! Redirecting...
                    </Text>
                  )}

                  {error && <Text style={styles.errorText}>{error}</Text>}
                </View>
              )}
            </View>
          </View>

          {/* Question Card */}
          <View style={styles.questionCard}>
            <Image
              source={require("../../../assets/images/logo.png")}
              style={{ width: 68, height: 48, marginBottom: 8 }}
            />
            <Text style={styles.questionNumber}>
              Question {current + 1} of {questions.length}
            </Text>

            {loading ? (
              <Text style={styles.loadingText}>Loading questions...</Text>
            ) : (
              <Text style={styles.questionText}>
                {question.questionDescription}
              </Text>
            )}

            {/* Question Navigation */}
            <View style={styles.navigationContainer}>
              <TouchableOpacity
                onPress={handlePrev}
                disabled={current <= 0 || questions.length <= 1}
                style={[
                  styles.navButton,
                  styles.prevButton,
                  { opacity: current <= 0 || questions.length <= 1 ? 0.5 : 1 },
                ]}
              >
                <Text style={styles.prevButtonText}>Previous</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleNext}
                disabled={
                  current >= questions.length - 1 || questions.length <= 1
                }
                style={[
                  styles.navButton,
                  styles.nextButton,
                  {
                    opacity:
                      current >= questions.length - 1 || questions.length <= 1
                        ? 0.5
                        : 1,
                  },
                ]}
              >
                <Text style={styles.nextButtonText}>Next</Text>
              </TouchableOpacity>
            </View>

            {/* Question Navigation Hint */}
            {questions.length > 1 && (
              <Text style={styles.navigationHint}>
                Tap Previous/Next to switch between questions
              </Text>
            )}

            {/* Progress Bar */}
            <View style={styles.questionProgressContainer}>
              <View
                style={[
                  styles.questionProgressBar,
                  { width: `${progress * 100}%` },
                ]}
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
    alignItems: "center",
    justifyContent: "center",
  },
  permissionCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 32,
    margin: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  permissionTitle: {
    fontSize: 20,
    fontFamily: "Comfortaa-Bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 12,
  },
  permissionText: {
    fontSize: 16,
    fontFamily: "Comfortaa-Regular",
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  permissionButtonText: {
    color: "#fff",
    fontFamily: "Comfortaa-Bold",
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  headerButton: {
    backgroundColor: "#fff",
    borderRadius: 999,
    padding: 8,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    fontFamily: "Comfortaa-Bold",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  cameraContainer: {
    width: "100%",
    maxWidth: 400,
    aspectRatio: 4 / 3,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  cameraOverlay: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 2,
  },
  cameraFlipButton: {
    backgroundColor: "#fff",
    borderRadius: 999,
    padding: 8,
  },
  recordingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ff4444",
    marginRight: 8,
  },
  recordingText: {
    color: "#fff",
    fontFamily: "Comfortaa-Bold",
    fontSize: 14,
  },
  recordBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  recordBtnText: {
    color: "#fff",
    fontFamily: "Comfortaa-Bold",
    marginLeft: 8,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: PRIMARY_COLOR,
  },
  progressText: {
    color: "#fff",
    fontFamily: "Comfortaa-Regular",
    fontSize: 12,
    textAlign: "center",
    opacity: 0.8,
  },
  successText: {
    color: "#4CAF50",
    fontFamily: "Comfortaa-Regular",
    fontSize: 12,
    textAlign: "center",
  },
  errorText: {
    color: "#d32f2f",
    textAlign: "center",
    fontFamily: "Comfortaa-Regular",
    fontSize: 14,
  },
  questionCard: {
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 24,
    marginTop: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  questionNumber: {
    fontSize: 18,
    marginBottom: 8,
    fontFamily: "Comfortaa-Bold",
  },
  loadingText: {
    color: PRIMARY_COLOR,
    fontFamily: "Comfortaa-Regular",
    marginBottom: 24,
  },
  questionText: {
    color: "#71727A",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    fontFamily: "Comfortaa-Regular",
  },
  navigationContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginTop: 8,
  },
  navButton: {
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  prevButton: {
    backgroundColor: "#fff",
    borderColor: PRIMARY_COLOR,
    borderWidth: 1,
  },
  nextButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 32,
  },
  prevButtonText: {
    color: PRIMARY_COLOR,
    fontFamily: "Comfortaa-Bold",
  },
  nextButtonText: {
    color: "#fff",
    fontFamily: "Comfortaa-Bold",
  },
  questionProgressContainer: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    width: "100%",
    marginTop: 24,
  },
  questionProgressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: PRIMARY_COLOR,
  },
  navigationHint: {
    color: "#666",
    fontSize: 12,
    textAlign: "center",
    fontFamily: "Comfortaa-Regular",
    marginTop: 8,
    opacity: 0.7,
  },
});
