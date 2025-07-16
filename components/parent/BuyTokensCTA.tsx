import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface BuyTokensCTAProps {
  onPress: () => void;
  title?: string;
  message?: string;
  showButtonBelow?: boolean;
}

const BuyTokensCTA: React.FC<BuyTokensCTAProps> = ({
  onPress,
  title = "Need More Tokens?",
  message = "Buy tokens to access more Buddi services and features instantly.",
  showButtonBelow = false,
}) => (
  <LinearGradient
    colors={["#34D399", "#06B6D4"]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={{
      borderRadius: 16,
      marginTop: 10,
      marginBottom: 10,
      padding: 18,
      shadowColor: "#06B6D4",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 10,
      elevation: 3,
    }}
  >
    <View style={{ flex: 1 }}>
      <Text
        style={{
          color: "#fff",
          fontFamily: "Comfortaa-Bold",
          fontSize: 18,
          marginBottom: 4,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          color: "#E0F2F1",
          fontFamily: "Comfortaa-Regular",
          fontSize: 14,
        }}
      >
        {message}
      </Text>
      {showButtonBelow && (
        <TouchableOpacity
          style={{
            backgroundColor: "#fff",
            borderRadius: 999,
            paddingVertical: 12,
            paddingHorizontal: 22,
            marginTop: 18,
            alignSelf: "flex-start",
            flexDirection: "row",
            alignItems: "center",
            shadowColor: "#06B6D4",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.12,
            shadowRadius: 6,
            elevation: 2,
          }}
          onPress={onPress}
          activeOpacity={0.85}
        >
          <Text
            style={{
              color: "#06B6D4",
              fontFamily: "Comfortaa-Bold",
              fontSize: 15,
              marginRight: 8,
            }}
          >
            Buy Tokens
          </Text>
          <Ionicons name="wallet-outline" size={18} color="#06B6D4" />
        </TouchableOpacity>
      )}
    </View>
    {!showButtonBelow && (
      <TouchableOpacity
        style={{
          backgroundColor: "#fff",
          borderRadius: 999,
          paddingVertical: 10,
          paddingHorizontal: 22,
          marginLeft: 12,
          flexDirection: "row",
          alignItems: "center",
          shadowColor: "#06B6D4",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.12,
          shadowRadius: 6,
          elevation: 2,
        }}
        onPress={onPress}
        activeOpacity={0.85}
      >
        <Text
          style={{
            color: "#06B6D4",
            fontFamily: "Comfortaa-Bold",
            fontSize: 15,
            marginRight: 8,
          }}
        >
          Buy Tokens
        </Text>
        <Ionicons name="wallet-outline" size={18} color="#06B6D4" />
      </TouchableOpacity>
    )}
  </LinearGradient>
);

export default BuyTokensCTA;
