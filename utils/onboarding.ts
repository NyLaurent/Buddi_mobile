import AsyncStorage from "@react-native-async-storage/async-storage";

export interface OnboardingState {
  hasSeenOnboarding: boolean;
  onboardingCompletedAt?: string;
  roleSelected?: string;
  onboardingVersion?: string;
}

const ONBOARDING_STORAGE_KEY = "onboarding_seen";
const ONBOARDING_STATE_KEY = "onboarding_state";
const ONBOARDING_VERSION = "1.0.0";

export class OnboardingManager {
  /**
   * Check if user has seen onboarding
   */
  static async hasSeenOnboarding(): Promise<boolean> {
    try {
      const seen = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
      return seen === "true";
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      return false;
    }
  }

  /**
   * Mark onboarding as seen
   */
  static async markOnboardingSeen(): Promise<void> {
    try {
      await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
      
      // Also save detailed onboarding state
      const state: OnboardingState = {
        hasSeenOnboarding: true,
        onboardingCompletedAt: new Date().toISOString(),
        onboardingVersion: ONBOARDING_VERSION,
      };
      
      await AsyncStorage.setItem(ONBOARDING_STATE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Error marking onboarding as seen:", error);
      throw error;
    }
  }

  /**
   * Get complete onboarding state
   */
  static async getOnboardingState(): Promise<OnboardingState> {
    try {
      const stateString = await AsyncStorage.getItem(ONBOARDING_STATE_KEY);
      if (stateString) {
        return JSON.parse(stateString);
      }
      
      // Fallback to legacy check
      const hasSeen = await this.hasSeenOnboarding();
      return {
        hasSeenOnboarding: hasSeen,
        onboardingVersion: ONBOARDING_VERSION,
      };
    } catch (error) {
      console.error("Error getting onboarding state:", error);
      return {
        hasSeenOnboarding: false,
        onboardingVersion: ONBOARDING_VERSION,
      };
    }
  }

  /**
   * Save role selection
   */
  static async saveRoleSelection(role: string): Promise<void> {
    try {
      const currentState = await this.getOnboardingState();
      const updatedState: OnboardingState = {
        ...currentState,
        roleSelected: role,
      };
      
      await AsyncStorage.setItem(ONBOARDING_STATE_KEY, JSON.stringify(updatedState));
    } catch (error) {
      console.error("Error saving role selection:", error);
      throw error;
    }
  }

  /**
   * Reset onboarding state (for testing or user preference)
   */
  static async resetOnboarding(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([ONBOARDING_STORAGE_KEY, ONBOARDING_STATE_KEY]);
    } catch (error) {
      console.error("Error resetting onboarding:", error);
      throw error;
    }
  }

  /**
   * Check if onboarding needs to be shown again (e.g., after app update)
   */
  static async shouldShowOnboarding(): Promise<boolean> {
    try {
      const state = await this.getOnboardingState();
      
      // If no onboarding state exists, show onboarding
      if (!state.hasSeenOnboarding) {
        return true;
      }
      
      // If onboarding version is different, show onboarding again
      if (state.onboardingVersion !== ONBOARDING_VERSION) {
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error checking if onboarding should be shown:", error);
      return true; // Show onboarding on error
    }
  }

  /**
   * Get onboarding analytics data
   */
  static async getOnboardingAnalytics(): Promise<{
    hasSeenOnboarding: boolean;
    onboardingCompletedAt?: string;
    roleSelected?: string;
    onboardingVersion?: string;
    daysSinceOnboarding?: number;
  }> {
    try {
      const state = await this.getOnboardingState();
      
      let daysSinceOnboarding: number | undefined;
      if (state.onboardingCompletedAt) {
        const completedDate = new Date(state.onboardingCompletedAt);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - completedDate.getTime());
        daysSinceOnboarding = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }
      
      return {
        ...state,
        daysSinceOnboarding,
      };
    } catch (error) {
      console.error("Error getting onboarding analytics:", error);
      return {
        hasSeenOnboarding: false,
        onboardingVersion: ONBOARDING_VERSION,
      };
    }
  }
}

export default OnboardingManager; 