import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, unauthorizedApi } from './config';
import { AUTH_ENDPOINTS } from './endpoints';
import {
  ApiResponse,
  AuthResponse,
  BuddiRegistrationRequest,
  BuddiRegistrationResponse,
  LoginRequest,
  RegisterRequest,
  User
} from './types';

class AuthService {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await unauthorizedApi.post<ApiResponse<AuthResponse>>(
        AUTH_ENDPOINTS.LOGIN,
        credentials
      );

      const { user, tokens } = response.data.data;

      // Store tokens and user data
      await this.storeAuthData(tokens.accessToken, tokens.refreshToken, user);

      return response.data.data;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Register new buddi with form data
   */
  async registerBuddi(data: BuddiRegistrationRequest): Promise<BuddiRegistrationResponse> {
    try {
      // Create form data
      const formData = new FormData();

      // Add all text fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && !(value instanceof File)) {
          formData.append(key, value);
        }
      });

      // Add files if present
      if (data.profilePicture) {
        formData.append('profilePicture', data.profilePicture);
      }
      if (data.resume) {
        formData.append('resume', data.resume);
      }

      const response = await unauthorizedApi.post<ApiResponse<BuddiRegistrationResponse>>(
        AUTH_ENDPOINTS.REGISTER_BUDDI,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data.data;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Register new user
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await unauthorizedApi.post<ApiResponse<AuthResponse>>(
        AUTH_ENDPOINTS.REGISTER,
        userData
      );

      const { user, tokens } = response.data.data;

      // Store tokens and user data
      await this.storeAuthData(tokens.accessToken, tokens.refreshToken, user);

      return response.data.data;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      return !!token;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  /**
   * Store authentication data
   */
  private async storeAuthData(
    accessToken: string, 
    refreshToken: string, 
    user: User
  ): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.ACCESS_TOKEN, accessToken],
        [STORAGE_KEYS.REFRESH_TOKEN, refreshToken],
        [STORAGE_KEYS.USER_DATA, JSON.stringify(user)],
      ]);
    } catch (error) {
      console.error('Error storing auth data:', error);
      throw new Error('Failed to store authentication data');
    }
  }

  /**
   * Handle authentication errors
   */
  private handleAuthError(error: any): Error {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    
    if (error.response?.status === 401) {
      return new Error('Invalid credentials');
    }
    
    if (error.response?.status === 403) {
      return new Error('Access forbidden');
    }
    
    if (error.response?.status >= 500) {
      return new Error('Server error. Please try again later.');
    }
    
    return new Error(error.message || 'An unexpected error occurred');
  }
}

export default new AuthService(); 