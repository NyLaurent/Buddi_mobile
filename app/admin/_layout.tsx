import AdminBottomNav from "@/components/admin/AdminBottomNav";
import { Stack, usePathname } from "expo-router";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RouteGuard } from "../../components/commons/RouteGuard";

export default function AdminLayout() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <RouteGuard allowedRoles={["admin", "minorAdmin"]}>
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
          <AdminBottomNav />
        </View>
      </View>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { flex: 1 },
});
