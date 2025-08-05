import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
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

const PasswordResetScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const code = params.code as string;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (password: string) => {
    // Password must be at least 8 characters with at least one uppercase, one lowercase, one number, and one special character
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleResetPassword = async () => {
    if (!password.trim()) {
      Alert.alert("Error", "Please enter a new password.");
      return;
    }

    if (!confirmPassword.trim()) {
      Alert.alert("Error", "Please confirm your password.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert(
        "Error",
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }

    if (!email || !code) {
      Alert.alert(
        "Error",
        "Missing email or verification code. Please start over."
      );
      return;
    }

    setIsLoading(true);
    try {
      await AuthService.resetPassword(email, code, password);
      Alert.alert("Success", "Your password has been reset successfully.", [
        {
          text: "OK",
          onPress: () => router.push("/auth/login" as any),
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Failed to reset password. Please try again."
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
            Reset Password
          </Text>
          <Text className="text-sm font-comfortaa text-center text-[#71727A] mb-8">
            Enter your new password below
          </Text>
        </View>

        {/* Password Input */}
        <View className="mb-4">
          <Text className="font-comfortaa-bold text-sm text-[#71727A] mb-2">
            New Password
          </Text>
          <View className="flex-row items-center bg-white border border-[#CBD5E1] rounded-2xl px-4 py-3.5">
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#A0A0A0"
              style={{ marginRight: 8 }}
            />
            <TextInput
              className="flex-1 font-comfortaa text-[#71727A] text-base"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter new password..."
              placeholderTextColor="#A0A0A0"
              secureTextEntry={!showPassword}
              editable={!isLoading}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={20}
                color="#A0A0A0"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Confirm Password Input */}
        <View className="mb-8">
          <Text className="font-comfortaa-bold text-sm text-[#71727A] mb-2">
            Confirm New Password
          </Text>
          <View className="flex-row items-center bg-white border border-[#CBD5E1] rounded-2xl px-4 py-3.5">
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#A0A0A0"
              style={{ marginRight: 8 }}
            />
            <TextInput
              className="flex-1 font-comfortaa text-[#71727A] text-base"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password..."
              placeholderTextColor="#A0A0A0"
              secureTextEntry={!showConfirmPassword}
              editable={!isLoading}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                size={20}
                color="#A0A0A0"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Password Requirements */}
        <View className="mb-6 px-2">
          <Text className="font-comfortaa-bold text-sm text-[#71727A] mb-2">
            Password Requirements:
          </Text>
          <Text className="font-comfortaa text-xs text-[#71727A] leading-4">
            • At least 8 characters long{"\n"}• At least one uppercase letter
            {"\n"}• At least one lowercase letter{"\n"}• At least one number
            {"\n"}• At least one special character (@$!%*?&)
          </Text>
        </View>

        {/* Reset Password Button */}
        <TouchableOpacity
          className="rounded-full py-3.5 items-center mb-6"
          style={{
            backgroundColor: PRIMARY_COLOR,
            opacity: isLoading ? 0.7 : 1,
          }}
          onPress={handleResetPassword}
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
                Reset Password
              </Text>
            )}
            {!isLoading && (
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            )}
            {isLoading && (
              <Text className="font-comfortaa-bold text-white text-base">
                Resetting...
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

export default PasswordResetScreen;
