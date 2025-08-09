import { StyleSheet } from 'react-native';
import { GlobalColors } from '../constants/Colors';

// Global styles for consistent visibility across the app
export const globalStyles = StyleSheet.create({
  // Text styles
  safeText: {
    color: GlobalColors.defaultText,
  },
  
  safeTextBold: {
    color: GlobalColors.defaultText,
    fontWeight: 'bold',
  },
  
  safeTextMedium: {
    color: GlobalColors.defaultText,
    fontWeight: '500',
  },
  
  // Input styles
  safeTextInput: {
    color: GlobalColors.defaultText,
    borderColor: GlobalColors.border,
    backgroundColor: GlobalColors.background,
  },
  
  // Common text sizes with safe colors
  heading1: {
    color: GlobalColors.defaultText,
    fontSize: 24,
    fontWeight: 'bold',
  },
  
  heading2: {
    color: GlobalColors.defaultText,
    fontSize: 20,
    fontWeight: '600',
  },
  
  heading3: {
    color: GlobalColors.defaultText,
    fontSize: 18,
    fontWeight: '600',
  },
  
  bodyText: {
    color: GlobalColors.defaultText,
    fontSize: 16,
  },
  
  bodyTextSmall: {
    color: GlobalColors.defaultText,
    fontSize: 14,
  },
  
  captionText: {
    color: GlobalColors.defaultText,
    fontSize: 12,
  },
  
  // Button text styles
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  secondaryButtonText: {
    color: GlobalColors.defaultText,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  // Error and status text
  errorText: {
    color: GlobalColors.error,
    fontSize: 14,
  },
  
  successText: {
    color: GlobalColors.success,
    fontSize: 14,
  },
  
  warningText: {
    color: GlobalColors.warning,
    fontSize: 14,
  },
  
  // Placeholder and disabled text
  placeholderText: {
    color: GlobalColors.placeholder,
    fontSize: 16,
  },
  
  disabledText: {
    color: GlobalColors.placeholder,
    fontSize: 16,
  },
  
  // Link text
  linkText: {
    color: GlobalColors.primary,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

// Helper functions for dynamic styling
export const getTextStyle = (size?: number, color?: string, weight?: string) => ({
  color: color || GlobalColors.defaultText,
  fontSize: size || 16,
  fontWeight: weight || 'normal',
});

export const getInputStyle = (borderColor?: string, backgroundColor?: string) => ({
  color: GlobalColors.defaultText,
  borderColor: borderColor || GlobalColors.border,
  backgroundColor: backgroundColor || GlobalColors.background,
});

// Common style combinations
export const commonStyles = {
  // Container styles with safe defaults
  container: {
    backgroundColor: GlobalColors.background,
  },
  
  // Card styles
  card: {
    backgroundColor: GlobalColors.background,
    borderColor: GlobalColors.border,
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
  },
  
  // Input container
  inputContainer: {
    backgroundColor: GlobalColors.background,
    borderColor: GlobalColors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
};

export default globalStyles;
