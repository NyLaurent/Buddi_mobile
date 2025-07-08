import { authorizedApi } from './config';
import { CHILDREN_ENDPOINTS } from './endpoints';
import { ApiResponse } from './types';

export interface RegisterChildRequest {
  parentId: string;
  name: string;
  age: number;
  schoolName: string;
  pickupAddress: string;
}

export interface RegisterChildResponse {
  id: string;
  parentId: string;
  name: string;
  age: number;
  schoolName: string;
  pickupAddress: string;
  updatedAt: string;
  createdAt: string;
}

export interface Child {
  id: string;
  parentId: string;
  name: string;
  age: number;
  schoolName: string;
  pickupAddress: string;
  updatedAt: string;
  createdAt: string;
}

const ChildrenService = {
  async registerChild(data: RegisterChildRequest): Promise<RegisterChildResponse> {
    const response = await authorizedApi.post<ApiResponse<RegisterChildResponse>>(CHILDREN_ENDPOINTS.REGISTER, data);
    return response.data.data;
  },
  async getChildrenByParent(parentId: string): Promise<Child[]> {
    try {
      const response = await authorizedApi.get(CHILDREN_ENDPOINTS.GET_BY_PARENT(parentId));
      return Array.isArray(response.data) ? response.data : [];
    } catch (err: any) {
      let message = 'Failed to fetch children.';
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
  async updateChild(childId: string, parentId: string, data: Omit<RegisterChildRequest, 'parentId'>): Promise<Child> {
    try {
      const response = await authorizedApi.put(CHILDREN_ENDPOINTS.UPDATE(childId, parentId), data);
      return response.data;
    } catch (err: any) {
      let message = 'Failed to update child.';
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
  async deleteChild(childId: string, parentId: string): Promise<void> {
    try {
      await authorizedApi.delete(CHILDREN_ENDPOINTS.DELETE(childId, parentId));
    } catch (err: any) {
      let message = 'Failed to delete child.';
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

export default ChildrenService; 