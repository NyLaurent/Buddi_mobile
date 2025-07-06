import ParentBottomNav from "@/components/parent/ParentBottomNav";
import { Stack, usePathname } from "expo-router";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RouteGuard } from "../../components/commons/RouteGuard";

export default function ParentLayout() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  // Only show the navbar if not on the request-buddi page
  const showNav = pathname !== "/parent/request-buddi";

  return (
    <RouteGuard allowedRoles={["parent"]} requireApproval={false}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Stack 
            screenOptions={{ 
              headerShown: false,
              animation: "slide_from_right"
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="schedule" />
            <Stack.Screen name="my-buddi" />
            <Stack.Screen name="payments" />
            <Stack.Screen name="callup-review" />
            <Stack.Screen name="rank-buddies" />
            <Stack.Screen name="request-buddi" />
          </Stack>
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
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { flex: 1 },
});
