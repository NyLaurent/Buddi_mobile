import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ButtonProps {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
}

interface CoverageAlertCardProps {
  title: string;
  subtitle: string;
  description: string;
  primaryButton: ButtonProps;
  secondaryButton?: ButtonProps;
}

const CoverageAlertCard: React.FC<CoverageAlertCardProps> = ({
  title,
  subtitle,
  description,
  primaryButton,
  secondaryButton,
}) => {
  return (
    <View style={styles.card}>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}
      >
        <Ionicons
          name="business"
          size={24}
          color="#FF9100"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <Text style={styles.description}>{description}</Text>
      <View
        style={[
          styles.buttonRow,
          !secondaryButton && { justifyContent: "center" },
        ]}
      >
        {secondaryButton && (
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={secondaryButton.onPress}
          >
            {secondaryButton.icon}
            <Text style={styles.secondaryButtonText}>
              {secondaryButton.label}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.primaryButton, !secondaryButton && { flex: 1 }]}
          onPress={primaryButton.onPress}
        >
          <Text style={styles.primaryButtonText}>{primaryButton.label}</Text>
          {primaryButton.icon}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F2F2F2",
    margin: 12,
   
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#23272F",
    fontFamily: "Comfortaa-Regular",
  },
  subtitle: {
    fontSize: 15,
    color: "#23272F",
    fontWeight: "500",
    marginBottom: 2,
    fontFamily: "Comfortaa-Regular",
  },
  description: {
    fontSize: 14,
    color: "#8A8A8A",
    marginBottom: 18,
    fontFamily: "Comfortaa-Regular",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF9100",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 32,
    justifyContent: "center",
    flex: 1,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "500",
    fontFamily: "Comfortaa-Regular",
    marginRight: 8,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: "#23272F",
    fontSize: 17,
    fontWeight: "500",
    fontFamily: "Comfortaa-Regular",
    marginLeft: 8,
  },
});

export default CoverageAlertCard;
