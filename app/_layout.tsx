import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TextInput, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider, useAuth } from "../context/AuthContext";
import "../global.css";
import { loadFonts } from "../utils/fonts";

// Set global default colors to ensure visibility on all devices/themes
const DEFAULT_TEXT_COLOR = "#23272F"; // Dark color for text visibility
const DEFAULT_PLACEHOLDER_COLOR = "#8B8B8B"; // Gray color for placeholders

// Override Text component with default color
(Text as any).defaultProps = {
  style: { color: DEFAULT_TEXT_COLOR },
};

// Override TextInput component with default colors
(TextInput as any).defaultProps = {
  style: { color: DEFAULT_TEXT_COLOR },
  placeholderTextColor: DEFAULT_PLACEHOLDER_COLOR,
};

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const RootLayoutNav = () => {
  const { isLoading } = useAuth();

  // Show loading screen while auth is initializing
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FF932E",
        }}
      >
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="role-select" />
      <Stack.Screen name="buddi" options={{ headerShown: false }} />
      <Stack.Screen name="teacher" options={{ headerShown: false }} />
      <Stack.Screen name="parent" options={{ headerShown: false }} />
      <Stack.Screen name="admin" options={{ headerShown: false }} />
      <Stack.Screen name="super-admin" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
    </Stack>
  );
};

const RootLayout = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await loadFonts();
      } catch (e) {
        console.warn(e);
      } finally {
        setFontsLoaded(true);
        // Hide the native splash screen
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!fontsLoaded) {
    return null; // Show native splash screen while fonts are loading
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
