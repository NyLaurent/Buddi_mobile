import AdminBottomNav from "@/components/admin/AdminBottomNav";
import { Stack } from "expo-router";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RouteGuard } from "../../components/commons/RouteGuard";
import TeacherBottomNav from "@/components/head-teacher/TeacherBottomNav";

export default function HeadTeacherLayout() {
  const insets = useSafeAreaInsets();

  

  return (
    <RouteGuard allowedRoles={["referralTeacher"]}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="students" />
            <Stack.Screen name="search" />
            <Stack.Screen name="requests" />
            <Stack.Screen name="school" />
            
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
          <TeacherBottomNav />
        </View>
      </View>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { flex: 1 },
});
