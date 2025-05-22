import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY_COLOR = "#FF932E";

const OTPVerificationScreen = () => {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(["", "", "", "", ""]);
  const inputRefs = useRef<TextInput[]>([]);

  // Handle input change for each OTP digit
  const handleOTPChange = (value: string, index: number) => {
    if (value.length > 1) {
      value = value[value.length - 1]; // Take only the last character
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if a digit is entered
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace key for OTP inputs
  const handleOTPKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      // Move to previous input on backspace if current input is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    // In a real app, you would verify the OTP here
    router.push("/auth/password-reset");
  };

  const handleResend = () => {
    // In a real app, you would resend the OTP
    console.log("Resending OTP");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-6">
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
          <Text className="text-3xl font-comfortaa-bold text-gray-800 mb-2">
            OTP Verification
          </Text>
          <Text className="text-sm font-comfortaa text-center text-gray-500 mb-8">
            Enter your email used in signup to get a confirmation code (OTP)
          </Text>
        </View>

        {/* OTP Input */}
        <View className="mb-8">
          <View className="flex-row justify-between px-2">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  if (ref) inputRefs.current[index] = ref;
                }}
                style={styles.otpInput}
                value={digit}
                onChangeText={(text) => handleOTPChange(text, index)}
                onKeyPress={(e) => handleOTPKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                textAlign="center"
                selectTextOnFocus
                className="font-comfortaa-bold text-xl text-gray-700"
              />
            ))}
          </View>

          {/* Didn't receive code? */}
          <View className="flex-row justify-center items-center mt-4">
            <Text className="font-comfortaa text-gray-500 mr-2">
              Didn't receive code?
            </Text>
            <TouchableOpacity onPress={handleResend}>
              <Text className="font-comfortaa-bold text-primary">Resend</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          className="bg-primary rounded-full py-3.5 items-center mb-6"
          onPress={handleSubmit}
        >
          <View className="flex-row items-center">
            <Text className="font-comfortaa-bold text-white text-base mr-2">
              Submit code
            </Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
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

const styles = StyleSheet.create({
  otpInput: {
    width: 56,
    height: 56,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#CBD5E1",
    fontSize: 24,
  },
  activeOtpInput: {
    borderColor: PRIMARY_COLOR,
  },
});

export default OTPVerificationScreen;
