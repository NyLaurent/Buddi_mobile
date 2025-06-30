# API Hooks Directory

This directory contains React hooks for API operations and state management.

## Structure

```
hooks/api/
├── useAuth.ts           # Authentication hooks
├── usePickup.ts         # Pickup operations hooks
├── useParent.ts         # Parent management hooks
├── useBuddi.ts          # Buddi management hooks
├── useAdmin.ts          # Admin operations hooks
├── usePayment.ts        # Payment hooks
├── useNotification.ts   # Notification hooks
├── useUpload.ts         # File upload hooks
└── common/
    ├── useApiQuery.ts   # Generic API query hook
    ├── useApiMutation.ts # Generic API mutation hook
    └── useApiState.ts   # API state management hook
```

## Features

- Loading states management
- Error handling
- Data caching
- Optimistic updates
- Background refetching
- Automatic token refresh
