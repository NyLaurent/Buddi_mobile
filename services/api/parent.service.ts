import { authorizedApi } from './config';
import { PARENT_ENDPOINTS } from './endpoints';

export interface ParentChild {
  name: string;
  age: number;
  school: string;
}

export interface ParentUser {
  userId: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  homeAddress: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface ParentRecord {
  id: string;
  childrenCount: number;
  children: ParentChild[];
  approvalStage: string;
  paymentMethod: string;
  cardDetails: any;
  checkrCandidateId: string | null;
  checkrReportId: string | null;
  bgcStatus: string;
  createdAt: string;
  updatedAt: string;
  userId: string | null;
  User: ParentUser | null;
}

export interface ParentListResponse {
  message: string;
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  data: ParentRecord[];
}

// Pickup Request Types (from API response example and types.ts)
export interface ParentPickupRequest {
  id: number;
  parentId: string;
  childId: string;
  description: string;
  availableDays: string[];
  pickupTime: string;
  kidsCount: number;
  fromZone: string;
  toZone: string;
  status: string;
  matchedBuddiId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Pickup {
  id: number;
  parentId: string;
  buddiId: number;
  childId: string;
  fromLocation: string;
  toLocation: string;
  status: 'pending' | 'enRoute' | 'pickedUp' | 'completed';
  pickupTime: string | null;
  dropoffTime: string | null;
  tripStartTime: string | null;
  fare: number | null;
  distance: number | null;
  duration: string | null;
  buddiRequestId: number;
  createdAt: string;
  updatedAt: string;
  Child: {
    id: string;
    parentId: string;
    name: string;
    age: number;
    schoolName: string;
    pickupAddress: string;
    createdAt: string;
    updatedAt: string;
  };
  BuddiRequest: {
    id: number;
    parentId: string;
    childId: string;
    description: string;
    availableDays: string[];
    pickupTime: string;
    kidsCount: number;
    fromZone: string;
    toZone: string;
    status: string;
    matchedBuddiId: number;
    createdAt: string;
    updatedAt: string;
  };
}

export interface DailyPickup {
  id: number;
  timesheetId: number;
  day: string;
  pickups: number;
  fare: number;
  createdAt: string;
  updatedAt: string;
}

export interface Timesheet {
  id: number;
  buddiId: number;
  parentId: string;
  buddiRequestId: number;
  weekStart: string;
  weekEnd: string;
  availableDays: string[];
  totalHours: number;
  totalPickups: number;
  totalEarnings: number;
  isPaid: boolean;
  isFull: boolean;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  dailyPickups: DailyPickup[];
}

export interface TimesheetResponse {
  total: number;
  page: number;
  limit: number;
  data: Timesheet[];
}

export interface ParentPickupRequestsResponse {
  message: string;
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  data: ParentPickupRequest[];
}

export interface Application {
  id: number;
  buddiRequestId: number;
  buddiId: number;
  status: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  Buddi: {
    id: number;
    currentSchool: string;
    AreaOfStudy: string;
    Gpa: string;
    status: string;
    teacherEmail: string;
    dob: string;
    gender: string;
    teacherPhoneNumber: string;
    customReferral: string;
    referralOccupation: string;
    resume: string;
    profilePicture: string | null;
    rating: number | null;
    isInterviewVideoSubmitted: boolean;
    totalEarnings: number;
    createdAt: string;
    updatedAt: string;
    userId: string;
    User?: {
      userId: string;
      email: string;
      password: string;
      phoneNumber: string;
      firstName: string;
      lastName: string;
      homeAddress: string;
      role: string;
      createdAt: string;
      updatedAt: string;
    };
  };
}

export interface BuddiRecommendation {
  id: number;
  parentId: string;
  buddiIds: number[];
  recommendedBy: string;
  reason: string;
  callId: number;
  createdAt: string;
  updatedAt: string;
  buddis: {
    id: number;
    currentSchool: string;
    AreaOfStudy: string;
    Gpa: string;
    status: string;
    teacherEmail: string;
    dob: string;
    gender: string;
    teacherPhoneNumber: string;
    customReferral: string;
    referralOccupation: string;
    resume: string;
    profilePicture: string | null;
    rating: number | null;
    isInterviewVideoSubmitted: boolean;
    totalEarnings: number;
    createdAt: string;
    updatedAt: string;
    userId: string;
    User?: {
      userId: string;
      email: string;
      password: string;
      phoneNumber: string;
      firstName: string;
      lastName: string;
      homeAddress: string;
      role: string;
      createdAt: string;
      updatedAt: string;
    };
  }[];
}

export interface BuddiRecommendationsResponse {
  data: BuddiRecommendation[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Propose up to 3 buddis for a parent call
 * @param parentId - The parent request ID
 * @param callId - The call/request ID
 * @param buddiIds - Array of 3 buddi IDs (as strings)
 * @param recommendedBy - The admin user ID recommending
 * @param reason - Reason for recommendation
 */
async function proposeBuddiRecommendations({
  parentId,
  callId,
  buddiIds,
  recommendedBy,
  reason,
}: {
  parentId: string;
  callId: string;
  buddiIds: string[];
  recommendedBy: string;
  reason: string;
}): Promise<any> {
  const response = await authorizedApi.post(
    "/coverage/buddi-recommendations/parent",
    {
      parentId,
      callId,
      buddiIds,
      recommendedBy,
      reason,
    }
  );
  return response.data;
}

/**
 * Create a new pickup request (parent initiates a trip)
 * @param payload - { parentId, buddiId, childId, fromLocation, toLocation }
 */
async function createPickupRequest(payload: {
  parentId: number;
  buddiId: number;
  childId: string;
  fromLocation: string;
  toLocation: string;
  buddiRequestId: number; // or string, depending on your backend
  callId: number;      
}): Promise<any> {
  try {
    const response = await authorizedApi.post("/parent/request", payload);
    return response.data;
  } catch (err: any) {
    // Re-throw the error with proper structure for handling in the UI
    if (err?.response?.status === 400) {
      throw {
        response: {
          status: 400,
          data: {
            error: err.response.data.error || "Bad request"
          }
        },
        message: err.response.data.error || "Bad request"
      };
    }
    throw err;
  }
}

const ParentService = {
  async getAllParents(page: number, limit: number): Promise<ParentListResponse> {
    const response = await authorizedApi.get(PARENT_ENDPOINTS.LIST + `/all?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getMyPickupRequests(parentId: string): Promise<ParentPickupRequestsResponse> {
    const response = await authorizedApi.get(`/parent/buddi-requests/my-requests/${parentId}`);
    return response.data;
  },

  async getAllPickups(parentId: string): Promise<{ pickups: any[] }> {
    try {
      const response = await authorizedApi.get(`/pickups/${parentId}/allPickups`);
      return response.data;
    } catch (err: any) {
      let message = 'Failed to fetch pickups.';
      if (err?.response?.data?.message) {
        message = err.response.data.message;
      } else if (err?.message) {
        if (err.message.includes('Network')) {
          message = 'Network error. Please check your connection and try again.';
        } else if (err.message.includes('timeout')) {
          message = 'Request timed out. Please try again.';
        } else {
          message = err.message;
        }
      } else if (typeof err === 'string') {
        message = err;
      }
      throw new Error(message);
    }
  },

  async getTimesheets(parentId: string, buddiId?: number, page: number = 1, limit: number = 10): Promise<TimesheetResponse> {
    console.log("🎯 getTimesheets method called");
    console.log("📋 Input parameters:", { parentId, buddiId, page, limit });
    
    try {
      const buddiParam = buddiId ? `/buddi/${buddiId}` : '';
      const url = `/timesheets/parent/${parentId}${buddiParam}?page=${page}&limit=${limit}`;
      
      console.log("🚀 Making API call to:", url);
      console.log("📋 Parameters:", { parentId, buddiId, page, limit });
      
      const response = await authorizedApi.get(url);
      
      console.log("📡 Raw API response:", response);
      console.log("📊 Response data:", response.data);
      
      return response.data;
    } catch (err: any) {
      console.error("💥 API Error:", err);
      console.error("💥 Error response:", err.response);
      
      let message = 'Failed to fetch timesheets.';
      if (err?.response?.data?.message) {
        message = err.response.data.message;
      } else if (err?.message) {
        if (err.message.includes('Network')) {
          message = 'Network error. Please check your connection and try again.';
        } else if (err.message.includes('timeout')) {
          message = 'Request timed out. Please try again.';
        } else {
          message = err.message;
        }
      } else if (typeof err === 'string') {
        message = err;
      }
      throw new Error(message);
    }
  },

  async getAllParentRequests(page: number = 1, limit: number = 10): Promise<ParentPickupRequestsResponse> {
    try {
      const response = await authorizedApi.get(`/parent/requests/all?page=${page}&limit=${limit}`);
      return response.data;
    } catch (err: any) {
      let message = 'Failed to fetch parent requests.';
      if (err?.response?.data?.message) {
        message = err.response.data.message;
      } else if (err?.message) {
        if (err.message.includes('Network')) {
          message = 'Network error. Please check your connection and try again.';
        } else if (err.message.includes('timeout')) {
          message = 'Request timed out. Please try again.';
        } else {
          message = err.message;
        }
      } else if (typeof err === 'string') {
        message = err;
      }
      throw new Error(message);
    }
  },

  async getParentRequestDetails(requestId: number): Promise<{ message: string; data: ParentPickupRequest }> {
    try {
      const response = await authorizedApi.get(`/coverage/buddi-request/${requestId}`);
      return response.data;
    } catch (err: any) {
      let message = 'Failed to fetch request details.';
      if (err?.response?.data?.message) {
        message = err.response.data.message;
      } else if (err?.message) {
        if (err.message.includes('Network')) {
          message = 'Network error. Please check your connection and try again.';
        } else if (err.message.includes('timeout')) {
          message = 'Request timed out. Please try again.';
        } else {
          message = err.message;
        }
      } else if (typeof err === 'string') {
        message = err;
      }
      throw new Error(message);
    }
  },

  async getRequestApplications(requestId: number, page: number = 1, limit: number = 5): Promise<{
    data: Application[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    try {
      const response = await authorizedApi.get(`/application/request/${requestId}?page=${page}&limit=${limit}`);
      return response.data;
    } catch (err: any) {
      let message = 'Failed to fetch applications.';
      if (err?.response?.data?.message) {
        message = err.response.data.message;
      } else if (err?.message) {
        if (err.message.includes('Network')) {
          message = 'Network error. Please check your connection and try again.';
        } else if (err.message.includes('timeout')) {
          message = 'Request timed out. Please try again.';
        } else {
          message = err.message;
        }
      } else if (typeof err === 'string') {
        message = err;
      }
      throw new Error(message);
    }
  },

  async getParentInfo(parentId: string): Promise<{ message: string; data: ParentRecord }> {
    try {
      const response = await authorizedApi.get(`/parent/info/${parentId}`);
      return response.data;
    } catch (err: any) {
      let message = 'Failed to fetch parent information.';
      if (err?.response?.data?.message) {
        message = err.response.data.message;
      } else if (err?.message) {
        if (err.message.includes('Network')) {
          message = 'Network error. Please check your connection and try again.';
        } else if (err.message.includes('timeout')) {
          message = 'Request timed out. Please try again.';
        } else {
          message = err.message;
        }
      } else if (typeof err === 'string') {
        message = err;
      }
      throw new Error(message);
    }
  },

  async getBuddiRecommendations(parentId: string, callId: number): Promise<BuddiRecommendationsResponse> {
    try {
      const response = await authorizedApi.get(`/coverage/getParentBuddiRecommendation/parent?parentId=${parentId}&callId=${callId}`);
      return response.data;
    } catch (err: any) {
      let message = 'Failed to fetch buddi recommendations.';
      if (err?.response?.data?.message) {
        message = err.response.data.message;
      } else if (err?.message) {
        if (err.message.includes('Network')) {
          message = 'Network error. Please check your connection and try again.';
        } else if (err.message.includes('timeout')) {
          message = 'Request timed out. Please try again.';
        } else {
          message = err.message;
        }
      } else if (typeof err === 'string') {
        message = err;
      }
      throw new Error(message);
    }
  },

  async rankBuddi(parentId: string, buddiId: number, rating: number, comment: string): Promise<any> {
    try {
      const response = await authorizedApi.post('/rankings/rank', {
        parentId,
        buddiId,
        rating,
        comment,
      });
      return response.data;
    } catch (err: any) {
      let message = 'Failed to rank buddi.';
      if (err?.response?.data?.message) {
        message = err.response.data.message;
      } else if (err?.message) {
        if (err.message.includes('Network')) {
          message = 'Network error. Please check your connection and try again.';
        } else if (err.message.includes('timeout')) {
          message = 'Request timed out. Please try again.';
        } else {
          message = err.message;
        }
      } else if (typeof err === 'string') {
        message = err;
      }
      throw new Error(message);
    }
  },

  async getBuddiRankings(parentId: string): Promise<any> {
    try {
      const response = await authorizedApi.get(`/rankings/my-rankings/${parentId}`);
      return response.data;
    } catch (err: any) {
      let message = 'Failed to fetch buddi rankings.';
      if (err?.response?.data?.message) {
        message = err.response.data.message;
      } else if (err?.message) {
        if (err.message.includes('Network')) {
          message = 'Network error. Please check your connection and try again.';
        } else if (err.message.includes('timeout')) {
          message = 'Request timed out. Please try again.';
        } else {
          message = err.message;
        }
      } else if (typeof err === 'string') {
        message = err;
      }
      throw new Error(message);
    }
  },

  async getTopRankedBuddi(parentId: string): Promise<any> {
    try {
      const response = await authorizedApi.get(`/rankings/top-ranked/${parentId}`);
      return response.data;
    } catch (err: any) {
      let message = 'Failed to fetch top ranked buddi.';
      if (err?.response?.data?.message) {
        message = err.response.data.message;
      } else if (err?.message) {
        if (err.message.includes('Network')) {
          message = 'Network error. Please check your connection and try again.';
        } else if (err.message.includes('timeout')) {
          message = 'Request timed out. Please try again.';
        } else {
          message = err.message;
        }
      } else if (typeof err === 'string') {
        message = err;
      }
      throw new Error(message);
    }
  },

  proposeBuddiRecommendations,
  createPickupRequest,
};

export default ParentService; 