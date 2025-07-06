import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../../context/AuthContext";

export default function RecordingSuccess() {
  const router = useRouter();
  const { user, buddiDetails, startStatusPolling } = useAuth();

  // Animation values for dots
  const dot1Opacity = useRef(new Animated.Value(0.3)).current;
  const dot2Opacity = useRef(new Animated.Value(0.3)).current;
  const dot3Opacity = useRef(new Animated.Value(0.3)).current;

  // Setup animations
  useEffect(() => {
    const animateDot = (value: Animated.Value) => {
      Animated.sequence([
        Animated.timing(value, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: 0.3,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    };

    // Create infinite animation loop
    const animate = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dot1Opacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(dot2Opacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(dot3Opacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(dot1Opacity, {
            toValue: 0.3,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(dot2Opacity, {
            toValue: 0.3,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(dot3Opacity, {
            toValue: 0.3,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animate();
  }, []);

  // Add access control and start polling
  useEffect(() => {
    // Check if user should be on this screen
    if (!user || user.role !== "buddi") {
      router.replace("/auth/login" as any);
      return;
    }

    if (!buddiDetails) return; // Wait for buddiDetails to load

    // Allow only Registered status for this page
    if (buddiDetails.status !== "Registered") {
      // If already submissionApproved, go to that page
      if (buddiDetails.status === "submissionApproved") {
        router.replace("/auth/submission-approved" as any);
        return;
      }
      // For any other status, go to waitlist
      router.replace("/auth/waitlist" as any);
      return;
    }

    // Start polling for status changes - this will automatically redirect
    // when status changes to submissionApproved
    startStatusPolling();
  }, [user, buddiDetails]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Recording Submitted</Text>
        <Text style={styles.message}>
          Your recording has been submitted successfully! We are now processing
          your submission.
        </Text>
        <Text style={styles.details}>
          Please wait while we verify your submission. You will be automatically
          redirected once the verification is complete. This usually takes a few
          moments.
        </Text>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Waiting for verification...</Text>
          <View style={styles.loadingDots}>
            <Animated.View style={[styles.dot, { opacity: dot1Opacity }]} />
            <Animated.View style={[styles.dot, { opacity: dot2Opacity }]} />
            <Animated.View style={[styles.dot, { opacity: dot3Opacity }]} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 600,
    alignSelf: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  message: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: "center",
    color: "#666",
  },
  details: {
    fontSize: 16,
    textAlign: "center",
    color: "#888",
    lineHeight: 24,
    marginBottom: 32,
  },
  loadingContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#FF6B00",
    marginBottom: 12,
  },
  loadingDots: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF6B00",
    margin: 3,
  },
});
