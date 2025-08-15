import { authorizedApi } from './config';
import { BUDDI_REQUEST_ENDPOINTS } from './endpoints';

// Types for the API response
export interface BuddiRequestSlot {
  id: number;
  buddiRequestId: number;
  fromLocation: string;
  toLocation: string;
  slotStartTime: string;
  slotEndTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface BuddiRequest {
  id: number;
  parentId: string;
  childId: string;
  description: string;
  availableDays: string[];
  kidsCount: number;
  status: string;
  matchedBuddiId: number | null;
  isBuddiRecommended: boolean;
  type: string;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  slots: BuddiRequestSlot[];
}

export interface BuddiRequestsResponse {
  message: string;
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  data: BuddiRequest[];
}

const BuddiRequestsService = {
  /**
   * Fetch all buddi requests for a specific parent
   */
  async getMyRequests(parentId: string | number): Promise<BuddiRequestsResponse> {
    try {
      console.log('[BuddiRequestsService] 📋 Fetching requests for parent:', parentId);
      
      const response = await authorizedApi.get<BuddiRequestsResponse>(
        BUDDI_REQUEST_ENDPOINTS.MY_REQUESTS(parentId.toString())
      );
      
      console.log('[BuddiRequestsService] ✅ Requests fetched successfully');
      return response.data;
    } catch (error: any) {
      console.error('[BuddiRequestsService] ❌ Error fetching requests:', error);
      
      let message = 'Failed to fetch buddi requests.';
      if (error?.response?.data?.message) {
        message = error.response.data.message;
      } else if (error?.message) {
        if (error.message.includes('Network')) {
          message = 'Network error. Please check your connection and try again.';
        } else if (error.message.includes('timeout')) {
          message = 'Request timed out. Please try again.';
        } else {
          message = error.message;
        }
      }
      
      throw new Error(message);
    }
  },

  /**
   * Create a new buddi request
   */
  async createRequest(data: Partial<BuddiRequest>): Promise<BuddiRequest> {
    try {
      console.log('[BuddiRequestsService] 📝 Creating new buddi request');
      
      const response = await authorizedApi.post<{ data: BuddiRequest }>(
        BUDDI_REQUEST_ENDPOINTS.CREATE,
        data
      );
      
      console.log('[BuddiRequestsService] ✅ Request created successfully');
      return response.data.data;
    } catch (error: any) {
      console.error('[BuddiRequestsService] ❌ Error creating request:', error);
      
      let message = 'Failed to create buddi request.';
      if (error?.response?.data?.message) {
        message = error.response.data.message;
      } else if (error?.message) {
        if (error.message.includes('Network')) {
          message = 'Network error. Please check your connection and try again.';
        } else if (error.message.includes('timeout')) {
          message = 'Request timed out. Please try again.';
        } else {
          message = error.message;
        }
      }
      
      throw new Error(message);
    }
  },

  /**
   * Update an existing buddi request
   */
  async updateRequest(id: string | number, data: Partial<BuddiRequest>): Promise<BuddiRequest> {
    try {
      console.log('[BuddiRequestsService] ✏️ Updating buddi request:', id);
      
      const response = await authorizedApi.put<{ data: BuddiRequest }>(
        BUDDI_REQUEST_ENDPOINTS.UPDATE(id.toString()),
        data
      );
      
      console.log('[BuddiRequestsService] ✅ Request updated successfully');
      return response.data.data;
    } catch (error: any) {
      console.error('[BuddiRequestsService] ❌ Error updating request:', error);
      
      let message = 'Failed to update buddi request.';
      if (error?.response?.data?.message) {
        message = error.response.data.message;
      } else if (error?.message) {
        if (error.message.includes('Network')) {
          message = 'Network error. Please check your connection and try again.';
        } else if (error.message.includes('timeout')) {
          message = 'Request timed out. Please try again.';
        } else {
          message = error.message;
        }
      }
      
      throw new Error(message);
    }
  },

  /**
   * Delete a buddi request
   */
  async deleteRequest(id: string | number): Promise<void> {
    try {
      console.log('[BuddiRequestsService] 🗑️ Deleting buddi request:', id);
      
      await authorizedApi.delete(BUDDI_REQUEST_ENDPOINTS.DELETE(id.toString()));
      
      console.log('[BuddiRequestsService] ✅ Request deleted successfully');
    } catch (error: any) {
      console.error('[BuddiRequestsService] ❌ Error deleting request:', error);
      
      let message = 'Failed to delete buddi request.';
      if (error?.response?.data?.message) {
        message = error.response.data.message;
      } else if (error?.message) {
        if (error.message.includes('Network')) {
          message = 'Network error. Please check your connection and try again.';
        } else if (error.message.includes('timeout')) {
          message = 'Request timed out. Please try again.';
        } else {
          message = error.message;
        }
      }
      
      throw new Error(message);
    }
  },

  /**
   * Get details of a specific buddi request
   */
  async getRequestDetails(id: string | number): Promise<BuddiRequest> {
    try {
      console.log('[BuddiRequestsService] 🔍 Fetching request details:', id);
      
      const response = await authorizedApi.get<{ data: BuddiRequest }>(
        BUDDI_REQUEST_ENDPOINTS.COVERAGE_DETAILS(id.toString())
      );
      
      console.log('[BuddiRequestsService] ✅ Request details fetched successfully');
      return response.data.data;
    } catch (error: any) {
      console.error('[BuddiRequestsService] ❌ Error fetching request details:', error);
      
      let message = 'Failed to fetch request details.';
      if (error?.response?.data?.message) {
        message = error.response.data.message;
      } else if (error?.message) {
        if (error.message.includes('Network')) {
          message = 'Network error. Please check your connection and try again.';
        } else if (error.message.includes('timeout')) {
          message = 'Request timed out. Please try again.';
        } else {
          message = error.message;
        }
      }
      
      throw new Error(message);
    }
  },
};

export default BuddiRequestsService;

// Export types for use in other files
export type { BuddiRequest, BuddiRequestSlot, BuddiRequestsResponse };

