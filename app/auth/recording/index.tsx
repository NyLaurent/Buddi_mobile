import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { useAuth } from "../../../context/AuthContext";

export default function App() {
  const router = useRouter();
  const { user, buddiDetails } = useAuth();

  // Add access control
  useEffect(() => {
    // Check if user should be on this screen
    if (!user || user.role !== "buddi") {
      router.replace("/auth/login" as any);
      return;
    }

    if (!buddiDetails) return; // Wait for buddiDetails to load

    // Allow both Registered and submissionApproved status for recording
    if (buddiDetails.status !== "Registered" && buddiDetails.status !== "submissionApproved") {
      router.replace("/auth/waitlist" as any);
      return;
    }
  }, [user, buddiDetails]);

  const handleContinue = () => {
    router.push("/auth/recording/success" as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Video Recording</Text>
        <Text style={styles.message}>
          The video recording functionality is currently being integrated and will be available soon.
        </Text>
        <Text style={styles.details}>
          This feature will allow you to record your introduction video directly through the app.
          For now, this is a placeholder page. The recording functionality, including camera access
          and video upload capabilities, will be implemented in a future update.
        </Text>
        <Pressable 
          style={({ pressed }) => [
            styles.button,
            { opacity: pressed ? 0.8 : 1 }
          ]}
          onPress={handleContinue}
        >
          <Text style={styles.buttonText}>Continue to Success Screen</Text>
        </Pressable>
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
  button: {
    backgroundColor: "#FF6B00",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
