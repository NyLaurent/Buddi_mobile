# 🔔 Notification Services

Push notifications, local notifications, and scheduled alerts for pickup operations.

## 📁 Structure

```
notifications/
├── PushNotificationService.ts     # Firebase/Expo push notifications
├── LocalNotificationService.ts    # Local scheduled notifications
├── NotificationScheduler.ts       # Advanced notification scheduling
└── index.ts                       # Notification service exports
```

## 🎯 Services

### **PushNotificationService**
- Firebase Cloud Messaging (FCM) integration
- Expo push notifications
- Device token management
- Push notification handling & routing

### **LocalNotificationService**
- Local notifications for reminders
- Pickup time alerts
- Offline notifications
- Custom notification sounds & icons

### **NotificationScheduler**
- Schedule pickup reminders
- Recurring notification patterns
- Smart notification timing
- Notification frequency management

## 📦 Dependencies

```bash
npm install expo-notifications
npm install @react-native-firebase/messaging  # For FCM
npm install expo-device
```

## 🚀 Usage

```typescript
import { 
  PushNotificationService, 
  LocalNotificationService, 
  NotificationScheduler 
} from '@/services/notifications';

// Initialize push notifications
await PushNotificationService.requestPermissions();
const deviceToken = await PushNotificationService.getDeviceToken();

// Schedule pickup reminder
await NotificationScheduler.schedulePickupReminder({
  pickupId: 'pickup-123',
  parentName: 'Sarah Johnson',
  childName: 'Emma',
  scheduledTime: new Date('2024-03-15T15:30:00'),
  reminderMinutes: 15 // 15 minutes before pickup
});

// Send immediate local notification
await LocalNotificationService.showNotification({
  title: 'Buddy Arrived!',
  body: 'Your buddy has arrived at the pickup location.',
  data: { pickupId: 'pickup-123' }
});
```

## 📱 Notification Types

### **For Parents:**
- Buddy assignment confirmation
- Pickup time reminders (15min, 5min before)
- Buddy arrival notifications
- Pickup completion confirmations
- Payment reminders

### **For Buddies:**
- New pickup assignment
- Pickup location reminders
- Parent contact information
- Schedule changes
- Earnings notifications

### **For Admins:**
- Backup request alerts
- System status updates
- Revenue reports
- User activity summaries

## 🔐 Permissions

Required permissions in app.json:
```json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#FF932E",
          "sounds": ["./assets/sounds/pickup-alert.wav"]
        }
      ]
    ]
  }
}
``` 