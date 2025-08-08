import { authorizedApi } from './config';
import { COVERAGE_ENDPOINTS } from './endpoints';
import { ApiResponse } from './types';

export interface CreatePickupRequest {
  parentId: string;
  childId: string;
  description: string;
  availableDays: string[];
  callPickupTime: string;
  callDropTime: string;
  kidsCount: number;
  fromZone: string;
  toZone: string;
}

export interface MatchBuddiRequest {
  requestId: number;
  buddiId: number;
}

export interface PickupRequestResponse {
  message: string;
  request: {
    id: number;
    parentId: string;
    childId: string;
    description: string;
    availableDays: string[];
    callPickupTime: string;
    callDropTime: string;
    kidsCount: number;
    fromZone: string;
    toZone: string;
    status: string;
    updatedAt: string;
    createdAt: string;
    matchedBuddiId: string | null;
  };
}

export interface MatchBuddiResponse {
  message: string;
  success: boolean;
}

export interface BuddiCoverageRequest {
  parentId: string;
  buddiId: string;
  reason: string;
}

export interface BuddiCoverageResponse {
  message: string;
  coverage: {
    id: number;
    parentId: string;
    buddiId: number;
    reason: string;
    status: string;
    coverageType: string;
    updatedAt: string;
    createdAt: string;
    coveredBy: string | null;
  };
}

export interface CoverageRequestItem {
  id: number;
  parentId: string;
  buddiId: number;
  reason: string;
  coveredBy: string | null;
  status: string;
  coverageType: string;
  createdAt: string;
  updatedAt: string;
}

export interface BuddiCoverageListResponse {
  data: CoverageRequestItem[];
  pagination: {
    totalItems: number;
    currentPage: number;
    perPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

const CoverageService = {
  async createPickupRequest(data: CreatePickupRequest): Promise<PickupRequestResponse> {
    try {
      const response = await authorizedApi.post<ApiResponse<PickupRequestResponse>>(COVERAGE_ENDPOINTS.CREATE_REQUEST, data);
      return response.data.data;
    } catch (err: any) {
      let message = 'Failed to create pickup request.';
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

  async matchBuddi(data: MatchBuddiRequest): Promise<MatchBuddiResponse> {
    try {
      const response = await authorizedApi.patch<ApiResponse<MatchBuddiResponse>>(COVERAGE_ENDPOINTS.MATCH_BUDDI, data);
      return response.data.data;
    } catch (err: any) {
      let message = 'Failed to match buddi.';
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

  async createBuddiCoverageRequest(data: BuddiCoverageRequest): Promise<BuddiCoverageResponse> {
    try {
      const response = await authorizedApi.post('/coverage/coverage-requests/buddi', data);
      return response.data;
    } catch (err: any) {
      let message = 'Failed to create coverage request.';
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

  async getBuddiCoverageRequests(buddiId: string, page: number = 1, limit: number = 10): Promise<BuddiCoverageListResponse> {
    try {
      const response = await authorizedApi.get(`/coverage/coverage-requests/buddi/${buddiId}?page=${page}&limit=${limit}`);
      return response.data;
    } catch (err: any) {
      let message = 'Failed to fetch coverage requests.';
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

export default CoverageService; 