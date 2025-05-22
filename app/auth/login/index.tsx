import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY_COLOR = "#FF932E";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    // Handle login logic here
    router.push("/");
  };

  const handleSignUp = () => {
    router.push("/role-select");
  };

  const handleForgotPassword = () => {
    router.push("/auth/recovery-email" as any);
  };

  const handleGoogleSignIn = () => {
    // Handle Google sign in
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
            Login
          </Text>
          <Text className="text-sm font-comfortaa text-center text-gray-500 mb-8">
            Sign In to access all-in-one intelligent health
          </Text>
        </View>

        {/* Email Input */}
        <View className="mb-4">
          <Text className="font-comfortaa-bold text-sm text-gray-600 mb-2">
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
              className="flex-1 font-comfortaa text-gray-700 text-base"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email address..."
              placeholderTextColor="#A0A0A0"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Password Input */}
        <View className="mb-6">
          <Text className="font-comfortaa-bold text-sm text-gray-600 mb-2">
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
              className="flex-1 font-comfortaa text-gray-700 text-base"
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

        {/* Remember Me and Forgot Password */}
        <View className="flex-row justify-between items-center mb-6">
          <TouchableOpacity
            className="flex-row items-center"
            onPress={() => setRememberMe(!rememberMe)}
          >
            <View
              className={`w-5 h-5 rounded-full items-center justify-center ${
                rememberMe ? "bg-primary" : "border border-gray-300"
              }`}
            >
              {rememberMe && (
                <Ionicons name="checkmark" size={12} color="#fff" />
              )}
            </View>
            <Text className="ml-2 font-comfortaa text-gray-700">
              Keep me signed in
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text className="font-comfortaa text-primary">Forgot Password</Text>
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          className="bg-primary rounded-full py-3.5 items-center mb-6"
          onPress={handleLogin}
        >
          <View className="flex-row items-center">
            <Text className="font-comfortaa-bold text-white text-base mr-2">
              Login
            </Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* OR Divider */}
        <View className="flex-row items-center mb-6">
          <View className="flex-1 h-[1px] bg-gray-200" />
          <Text className="mx-4 font-comfortaa text-gray-400">OR</Text>
          <View className="flex-1 h-[1px] bg-gray-200" />
        </View>

        {/* Google Sign In */}
        <TouchableOpacity
          className="border border-gray-200 rounded-full py-3.5 items-center mb-8"
          onPress={handleGoogleSignIn}
        >
          <View className="flex-row items-center">
            <Image
              source={{
                uri: "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg",
              }}
              style={{ width: 20, height: 20, marginRight: 10 }}
            />
            <Text className="font-comfortaa-bold text-gray-700 text-base">
              Sign In With Google
            </Text>
          </View>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View className="items-center">
          <Text className="font-comfortaa text-gray-600">
            Don&apos;t have an account?{" "}
            <Text
              className="font-comfortaa-bold text-primary"
              onPress={handleSignUp}
            >
              Sign Up
            </Text>
          </Text>
        </View>
      </View>

      {/* Bottom Right Decorative Element */}
      <View
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          zIndex: -100,
          opacity: 0.5,
        }}
      >
        <Image
          source={require("../../../assets/images/onboarding/bottom_right.png")}
          style={{ width: 150, height: 150 }}
          resizeMode="contain"
        />
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
