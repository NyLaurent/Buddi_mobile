import { Ionicons } from "@expo/vector-icons";
import {
  Linking,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  timesheetId: number;
}

const PaymentModal = ({
  visible,
  onClose,
  onConfirm,
  timesheetId,
}: PaymentModalProps) => {
  const handleConfirm = async () => {
    const webAppUrl = `https://app.pickupbuddi.com/`;

    try {
      const supported = await Linking.canOpenURL(webAppUrl);
      if (supported) {
        await Linking.openURL(webAppUrl);
        onConfirm();
      } else {
        // Fallback to the original URL if the new one doesn't work
        const fallbackUrl = `https://pickup-buddi.com/`;
        await Linking.openURL(fallbackUrl);
        onConfirm();
      }
    } catch (error) {
      console.error("Failed to open payment URL:", error);
      onConfirm(); // Still call onConfirm to close modal
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      {/* Overlay with semi-transparent black background */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          {/* Modal container with shadow */}
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {/* Close Button */}
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>

                {/* Header */}
                <View style={styles.header}>
                  <Ionicons name="card-outline" size={32} color="#FF932E" />
                  <Text style={styles.title}>Process Payment</Text>
                </View>

                {/* Content */}
                <View style={styles.content}>
                  <Text style={styles.description}>
                    You will be redirected to our web app portal to complete the
                    payment securely.
                  </Text>
                  <Text style={styles.webAppText}>
                    Web App: app.pickupbuddi.com
                  </Text>
                </View>

                {/* Continue Button */}
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handleConfirm}
                >
                  <View style={styles.confirmButtonContent}>
                    <Ionicons name="open-outline" size={18} color="#fff" />
                    <Text style={styles.confirmButtonText}>
                      Continue to Payment
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
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
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 1,
    padding: 4,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 8,
  },
  title: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 20,
    color: "#1F2937",
    marginTop: 8,
    textAlign: "center",
  },
  content: {
    marginBottom: 24,
  },
  description: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 12,
  },
  webAppText: {
    fontFamily: "Comfortaa-Medium",
    fontSize: 14,
    color: "#FF932E",
    textAlign: "center",
  },
  confirmButton: {
    backgroundColor: "#FF932E",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  confirmButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  confirmButtonText: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 16,
    color: "#fff",
    marginLeft: 8,
  },
});

export default PaymentModal;
