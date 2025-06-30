/**
 * 💾 Storage Services
 * 
 * Local data storage and management
 */

// Storage service exports (to be implemented)
// export { AsyncStorageService } from './AsyncStorageService';
// export { SecureStorageService } from './SecureStorageService';
// export { CacheService } from './CacheService';

// Storage types and configurations
export interface StorageConfig {
  enableEncryption?: boolean;
  cacheTimeout?: number;
  maxCacheSize?: number;
}

export const STORAGE_KEYS = {
  USER_TOKEN: 'user_token',
  USER_PROFILE: 'user_profile',
  PICKUP_CACHE: 'pickup_cache',
  APP_SETTINGS: 'app_settings',
} as const;

// Placeholder exports for future implementation
export const StorageServices = {
  // Will be populated as services are implemented
} as const; 