import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const Index = () => {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);
  const { user, isLoading, getInitialRoute } = useAuth();

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const seen = await AsyncStorage.getItem('onboarding_seen');
      setHasSeenOnboarding(seen === 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setHasSeenOnboarding(false);
    }
  };

  // Show loading while checking onboarding status or auth is loading
  if (hasSeenOnboarding === null || isLoading) {
    return null; // Or a loading component
  }

  // First time user - show onboarding
  if (!hasSeenOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  // User has seen onboarding - handle auth flow
  if (!user) {
    // Not authenticated - go to role selection for signup or login
    return <Redirect href="/role-select" />;
  }

  // User is authenticated - redirect to appropriate route based on their status
  const targetRoute = getInitialRoute();
  return <Redirect href={targetRoute as any} />;
};

export default Index;
