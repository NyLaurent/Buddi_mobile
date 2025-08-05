import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import OnboardingManager from "../utils/onboarding";

// Enhanced loading component with better UX
const LoadingScreen = ({ message = "Loading..." }: { message?: string }) => (
  <View className="flex-1 bg-white justify-center items-center">
    <View className="items-center">
      <ActivityIndicator size="large" color="#FF932E" />
      <Text className="mt-4 text-lg font-comfortaa-medium text-[#71727A]">
        {message}
      </Text>
    </View>
  </View>
);

const Index = () => {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(
    null
  );
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoading, getInitialRoute } = useAuth();

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      setError(null);

      const shouldShow = await OnboardingManager.shouldShowOnboarding();
      setHasSeenOnboarding(!shouldShow);
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      setError("Failed to check onboarding status");
      // Default to showing onboarding on error
      setHasSeenOnboarding(false);
    } finally {
      setOnboardingChecked(true);
    }
  };

  // Show loading while checking onboarding status or auth is loading
  if (!onboardingChecked || isLoading) {
    return <LoadingScreen message="Setting up your experience..." />;
  }

  // Show error state if there was an issue
  if (error) {
    return (
      <View className="flex-1 bg-white justify-center items-center px-6">
        <Text className="text-lg font-comfortaa-medium text-red-500 text-center mb-4">
          {error}
        </Text>
      </View>
    );
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
