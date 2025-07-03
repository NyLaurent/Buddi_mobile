// ===============================
// API Endpoints Configuration
// ===============================

// Auth Endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REGISTER_BUDDI: '/auth/register/buddi',
  REGISTER_PARENT: '/auth/register/parent',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',
  RESEND_VERIFICATION: '/auth/resend-verification',
  PROFILE: '/auth/profile',
} as const;

// User Endpoints
export const USER_ENDPOINTS = {
  PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/profile',
  CHANGE_PASSWORD: '/user/change-password',
  UPLOAD_AVATAR: '/user/avatar',
  DELETE_ACCOUNT: '/user/delete',
} as const;

// Parent Endpoints
export const PARENT_ENDPOINTS = {
  LIST: '/parents',
  DETAILS: (id: string) => `/parents/${id}`,
  CREATE: '/parents',
  UPDATE: (id: string) => `/parents/${id}`,
  DELETE: (id: string) => `/parents/${id}`,
  CHILDREN: (id: string) => `/parents/${id}/children`,
  ADD_CHILD: (id: string) => `/parents/${id}/children`,
  UPDATE_CHILD: (parentId: string, childId: string) => `/parents/${parentId}/children/${childId}`,
  DELETE_CHILD: (parentId: string, childId: string) => `/parents/${parentId}/children/${childId}`,
} as const;

// Buddi Endpoints
export const BUDDI_ENDPOINTS = {
  LIST: '/buddies',
  DETAILS: (id: string) => `/buddies/${id}`,
  CREATE: '/buddies',
  UPDATE: (id: string) => `/buddies/${id}`,
  DELETE: (id: string) => `/buddies/${id}`,
  AVAILABILITY: (id: string) => `/buddies/${id}/availability`,
  UPDATE_AVAILABILITY: (id: string) => `/buddies/${id}/availability`,
  APPLICATIONS: '/buddies/applications',
  APPROVE_APPLICATION: (id: string) => `/buddies/${id}/approve`,
  REJECT_APPLICATION: (id: string) => `/buddies/${id}/reject`,
  BACKGROUND_CHECK: (id: string) => `/buddies/${id}/background-check`,
} as const;

// Pickup Endpoints  
export const PICKUP_ENDPOINTS = {
  // Main pickup operations
  CREATE_REQUEST: '/request',
  ASSIGN_BUDDY: '/assign',
  TODAYS_PICKUPS: (buddyId: string) => `/todays-pickups/${buddyId}`,
  
  // Extended pickup management
  LIST_REQUESTS: '/pickups/requests',
  REQUEST_DETAILS: (id: string) => `/pickups/requests/${id}`,
  UPDATE_REQUEST: (id: string) => `/pickups/requests/${id}`,
  CANCEL_REQUEST: (id: string) => `/pickups/requests/${id}/cancel`,
  
  // Pickup status and tracking
  UPDATE_STATUS: (id: string) => `/pickups/${id}/status`,
  TRACK_PICKUP: (id: string) => `/pickups/${id}/track`,
  UPDATE_LOCATION: (id: string) => `/pickups/${id}/location`,
  
  // Schedules
  SCHEDULES: '/pickups/schedules',
  CREATE_SCHEDULE: '/pickups/schedules',
  UPDATE_SCHEDULE: (id: string) => `/pickups/schedules/${id}`,
  DELETE_SCHEDULE: (id: string) => `/pickups/schedules/${id}`,
} as const;

// School Endpoints
export const SCHOOL_ENDPOINTS = {
  LIST: '/schools',
  DETAILS: (id: string) => `/schools/${id}`,
  CREATE: '/schools',
  UPDATE: (id: string) => `/schools/${id}`,
  DELETE: (id: string) => `/schools/${id}`,
  SEARCH: '/schools/search',
} as const;

// Admin Endpoints
export const ADMIN_ENDPOINTS = {
  DASHBOARD_STATS: '/admin/dashboard',
  USER_MANAGEMENT: '/admin/users',
  USER_DETAILS: (id: string) => `/admin/users/${id}`,
  SUSPEND_USER: (id: string) => `/admin/users/${id}/suspend`,
  ACTIVATE_USER: (id: string) => `/admin/users/${id}/activate`,
  
  // Backup requests
  BACKUP_REQUESTS: '/admin/backup-requests',
  BACKUP_REQUEST_DETAILS: (id: string) => `/admin/backup-requests/${id}`,
  RESOLVE_BACKUP: (id: string) => `/admin/backup-requests/${id}/resolve`,
  
  // Reports
  REPORTS: '/admin/reports',
  EXPORT_DATA: '/admin/export',
  
  // Settings
  SETTINGS: '/admin/settings',
  UPDATE_SETTINGS: '/admin/settings',
} as const;

// Payment Endpoints
export const PAYMENT_ENDPOINTS = {
  LIST: '/payments',
  DETAILS: (id: string) => `/payments/${id}`,
  CREATE: '/payments',
  PROCESS: (id: string) => `/payments/${id}/process`,
  REFUND: (id: string) => `/payments/${id}/refund`,
  HISTORY: '/payments/history',
  METHODS: '/payments/methods',
  ADD_METHOD: '/payments/methods',
  DELETE_METHOD: (id: string) => `/payments/methods/${id}`,
} as const;

// Notification Endpoints
export const NOTIFICATION_ENDPOINTS = {
  LIST: '/notifications',
  UNREAD_COUNT: '/notifications/unread-count',
  MARK_READ: (id: string) => `/notifications/${id}/read`,
  MARK_ALL_READ: '/notifications/mark-all-read',
  DELETE: (id: string) => `/notifications/${id}`,
  SETTINGS: '/notifications/settings',
  UPDATE_SETTINGS: '/notifications/settings',
} as const;

// File Upload Endpoints
export const UPLOAD_ENDPOINTS = {
  AVATAR: '/upload/avatar',
  DOCUMENT: '/upload/document',
  RESUME: '/upload/resume',
  BULK: '/upload/bulk',
} as const;

// Analytics Endpoints
export const ANALYTICS_ENDPOINTS = {
  OVERVIEW: '/analytics/overview',
  USER_ACTIVITY: '/analytics/user-activity',
  PICKUP_STATS: '/analytics/pickup-stats',
  REVENUE: '/analytics/revenue',
  PERFORMANCE: '/analytics/performance',
} as const;

// Chat/Messaging Endpoints
export const MESSAGING_ENDPOINTS = {
  CONVERSATIONS: '/messages/conversations',
  CONVERSATION_DETAILS: (id: string) => `/messages/conversations/${id}`,
  SEND_MESSAGE: '/messages/send',
  MARK_READ: (conversationId: string) => `/messages/conversations/${conversationId}/read`,
} as const;

// Search Endpoints
export const SEARCH_ENDPOINTS = {
  GLOBAL: '/search',
  USERS: '/search/users',
  PICKUPS: '/search/pickups',
  SCHOOLS: '/search/schools',
} as const; 