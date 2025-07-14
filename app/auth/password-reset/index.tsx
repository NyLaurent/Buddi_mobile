import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY_COLOR = "#FF932E";

const PasswordResetScreen = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleResetPassword = () => {
    // In a real app, you would reset the password here
    router.push("/auth/login");
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
          <Text className="text-3xl font-comfortaa-bold text-black mb-2">
            Password Recovery
          </Text>
          <Text className="text-sm font-comfortaa text-center text-[#71727A] mb-8">
            Enter your email used in signup to get a confirmation code (OTP)
          </Text>
        </View>

        {/* Password Input */}
        <View className="mb-4">
          <Text className="font-comfortaa-bold text-sm text-[#71727A] mb-2">
            Password
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
              placeholder="**************"
              placeholderTextColor="#A0A0A0"
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
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
            Confirm Password
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
              placeholder="**************"
              placeholderTextColor="#A0A0A0"
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                size={20}
                color="#A0A0A0"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Reset Password Button */}
        <TouchableOpacity
          className="bg-primary rounded-full py-3.5 items-center mb-6"
          onPress={handleResetPassword}
        >
          <View className="flex-row items-center">
            <Text className="font-comfortaa-bold text-white text-base mr-2">
              Reset Password
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

export default PasswordResetScreen;
