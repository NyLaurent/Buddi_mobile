import ParentBottomNav from "@/components/parent/ParentBottomNav";
import { Stack } from "expo-router";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RouteGuard } from "../../components/commons/RouteGuard";

export default function ParentLayout() {
  const insets = useSafeAreaInsets();

  return (
    <RouteGuard allowedRoles={["parent"]} requireApproval={false}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="call-page" />
            <Stack.Screen name="callup-review" />
            <Stack.Screen name="rank-buddies" />
            <Stack.Screen name="my-buddi" />
            <Stack.Screen name="schedule" />
            <Stack.Screen name="timesheets" />
            <Stack.Screen name="timesheet-details/[id]" />
            <Stack.Screen name="payments" />
            <Stack.Screen name="settings" />
            <Stack.Screen name="buddi-recommendations/[callId]" />
            <Stack.Screen name="buddi-profile/[buddiId]" />
            <Stack.Screen name="call-details/[callId]" />
          </Stack>
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
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { flex: 1 },
});
