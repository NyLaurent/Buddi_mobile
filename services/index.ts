/**
 * 🔧 Pickup Buddi Services
 * 
 * Centralized export for all service categories
 */

// 🌐 API Services
export * from './api';

// 💾 Storage Services
export * from './storage';

// 📍 Location Services  
export * from './location';

// 🔔 Notification Services
export * from './notifications';

// 💳 Payment Services
export * from './payments';

// 📱 Device Services
export * from './device';

// Re-export specific services for convenience
export { AuthService } from './api';

// Service configuration
export const SERVICES_CONFIG = {
  API_TIMEOUT: 30000,
  CACHE_TTL: 300, // 5 minutes default
  RETRY_ATTEMPTS: 3,
  DEBUG_MODE: __DEV__,
} as const;

// Service status monitoring
export interface ServiceHealth {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  lastCheck: Date;
  responseTime?: number;
}

// Global service registry (for dependency injection if needed)
export const ServiceRegistry = {
  // Will be populated as services are implemented
} as const; 