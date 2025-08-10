import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface CoverageRequestModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void>;
  buddiName?: string;
}

const CoverageRequestModal: React.FC<CoverageRequestModalProps> = ({
  visible,
  onClose,
  onSubmit,
  buddiName = "your Buddi",
}) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      Alert.alert("Error", "Please enter a reason for the coverage request.");
      return;
    }

    setLoading(true);
    try {
      Keyboard.dismiss();
      await onSubmit(reason.trim());
      setReason("");
      onClose();
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Failed to create coverage request."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      Keyboard.dismiss();
      setReason("");
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
      statusBarTranslucent={true}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 20,
            }}
          >
            <TouchableWithoutFeedback onPress={() => {}}>
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: 20,
                  padding: 24,
                  width: "100%",
                  maxWidth: 400,
                  maxHeight: "80%",
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}
              >
                {/* Header */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 20,
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: "#FF932E",
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 12,
                    }}
                  >
                    <Ionicons name="shield-outline" size={20} color="white" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: "Comfortaa-Bold",
                        fontSize: 18,
                        color: "#1F2937",
                      }}
                    >
                      Request Coverage
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Comfortaa-Regular",
                        fontSize: 14,
                        color: "#6B7280",
                      }}
                    >
                      Ask {buddiName} for coverage
                    </Text>
                  </View>
                  <TouchableOpacity onPress={handleClose} disabled={loading}>
                    <Ionicons name="close" size={24} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={{ flexGrow: 1 }}
                >
                  {/* Reason Input */}
                  <View style={{ marginBottom: 24 }}>
                    <Text
                      style={{
                        fontFamily: "Comfortaa-Bold",
                        fontSize: 16,
                        color: "#374151",
                        marginBottom: 8,
                      }}
                    >
                      Reason for Coverage Request
                    </Text>
                    <TextInput
                      style={{
                        borderWidth: 1,
                        borderColor: "#D1D5DB",
                        borderRadius: 12,
                        padding: 16,
                        fontFamily: "Comfortaa-Regular",
                        fontSize: 16,
                        color: "#1F2937",
                        backgroundColor: "#F9FAFB",
                        minHeight: 100,
                        maxHeight: 200,
                        textAlignVertical: "top",
                      }}
                      placeholder="Explain why you need coverage (e.g., unexpected schedule change, emergency, etc.)"
                      placeholderTextColor="#9CA3AF"
                      value={reason}
                      onChangeText={setReason}
                      multiline
                      numberOfLines={4}
                      editable={!loading}
                      returnKeyType="done"
                      blurOnSubmit={true}
                      onSubmitEditing={() => Keyboard.dismiss()}
                    />
                  </View>
                </ScrollView>

                {/* Action Button */}
                <TouchableOpacity
                  style={{
                    width: "100%",
                    paddingVertical: 14,
                    paddingHorizontal: 20,
                    borderRadius: 12,
                    backgroundColor: "#FF932E",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: loading ? 0.7 : 1,
                  }}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Ionicons
                        name="send"
                        size={18}
                        color="white"
                        style={{ marginRight: 6 }}
                      />
                      <Text
                        style={{
                          fontFamily: "Comfortaa-Bold",
                          fontSize: 16,
                          color: "white",
                        }}
                      >
                        Send Request
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CoverageRequestModal;