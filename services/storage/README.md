# 💾 Storage Services

Local data storage and management services for the Pickup Buddi app.

## 📁 Structure

```
storage/
├── AsyncStorageService.ts    # AsyncStorage wrapper with error handling
├── SecureStorageService.ts   # Secure storage for tokens & sensitive data
├── CacheService.ts           # Data caching strategies & TTL management
└── index.ts                  # Storage service exports
```

## 🎯 Services

### **AsyncStorageService**

- Wrapper around React Native AsyncStorage
- JSON serialization/deserialization
- Error handling and fallbacks
- Batch operations for performance

### **SecureStorageService**

- Secure storage for sensitive data (tokens, passwords)
- Platform-specific secure storage (Keychain/Keystore)
- Encryption for extra security
- Biometric protection integration

### **CacheService**

- Memory and disk caching strategies
- TTL (Time To Live) management
- Cache invalidation policies
- Storage optimization

## 📦 Dependencies

```bash
npm install @react-native-async-storage/async-storage
npm install react-native-keychain
npm install @react-native-mmkv/mmkv  # Optional: for faster storage
```

## 🚀 Usage

```typescript
import {
  AsyncStorageService,
  SecureStorageService,
  CacheService,
} from "@/services/storage";

// Store user preferences
await AsyncStorageService.setItem("userPreferences", { theme: "dark" });

// Store secure tokens
await SecureStorageService.setSecureItem("accessToken", token);

// Cache API responses
await CacheService.set("parents-list", parentsData, { ttl: 300 }); // 5 min TTL
```
