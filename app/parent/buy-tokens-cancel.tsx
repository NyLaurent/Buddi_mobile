import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BuyTokensCancel() {
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
        name="close-circle"
        size={80}
        color="#FF3B30"
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
        Purchase Cancelled
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
        Your token purchase was cancelled. No changes have been made to your
        account.
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
