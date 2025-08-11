import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export interface NotificationData {
  title: string;
  body: string;
  data?: Record<string, any>;
  sound?: 'default' | boolean;
  priority?: 'default' | 'normal' | 'high';
  badge?: number;
}

export class NotificationService {
  private static instance: NotificationService;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Check if a notification is trip-related
   */
  private isTripNotification(notification: NotificationData): boolean {
    const tripTypes = [
      'trip_started', 'child_picked_up', 'trip_completed', 'trip_cancelled',
      'pickup_started', 'buddi_assigned', 'coverage_request_sent'
    ];
    
    return notification.data?.type && tripTypes.includes(notification.data.type);
  }

  /**
   * Send an immediate system notification
   */
  async sendImmediateNotification(notification: NotificationData): Promise<string> {
    try {
      // Use "trips" channel for trip-related notifications, "default" for others
      const channelId = this.isTripNotification(notification) ? 'trips' : 'default';
      
      const notificationId = await Notifications.scheduleNotificationAsync({
        // Specify the channel for Android
        ...(Platform.OS === 'android' && { android: { channelId } }),
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: notification.sound || 'default',
          priority: notification.priority || 'high',
          badge: notification.badge,
          // Ensure notification is visible but dismissible
          autoDismiss: true,
          sticky: false,
        },
        trigger: null, // null trigger means immediate
      });

      console.log('🔔 System notification sent:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('❌ Failed to send notification:', error);
      throw error;
    }
  }

