import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// API Configuration
const API_BASE_URL = process.env.API_BASE_URL || 'https://backend-service-hw1rh.kinsta.app';
const API_TIMEOUT = parseInt(process.env.API_TIMEOUT || '30000');

// Storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
} as const;

// Create base axios instance
const createAxiosInstance = (requiresAuth: boolean = false): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      if (requiresAuth) {
        try {
          const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Error getting token from storage:', error);
        }
      }

      // Log request in development
      if (__DEV__) {
        console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
          data: config.data,
          params: config.params,
        });
      }

      return config;
    },
    (error) => {
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // Log response in development
      if (__DEV__) {
        console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, {
          status: response.status,
          data: response.data,
        });
      }
      return response;
    },
    async (error) => {
      // Log error in development
      if (__DEV__) {
        console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
          status: error.response?.status,
          data: error.response?.data,
        });
      }

      // Handle 401 unauthorized errors
      if (error.response?.status === 401 && requiresAuth) {
        try {
          // Clear stored tokens
          await AsyncStorage.multiRemove([
            STORAGE_KEYS.ACCESS_TOKEN,
            STORAGE_KEYS.REFRESH_TOKEN,
            STORAGE_KEYS.USER_DATA,
          ]);
          
          // Optionally navigate to login screen
          // NavigationService.navigate('Login');
        } catch (storageError) {
          console.error('Error clearing storage:', storageError);
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// Create API instances
export const unauthorizedApi = createAxiosInstance(false);
export const authorizedApi = createAxiosInstance(true);

// API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// API Error interface
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
} 