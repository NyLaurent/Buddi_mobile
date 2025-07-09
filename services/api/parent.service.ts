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

const ParentService = {
  async getAllParents(page: number, limit: number): Promise<ParentListResponse> {
    const response = await authorizedApi.get(PARENT_ENDPOINTS.LIST + `/all?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getMyPickupRequests(parentId: string): Promise<ParentPickupRequestsResponse> {
    const response = await authorizedApi.get(`/parent/buddi-requests/my-requests/${parentId}`);
    return response.data;
  },
};

export default ParentService; 