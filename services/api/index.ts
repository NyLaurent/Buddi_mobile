// ===============================
// API Services Index
// Clean & Organized Structure
// ===============================

// Core API Configuration
export { STORAGE_KEYS, authorizedApi, unauthorizedApi } from './config';
export type { ApiError } from './config';

// API Endpoints
export * from './endpoints';

// Type Definitions
export * from './types';

// ===============================
// Services (to be implemented during integration)
// ===============================
// export { default as AuthService } from './auth.service';
// export { default as PickupService } from './pickup.service';
export { default as BuddiService } from './buddi.service';
export { default as ParentService } from './parent.service';
export type { ParentListResponse, ParentRecord } from './parent.service';
// export { default as AdminService } from './admin.service';
// export { default as PaymentService } from './payment.service';
// export { default as NotificationService } from './notification.service';
// export { default as UploadService } from './upload.service';
// export { default as SchoolService } from './school.service';
// export { default as AnalyticsService } from './analytics.service';
export { default as ChildrenService } from './children.service';
export { default as CoverageService } from './coverage.service';

// ===============================
// Utility Functions (to be implemented)
// ===============================
// export * from './utils/api.utils';
// export * from './utils/error.utils';
// export * from './utils/storage.utils';
// export * from './utils/validation.utils';
// export * from './utils/transform.utils';

// ===============================
// Ready for Integration
// ===============================
// When you're ready to start integration:
// 1. Uncomment the service exports above
// 2. Implement individual service files directly in this directory
// 3. Add proper error handling
// 4. Set up loading states
// 5. Configure proper TypeScript types 