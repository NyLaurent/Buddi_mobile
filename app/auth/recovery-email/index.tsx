import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY_COLOR = "#FF932E";

const RecoveryEmailScreen = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSendCode = () => {
    // In a real app, you would send the code to the email
    router.push("/auth/otp-verification" as any);
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
          <Text className="text-sm font-comfortaa text-center text-gray mb-8">
            Enter your email used in signup to get a confirmation code (OTP)
          </Text>
        </View>

        {/* Email Input */}
        <View className="mb-8">
          <Text className="font-comfortaa-bold text-sm text-gray mb-2">
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
              className="flex-1 font-comfortaa text-gray text-base"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email address..."
              placeholderTextColor="#A0A0A0"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Send Code Button */}
        <TouchableOpacity
          className="bg-primary rounded-full py-3.5 items-center mb-6"
          onPress={handleSendCode}
        >
          <View className="flex-row items-center">
            <Text className="font-comfortaa-bold text-white text-base mr-2">
              Send code
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

export default RecoveryEmailScreen;
