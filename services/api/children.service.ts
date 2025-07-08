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
      const response = await authorizedApi.get<ApiResponse<Child[]>>(CHILDREN_ENDPOINTS.GET_BY_PARENT(parentId));
      return response.data.data;
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
};

export default ChildrenService; 