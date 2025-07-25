import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BuyTokensSuccess() {
  const router = useRouter();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Ionicons
        name="checkmark-circle"
        size={80}
        color="#34C759"
        style={{ marginBottom: 24 }}
      />
      <Text
        style={{
          fontFamily: "Comfortaa-Bold",
          fontSize: 28,
          color: "#232B3A",
          marginBottom: 12,
        }}
      >
        Purchase Successful!
      </Text>
      <Text
        style={{
          fontFamily: "Comfortaa-Regular",
          fontSize: 17,
          color: "#71727A",
          marginBottom: 32,
          textAlign: "center",
          maxWidth: 320,
        }}
      >
        Your tokens have been added to your account. Thank you for your
        purchase!
      </Text>
      <TouchableOpacity
        style={{
          backgroundColor: "#FF932E",
          borderRadius: 999,
          paddingVertical: 14,
          paddingHorizontal: 38,
        }}
        onPress={() => router.replace("/parent")}
      >
        <Text
          style={{ color: "#fff", fontFamily: "Comfortaa-Bold", fontSize: 17 }}
        >
          Go to Dashboard
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
