import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import BackgroundCheckService from "../../services/api/background-check.service";

export default function BackgroundCheck() {
  const router = useRouter();
  const { user, parentDetails } = useAuth();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isSubmittingBgCheck, setIsSubmittingBgCheck] = React.useState(false);
  const [bgCheckData, setBgCheckData] = React.useState({
    city: "",
    state: "",
    country: "US",
    zip: "",
  });

  // Check if background check is already paid
  const isBgCheckPaid = parentDetails?.isBgCheckPaid === true;

  const handlePayment = async () => {
    if (!parentDetails?.id) {
      Alert.alert("Error", "Parent details not found. Please try again.");
      return;
    }

    console.log("[PAYMENT] Starting background check payment...");
    setIsProcessing(true);

    try {
      // Redirect to web app for payment
      const webAppUrl = "https://app.pickupbuddi.com";
      const supported = await Linking.canOpenURL(webAppUrl);
      if (supported) {
        await Linking.openURL(webAppUrl);
        console.log("[PAYMENT] Successfully opened web app URL");
        // Show a message that they'll be redirected back after payment
        Alert.alert(
          "Payment Redirect",
          "You're being redirected to our web app to complete your background check payment securely. After successful payment, you'll be redirected back to the app.",
          [{ text: "OK" }]
        );
      } else {
        console.log("[PAYMENT] Cannot open web app URL:", webAppUrl);
        Alert.alert(
          "Error",
          "Cannot open web app. Please visit the website manually."
        );
      }
    } catch (error) {
      console.error("[PAYMENT] Error opening web app URL:", error);
      Alert.alert("Error", "Failed to open web app. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackgroundCheckSubmit = async () => {
    if (!parentDetails?.id) {
      Alert.alert("Error", "Parent details not found. Please try again.");
      return;
    }

    // Validate form data
    if (
      !bgCheckData.city.trim() ||
      !bgCheckData.state.trim() ||
      !bgCheckData.zip.trim()
    ) {
      Alert.alert("Validation Error", "Please fill in all required fields.");
      return;
    }

    setIsSubmittingBgCheck(true);

    try {
      const response = await BackgroundCheckService.submitBackgroundCheck(
        parentDetails.id.toString(),
        bgCheckData
      );

      if (response.success) {
        // Check if there's an invitation URL to redirect to
        if (response.invitationUrl) {
          console.log(
            "[BG-CHECK] Redirecting to Checkr invitation URL:",
            response.invitationUrl
          );

          // Redirect immediately to Checkr invitation URL
          try {
            const supported = await Linking.canOpenURL(response.invitationUrl);
            if (supported) {
              await Linking.openURL(response.invitationUrl);
              console.log(
                "[BG-CHECK] Successfully opened Checkr invitation URL"
              );
              // Navigate back to dashboard after opening the URL
              router.back();
            } else {
              console.log(
                "[BG-CHECK] Cannot open Checkr invitation URL:",
                response.invitationUrl
              );
              Alert.alert(
                "Error",
                "Cannot open the background check link. Please check your internet connection and try again."
              );
            }
          } catch (error) {
            console.error(
              "[BG-CHECK] Error opening Checkr invitation URL:",
              error
            );
            Alert.alert(
              "Error",
              "Failed to open the background check link. Please try again."
            );
          }
        } else {
          // Fallback to original success message if no invitation URL
          Alert.alert(
            "Background Check Submitted",
            "Your background check information has been submitted successfully. Our team will review and contact you within 2-3 business days.",
            [
              {
                text: "OK",
                onPress: () => {
                  // Navigate back to dashboard
                  router.back();
                },
              },
            ]
          );
        }
      } else {
        Alert.alert("Submission Failed", response.message);
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsSubmittingBgCheck(false);
    }
  };

  // Debug logging
  console.log("[BG-CHECK] Debug:", {
    isBgCheckPaid,
    approvalStage: parentDetails?.approvalStage,
  });

  // If background check is already paid, show the form
  if (isBgCheckPaid) {
    console.log("[BG-CHECK] Showing background check form");
    return (
      <SafeAreaView className="flex-1 bg-white">
        <ScrollView className="flex-1 px-4">
          {/* Header */}
          <View className="flex-row items-center justify-between mt-4 mb-6">
            <TouchableOpacity
              onPress={() => router.back()}
              className="p-2 rounded-full bg-gray-100"
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text className="text-xl font-comfortaa-bold text-black">
              Background Check Information
            </Text>
            <View className="w-10" />
          </View>

          {/* Main Content */}
          <View className="items-center mt-8">
            {/* Icon */}
            <View className="w-24 h-24 bg-green-100 rounded-full items-center justify-center mb-6">
              <Ionicons name="checkmark-circle" size={48} color="#16A34A" />
            </View>

            {/* Title */}
            <Text className="text-2xl font-comfortaa-bold text-black text-center mb-4">
              Complete Background Check
            </Text>

            {/* Description */}
            <Text className="text-base font-comfortaa text-[#71727A] text-center leading-6 mb-8 px-4">
              Please provide your location information to complete the
              background check process.
            </Text>

            {/* Background Check Form */}
            <View className="w-full bg-green-50 p-6 rounded-xl border border-green-200 mb-6">
              <View className="flex-row items-center mb-4">
                <Ionicons name="location" size={24} color="#16A34A" />
                <Text className="text-lg font-comfortaa-bold text-green-800 ml-3">
                  Location Information
                </Text>
              </View>

              {/* City Input */}
              <View className="mb-4">
                <Text className="text-sm font-comfortaa-bold text-gray-700 mb-2">
                  City *
                </Text>
                <TextInput
                  value={bgCheckData.city}
                  onChangeText={(text) =>
                    setBgCheckData({ ...bgCheckData, city: text })
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 bg-white font-comfortaa text-lg text-black"
                  placeholder="Enter your city"
                  placeholderTextColor="#000000"
                />
              </View>

              {/* State Input */}
              <View className="mb-4">
                <Text className="text-sm font-comfortaa-bold text-gray-700 mb-2">
                  State *
                </Text>
                <TextInput
                  value={bgCheckData.state}
                  onChangeText={(text) =>
                    setBgCheckData({ ...bgCheckData, state: text })
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 bg-white font-comfortaa text-lg text-black"
                  placeholder="Enter your state"
                  placeholderTextColor="#000000"
                />
              </View>

              {/* Country Input */}
              <View className="mb-4">
                <Text className="text-sm font-comfortaa-bold text-gray-700 mb-2">
                  Country
                </Text>
                <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2 bg-gray-100">
                  <TextInput
                    value={bgCheckData.country}
                    editable={false}
                    className="flex-1 font-comfortaa text-lg text-black"
                  />
                </View>
              </View>

              {/* Zip Code Input */}
              <View className="mb-6">
                <Text className="text-sm font-comfortaa-bold text-gray-700 mb-2">
                  Zip Code *
                </Text>
                <TextInput
                  value={bgCheckData.zip}
                  onChangeText={(text) =>
                    setBgCheckData({ ...bgCheckData, zip: text })
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 bg-white font-comfortaa text-lg text-black"
                  placeholder="Enter your zip code"
                  placeholderTextColor="#000000"
                  keyboardType="numeric"
                />
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleBackgroundCheckSubmit}
                disabled={isSubmittingBgCheck}
                className={`w-full py-4 rounded-xl items-center ${
                  isSubmittingBgCheck ? "bg-gray-300" : "bg-[#16A34A]"
                }`}
              >
                {isSubmittingBgCheck ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-comfortaa-bold text-lg">
                    Submit Background Check
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Back to Dashboard */}
            <TouchableOpacity
              onPress={() => router.back()}
              className="mt-4 py-3 px-6"
            >
              <Text className="text-[#71727A] font-comfortaa text-center">
                Back to Payment
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // If not paid, show payment form
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-4">
        {/* Header */}
        <View className="flex-row items-center justify-between mt-4 mb-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 rounded-full bg-gray-100"
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text className="text-xl font-comfortaa-bold text-black">
            Background Check
          </Text>
          <View className="w-10" />
        </View>

        {/* Main Content */}
        <View className="items-center mt-8">
          {/* Icon */}
          <View className="w-24 h-24 bg-orange-100 rounded-full items-center justify-center mb-6">
            <Ionicons name="shield-checkmark" size={48} color="#FF932E" />
          </View>

          {/* Title */}
          <Text className="text-2xl font-comfortaa-bold text-black text-center mb-4">
            Background Check Required
          </Text>

          {/* Description */}
          <Text className="text-base font-comfortaa text-[#71727A] text-center leading-6 mb-8 px-4">
            To ensure the safety and security of all children in our community,
            we require a background check before you can create pickup requests.
          </Text>

          {/* Payment Section */}
          <View className="w-full bg-orange-50 p-6 rounded-xl border border-orange-200 mb-6">
            <View className="flex-row items-center mb-4">
              <Ionicons name="card" size={24} color="#FF932E" />
              <Text className="text-lg font-comfortaa-bold text-orange-800 ml-3">
                Background Check Payment
              </Text>
            </View>

            <Text className="text-sm font-comfortaa text-orange-700 mb-4">
              Complete your background check payment to proceed with creating
              pickup requests. All payments are securely processed on our web
              app.
            </Text>

            {/* Payment Info */}
            <View className="mb-4">
              <Text className="text-sm font-comfortaa-bold text-gray-700 mb-2">
                Background Check Fee
              </Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2 bg-gray-100">
                <Text className="text-gray-500 mr-2">$</Text>
                <Text className="flex-1 font-comfortaa text-lg text-gray-700">
                  35.00
                </Text>
              </View>
              <Text className="text-xs text-gray-500 mt-1">
                Standard background check fee: $35.00
              </Text>
            </View>

            {/* Payment Button */}
            <TouchableOpacity
              onPress={handlePayment}
              disabled={isProcessing}
              className={`w-full py-4 rounded-xl items-center ${
                isProcessing ? "bg-gray-300" : "bg-[#FF932E]"
              }`}
            >
              {isProcessing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-comfortaa-bold text-lg">
                  Continue to Web App
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Back to Dashboard */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-4 py-3 px-6"
          >
            <Text className="text-[#71727A] font-comfortaa text-center">
              Back to Dashboard
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
