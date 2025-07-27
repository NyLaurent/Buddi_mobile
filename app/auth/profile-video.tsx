import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Button,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SuccessScreen from "../../components/commons/SuccessScreen";
import { useAuth } from "../../context/AuthContext";
import { uploadBuddiProfileIntroVideo } from "../../services/api/buddi.service";

const PRIMARY_COLOR = "#FF932E";

export default function BuddiProfileVideoScreen() {
  const router = useRouter();
  const { buddiDetails, refreshUserData } = useAuth();

  // Camera state
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [recording, setRecording] = useState(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [facing, setFacing] = useState<CameraType>("front");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Redirect if already submitted (shouldn't happen, but for safety)
  useEffect(() => {
    if (buddiDetails?.isProfileVideoSubmitted) {
      router.replace("/buddi");
    }
  }, [buddiDetails]);

  if (!permission) return null;
  if (!permission.granted) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={{ textAlign: "center", fontFamily: "Comfortaa-Regular" }}>
          We need your permission to use the camera
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  const startRecording = async () => {
    setVideoUri(null);
    setRecording(true);
    try {
      const video = await cameraRef.current?.recordAsync();
      setVideoUri(video?.uri || null);
    } catch (e) {
      setError("Failed to record video");
    } finally {
      setRecording(false);
    }
  };

  const stopRecording = () => {
    setRecording(false);
    cameraRef.current?.stopRecording();
  };

  const pickVideo = async () => {
    setError("");
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "video/*",
        copyToCacheDirectory: true,
      });
      if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
        setVideoUri(result.assets[0].uri);
      }
    } catch (e) {
      setError("Failed to pick video");
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      if (!videoUri || !buddiDetails?.id)
        throw new Error("Missing video or Buddi ID");
      await uploadBuddiProfileIntroVideo(buddiDetails.id, videoUri);
      if (refreshUserData) await refreshUserData();
      setSuccess(true);
    } catch (e: any) {
      setError("Failed to upload video");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <SuccessScreen
        title="Profile Video Uploaded!"
        description="You have successfully uploaded your profile video. Please log in again to access your Buddi portal."
        buttonText="Go to Login"
        onContinue={() => router.replace("/auth/login")}
      />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
        <Text
          style={{
            fontSize: 22,
            fontFamily: "Comfortaa-Bold",
            color: PRIMARY_COLOR,
            textAlign: "center",
            marginBottom: 12,
          }}
        >
          Upload Your Profile Video
        </Text>
        <Text
          style={{
            fontSize: 15,
            fontFamily: "Comfortaa-Regular",
            color: "#555",
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          Please record a short introduction video about yourself. This helps
          parents and admins get to know you better before assigning pickups.
        </Text>
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
          {!recording && !videoUri && (
            <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
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
                  Record Video
                </Text>
              </TouchableOpacity>
              {/* <TouchableOpacity
                style={[styles.recordBtn, { backgroundColor: "#2563EB" }]}
                onPress={pickVideo}
              >
                <Ionicons name="cloud-upload" size={24} color="#fff" />
                <Text
                  style={{
                    color: "#fff",
                    fontFamily: "Comfortaa-Bold",
                    marginLeft: 8,
                  }}
                >
                  Upload Video
                </Text>
              </TouchableOpacity> */}
            </View>
          )}
          {recording && (
            <TouchableOpacity
              style={[styles.recordBtn, { backgroundColor: "#d32f2f" }]}
              onPress={stopRecording}
            >
              <Ionicons name="stop" size={24} color="#fff" />
              <Text
                style={{
                  color: "#fff",
                  fontFamily: "Comfortaa-Bold",
                  marginLeft: 8,
                }}
              >
                Stop Recording
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
          {error ? (
            <Text style={{ color: "red", marginTop: 12 }}>{error}</Text>
          ) : null}
          {submitting && <ActivityIndicator style={{ marginTop: 12 }} />}
        </View>
      </View>
    </SafeAreaView>
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
