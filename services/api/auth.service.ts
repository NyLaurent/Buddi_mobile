import AsyncStorage from '@react-native-async-storage/async-storage';
import { authorizedApi, STORAGE_KEYS, unauthorizedApi } from './config';
import { AUTH_ENDPOINTS } from './endpoints';
import {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  LoginResponse,
  ParentRegistrationRequest,
  ParentRegistrationResponse,
  ReferralTeacherRegistrationRequest,
  ReferralTeacherRegistrationResponse,
  RegisterRequest
} from './types';

// Sanitized user interface without password
interface SanitizedUser {
  userId: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  homeAddress: string;
  role: 'buddi' | 'parent' | 'admin' | 'minorAdmin' | 'head-teacher';
  createdAt: string;
  updatedAt: string;
}

interface SanitizedLoginResponse {
  user: SanitizedUser;
  token: string;
}

class AuthService {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginRequest): Promise<SanitizedLoginResponse> {
    try {
      const response = await unauthorizedApi.post<LoginResponse>(
        AUTH_ENDPOINTS.LOGIN,
        credentials
      );

      const { user, token } = response.data;

      // Store token and user data (excluding password from user object)
      const sanitizedUser: SanitizedUser = {
        userId: user.userId,
        email: user.email,
        phoneNumber: user.phoneNumber,
        firstName: user.firstName,
        lastName: user.lastName,
        homeAddress: user.homeAddress,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      await this.storeAuthData(token, sanitizedUser);

      return { user: sanitizedUser, token };
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Logout user and clear stored data
   */
  async logout(): Promise<void> {
    try {
      console.log("AuthService: Starting logout process..."); // Debug log
      
      // First, call the logout API endpoint to invalidate the session on the server
      try {
        console.log("AuthService: Calling logout API..."); // Debug log
        await authorizedApi.post(AUTH_ENDPOINTS.LOGOUT);
        console.log("AuthService: Logout API call successful"); // Debug log
      } catch (apiError) {
        // Log the error but continue with local cleanup
        console.warn('Logout API call failed, continuing with local cleanup:', apiError);
      }

      console.log("AuthService: Clearing local storage..."); // Debug log
      // Clear all stored authentication data
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.ACCESS_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.USER_DATA,
        'buddi_details',
        'parent_details',
      ]);
      console.log("AuthService: Local storage cleared successfully"); // Debug log
    } catch (error) {
      console.error('AuthService: Error during logout:', error);
      throw new Error('Failed to logout');
    }
  }

  /**
   * Register new buddi with form data
   */
  async registerBuddi(data: any): Promise<any> {
    try {
      // Debug: Log the incoming data
      console.log('Buddi registration data:', data);
      console.log('Resume file:', data.resume);
      console.log('Profile picture:', data.profilePicture);

      // Create form data
      const formData = new FormData();

      // Add all text fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '' && !(value instanceof File) && !(value && typeof value === 'object' && 'uri' in value) && key !== 'resume' && key !== 'profilePicture') {
          formData.append(key, value.toString());
        }
      });

      // Add files if present
      if (data.resume && typeof data.resume === 'object' && 'uri' in data.resume) {
        console.log('Adding resume file to FormData');
        formData.append('resume', data.resume as any);
      }
      if (data.profilePicture && typeof data.profilePicture === 'object' && 'uri' in data.profilePicture) {
        console.log('Adding profile picture to FormData');
        formData.append('profilePicture', data.profilePicture as any);
      }

      const response = await unauthorizedApi.post(
        AUTH_ENDPOINTS.REGISTER_BUDDI,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Register new parent with form data
   */
  async registerParent(data: ParentRegistrationRequest): Promise<ParentRegistrationResponse> {
    try {
      // If there's a profile picture, use FormData, otherwise send JSON
      if (data.profilePicture) {
        // Create form data for file upload
        const formData = new FormData();

        // Add all fields except profilePicture and cardDetails
        Object.entries(data).forEach(([key, value]) => {
          if (key === 'children' && Array.isArray(value)) {
            // Handle children array
            formData.append(key, JSON.stringify(value));
          } else if (key === 'cardDetails') {
            // Skip cardDetails for now
            return;
          } else if (value !== undefined && !(value instanceof File)) {
            formData.append(key, value.toString());
          }
        });

        // Add profile picture
        formData.append('profilePicture', data.profilePicture);

        const response = await unauthorizedApi.post<ApiResponse<ParentRegistrationResponse>>(
          AUTH_ENDPOINTS.REGISTER_PARENT,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        return response.data.data;
      } else {
        // Send as JSON when no file upload
        const { cardDetails, profilePicture, ...jsonData } = data;

        const response = await unauthorizedApi.post<ApiResponse<ParentRegistrationResponse>>(
          AUTH_ENDPOINTS.REGISTER_PARENT,
          jsonData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        return response.data.data;
      }
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
      await this.storeAuthData(tokens.accessToken, user);

      return response.data.data;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<any | null> {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Get user profile from API with fresh status data
   */
  async getProfile(): Promise<any> {
    try {
      const response = await authorizedApi.get(AUTH_ENDPOINTS.PROFILE);
      return response.data;
    } catch (error: any) {
      throw this.handleAuthError(error);
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
  private async storeAuthData(token: string, user: any): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.ACCESS_TOKEN, token],
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

  async uploadBuddiInterviewVideo(buddiId: number, videoData: FormData) {
    try {
      const response = await authorizedApi.post(
        AUTH_ENDPOINTS.UPLOAD_INTERVIEW_VIDEO(buddiId),
        videoData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error uploading interview video:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Register new referral teacher (head teacher)
   */
  async registerReferralTeacher(data: ReferralTeacherRegistrationRequest): Promise<ReferralTeacherRegistrationResponse> {
    try {
      const response = await unauthorizedApi.post<ReferralTeacherRegistrationResponse>(
        AUTH_ENDPOINTS.REGISTER_REFERRAL_TEACHER,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }
}

export default new AuthService(); 