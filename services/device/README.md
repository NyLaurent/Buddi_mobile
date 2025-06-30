# 📱 Device Services

Device-specific functionality and hardware integration services.

## 📁 Structure

```
device/
├── BiometricService.ts       # Face ID, Touch ID, Fingerprint
├── CameraService.ts          # Camera & photo handling
├── ContactsService.ts        # Device contacts access
├── CalendarService.ts        # Calendar integration
└── index.ts                  # Device service exports
```

## 🎯 Services

### **BiometricService**
- Face ID, Touch ID, Fingerprint authentication
- Biometric availability checking
- Secure app unlocking
- Payment confirmation with biometrics

### **CameraService**
- Profile photo capture
- Document scanning (ID verification)
- QR code scanning for quick actions
- Image compression and optimization

### **ContactsService**
- Emergency contact integration
- Parent contact import
- Quick dial functionality
- Contact verification

### **CalendarService**
- Pickup schedule integration
- Calendar event creation
- Reminder synchronization
- Schedule conflict detection

## 📦 Dependencies

```bash
npm install expo-local-authentication    # Biometrics
npm install expo-image-picker           # Camera & gallery
npm install expo-contacts               # Contacts access
npm install expo-calendar               # Calendar integration
npm install expo-barcode-scanner        # QR code scanning
```

## 🚀 Usage

```typescript
import { 
  BiometricService, 
  CameraService, 
  ContactsService, 
  CalendarService 
} from '@/services/device';

// Check biometric authentication
const biometricSupported = await BiometricService.isAvailable();
const authResult = await BiometricService.authenticate('Confirm payment');

// Take profile photo
const photoResult = await CameraService.takePhoto({
  quality: 0.8,
  aspect: [1, 1], // Square aspect ratio
  allowsEditing: true
});

// Get emergency contacts
const contacts = await ContactsService.getContacts({
  fields: ['name', 'phoneNumber']
});

// Add pickup to calendar
await CalendarService.createEvent({
  title: 'Pickup - Emma Johnson',
  startDate: new Date('2024-03-15T15:30:00'),
  endDate: new Date('2024-03-15T16:00:00'),
  location: 'Lincoln Elementary School',
  notes: 'Pickup buddy: John Smith'
});
```

## 🔐 Permissions Required

### **Biometric Authentication**
- Face ID / Touch ID usage description
- Local authentication permissions

### **Camera Access**
- Camera usage description
- Photo library access (for selecting existing photos)

### **Contacts Access**
- Contacts usage description
- Read contacts permission

### **Calendar Access**
- Calendar usage description
- Calendar write permissions

## 📱 Platform Differences

### **iOS Specific:**
- Face ID / Touch ID integration
- Native camera interface
- Contacts framework access
- EventKit for calendar

### **Android Specific:**
- Fingerprint / Face unlock
- Camera2 API integration
- ContactsContract provider
- Calendar provider access

## 🎯 Use Cases

### **For Safety & Security:**
- Biometric app lock for sensitive data
- Emergency contact quick access
- ID verification during onboarding

### **For User Experience:**
- Quick profile photo updates
- Calendar integration for pickup schedules
- Contact import for easy parent setup

### **For Verification:**
- Document scanning for buddy verification
- QR code scanning for quick check-ins
- Photo verification for safety 