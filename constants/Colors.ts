/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

// Global default colors for visibility across all devices
export const GlobalColors = {
  defaultText: '#23272F',     // Dark color for text visibility
  placeholder: '#8B8B8B',     // Gray color for placeholders
  primary: '#FF932E',         // App primary color
  background: '#FFFFFF',      // Default background
  error: '#EF4444',          // Error color
  success: '#22C55E',        // Success color
  warning: '#F59E0B',        // Warning color
  border: '#E5E7EB',         // Border color
};

export const Colors = {
  light: {
    text: GlobalColors.defaultText,
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: GlobalColors.defaultText, // Use same text color for consistency
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

// Utility function to get safe text color
export const getSafeTextColor = (customColor?: string) => {
  return customColor || GlobalColors.defaultText;
};

// Utility function to get safe placeholder color
export const getSafePlaceholderColor = (customColor?: string) => {
  return customColor || GlobalColors.placeholder;
};
