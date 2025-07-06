import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const SubmissionApproved = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
        </View>

        <Text style={styles.title}>Thanks for Your Interview!</Text>

        <Text style={styles.description}>
          Thank you for completing your interview. We&apos;re currently
          reviewing your references and background information. This process
          typically takes 2-3 business days.
        </Text>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>What&apos;s Next?</Text>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={24} color="#FF932E" />
            <Text style={styles.infoText}>Reference check in progress</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="document-text-outline" size={24} color="#FF932E" />
            <Text style={styles.infoText}>Background verification</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="mail-outline" size={24} color="#FF932E" />
            <Text style={styles.infoText}>
              You&apos;ll receive an email once approved
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace("/auth/login")}
        >
          <Text style={styles.buttonText}>Return to Login</Text>
          <Ionicons
            name="arrow-forward"
            size={20}
            color="#fff"
            style={styles.buttonIcon}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    fontFamily: "Comfortaa-Bold",
    color: "#333",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
    color: "#666",
    lineHeight: 24,
    fontFamily: "Comfortaa-Regular",
  },
  infoContainer: {
    width: "100%",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
    fontFamily: "Comfortaa-Bold",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  infoText: {
    marginLeft: 12,
    fontSize: 14,
    color: "#333",
    flex: 1,
    fontFamily: "Comfortaa-Regular",
  },
  button: {
    backgroundColor: "#FF932E",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
    fontFamily: "Comfortaa-Bold",
  },
  buttonIcon: {
    marginLeft: 8,
  },
});

export default SubmissionApproved;
