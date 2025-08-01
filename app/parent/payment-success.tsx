import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { authorizedApi } from "../../services/api/config";

export default function PaymentSuccess() {
  const router = useRouter();
  const { user, parentDetails, refreshUserData } = useAuth();
  const params = useLocalSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<
    "success" | "failed" | "not_paid" | "pending"
  >("pending");
  const [amount, setAmount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get payment session ID from URL params
  const sessionId = params.session_id as string;

  useEffect(() => {
    if (sessionId) {
      verifyPayment();
    } else {
      setError("No session ID in URL.");
      setIsVerifying(false);
      setVerificationStatus("failed");
    }
  }, [sessionId]);

  const verifyPayment = async () => {
    if (!sessionId) {
      setError("No session ID in URL.");
      setIsVerifying(false);
      setVerificationStatus("failed");
      return;
    }

    try {
      console.log(
        "[PAYMENT] Verifying background check payment with session:",
        sessionId
      );

      // Call the background check payment verification endpoint
      const response = await authorizedApi.get(
        `/payments/verifyBgcheckPayment/${sessionId}`
      );

      console.log("[PAYMENT] Verification response:", response.data);

      if (response.data.status === "paid") {
        setVerificationStatus("success");
        setAmount(response.data.amount / 100); // Convert from cents to dollars

        // Refresh user data to get updated isBgCheckPaid status
        await refreshUserData();

        // Show success notification
        Alert.alert(
          "Payment Successful!",
          `Background check payment of $${
            response.data.amount / 100
          } completed successfully.`,
          [{ text: "OK" }]
        );
      } else {
        setVerificationStatus("not_paid");
      }
    } catch (error: any) {
      console.error("[PAYMENT] Payment verification error:", error);
      setError("Error verifying payment.");
      setVerificationStatus("failed");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleContinue = () => {
    // Navigate to background check form with payment success parameter
    router.replace("/parent/background-check?fromPaymentSuccess=true" as any);
  };

  const handleBackToDashboard = () => {
    router.replace("/parent" as any);
  };

  const handleRetry = () => {
    setIsVerifying(true);
    setVerificationStatus("pending");
    setError(null);
    verifyPayment();
  };

  if (isVerifying) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center px-4">
          <View className="w-16 h-16 border-4 border-dashed border-orange-300 rounded-full animate-spin mb-6" />
          <Text className="text-xl font-comfortaa-bold text-black text-center">
            Verifying payment...
          </Text>
          <Text className="text-sm font-comfortaa text-[#71727A] mt-2 text-center">
            Please wait while we confirm your payment with Stripe.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (verificationStatus === "failed") {
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
              Payment Verification
            </Text>
            <View className="w-10" />
          </View>

          {/* Error Content */}
          <View className="items-center mt-8">
            {/* Error Icon */}
            <View className="w-20 h-20 bg-red-100 rounded-full items-center justify-center mb-6">
              <Ionicons name="close-circle" size={48} color="#DC2626" />
            </View>

            {/* Error Title */}
            <Text className="text-3xl font-comfortaa-bold text-red-600 text-center mb-4">
              Payment Error
            </Text>

            {/* Error Description */}
            <Text className="text-xl font-comfortaa text-gray-700 text-center leading-6 mb-6 px-4 max-w-md">
              {error || "We couldn't verify your payment. Please try again."}
            </Text>

            {/* Retry Button */}
            <TouchableOpacity
              onPress={handleRetry}
              className="w-full py-4 rounded-xl items-center bg-[#FF932E] mb-4"
            >
              <Text className="text-white font-comfortaa-bold text-lg">
                Retry Verification
              </Text>
            </TouchableOpacity>

            {/* Back to Background Check */}
            <TouchableOpacity
              onPress={() => router.push("/parent/background-check" as any)}
              className="py-3 px-6"
            >
              <Text className="text-[#71727A] font-comfortaa text-center">
                Back to Background Check
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (verificationStatus === "not_paid") {
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
              Payment Verification
            </Text>
            <View className="w-10" />
          </View>

          {/* Not Paid Content */}
          <View className="items-center mt-8">
            {/* Error Icon */}
            <View className="w-20 h-20 bg-red-100 rounded-full items-center justify-center mb-6">
              <Ionicons name="close-circle" size={48} color="#DC2626" />
            </View>

            {/* Error Title */}
            <Text className="text-3xl font-comfortaa-bold text-red-600 text-center mb-4">
              Payment Not Completed
            </Text>

            {/* Error Description */}
            <Text className="text-xl font-comfortaa text-gray-700 text-center leading-6 mb-6 px-4 max-w-md">
              Your background check payment was not completed. Please try again.
            </Text>

            {/* Back to Background Check */}
            <TouchableOpacity
              onPress={() => router.push("/parent/background-check" as any)}
              className="w-full py-4 rounded-xl items-center bg-[#FF932E] mb-4"
            >
              <Text className="text-white font-comfortaa-bold text-lg">
                Back to Background Check
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-4">
        {/* Header */}
        <View className="flex-row items-center justify-between mt-4 mb-6">
          <View className="w-10" />
          <Text className="text-xl font-comfortaa-bold text-black">
            Payment Successful
          </Text>
          <View className="w-10" />
        </View>

        {/* Success Content */}
        <View className="items-center mt-8">
          {/* Success Icon */}
          <View className="w-24 h-24 bg-green-100 rounded-full items-center justify-center mb-6">
            <Ionicons name="shield-checkmark" size={48} color="#16A34A" />
          </View>

          {/* Success Title */}
          <Text className="text-4xl font-comfortaa-bold text-green-700 text-center mb-4">
            Background Check Payment Successful!
          </Text>

          {/* Success Description */}
          <Text className="text-2xl font-comfortaa text-gray-800 text-center mb-4">
            Thank you for your payment.
          </Text>

          {/* Amount Display */}
          {amount !== null && (
            <Text className="text-lg font-comfortaa text-gray-600 text-center mb-6">
              <Text className="font-comfortaa-bold text-green-700">
                You paid ${amount}
              </Text>{" "}
              for your background check.
            </Text>
          )}

          {/* What happens next */}
          <View className="w-full bg-green-50 p-6 rounded-xl border border-green-200 mb-8">
            <Text className="font-comfortaa-bold text-green-800 mb-3 text-center text-lg">
              What happens next?
            </Text>
            <View className="space-y-2">
              <Text className="text-sm font-comfortaa text-green-700">
                • Your background check will be processed within 3-5 business
                days
              </Text>
              <Text className="text-sm font-comfortaa text-green-700">
                • You&apos;ll receive email notifications at each step
              </Text>
              <Text className="text-sm font-comfortaa text-green-700">
                • Once approved, you can create Buddi requests
              </Text>
              <Text className="text-sm font-comfortaa text-green-700">
                • You&apos;ll be notified via email and SMS when complete
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="w-full space-y-3">
            <TouchableOpacity
              onPress={handleContinue}
              className="w-full py-4 rounded-xl items-center bg-[#FF932E]"
            >
              <Text className="text-white font-comfortaa-bold text-lg">
                Complete Background Check
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleBackToDashboard}
              className="w-full py-4 rounded-xl items-center bg-gray-200"
            >
              <Text className="text-gray-800 font-comfortaa-bold text-lg">
                Back to Home
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
