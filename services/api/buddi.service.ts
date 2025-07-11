import { authorizedApi } from './config';
import { BUDDI_ENDPOINTS } from './endpoints';

export interface Buddi {
  id: string;
  name: string;
  email: string;
  totalJobs: number;
  currentStatus: string;
  rating: number | null;
  status?: string;
  AreaOfStudy?: string;
  currentSchool?: string;
  User?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}

export interface BuddiDetails {
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
  User: {
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
  Videos: any[];
}

export interface BuddiListResponse {
  data: Buddi[];
  total: number;
}

export interface AvailableCall {
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
  matchedBuddiId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface AvailableCallsResponse {
  message: string;
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  data: AvailableCall[];
}

export interface CallDetailsResponse {
  message: string;
  data: AvailableCall;
}

export interface ApplyForCallRequest {
  buddiRequestId: number;
  buddiId: number;
  message: string;
}

const BuddiService = {
  async getAvailableCalls(page: number = 1, limit: number = 5): Promise<AvailableCallsResponse> {
    try {
      const response = await authorizedApi.get(`/parent/requests/all?page=${page}&limit=${limit}`);
      return response.data;
    } catch (err: any) {
      let message = 'Failed to fetch available calls.';
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

  async getCallDetails(callId: number): Promise<CallDetailsResponse> {
    try {
      const response = await authorizedApi.get(`/coverage/buddi-request/${callId}`);
      return response.data;
    } catch (err: any) {
      let message = 'Failed to fetch call details.';
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

  async applyForCall(request: ApplyForCallRequest): Promise<void> {
    try {
      await authorizedApi.post('/application/apply', request);
    } catch (err: any) {
      // Handle specific HTTP status codes for better user experience
      if (err?.response?.status === 409) {
        throw new Error('ALREADY_APPLIED');
      }
      
      // Handle other common HTTP status codes
      if (err?.response?.status === 400) {
        throw new Error('INVALID_REQUEST');
      }
      
      if (err?.response?.status === 401) {
        throw new Error('UNAUTHORIZED');
      }
      
      if (err?.response?.status === 403) {
        throw new Error('FORBIDDEN');
      }
      
      if (err?.response?.status === 404) {
        throw new Error('CALL_NOT_FOUND');
      }
      
      if (err?.response?.status === 422) {
        throw new Error('VALIDATION_ERROR');
      }
      
      if (err?.response?.status >= 500) {
        throw new Error('SERVER_ERROR');
      }
      
      // Handle network and connection errors
      if (err?.message) {
        if (err.message.includes('Network') || err.message.includes('network')) {
          throw new Error('NETWORK_ERROR');
        } else if (err.message.includes('timeout') || err.message.includes('Timeout')) {
          throw new Error('TIMEOUT_ERROR');
        } else if (err.message.includes('ECONNREFUSED') || err.message.includes('ENOTFOUND')) {
          throw new Error('CONNECTION_ERROR');
        }
      }
      
      // Handle generic errors
      let message = 'Failed to submit application.';
      if (err?.response?.data?.message) {
        message = err.response.data.message;
      } else if (err?.message) {
        message = err.message;
      } else if (typeof err === 'string') {
        message = err;
      }
      throw new Error(message);
    }
  },

  async getBuddiesByStatus(status: string, page: number, limit: number): Promise<BuddiListResponse> {
    try {
      const response = await authorizedApi.get(BUDDI_ENDPOINTS.BY_STATUS(status, page, limit));
      // If API returns { data: Buddi[], total: number }
      if (Array.isArray(response.data.data)) {
        return { data: response.data.data, total: response.data.total ?? response.data.data.length };
      }
      // If API returns array directly
      if (Array.isArray(response.data)) {
        return { data: response.data, total: response.data.length };
      }
      return { data: [], total: 0 };
    } catch (err: any) {
      let message = 'Failed to fetch buddies.';
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
  async approveBuddi(id: string, currentStatus: string, reason?: string): Promise<void> {
    // Determine the next status based on current status
    const getNextStatus = (status: string) => {
      switch (status) {
        case "RegisterApprovalPending":
          return "Registered";
        case "Registered":
          return "submissionApproved";
        case "submissionApproved":
          return "referenceApproved";
        case "referenceApproved":
          return "verified";
        case "verified":
          return "approved";
        default:
          return "approved";
      }
    };

    const nextStatus = getNextStatus(currentStatus);
    await authorizedApi.put(`/buddi/buddies/${id}/status`, { 
      status: nextStatus, 
      reason: reason || `Advanced to ${nextStatus} by admin` 
    });
  },
  async rejectBuddi(id: string, reason?: string): Promise<void> {
    await authorizedApi.put(`/buddi/buddies/${id}/status`, { 
      status: "rejected", 
      reason: reason || "Rejected by admin" 
    });
  },
  async updateStatus(id: string, status: string, reason: string): Promise<void> {
    await authorizedApi.put(BUDDI_ENDPOINTS.STATUS_UPDATE(id), { status, reason });
  },

  async getBuddiInfo(buddiId: string): Promise<{ message: string; data: BuddiDetails }> {
    try {
      const response = await authorizedApi.get(`/buddi/single/${buddiId}`);
      // The API returns the data directly, not wrapped in a data property
      return { message: "Success", data: response.data };
    } catch (err: any) {
      let message = 'Failed to fetch buddi information.';
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
};

export default BuddiService; 