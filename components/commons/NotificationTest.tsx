import { useNotification } from "@/context/NotificationContext";
import * as Notifications from "expo-notifications";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const NotificationTest: React.FC = () => {
  const { expoPushToken, notification, error } = useNotification();

  const sendTestNotification = async () => {
    if (!expoPushToken) {
      Alert.alert("Error", "No push token available");
      return;
    }

    try {
      // This would typically be sent from your backend
      // For testing, you can use Expo's push notification tool
      Alert.alert(
        "Test Notification",
        `Your push token is: ${expoPushToken}\n\nUse this token to send a test notification from your backend or Expo's push notification tool.`
      );
    } catch (err) {
      Alert.alert("Error", "Failed to send notification");
    }
  };

  const scheduleLocalNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Test Local Notification",
          body: "This is a local notification from your app!",
          data: { data: "goes here" },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 2,
        },
      });
      Alert.alert(
        "Success",
        "Local notification scheduled for 2 seconds from now"
      );
    } catch (err) {
      Alert.alert("Error", "Failed to schedule local notification");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Push Notifications Test</Text>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error.message}</Text>
        </View>
      )}

      {expoPushToken ? (
        <View style={styles.tokenContainer}>
          <Text style={styles.tokenLabel}>Push Token:</Text>
          <Text style={styles.tokenText} numberOfLines={3}>
            {expoPushToken}
          </Text>
        </View>
      ) : (
        <Text style={styles.loadingText}>Loading push token...</Text>
      )}

      {notification && (
        <View style={styles.notificationContainer}>
          <Text style={styles.notificationLabel}>Last Notification:</Text>
          <Text style={styles.notificationText}>
            {notification.request.content.title}
          </Text>
          <Text style={styles.notificationBody}>
            {notification.request.content.body}
          </Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={sendTestNotification}>
          <Text style={styles.buttonText}>Show Push Token</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={scheduleLocalNotification}
        >
          <Text style={styles.buttonText}>Test Local Notification</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  errorContainer: {
    backgroundColor: "#ffebee",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  errorText: {
    color: "#c62828",
    fontSize: 14,
  },
  tokenContainer: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
  },
  tokenLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "#333",
  },
  tokenText: {
    fontSize: 12,
    fontFamily: "monospace",
    color: "#666",
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 3,
  },
  loadingText: {
    textAlign: "center",
    color: "#666",
    fontStyle: "italic",
    marginBottom: 15,
  },
  notificationContainer: {
    backgroundColor: "#e3f2fd",
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  notificationLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "#1976d2",
  },
  notificationText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 3,
  },
  notificationBody: {
    fontSize: 14,
    color: "#666",
  },
  buttonContainer: {
    gap: 10,
  },
  button: {
    backgroundColor: "#FF932E",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
