import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

// Temporary debug function - remove this in production
const clearAllStorageForTesting = async () => {
  try {
    console.log("🧹 Clearing all storage for testing...");
    const keys = await AsyncStorage.getAllKeys();
    console.log("🧹 Found keys:", keys);
    await AsyncStorage.multiRemove(keys);
    console.log("🧹 All storage cleared!");
  } catch (error) {
    console.error("🧹 Error clearing storage:", error);
  }
};

const Index = () => {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(
    null
  );
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const { user, isLoading, getInitialRoute } = useAuth();

  useEffect(() => {
    checkOnboardingStatus();

    // Temporary: Uncomment this line to clear all storage for testing
    // clearAllStorageForTesting();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      console.log("🔍 Checking onboarding status...");
      const seen = await AsyncStorage.getItem("onboarding_seen");
      console.log("🔍 onboarding_seen value:", seen);
      setHasSeenOnboarding(seen === "true");
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      setHasSeenOnboarding(false);
    } finally {
      setOnboardingChecked(true);
      console.log("🔍 Onboarding check completed");
    }
  };

  // Debug logging
  console.log("🔍 Index render state:", {
    hasSeenOnboarding,
    onboardingChecked,
    isLoading,
    user: !!user,
  });

  // Show loading while checking onboarding status or auth is loading
  if (!onboardingChecked || isLoading) {
    console.log("🔍 Showing loading state...");
    return null; // Or a loading component
  }

  // First time user - show onboarding
  if (!hasSeenOnboarding) {
    console.log("🔍 Redirecting to onboarding...");
    return <Redirect href="/onboarding" />;
  }

  // User has seen onboarding - handle auth flow
  if (!user) {
    console.log("🔍 No user, redirecting to role-select...");
    // Not authenticated - go to role selection for signup or login
    return <Redirect href="/role-select" />;
  }

  // User is authenticated - redirect to appropriate route based on their status
  console.log("🔍 User authenticated, getting initial route...");
  const targetRoute = getInitialRoute();
  console.log("🔍 Target route:", targetRoute);
  return <Redirect href={targetRoute as any} />;
};

export default Index;
