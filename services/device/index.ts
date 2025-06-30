/**
 * 📱 Device Services
 * 
 * Device-specific functionality and hardware integration
 */

// Device service exports (to be implemented)
// export { BiometricService } from './BiometricService';
// export { CameraService } from './CameraService';
// export { ContactsService } from './ContactsService';
// export { CalendarService } from './CalendarService';

// Device types and configurations
export interface DeviceConfig {
  enableBiometrics: boolean;
  cameraQuality: number;
  enableContacts: boolean;
}

export const DEVICE_PERMISSIONS = {
  CAMERA: 'camera',
  CONTACTS: 'contacts',
  CALENDAR: 'calendar',
  BIOMETRIC: 'biometric',
} as const;

// Placeholder exports for future implementation
export const DeviceServices = {
  // Will be populated as services are implemented
} as const; 