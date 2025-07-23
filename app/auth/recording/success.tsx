import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Alert,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../../context/AuthContext";

export default function RecordingSuccess() {
  const router = useRouter();
  const { user, buddiDetails } = useAuth();

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

  // COMMENTED OUT: Status polling - users stay on page and get emailed when approved
  // useEffect(() => {
  //   // Check if user should be on this screen
  //   if (!user || user.role !== "buddi") {
  //     router.replace("/auth/login" as any);
  //     return;
  //   }

  //   if (!buddiDetails) return; // Wait for buddiDetails to load

  //   // Allow only Registered status for this page
  //   if (buddiDetails.status !== "Registered") {
  //     // If already submissionApproved, go to that page
  //     if (buddiDetails.status === "submissionApproved") {
  //       router.replace("/auth/submission-approved" as any);
  //       return;
  //     }
  //     // For any other status, go to waitlist
  //     router.replace("/auth/waitlist" as any);
  //     return;
  //   }

  //   // Start polling for status changes - this will automatically redirect
  //   // when status changes to submissionApproved
  //   startStatusPolling();
  // }, [user, buddiDetails]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Recording Submitted</Text>
        <Text style={styles.message}>
          Your recording has been submitted successfully! We are now processing
          your submission.
        </Text>
        <Text style={styles.details}>
          Your submission is now being reviewed. You will receive an email
          notification once your interview has been processed and approved.
        </Text>
        <View style={styles.emailNotification}>
          <Text style={styles.emailText}>
            📧 Check your email for approval notification, then log in again to
            continue.
          </Text>
        </View>
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={() => {
            Alert.alert(
              "Sign Out",
              "Are you sure you want to sign out? You'll need to log in again once you receive approval via email.",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Sign Out",
                  style: "destructive",
                  onPress: () => {
                    router.replace("/auth/login");
                  },
                },
              ]
            );
          }}
        >
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
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
  emailNotification: {
    backgroundColor: "#E3F2FD",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: "center",
  },
  emailText: {
    fontSize: 14,
    color: "#1976D2",
    textAlign: "center",
    fontWeight: "500",
  },
  signOutButton: {
    backgroundColor: "#DC3545",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: "center",
  },
  signOutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
