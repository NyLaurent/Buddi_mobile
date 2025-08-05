import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthService from "../../../services/api/auth.service";

const PRIMARY_COLOR = "#FF932E";

const RecoveryEmailScreen = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendCode = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }

    if (!validateEmail(email.trim())) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      await AuthService.forgotPassword(email.trim());
      Alert.alert(
        "Success",
        "Password reset code has been sent to your email address.",
        [
          {
            text: "OK",
            onPress: () =>
              router.push({
                pathname: "/auth/otp-verification" as any,
                params: { email: email.trim() },
              }),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Failed to send reset code. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-6">
        {/* Back Button */}
        <TouchableOpacity
          onPress={handleBack}
          className="mb-4"
          disabled={isLoading}
        >
          <Ionicons name="arrow-back" size={24} color="#71727A" />
        </TouchableOpacity>

        {/* Logo */}
        <View className="items-center mb-8">
          <Image
            source={require("../../../assets/images/logo.png")}
            className="w-40 h-12"
            resizeMode="contain"
          />
        </View>

        {/* Header */}
        <View className="items-center">
          <Text className="text-3xl font-comfortaa-bold text-[#71727A] mb-2">
            Password Recovery
          </Text>
          <Text className="text-sm font-comfortaa text-center text-[#71727A] mb-8">
            Enter your email address to receive a password reset code
          </Text>
        </View>

        {/* Email Input */}
        <View className="mb-8">
          <Text className="font-comfortaa-bold text-sm text-[#71727A] mb-2">
            Email Address
          </Text>
          <View className="flex-row items-center bg-white border border-[#CBD5E1] rounded-2xl px-4 py-3.5">
            <Ionicons
              name="mail-outline"
              size={20}
              color="#A0A0A0"
              style={{ marginRight: 8 }}
            />
            <TextInput
              className="flex-1 font-comfortaa text-[#71727A] text-base"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email address..."
              placeholderTextColor="#A0A0A0"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />
          </View>
        </View>

        {/* Send Code Button */}
        <TouchableOpacity
          className="rounded-full py-3.5 items-center mb-6"
          style={{
            backgroundColor: PRIMARY_COLOR,
            opacity: isLoading ? 0.7 : 1,
          }}
          onPress={handleSendCode}
          disabled={isLoading}
        >
          <View className="flex-row items-center">
            {isLoading ? (
              <ActivityIndicator
                size="small"
                color="#fff"
                style={{ marginRight: 8 }}
              />
            ) : (
              <Text className="font-comfortaa-bold text-white text-base mr-2">
                Send Code
              </Text>
            )}
            {!isLoading && (
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            )}
            {isLoading && (
              <Text className="font-comfortaa-bold text-white text-base">
                Sending...
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Bottom Right Decorative Element */}
      <View style={{ position: "absolute", right: 0, bottom: 0, zIndex: -1 }}>
        <Image
          source={require("../../../assets/images/onboarding/bottom_right.png")}
          style={{ width: 150, height: 150 }}
          resizeMode="contain"
        />
      </View>
    </SafeAreaView>
  );
};

export default RecoveryEmailScreen;
