/**
 * 🔔 Notification Services
 * 
 * Push notifications, local notifications, and scheduled alerts
 */

// Notification service exports (to be implemented)
// export { PushNotificationService } from './PushNotificationService';
// export { LocalNotificationService } from './LocalNotificationService';
// export { NotificationScheduler } from './NotificationScheduler';

// Notification types and configurations
export interface NotificationConfig {
  enablePush: boolean;
  enableLocal: boolean;
  defaultSound: string;
}

export const NOTIFICATION_TYPES = {
  PICKUP_REMINDER: 'pickup_reminder',
  BUDDY_ARRIVAL: 'buddy_arrival',
  PAYMENT_DUE: 'payment_due',
} as const;

// Placeholder exports for future implementation
export const NotificationServices = {
  // Will be populated as services are implemented
} as const; 