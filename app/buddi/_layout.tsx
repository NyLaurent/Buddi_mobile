import BuddiBottomNav from "@/components/buddi/BuddiBottomNav";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RouteGuard } from "../../components/commons/RouteGuard";
import { useAuth } from "../../context/AuthContext";
import AuthService from "../../services/api/auth.service";

export default function BuddiLayout() {
  const insets = useSafeAreaInsets();
  const { buddiDetails, refreshUserData } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function checkProfile() {
      setChecking(true);
      try {
        // Fetch latest profile from backend
        const profile = await AuthService.getProfile();
        const buddi = profile?.user?.Buddi;
        const allowedStatuses = ["referenceApproved", "approved", "verified"];
        if (
          buddi &&
          allowedStatuses.includes(buddi.status) &&
          buddi.isProfileVideoSubmitted === true
        ) {
          if (mounted) setAllowed(true);
        } else {
          if (mounted) setAllowed(false);
          router.replace("/auth/profile-video");
        }
        // Do NOT call refreshUserData here to avoid infinite loops
      } catch (e) {
        if (mounted) setAllowed(false);
        router.replace("/auth/profile-video");
      } finally {
        if (mounted) setChecking(false);
      }
    }
    checkProfile();
    return () => {
      mounted = false;
    };
  }, []);

  if (checking) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" color="#FF932E" />
      </View>
    );
  }
  if (!allowed) return null;

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
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
});