  /**
   * Schedule a notification for later
   */
  async scheduleNotification(
    notification: NotificationData,
    trigger: Notifications.NotificationTriggerInput
  ): Promise<string> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: notification.sound || 'default',
          priority: notification.priority || 'normal',
          badge: notification.badge,
        },
        trigger,
      });

      console.log('🔔 Notification scheduled:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('❌ Failed to schedule notification:', error);
      throw error;
    }
  }

  /**
   * Send success notification for signup completion
   */
  async sendSignupSuccessNotification(userType: 'buddi' | 'parent' | 'head-teacher', firstName: string): Promise<string> {
    const messages = {
      buddi: {
        title: '🎉 Welcome to PickupBuddi!',
        body: `Hi ${firstName}! Your Buddi account has been created successfully. We're excited to have you on board!`
      },
      parent: {
        title: '🎉 Welcome to PickupBuddi!',
        body: `Hi ${firstName}! Your parent account has been created successfully. You can now start requesting pickups for your kids.`
      },
      'head-teacher': {
        title: '🎉 Welcome to PickupBuddi!',
        body: `Hi ${firstName}! Your head teacher account has been created successfully. You can now manage your school's pickup requests.`
      }
    };

    const message = messages[userType];
    return this.sendImmediateNotification({
      title: message.title,
      body: message.body,
      data: { type: 'signup_success', userType, firstName },
      priority: 'high',
      sound: 'default'
    });
  }

  /**
   * Send notification for profile video submission
   */
  async sendProfileVideoSubmittedNotification(firstName: string): Promise<string> {
    return this.sendImmediateNotification({
      title: '📹 Profile Video Submitted!',
      body: `Hi ${firstName}! Your profile video has been submitted successfully. We'll review it and get back to you soon.`,
      data: { type: 'profile_video_submitted', firstName },
      priority: 'high',
      sound: 'default'
    });
  }

  /**
   * Send notification for recording submission
   */
  async sendRecordingSubmittedNotification(firstName: string): Promise<string> {
    return this.sendImmediateNotification({
      title: '🎤 Interview Recording Submitted!',
      body: `Hi ${firstName}! Your interview recording has been submitted successfully. We're processing it and will notify you once approved.`,
      data: { type: 'recording_submitted', firstName },
      priority: 'high',
      sound: 'default'
    });
  }

  /**
   * Send notification for background check submission
   */
  async sendBackgroundCheckSubmittedNotification(firstName: string): Promise<string> {
    return this.sendImmediateNotification({
      title: '🔍 Background Check Submitted!',
      body: `Hi ${firstName}! Your background check information has been submitted successfully. Our team will review it within 2-3 business days.`,
      data: { type: 'background_check_submitted', firstName },
      priority: 'high',
      sound: 'default'
    });
  }

  /**
   * Send notification for pickup request success
   */
  async sendPickupRequestSuccessNotification(kidName: string, pickupTime: string): Promise<string> {
    return this.sendImmediateNotification({
      title: '🚗 Pickup Request Confirmed!',
      body: `Your pickup request for ${kidName} at ${pickupTime} has been confirmed. A Buddi will be assigned soon!`,
      data: { type: 'pickup_request_success', kidName, pickupTime },
      priority: 'high',
      sound: 'default'
    });
  }

  /**
   * Send notification for trip completion
   */
  async sendTripCompletedNotification(kidName: string, fare: number, duration: string): Promise<string> {
    return this.sendImmediateNotification({
      title: '✅ Trip Completed Successfully!',
      body: `Your trip with ${kidName} has been completed! Fare`,
      data: { type: 'trip_completed', kidName, fare, duration },
      priority: 'high',
      sound: 'default'
    });
  }

  /**
   * Send notification for payment success
   */
  async sendPaymentSuccessNotification(amount: number, description: string): Promise<string> {
    return this.sendImmediateNotification({
      title: '💳 Payment Successful!',
      body: `Payment of $${amount.toFixed(2)} for ${description} has been processed successfully.`,
      data: { type: 'payment_success', amount, description },
      priority: 'high',
      sound: 'default'
    });
  }

  /**
   * Send notification for token purchase
   */
  async sendTokenPurchaseSuccessNotification(amount: number, tokens: number): Promise<string> {
    return this.sendImmediateNotification({
      title: '🪙 Tokens Purchased Successfully!',
      body: `You've successfully purchased ${tokens} tokens for $${amount.toFixed(2)}. Your tokens are now available for use!`,
      data: { type: 'token_purchase_success', amount, tokens },
      priority: 'high',
      sound: 'default'
    });
  }

  /**
   * Send notification for account approval
   */
  async sendAccountApprovedNotification(firstName: string, userType: string): Promise<string> {
    return this.sendImmediateNotification({
      title: '🎉 Account Approved!',
      body: `Congratulations ${firstName}! Your ${userType} account has been approved. You can now access all features!`,
      data: { type: 'account_approved', firstName, userType },
      priority: 'high',
      sound: 'default'
    });
  }

  /**
   * Send notification for new pickup assignment
   */
  async sendNewPickupAssignmentNotification(kidName: string, pickupTime: string, fromLocation: string): Promise<string> {
    return this.sendImmediateNotification({
      title: '🚗 New Pickup Assignment!',
      body: `You've been assigned to pick up ${kidName} at ${pickupTime} from ${fromLocation}. Please confirm and start your trip!`,
      data: { type: 'new_pickup_assignment', kidName, pickupTime, fromLocation },
      priority: 'high',
      sound: 'default'
    });
  }

  /**
   * Send notification for coverage request
   */
  async sendCoverageRequestNotification(kidName: string, pickupTime: string): Promise<string> {
    return this.sendImmediateNotification({
      title: '🆘 Coverage Request',
      body: `Coverage needed for ${kidName} at ${pickupTime}. Please check the app for details and respond if you can help.`,
      data: { type: 'coverage_request', kidName, pickupTime },
      priority: 'high',
      sound: 'default'
    });
  }

  /**
   * Cancel a scheduled notification
   */
  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log('🔔 Notification cancelled:', notificationId);
    } catch (error) {
      console.error('❌ Failed to cancel notification:', error);
      throw error;
    }
  }

  /**
   * Cancel all scheduled notifications
   */
  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('🔔 All notifications cancelled');
    } catch (error) {
      console.error('❌ Failed to cancel all notifications:', error);
      throw error;
    }
  }

  /**
   * Get all scheduled notifications
   */
  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      return notifications;
    } catch (error) {
      console.error('❌ Failed to get scheduled notifications:', error);
      throw error;
    }
  }

  /**
   * Clear all current notifications from the notification tray
   * This removes notifications that are currently displayed
   */
  async clearAllCurrentNotifications(): Promise<void> {
    try {
      // On Android, we can clear the notification badge
      if (Platform.OS === 'android') {
        await Notifications.setBadgeCountAsync(0);
      }
      
      // Cancel all scheduled notifications
      await this.cancelAllNotifications();
      
      console.log('🔔 All current notifications cleared');
    } catch (error) {
      console.error('❌ Failed to clear current notifications:', error);
      throw error;
    }
  }
}

export default NotificationService.getInstance();
