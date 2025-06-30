# Context Directory

This directory contains React Context providers for global state management.

## Structure

```
context/
├── AuthContext.tsx        # Authentication state
├── UserContext.tsx        # User profile state
├── PickupContext.tsx      # Pickup state management
├── NotificationContext.tsx # Notification state
├── ThemeContext.tsx       # App theme state
├── LocationContext.tsx    # Location/GPS state
└── providers/
    ├── AppProvider.tsx    # Main app provider wrapper
    └── index.ts           # Export all providers
```

## Purpose

- **AuthContext**: User authentication status, login/logout
- **UserContext**: Current user data, profile management
- **PickupContext**: Active pickups, requests state
- **NotificationContext**: Push notifications, in-app notifications
- **ThemeContext**: Dark/light theme, color schemes
- **LocationContext**: GPS tracking, location permissions
- **AppProvider**: Combines all contexts in one wrapper
