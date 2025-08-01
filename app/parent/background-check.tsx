import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
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
import PaymentService from "../../services/api/payment.service";

export default function BackgroundCheck() {
  const router = useRouter();
  const { user, parentDetails } = useAuth();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [amount, setAmount] = React.useState("35");
  const [showBgCheckForm, setShowBgCheckForm] = React.useState(false);
  const [isSubmittingBgCheck, setIsSubmittingBgCheck] = React.useState(false);
  const [bgCheckData, setBgCheckData] = React.useState({
    city: "",
    state: "",
    country: "US",
    zip: "",
  });

  // Check if background check is already paid
  const isBgCheckPaid = parentDetails?.isBgCheckPaid || false;

  // Check if we're coming from payment success
  const params = useLocalSearchParams();
  const fromPaymentSuccess = params.fromPaymentSuccess === "true";

  const handlePayment = async () => {
    if (!parentDetails?.id) {
      Alert.alert("Error", "Parent details not found. Please try again.");
      return;
    }

    const paymentAmount = parseFloat(amount);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount.");
      return;
    }

    console.log("[PAYMENT] Starting background check payment...");
    setIsProcessing(true);

    try {
      const response = await PaymentService.payBackgroundCheck({
        parentId: parentDetails.id.toString(),
        amount: paymentAmount,
      });

      if (response.success) {
        if (response.url) {
          console.log("[PAYMENT] Redirecting to Stripe:", response.url);
          // Redirect to Stripe checkout
          try {
            const supported = await Linking.canOpenURL(response.url);
            if (supported) {
              await Linking.openURL(response.url);
              console.log("[PAYMENT] Successfully opened Stripe URL");
              // Show a message that they'll be redirected back after payment
              Alert.alert(
                "Payment Redirect",
                "You're being redirected to complete your payment. After successful payment, you'll be redirected back to the app.",
                [{ text: "OK" }]
              );
            } else {
              console.log("[PAYMENT] Cannot open URL:", response.url);
              Alert.alert(
                "Error",
                "Cannot open payment link. Please try again."
              );
            }
          } catch (error) {
            console.error("[PAYMENT] Error opening URL:", error);
            Alert.alert(
              "Error",
              "Failed to open payment link. Please try again."
            );
          }
        } else {
          console.log("[PAYMENT] No payment URL received");
          Alert.alert("Payment Failed", "No payment URL received.");
        }
      } else {
        console.log("[PAYMENT] Payment failed:", response.message);
        Alert.alert("Payment Failed", response.message);
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
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
      } else {
        Alert.alert("Submission Failed", response.message);
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsSubmittingBgCheck(false);
    }
  };

  // If background check is already paid, show success message
  if (isBgCheckPaid && !fromPaymentSuccess) {
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

          {/* Success Content */}
          <View className="items-center mt-8">
            {/* Success Icon */}
            <View className="w-24 h-24 bg-green-100 rounded-full items-center justify-center mb-6">
              <Ionicons name="checkmark-circle" size={48} color="#16A34A" />
            </View>

            {/* Success Title */}
            <Text className="text-2xl font-comfortaa-bold text-black text-center mb-4">
              Background Check Paid
            </Text>

            {/* Success Description */}
            <Text className="text-base font-comfortaa text-[#71727A] text-center leading-6 mb-8 px-4">
              Your background check payment has been processed successfully. Our
              team will review your application and contact you within 2-3
              business days.
            </Text>

            {/* Back to Dashboard Button */}
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-full py-4 rounded-xl items-center bg-[#FF932E]"
            >
              <Text className="text-white font-comfortaa-bold text-lg">
                Back to Dashboard
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // If background check form should be shown after payment
  if (showBgCheckForm || fromPaymentSuccess) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <ScrollView className="flex-1 px-4">
          {/* Header */}
          <View className="flex-row items-center justify-between mt-4 mb-6">
            <TouchableOpacity
              onPress={() => setShowBgCheckForm(false)}
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
                  className="border border-gray-300 rounded-lg px-3 py-2 bg-white font-comfortaa text-lg"
                  placeholder="Enter your city"
                  placeholderTextColor="#9CA3AF"
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
                  className="border border-gray-300 rounded-lg px-3 py-2 bg-white font-comfortaa text-lg"
                  placeholder="Enter your state"
                  placeholderTextColor="#9CA3AF"
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
                    className="flex-1 font-comfortaa text-lg text-gray-700"
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
                  className="border border-gray-300 rounded-lg px-3 py-2 bg-white font-comfortaa text-lg"
                  placeholder="Enter your zip code"
                  placeholderTextColor="#9CA3AF"
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

            {/* Back to Payment */}
            <TouchableOpacity
              onPress={() => setShowBgCheckForm(false)}
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
              pickup requests.
            </Text>

            {/* Amount Input */}
            <View className="mb-4">
              <Text className="text-sm font-comfortaa-bold text-gray-700 mb-2">
                Amount (USD)
              </Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2 bg-gray-100">
                <Text className="text-gray-500 mr-2">$</Text>
                <TextInput
                  value={amount}
                  editable={false}
                  className="flex-1 font-comfortaa text-lg text-gray-700"
                />
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
                  Pay ${amount} for Background Check
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
