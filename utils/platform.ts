import { Platform } from 'react-native';

/**
 * Detect the current platform and return the appropriate platform identifier
 * @returns 'web' for web platform, 'mobile' for iOS/Android
 */
export const getPlatform = (): 'web' | 'mobile' => {
  if (Platform.OS === 'web') {
    return 'web';
  }
  return 'mobile';
};

/**
 * Get platform-specific information
 * @returns Object containing platform details
 */
export const getPlatformInfo = () => {
  return {
    platform: getPlatform(),
    os: Platform.OS,
    version: Platform.Version,
    isWeb: Platform.OS === 'web',
    isMobile: Platform.OS === 'ios' || Platform.OS === 'android',
    isIOS: Platform.OS === 'ios',
    isAndroid: Platform.OS === 'android',
  };
}; 