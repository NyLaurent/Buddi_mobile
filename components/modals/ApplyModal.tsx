import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import BuddiService from "../../services/api/buddi.service";

interface ApplyModalProps {
  visible: boolean;
  onClose: () => void;
  callId: number;
  onSuccess?: () => void;
}

export default function ApplyModal({
  visible,
  onClose,
  callId,
  onSuccess,
}: ApplyModalProps) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, buddiDetails } = useAuth();

  const handleSubmit = async () => {
    if (!message.trim()) {
      Alert.alert(
        "Message Required",
        "Please add a reason why you'd like to help with this pickup request."
      );
      return;
    }

    if (!buddiDetails?.id) {
      Alert.alert(
        "Authentication Error",
        "Please log in again to submit your application."
      );
      return;
    }

    try {
      setLoading(true);

      await BuddiService.applyForCall({
        buddiRequestId: callId,
        buddiId: buddiDetails.id,
        message: message.trim(),
      });

      Alert.alert(
        "Application Submitted! 🎉",
        "Your application has been sent successfully. The parent will be notified and you'll hear back soon!",
        [
          {
            text: "Great!",
            onPress: () => {
              setMessage("");
              onClose();
              onSuccess?.();
            },
          },
        ]
      );
    } catch (error: any) {
      // Handle specific error cases for better user experience
      switch (error.message) {
        case 'ALREADY_APPLIED':
          Alert.alert(
            "Already Applied! 📝",
            "You've already applied to this pickup request. The parent will review your application and get back to you soon!",
            [
              {
                text: "Got it!",
                onPress: () => {
                  setMessage("");
                  onClose();
                  onSuccess?.();
                },
              },
            ]
          );
          break;
          
        case 'INVALID_REQUEST':
          Alert.alert(
            "Invalid Request ⚠️",
            "There was an issue with your application. Please check your message and try again.",
            [{ text: "OK" }]
          );
          break;
          
        case 'UNAUTHORIZED':
          Alert.alert(
            "Session Expired 🔐",
            "Please log in again to submit your application.",
            [{ text: "OK" }]
          );
          break;
          
        case 'FORBIDDEN':
          Alert.alert(
            "Access Denied 🚫",
            "You don't have permission to apply to this pickup request.",
            [{ text: "OK" }]
          );
          break;
          
        case 'CALL_NOT_FOUND':
          Alert.alert(
            "Call Not Available ❌",
            "This pickup request is no longer available. It may have been removed or already filled.",
            [{ text: "OK" }]
          );
          break;
          
        case 'VALIDATION_ERROR':
          Alert.alert(
            "Invalid Information ⚠️",
            "Please check your application details and try again.",
            [{ text: "OK" }]
          );
          break;
          
        case 'SERVER_ERROR':
          Alert.alert(
            "Server Error 🔧",
            "Our servers are experiencing issues. Please try again in a few minutes.",
            [{ text: "OK" }]
          );
          break;
          
        case 'NETWORK_ERROR':
          Alert.alert(
            "No Internet Connection 📡",
            "Please check your internet connection and try again.",
            [{ text: "OK" }]
          );
          break;
          
        case 'TIMEOUT_ERROR':
          Alert.alert(
            "Request Timeout ⏰",
            "The request took too long. Please check your connection and try again.",
            [{ text: "OK" }]
          );
          break;
          
        case 'CONNECTION_ERROR':
          Alert.alert(
            "Connection Failed 🔌",
            "Unable to connect to our servers. Please try again later.",
            [{ text: "OK" }]
          );
          break;
          
        default:
          Alert.alert(
            "Application Failed",
            error.message || "Something went wrong. Please try again.",
            [{ text: "OK" }]
          );
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return; // Prevent closing while submitting
    setMessage("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={["#FF932E", "#FFB86C"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.modalHeader}
          >
            <View style={styles.headerContent}>
              <FontAwesome5 name="hand-holding-heart" size={24} color="#fff" />
              <Text style={styles.modalTitle}>Apply for Pickup</Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
              disabled={loading}
            >
              <FontAwesome5 name="times" size={20} color="#fff" />
            </TouchableOpacity>
          </LinearGradient>

          <ScrollView
            style={styles.modalBody}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.contentContainer}>
              {/* Welcome Message */}
              <View style={styles.welcomeSection}>
                <FontAwesome5 name="star" size={20} color="#FF932E" />
                <Text style={styles.welcomeTitle}>Ready to Help? 🌟</Text>
                <Text style={styles.welcomeText}>
                  Tell the parent why you'd be perfect for this pickup request.
                  Share your experience, availability, or any special skills
                  that make you the ideal choice!
                </Text>
              </View>

              {/* Message Input */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Your Message to Parent</Text>
                <TextInput
                  style={styles.messageInput}
                  placeholder="Hi! I'd love to help with your pickup request because..."
                  placeholderTextColor="#999"
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                  maxLength={500}
                />
                <Text style={styles.characterCount}>
                  {message.length}/500 characters
                </Text>
              </View>

              {/* Tips Section */}
              <View style={styles.tipsSection}>
                <Text style={styles.tipsTitle}>
                  💡 Tips for a great application:
                </Text>
                <View style={styles.tipItem}>
                  <FontAwesome5 name="check-circle" size={12} color="#34C759" />
                  <Text style={styles.tipText}>
                    Mention your experience with kids
                  </Text>
                </View>
                <View style={styles.tipItem}>
                  <FontAwesome5 name="check-circle" size={12} color="#34C759" />
                  <Text style={styles.tipText}>
                    Highlight your reliability and punctuality
                  </Text>
                </View>
                <View style={styles.tipItem}>
                  <FontAwesome5 name="check-circle" size={12} color="#34C759" />
                  <Text style={styles.tipText}>
                    Share why you're passionate about helping families
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.submitButton,
                loading && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <View style={styles.loadingContainer}>
                  <FontAwesome5 name="spinner" size={14} color="#fff" />
                  <Text style={styles.submitButtonText}>Submitting...</Text>
                </View>
              ) : (
                <>
                  <FontAwesome5 name="paper-plane" size={14} color="#fff" />
                  <Text style={styles.submitButtonText}>
                    Submit Application
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "95%",
    minHeight: "75%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalTitle: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 20,
    color: "#fff",
    marginLeft: 10,
  },
  closeButton: {
    padding: 6,
  },
  modalBody: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 24,
  },
  welcomeSection: {
    alignItems: "center",
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  welcomeTitle: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 18,
    color: "#333",
    marginTop: 10,
    marginBottom: 10,
  },
  welcomeText: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  messageInput: {
    borderWidth: 2,
    borderColor: "#e9ecef",
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    fontFamily: "Comfortaa-Regular",
    color: "#333",
    backgroundColor: "#f8f9fa",
    minHeight: 120,
    textAlignVertical: "top",
  },
  characterCount: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 12,
    color: "#999",
    textAlign: "right",
    marginTop: 6,
  },
  tipsSection: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  tipsTitle: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 14,
    color: "#333",
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  tipText: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 13,
    color: "#666",
    marginLeft: 10,
    lineHeight: 18,
  },
  modalFooter: {
    flexDirection: "row",
    padding: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    fontFamily: "Comfortaa-Bold",
  },
  cancelButton: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  cancelButtonText: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 14,
    color: "#666",
  },
  submitButton: {
    backgroundColor: "#FF932E",
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
  },
  submitButtonText: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 14,
    color: "#fff",
    marginLeft: 6,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
