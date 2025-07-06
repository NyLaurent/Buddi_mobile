import BuddiBottomNav from "@/components/buddi/BuddiBottomNav";
import { Stack } from "expo-router";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RouteGuard } from "../../components/commons/RouteGuard";

export default function BuddiLayout() {
  const insets = useSafeAreaInsets();

  return (
    <RouteGuard allowedRoles={["buddi"]}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="schedule" />
            <Stack.Screen name="messages" />
            <Stack.Screen name="profile" />
            <Stack.Screen name="settings" />
            <Stack.Screen name="pickup/[id]" />
            <Stack.Screen name="timesheet/index" />
            <Stack.Screen name="timesheet/[id]/index" />
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
          <BuddiBottomNav />
        </View>
      </View>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },
  content: { 
    flex: 1 
  },
});
