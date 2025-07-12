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

const ParentService = {
  async getAllParents(page: number, limit: number): Promise<ParentListResponse> {
    const response = await authorizedApi.get(PARENT_ENDPOINTS.LIST + `/all?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getMyPickupRequests(parentId: string): Promise<ParentPickupRequestsResponse> {
    const response = await authorizedApi.get(`/parent/buddi-requests/my-requests/${parentId}`);
    return response.data;
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
  proposeBuddiRecommendations,
};

export default ParentService; 