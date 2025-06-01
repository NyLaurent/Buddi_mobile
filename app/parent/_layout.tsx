import ParentBottomNav from "@/components/parent/ParentBottomNav";
import { Stack } from "expo-router";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ParentLayout() {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
      <View
        style={{
          paddingBottom: Math.max(insets.bottom, 16),
          height: Platform.select({
            ios: 80 + insets.bottom,
            android: 65 + insets.bottom,
          }),
          backgroundColor: "#fff",
        }}
      >
        <ParentBottomNav />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { flex: 1 },
});
