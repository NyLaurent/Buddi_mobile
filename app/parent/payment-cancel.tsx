import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PaymentCancel() {
  const router = useRouter();

  const handleBackToBackgroundCheck = () => {
    router.replace("/parent/background-check" as any);
  };

  const handleBackToDashboard = () => {
    router.replace("/parent" as any);
  };

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
            Payment Cancelled
          </Text>
          <View className="w-10" />
        </View>

        {/* Cancel Content */}
        <View className="items-center mt-8">
          {/* Cancel Icon */}
          <View className="w-24 h-24 bg-orange-100 rounded-full items-center justify-center mb-6">
            <Ionicons name="close-circle" size={48} color="#FF932E" />
          </View>

          {/* Cancel Title */}
          <Text className="text-3xl font-comfortaa-bold text-orange-600 text-center mb-4">
            Payment Cancelled
          </Text>

          {/* Cancel Description */}
          <Text className="text-xl font-comfortaa text-gray-700 text-center leading-6 mb-6 px-4 max-w-md">
            Your background check payment was cancelled. You can try again
            anytime.
          </Text>

          {/* Info Box */}
          <View className="w-full bg-orange-50 p-6 rounded-xl border border-orange-200 mb-8">
            <Text className="font-comfortaa-bold text-orange-800 mb-3 text-center text-lg">
              What you can do:
            </Text>
            <View className="space-y-2">
              <Text className="text-sm font-comfortaa text-orange-700">
                • Try the payment again when you&apos;re ready
              </Text>
              <Text className="text-sm font-comfortaa text-orange-700">
                • Contact support if you need assistance
              </Text>
              <Text className="text-sm font-comfortaa text-orange-700">
                • Complete your background check later
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="w-full space-y-3">
            <TouchableOpacity
              onPress={handleBackToBackgroundCheck}
              className="w-full py-4 rounded-xl items-center bg-[#FF932E]"
            >
              <Text className="text-white font-comfortaa-bold text-lg">
                Try Payment Again
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
