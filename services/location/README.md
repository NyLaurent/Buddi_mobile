# 📍 Location Services

GPS tracking, geofencing, and navigation services for pickup operations.

## 📁 Structure

```
location/
├── LocationService.ts        # GPS tracking & coordinates
├── GeofenceService.ts        # Geofencing for pickup zones
├── DirectionsService.ts      # Navigation & routing
└── index.ts                  # Location service exports
```

## 🎯 Services

### **LocationService**

- Real-time GPS tracking
- Location permissions management
- Background location tracking
- Accuracy and battery optimization

### **GeofenceService**

- Create pickup zone boundaries
- Entry/exit notifications
- Zone-based automation
- Proximity alerts for buddies

### **DirectionsService**

- Route calculation between points
- Real-time navigation
- ETA calculations
- Traffic-aware routing

## 📦 Dependencies

```bash
npm install expo-location
npm install react-native-geolocation-service
npm install @react-native-google-maps/maps  # For directions
```

## 🚀 Usage

```typescript
import {
  LocationService,
  GeofenceService,
  DirectionsService,
} from "@/services/location";

// Get current location
const location = await LocationService.getCurrentPosition();

// Set up geofence for school
await GeofenceService.addGeofence("school-zone", {
  latitude: 40.7128,
  longitude: -74.006,
  radius: 100, // meters
});

// Get directions to pickup location
const route = await DirectionsService.getDirections(
  currentLocation,
  pickupLocation
);
```

## 🔐 Permissions

Required permissions in app.json:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Allow $(PRODUCT_NAME) to use your location for pickup tracking."
        }
      ]
    ]
  }
}
```
