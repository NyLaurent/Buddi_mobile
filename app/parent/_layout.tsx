import ParentBottomNav from "@/components/parent/ParentBottomNav";
import { Stack, usePathname } from "expo-router";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ParentLayout() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  // Only show the navbar if not on the request-buddi page
  const showNav = pathname !== "/parent/request-buddi";

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
      {showNav && (
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { flex: 1 },
});
