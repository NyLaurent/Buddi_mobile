import { Feather } from "@expo/vector-icons";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface RequestBuddiSuccessModalProps {
  visible: boolean;
  onClose: () => void;
}

const RequestBuddiSuccessModal = ({
  visible,
  onClose,
}: RequestBuddiSuccessModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      {/* Overlay with semi-transparent black background */}
      <View style={styles.overlay}>
        {/* Modal container with shadow */}
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={onClose}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={styles.modalContainer}
          >
            <View className="bg-white rounded-3xl p-6 w-full">
              <Text className="text-2xl font-comfortaa-bold text-center mb-2">
                Is everything correct?
              </Text>
              <Text className="text-grayText font-comfortaa text-center mb-6">
                Please review the information before submitting
              </Text>

              <View className="flex-row justify-between mt-4">
                <TouchableOpacity style={styles.reviewButton} onPress={onClose}>
                  <View style={styles.reviewContent}>
                    <Feather name="corner-up-left" size={20} color="#6B7280" />
                    <Text style={styles.reviewText}>Review</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-1 bg-primary py-3 rounded-full ml-2 items-center"
                  onPress={onClose}
                >
                  <View className="flex-row items-center">
                    <Feather name="check" size={18} color="white" />
                    <Text className="font-comfortaa-bold text-white ml-2">
                      Confirm
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  modalContainer: {
    width: "100%",
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  reviewButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderRadius: 9999,
    paddingVertical: 10,
    marginRight: 8,
  },
  reviewContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewText: {
    color: "#6B7280",
    fontFamily: "Comfortaa-Bold",
    fontSize: 16,
    marginLeft: 8,
  },
});

export default RequestBuddiSuccessModal;
