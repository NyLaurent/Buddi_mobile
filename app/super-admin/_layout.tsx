import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RouteGuard } from "../../components/commons/RouteGuard";

export default function SuperAdminLayout() {
  const insets = useSafeAreaInsets();

  return (
    <RouteGuard allowedRoles={["superAdmin"]}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          >
            <Stack.Screen name="index" />
            {/* Add more super-admin screens here as needed */}
          </Stack>
        </View>
      </View>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { flex: 1 },
});
