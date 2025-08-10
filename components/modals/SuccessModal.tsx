import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect } from "react";
import { Animated, Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

interface SuccessModalProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  autoCloseDelay?: number; // milliseconds, default 3000 (3 seconds)
  showCloseButton?: boolean;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  visible,
  title,
  message,
  onClose,
  autoCloseDelay = 3000,
  showCloseButton = true,
  iconName = "checkmark-circle",
  iconColor = "#22C55E",
}) => {
  const [slideAnim] = React.useState(new Animated.Value(300));
  const [opacityAnim] = React.useState(new Animated.Value(0));

  const handleClose = useCallback(() => {
    // Animate out
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  }, [slideAnim, opacityAnim, onClose]);

  useEffect(() => {
    if (visible) {
      // Animate in
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto close after delay
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    } else {
      // Reset animations for next time
      slideAnim.setValue(300);
      opacityAnim.setValue(0);
    }
  }, [visible, autoCloseDelay, slideAnim, opacityAnim, handleClose]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent={true}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
            opacity: opacityAnim,
          }}
        >
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <Animated.View
              style={{
                backgroundColor: "white",
                borderRadius: 20,
                padding: 24,
                width: "100%",
                maxWidth: 340,
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 12,
                elevation: 8,
                transform: [{ translateY: slideAnim }],
              }}
            >
              {/* Success Icon */}
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: `${iconColor}20`,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <Ionicons name={iconName} size={32} color={iconColor} />
              </View>

              {/* Title */}
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "Comfortaa-Bold",
                  color: "#1F2937",
                  textAlign: "center",
                  marginBottom: 8,
                }}
              >
                {title}
              </Text>

              {/* Message */}
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: "Comfortaa-Regular",
                  color: "#6B7280",
                  textAlign: "center",
                  lineHeight: 22,
                  marginBottom: showCloseButton ? 20 : 0,
                }}
              >
                {message}
              </Text>

              {/* Close Button (optional) */}
              {showCloseButton && (
                <TouchableOpacity
                  onPress={handleClose}
                  style={{
                    backgroundColor: iconColor,
                    borderRadius: 12,
                    paddingVertical: 12,
                    paddingHorizontal: 24,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 120,
                  }}
                  activeOpacity={0.8}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 16,
                      fontFamily: "Comfortaa-Bold",
                      marginRight: 6,
                    }}
                  >
                    Got it!
                  </Text>
                  <Ionicons name="thumbs-up" size={16} color="white" />
                </TouchableOpacity>
              )}
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SuccessModal;
