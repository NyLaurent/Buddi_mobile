import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface PaymentAlertProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  onPress?: () => void;
}

const PaymentAlert = ({
  title = "Payment Required For 2 Full Timesheets",
  subtitle = "Your Buddi is waiting! Complete the payment to confirm their awesome support.",
  buttonText = "View Timesheets",
  onPress,
}: PaymentAlertProps) => (
  <View
    style={{
      backgroundColor: "#fff",
      borderRadius: 16,
      borderWidth: 1,
      borderColor: "#E8E8E8",
      padding: 14,
      marginVertical: 8,
      shadowColor: "#000",
      shadowOpacity: 0.02,
      shadowRadius: 1,
      shadowOffset: { width: 0, height: 1 },
    }}
  >
    <MaterialIcons
      name="account-balance"
      size={26}
      color="#FF9100"
      style={{ marginBottom: 4 }}
    />
    <Text
      style={{
        fontSize: 16,
        fontFamily: "Comfortaa-Bold",
        color: "#222",
        marginBottom: 4,
      }}
    >
      {title}
    </Text>
    <Text
      style={{
        fontSize: 13,
        fontFamily: "Comfortaa-Regular",
        color: "#8A8A8A",
        marginBottom: 14,
      }}
    >
      {subtitle}
    </Text>
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: "#FF9100",
        borderRadius: 32,
        paddingVertical: 10,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
      }}
      activeOpacity={0.85}
    >
      <Text
        style={{
          color: "#fff",
          fontSize: 16,
          fontFamily: "Comfortaa-Regular",
          marginRight: 8,
        }}
      >
        {buttonText}
      </Text>
      <MaterialIcons name="history" size={20} color="#fff" />
    </TouchableOpacity>
  </View>
);

export default PaymentAlert;
