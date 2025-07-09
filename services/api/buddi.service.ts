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

export interface BuddiListResponse {
  data: Buddi[];
  total: number;
}

const BuddiService = {
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
  async approveBuddi(id: string, reason?: string): Promise<void> {
    await authorizedApi.put(BUDDI_ENDPOINTS.APPROVE_APPLICATION(id), reason ? { reason } : undefined);
  },
  async rejectBuddi(id: string, reason?: string): Promise<void> {
    await authorizedApi.put(BUDDI_ENDPOINTS.REJECT_APPLICATION(id), reason ? { reason } : undefined);
  },
  async updateStatus(id: string, status: string, reason: string): Promise<void> {
    await authorizedApi.put(BUDDI_ENDPOINTS.STATUS_UPDATE(id), { status, reason });
  },
};

export default BuddiService; 