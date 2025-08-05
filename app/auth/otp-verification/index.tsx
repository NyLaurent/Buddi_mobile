import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthService from "../../../services/api/auth.service";

const PRIMARY_COLOR = "#FF932E";

const OTPVerificationScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
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

  const handleSubmit = async () => {
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      Alert.alert("Error", "Please enter the complete 6-digit code.");
      return;
    }

    if (!email) {
      Alert.alert("Error", "Email not found. Please go back and try again.");
      return;
    }

    setIsLoading(true);
    try {
      await AuthService.verifyResetCode(email, otpString);
      router.push({
        pathname: "/auth/password-reset" as any,
        params: { email, code: otpString },
      });
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Invalid verification code. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      Alert.alert("Error", "Email not found. Please go back and try again.");
      return;
    }

    setIsResending(true);
    try {
      await AuthService.forgotPassword(email);
      Alert.alert(
        "Success",
        "A new verification code has been sent to your email."
      );
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Failed to resend code. Please try again."
      );
    } finally {
      setIsResending(false);
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
            Verify Code
          </Text>
          <Text className="text-sm font-comfortaa text-center text-[#71727A] mb-2">
            Enter the 6-digit code sent to
          </Text>
          <Text className="text-sm font-comfortaa-bold text-center text-[#71727A] mb-8">
            {email || "your email"}
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
                className="font-comfortaa-bold text-xl text-[#71727A]"
                editable={!isLoading}
              />
            ))}
          </View>

          {/* Didn't receive code? */}
          <View className="flex-row justify-center items-center mt-4">
            <Text className="font-comfortaa text-[#71727A] mr-2">
              Didn't receive code?
            </Text>
            <TouchableOpacity
              onPress={handleResend}
              disabled={isResending || isLoading}
              style={{ opacity: isResending || isLoading ? 0.7 : 1 }}
            >
              <Text
                className="font-comfortaa-bold"
                style={{ color: PRIMARY_COLOR }}
              >
                {isResending ? "Resending..." : "Resend"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          className="rounded-full py-3.5 items-center mb-6"
          style={{
            backgroundColor: PRIMARY_COLOR,
            opacity: isLoading ? 0.7 : 1,
          }}
          onPress={handleSubmit}
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
                Verify Code
              </Text>
            )}
            {!isLoading && (
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            )}
            {isLoading && (
              <Text className="font-comfortaa-bold text-white text-base">
                Verifying...
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

const styles = StyleSheet.create({
  otpInput: {
    width: 48,
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
