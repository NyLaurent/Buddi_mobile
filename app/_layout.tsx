import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, Image, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider, useAuth } from "../context/AuthContext";
import "../global.css";
import { loadFonts } from "../utils/fonts";

// Set default text color to black

// @ts-ignore
Text.defaultProps = Text.defaultProps || {};
// @ts-ignore
Text.defaultProps.style = [{ color: "#23272F" }, Text.defaultProps.style];

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const AnimatedSplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Fade in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Fade out after 2 seconds
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff",
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
      }}
    >
      <Image
        source={require("../assets/images/logo.png")}
        style={{
          width: 200,
          height: 60,
          resizeMode: "contain",
        }}
      />
      <Text
        style={{
          marginTop: 20,
          fontSize: 16,
          color: "#FF932E",
          fontFamily: "Comfortaa-Medium",
        }}
      >
        Loading...
      </Text>
    </Animated.View>
  );
};

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
  const [showSplash, setShowSplash] = useState(true);

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

        // Show our custom splash for a bit longer
        setTimeout(() => {
          setShowSplash(false);
        }, 2800); // Total splash time: 2.8 seconds
      }
    }

    prepare();
  }, []);

  if (!fontsLoaded || showSplash) {
    return <AnimatedSplashScreen />;
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
