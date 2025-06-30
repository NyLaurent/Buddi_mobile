/**
 * 📍 Location Services
 * 
 * GPS tracking, geofencing, and navigation
 */

// Location service exports (to be implemented)
// export { LocationService } from './LocationService';
// export { GeofenceService } from './GeofenceService';
// export { DirectionsService } from './DirectionsService';

// Location types and configurations
export interface LocationConfig {
  accuracy: 'low' | 'balanced' | 'high';
  timeout: number;
  enableBackground: boolean;
}

export const LOCATION_PERMISSIONS = {
  FOREGROUND: 'foreground',
  BACKGROUND: 'background',
} as const;

// Placeholder exports for future implementation
export const LocationServices = {
  // Will be populated as services are implemented
} as const; 