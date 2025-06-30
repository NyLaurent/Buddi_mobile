# 🔧 Services Directory

This directory contains all business logic and external service integrations for the Pickup Buddi app.

## 📁 Structure

```
services/
├── 🌐 api/                    # API integration layer
│   ├── auth.service.ts        # Authentication
│   ├── pickup.service.ts      # Pickup operations
│   ├── parent.service.ts      # Parent management
│   ├── buddi.service.ts       # Buddi management
│   ├── admin.service.ts       # Admin operations
│   ├── payment.service.ts     # Payment API calls
│   ├── notification.service.ts # Notification API
│   ├── upload.service.ts      # File uploads
│   ├── school.service.ts      # School management
│   ├── analytics.service.ts   # Analytics API
│   ├── config.ts              # Axios configuration
│   ├── endpoints.ts           # API endpoints
│   ├── types.ts               # TypeScript types
│   ├── utils/                 # API utilities
│   └── index.ts               # Main API export
│
├── 💾 storage/                # Local storage management
│   ├── AsyncStorageService.ts # AsyncStorage wrapper
│   ├── SecureStorageService.ts # Secure storage (tokens, sensitive data)
│   ├── CacheService.ts        # Data caching strategies
│   └── index.ts               # Storage exports
│
├── 📍 location/               # GPS & location services
│   ├── LocationService.ts     # GPS tracking, coordinates
│   ├── GeofenceService.ts     # Geofencing for pickup zones
│   ├── DirectionsService.ts   # Navigation & routing
│   └── index.ts               # Location exports
│
├── 🔔 notifications/          # Push & local notifications
│   ├── PushNotificationService.ts # Firebase/Expo push notifications
│   ├── LocalNotificationService.ts # Local notifications
│   ├── NotificationScheduler.ts # Scheduled notifications
│   └── index.ts               # Notification exports
│
├── 💳 payments/               # Payment processing
│   ├── StripeService.ts       # Stripe integration
│   ├── PaymentValidation.ts   # Payment validation
│   ├── WalletService.ts       # Digital wallet management
│   └── index.ts               # Payment exports
│
├── 📱 device/                 # Device-specific services
│   ├── BiometricService.ts    # Face ID, Touch ID, Fingerprint
│   ├── CameraService.ts       # Camera & photo handling
│   ├── ContactsService.ts     # Device contacts access
│   ├── CalendarService.ts     # Calendar integration
│   └── index.ts               # Device exports
│
├── 📊 analytics/              # Analytics & tracking
│   ├── FirebaseAnalytics.ts   # Firebase Analytics
│   ├── CrashReporting.ts      # Crash reporting (Crashlytics)
│   ├── UserTrackingService.ts # User behavior tracking
│   └── index.ts               # Analytics exports
│
├── 🔐 security/               # Security & encryption
│   ├── EncryptionService.ts   # Data encryption/decryption
│   ├── BiometricAuth.ts       # Biometric authentication
│   ├── SessionManager.ts      # Session management
│   └── index.ts               # Security exports
│
├── 📞 communication/          # Real-time communication
│   ├── SocketService.ts       # WebSocket connections
│   ├── ChatService.ts         # In-app messaging
│   ├── VideoCallService.ts    # Video calling (if needed)
│   └── index.ts               # Communication exports
│
├── 🌍 external/               # Third-party integrations
│   ├── GoogleMapsService.ts   # Google Maps integration
│   ├── AppleMapsService.ts    # Apple Maps integration
│   ├── WeatherService.ts      # Weather API
│   ├── SMSService.ts          # SMS sending service
│   └── index.ts               # External exports
│
├── ⚙️ background/             # Background tasks
│   ├── BackgroundSync.ts      # Background data sync
│   ├── LocationTracking.ts    # Background location tracking
│   ├── ScheduledTasks.ts      # Scheduled background tasks
│   └── index.ts               # Background exports
│
└── 🛠️ utils/                  # Shared service utilities
    ├── ServiceRegistry.ts     # Service dependency injection
    ├── ServiceMonitor.ts      # Service health monitoring
    ├── ErrorHandler.ts        # Global error handling
    └── index.ts               # Utils exports
```

## 🎯 Service Categories

### 🌐 **API Services**
- HTTP requests to backend
- Authentication & authorization
- Data fetching & mutations
- Error handling & retries

### 💾 **Storage Services**
- Local data persistence
- Secure token storage
- Data caching strategies
- Offline data management

### 📍 **Location Services**
- GPS tracking & coordinates
- Geofencing for pickup zones
- Navigation & directions
- Location permissions

### 🔔 **Notification Services**
- Push notifications (Firebase/Expo)
- Local scheduled notifications
- In-app notifications
- Notification permissions

### 💳 **Payment Services**
- Payment processing (Stripe, etc.)
- Payment method management
- Transaction validation
- Refund handling

### 📱 **Device Services**
- Camera & photo handling
- Biometric authentication
- Device contacts access
- Calendar integration

### 📊 **Analytics Services**
- User behavior tracking
- Performance monitoring
- Crash reporting
- Custom event tracking

### 🔐 **Security Services**
- Data encryption/decryption
- Secure authentication
- Session management
- Security validations

### 📞 **Communication Services**
- Real-time messaging
- WebSocket connections
- Video calling (if needed)
- Chat management

### 🌍 **External Services**
- Google/Apple Maps integration
- Weather data
- SMS services
- Third-party APIs

### ⚙️ **Background Services**
- Background data sync
- Location tracking
- Scheduled tasks
- Background processing

## 🚀 Usage Example

```typescript
// Import specific services
import { AuthService } from '@/services/api';
import { LocationService } from '@/services/location';
import { PushNotificationService } from '@/services/notifications';
import { AsyncStorageService } from '@/services/storage';

// Use in components or hooks
const userLocation = await LocationService.getCurrentPosition();
const user = await AuthService.getCurrentUser();
await PushNotificationService.schedulePickupReminder(pickup);
```

## 📝 Implementation Notes

- Each service category has its own directory
- Services follow singleton pattern where appropriate
- Proper error handling in all services
- TypeScript interfaces for all service methods
- Comprehensive testing for critical services
- Environment-specific configurations 