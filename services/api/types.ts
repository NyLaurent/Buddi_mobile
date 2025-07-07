// ===============================
// Common Types
// ===============================
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ===============================
// Auth Types
// ===============================
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    userId: string;
    email: string;
    password: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    homeAddress: string;
    role: 'buddi' | 'parent' | 'admin' | 'minorAdmin' | 'head-teacher';
    createdAt: string;
    updatedAt: string;
  };
  token: string;
}

export interface BuddiRegistrationRequest {
  email: string;
  password: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  homeAddress: string;
  currentSchool: string;
  AreaOfStudy: string;
  Gpa: string;
  teacherEmail: string;
  teacherPhoneNumber: string;
  customReferral?: string;
  referralOccupation?: string;
  resume?: File;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dob: string;
  profilePicture?: File;
}

export interface BuddiRegistrationResponse {
  message: string;
  user: User;
  buddi: {
    id: number;
    status: 'RegisterApprovalPending';
    totalEarnings: number;
    currentSchool: string;
    AreaOfStudy: string;
    Gpa: string;
    teacherEmail: string;
    teacherPhoneNumber: string;
    customReferral?: string;
    referralOccupation?: string;
    resume?: string;
    gender: string;
    dob: string;
    userId: string;
    updatedAt: string;
    createdAt: string;
    profilePicture?: string;
    rating?: number;
  }
}

export interface ParentRegistrationRequest {
  email: string;
  password: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  homeAddress: string;
  childrenCount: number;
  children: {
    name: string;
    age: number;
    school: string;
  }[];
  paymentMethod: 'card' | 'paypal' | 'apple_pay';
  cardDetails?: {
    cardNumber: string;
    expiry: string;
    cvv: string;
  } | null;
  profilePicture?: File;
}

export interface ParentRegistrationResponse {
  message: string;
  user: {
    userId: string;
    email: string;
    password: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    homeAddress: string;
    role: string;
    updatedAt: string;
    createdAt: string;
  };
  parent: {
    id: number;
    userId: string;
    childrenCount: number;
    children: {
      name: string;
      age: number;
      school: string;
    }[];
    approvalStage: string;
    paymentMethod: string;
    bgcStatus: string;
    updatedAt: string;
    createdAt: string;
    cardDetails: any;
    checkrCandidateId: any;
    checkrReportId: any;
  };
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  profileImage?: string;
  userType: 'parent' | 'buddi' | 'teacher';
}

export interface AuthResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface User extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage?: string;
  dateOfBirth: string;
  gender: string;
  userType: 'parent' | 'buddi' | 'teacher' | 'admin' | 'minorAdmin';
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  emailVerified: boolean;
  phoneVerified: boolean;
}

// ===============================
// Parent Types
// ===============================
export interface Parent extends User {
  children: Child[];
  currentBuddi?: Buddi;
  totalPickups: number;
  joinDate: string;
  paymentStatus: 'active' | 'pending' | 'overdue';
}

export interface Child extends BaseEntity {
  name: string;
  age: number;
  school: School;
  grade?: string;
  parentId: string;
  buddyId?: string;
  pickupSchedule?: PickupSchedule[];
}

// ===============================
// Buddi Types
// ===============================
export interface Buddi extends User {
  academicDetails: AcademicDetails;
  resume?: DocumentFile;
  references: Reference[];
  rating: number;
  totalPickups: number;
  availability: Availability[];
  backgroundCheckStatus: 'pending' | 'approved' | 'rejected';
  applicationStatus: 'pending' | 'approved' | 'rejected' | 'waitlisted';
}

export interface AcademicDetails {
  currentSchool: string;
  major: string;
  gpa?: number;
  graduationYear: string;
}

export interface Reference {
  name: string;
  email: string;
  phone: string;
  relationship: string;
  institution?: string;
}

export interface DocumentFile {
  id: string;
  filename: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
}

// ===============================
// School Types
// ===============================
export interface School extends BaseEntity {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  contactEmail: string;
  contactPhone: string;
}

// ===============================
// Pickup Types
// ===============================
export interface PickupRequest extends BaseEntity {
  parentId: string;
  childId: string;
  buddyId?: string;
  requestedDate: string;
  requestedTime: string;
  pickupLocation: string;
  dropoffLocation: string;
  notes?: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'normal' | 'high' | 'urgent';
}

export interface PickupAssignment {
  requestId: string;
  buddyId: string;
  assignedAt: string;
  assignedBy: string;
}

export interface TodaysPickup extends BaseEntity {
  request: PickupRequest;
  parent: Parent;
  child: Child;
  buddy?: Buddi;
  school: School;
  scheduledTime: string;
  actualPickupTime?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  trackingData?: {
    currentLocation?: {
      latitude: number;
      longitude: number;
    };
    estimatedArrival?: string;
  };
}

export interface PickupSchedule extends BaseEntity {
  childId: string;
  buddyId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  pickupTime: string;
  pickupLocation: string;
  dropoffLocation: string;
  isActive: boolean;
}

// ===============================
// Availability Types
// ===============================
export interface Availability extends BaseEntity {
  buddyId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

// ===============================
// Payment Types
// ===============================
export interface Payment extends BaseEntity {
  parentId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'bank_transfer' | 'wallet';
  transactionId?: string;
  description: string;
  dueDate?: string;
  paidAt?: string;
}

// ===============================
// Admin Types
// ===============================
export interface AdminStats {
  totalParents: number;
  totalBuddies: number;
  totalChildren: number;
  activePickups: number;
  pendingRequests: number;
  revenue: number;
}

export interface BackupRequest extends BaseEntity {
  parentId: string;
  childId: string;
  originalBuddyId: string;
  requestedDate: string;
  reason: string;
  status: 'pending' | 'resolved' | 'cancelled';
  assignedBuddyId?: string;
  resolvedAt?: string;
  timeRemaining?: string;
}

// ===============================
// Notification Types
// ===============================
export interface Notification extends BaseEntity {
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  isRead: boolean;
  data?: Record<string, any>;
}

// ===============================
// API Request/Response Types
// ===============================
export interface CreatePickupRequest {
  childId: string;
  requestedDate: string;
  requestedTime: string;
  pickupLocation: string;
  dropoffLocation: string;
  notes?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
}

export interface AssignPickupRequest {
  requestId: string;
  buddyId: string;
}

export interface UpdatePickupStatusRequest {
  requestId: string;
  status: 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface ReferralTeacherRegistrationRequest {
  email: string;
  password: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  homeAddress: string;
  schoolName: string;
  schoolEmail: string;
  position: string;
}

export interface ReferralTeacherRegistrationResponse {
  user: {
    userId: string;
    email: string;
    password: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    homeAddress: string;
    role: string;
    updatedAt: string;
    createdAt: string;
  };
  teacher: {
    approvedReferrals: number;
    recommendingFiles: any[];
    id: number;
    schoolName: string;
    schoolEmail: string;
    position: string;
    userId: string;
    updatedAt: string;
    createdAt: string;
  };
} 